package io.jhd.oss.fdb.resources.pairs;

import com.apple.foundationdb.Database;
import com.apple.foundationdb.Range;
import io.jhd.oss.fdb.utils.BinaryCodec;
import org.apache.commons.lang3.StringUtils;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.nio.ByteBuffer;
import java.nio.charset.CharacterCodingException;
import java.nio.charset.CodingErrorAction;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Path("/api/pairs")
@Produces(MediaType.APPLICATION_JSON)
public class PairsResource {
    private static final byte[] BEGIN_BYTE = new byte[]{0};
    private static final byte[] END_BYTE = new byte[]{-1}; // \xFF (but only signed bytes in Java...)

    private final Database db;

    public PairsResource(Database db) {
        this.db = db;
    }

    private Range buildRange(String begin, String end) {
        byte[] absoluteBegin = StringUtils.isEmpty(begin) ? BEGIN_BYTE : BinaryCodec.decode(begin);
        byte[] absoluteEnd = StringUtils.isEmpty(end) ? END_BYTE : BinaryCodec.decode(end);

        return new Range(absoluteBegin, absoluteEnd);
    }

    @GET
    public RangeResponse get(
            @QueryParam("begin") @DefaultValue("") String begin,
            @QueryParam("end") @DefaultValue("") String end,
            @QueryParam("limit") @DefaultValue("25") int limit
    ) {
        Range range = buildRange(begin, end);

        List<RangeResponse.Pair> hits = db.run(tr -> StreamSupport
                .stream(
                        tr.getRange(
                                range,
                                limit
                        )
                                .spliterator()
                        , false
                )
                .map(hit -> {
                    RangeResponse.Pair pair = new RangeResponse.Pair();
                    pair.setKey(BinaryCodec.encode(hit.getKey()));

                    try {
                        String utf8Value = StandardCharsets.UTF_8
                                .newDecoder()
                                .onMalformedInput(CodingErrorAction.REPORT)
                                .onUnmappableCharacter(CodingErrorAction.REPORT)
                                .decode(ByteBuffer.wrap(hit.getValue()))
                                .toString();
                        pair.setEncoding(RangeResponse.ValueEncoding.UTF8);
                        pair.setValue(utf8Value);
                    } catch (CharacterCodingException e) {
                        pair.setEncoding(RangeResponse.ValueEncoding.BASE64);
                        pair.setValue(Base64.getEncoder().encodeToString(hit.getValue()));
                    }

                    return pair;
                })
                .collect(Collectors.toList())
        );

        RangeResponse response = new RangeResponse();
        response.setHits(hits);
        return response;
    }

    @GET
    @Path("{key}")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public byte[] get(
            @PathParam("key") String key
    ) throws ExecutionException, InterruptedException {
        return db.run(tr -> tr.get(BinaryCodec.decode(key))).get();
    }

    @PUT
    @Path("{key}")
    public void set(
            @PathParam("key") String key,
            byte[] body
    ) {
        db.run(tr -> {
            tr.set(BinaryCodec.decode(key), body);
            return null;
        });
    }

    @DELETE
    @Path("{key}")
    public void clear(
            @PathParam("key") String key
    ) {
        db.run(tr -> {
            tr.clear(BinaryCodec.decode(key));
            return null;
        });
    }
}
