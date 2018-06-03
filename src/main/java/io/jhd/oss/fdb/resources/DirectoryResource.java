package io.jhd.oss.fdb.resources;

import com.apple.foundationdb.Database;
import com.apple.foundationdb.Range;
import com.apple.foundationdb.directory.Directory;
import com.apple.foundationdb.directory.DirectoryLayer;
import com.apple.foundationdb.directory.DirectorySubspace;
import com.apple.foundationdb.directory.NoSuchDirectoryException;
import com.apple.foundationdb.tuple.Tuple;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jhd.oss.fdb.api.DirectoryListResponse;
import io.jhd.oss.fdb.api.DirectoryPairsResponse;
import io.jhd.oss.fdb.api.Pair;
import io.jhd.oss.fdb.utils.BinaryCodec;
import org.apache.commons.lang3.StringUtils;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Path("/api/directories")
@Produces(MediaType.APPLICATION_JSON)
public class DirectoryResource {
    private static final TypeReference directoryRef = new TypeReference<List<String>>() {
    };

    private final Database db;
    private final ObjectMapper objectMapper;

    public DirectoryResource(Database db) {
        this.db = db;

        objectMapper = new ObjectMapper();
    }

    private DirectoryListResponse root() throws ExecutionException, InterruptedException {
        DirectoryListResponse response = new DirectoryListResponse();

        Directory dir = DirectoryLayer.getDefault();
        response.setSubDirectories(dir.list(db).get());

        return response;
    }

    private DirectoryListResponse build(DirectorySubspace dir) throws ExecutionException, InterruptedException {
        DirectoryListResponse response = new DirectoryListResponse();
        response.setKey(BinaryCodec.encode(dir.getKey()));
        response.setSubDirectories(dir.list(db).get());
        return response;
    }

    @GET
    @Path("{directory}")
    public DirectoryListResponse list(
            @PathParam("directory") String directory
    ) throws ExecutionException, InterruptedException, IOException {
        if (directory.length() <= 2) {
            return root();
        }

        return build(getDirectoryOrFail(directory));
    }

    @PUT
    @Path("{directory}")
    public DirectoryListResponse create(
            @PathParam("directory") String directory,
            @QueryParam("delimiter") @DefaultValue(",") String delimiter
    ) throws ExecutionException, InterruptedException, IOException {
        return build(DirectoryLayer.getDefault().createOrOpen(db, objectMapper.readValue(directory, directoryRef)).get());
    }

    private DirectorySubspace getDirectoryOrFail(String directory) throws ExecutionException, IOException, InterruptedException {
        List<String> d = objectMapper.readValue(directory, directoryRef);
        try {
            return DirectoryLayer.getDefault().open(db, d).get();
        } catch (ExecutionException e) {
            if (e.getCause() instanceof NoSuchDirectoryException) {
                throw new WebApplicationException("No such directory: " + directory, Response.Status.NOT_FOUND);
            }
            throw e;
        }
    }

    private Range buildRange(DirectorySubspace subspace, String begin, String end) {
        byte[] absoluteBegin = StringUtils.isEmpty(begin) ? subspace.pack() : subspace.pack(Tuple.fromBytes(BinaryCodec.decode(begin)));
        if (StringUtils.isEmpty(end)) {
            return Range.startsWith(absoluteBegin);
        }

        return new Range(absoluteBegin, subspace.pack(Tuple.fromBytes(BinaryCodec.decode(end))));
    }

    @GET
    @Path("{directory}/pairs")
    public DirectoryPairsResponse get(
            @PathParam("directory") String directory,
            @QueryParam("begin") @DefaultValue("") String begin,
            @QueryParam("end") @DefaultValue("") String end,
            @QueryParam("limit") @DefaultValue("25") int limit
    ) throws ExecutionException, InterruptedException, IOException {
        DirectorySubspace subspace = getDirectoryOrFail(directory);
        Range range = buildRange(subspace, begin, end);

        byte[] subspaceKey = subspace.getKey();

        List<Pair> pairs = db.run(tr -> {
            return StreamSupport.stream(
                    tr.getRange(
                            range,
                            limit
                    )
                            .spliterator()
                    , false
            )
                    .map(keyValue -> {
                        Pair pair = new Pair();
                        pair.setKey(BinaryCodec.encode(Arrays.copyOfRange(keyValue.getKey(), subspaceKey.length, keyValue.getKey().length)));
                        pair.setValue(BinaryCodec.encode(keyValue.getValue()));
                        return pair;
                    })
                    .collect(Collectors.toList());
        });

        DirectoryPairsResponse response = new DirectoryPairsResponse();
        response.setKey(BinaryCodec.encode(subspaceKey));
        response.setPairs(pairs);
        return response;
    }

    @GET
    @Path("{directory}/pairs/{key}")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public byte[] get(
            @PathParam("directory") String directory,
            @PathParam("key") String key
    ) throws ExecutionException, InterruptedException, IOException {
        DirectorySubspace subspace = getDirectoryOrFail(directory);

        return db.run(tr -> tr.get(subspace.pack(Tuple.fromBytes(BinaryCodec.decode(key))))).get();
    }

    @PUT
    @Path("{directory}/pairs/{key}")
    public void set(
            @PathParam("directory") String directory,
            @PathParam("key") String key,
            byte[] body
    ) throws ExecutionException, InterruptedException, IOException {
        DirectorySubspace subspace = getDirectoryOrFail(directory);

        db.run(tr -> {
            tr.set(subspace.pack(Tuple.fromBytes(BinaryCodec.decode(key))), body);
            return null;
        });
    }

    @DELETE
    @Path("{directory}/pairs/{key}")
    public void clear(
            @PathParam("directory") String directory,
            @PathParam("key") String key
    ) throws ExecutionException, InterruptedException, IOException {
        DirectorySubspace subspace = getDirectoryOrFail(directory);

        db.run(tr -> {
            tr.clear(subspace.pack(Tuple.fromBytes(BinaryCodec.decode(key))));
            return null;
        });
    }
}
