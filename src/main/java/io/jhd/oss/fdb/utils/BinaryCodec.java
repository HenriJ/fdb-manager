package io.jhd.oss.fdb.utils;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;

/**
 * Binary is hexadecimal encoded between the browser and the server
 * All bytes that are non-alphanumerical a "_" or a "-" are hex-encoded
 * <p>
 * It might no always be more efficient that base64 encoding, but it is definitely more readable...
 */
public class BinaryCodec {

    public static class FdbBinaryParsingException extends RuntimeException {
        public FdbBinaryParsingException(String message) {
            super(message);
        }
    }

    public static byte[] decode(String encoded) {
        ByteArrayOutputStream builder = new ByteArrayOutputStream(encoded.length());

        int pos = 0;
        while (pos < encoded.length()) {
            if (encoded.charAt(pos) == '\\') {
                if (encoded.charAt(pos + 1) != 'x') {
                    throw new FdbBinaryParsingException("A \\ must be followed with an x to form a valid hexadecimal sequence");
                }

                builder.write(Integer.valueOf(encoded.substring(pos + 2, pos + 4), 16));
                pos += 4;
            } else {
                builder.write(encoded.charAt(pos));
                pos++;
            }
        }

        return builder.toByteArray();
    }

    public static String encode(byte[] bytes) {
        StringBuilder builder = new StringBuilder();

        for (byte b : bytes) {
            if ((b >= 65 && b <= 90) || // A-Z
                    (b >= 97 && b <= 122) || // a-z
                    (b >= 48 && b <= 57) || // 0-9
                    (b == 95) || // _
                    (b == 45) // -
                    ) {
                builder.append(new String(new byte[]{b}, StandardCharsets.UTF_8)); // TODO really ugly
            } else {
                builder.append("\\x");
                builder.append(String.format("%02X", b));
            }
        }

        return builder.toString();
    }

}
