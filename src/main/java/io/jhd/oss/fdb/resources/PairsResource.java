package io.jhd.oss.fdb.resources;

import com.apple.foundationdb.Database;
import com.apple.foundationdb.KeyValue;
import com.apple.foundationdb.async.AsyncIterable;
import com.apple.foundationdb.directory.DirectoryLayer;
import com.apple.foundationdb.directory.DirectorySubspace;
import com.apple.foundationdb.tuple.Tuple;
import io.jhd.oss.fdb.api.DirectoryListResponse;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.concurrent.ExecutionException;

import static java.util.Arrays.asList;

@Path("/api/pairs")
@Produces(MediaType.APPLICATION_JSON)
public class PairsResource {
    private final Database db;

    public PairsResource(Database db) {
        this.db = db;
    }

    @GET
    @Path("{directory}/{key}")
    public DirectoryListResponse get(
            @PathParam("directory") String directory,
            @PathParam("key") String key
    ) throws ExecutionException, InterruptedException {
        DirectoryListResponse response = new DirectoryListResponse();

        DirectorySubspace directorySubspace = DirectoryLayer.getDefault().createOrOpen(db, asList("test-dir", "test-subdir")).get();

        db.run(tr -> {
            AsyncIterable<KeyValue> range = tr.getRange("".getBytes(), "\0xFF".getBytes(), 100);

//            tr.set(directorySubspace.pack(Tuple.fromList(asList("test-elt"))), "pouet".getBytes());
            return null;
        });

//        response.setSubdirectories(DirectoryLayer.getDefault().list(db).get());


        return response;
    }
}
