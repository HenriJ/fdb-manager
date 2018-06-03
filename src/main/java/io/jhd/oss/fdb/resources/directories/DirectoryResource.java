package io.jhd.oss.fdb.resources.directories;

import com.apple.foundationdb.Database;
import com.apple.foundationdb.directory.Directory;
import com.apple.foundationdb.directory.DirectoryLayer;
import com.apple.foundationdb.directory.DirectorySubspace;
import com.apple.foundationdb.directory.NoSuchDirectoryException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jhd.oss.fdb.utils.BinaryCodec;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.ExecutionException;

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
}
