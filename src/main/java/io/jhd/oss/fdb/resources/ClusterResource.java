package io.jhd.oss.fdb.resources;

import com.apple.foundationdb.Database;
import io.jhd.oss.fdb.utils.BinaryCodec;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ExecutionException;

@Path("/api/cluster")
@Produces(MediaType.APPLICATION_JSON)
public class ClusterResource {
    private final Database db;

    public ClusterResource(Database db) {
        this.db = db;
    }

    @GET
    @Path("status")
    public Response status() throws ExecutionException, InterruptedException {
        byte[] bytes = db.run(tr -> tr.get(BinaryCodec.decode("\\xff\\xff/status/json"))).get();
        return Response.ok(new String(bytes, StandardCharsets.UTF_8)).build();
    }

    @GET
    @Path("connection")
    public String connection() throws ExecutionException, InterruptedException {
        byte[] bytes = db.run(tr -> tr.get(BinaryCodec.decode("\\xff\\xff/connection_string"))).get();
        return new String(bytes, StandardCharsets.UTF_8);
    }
}
