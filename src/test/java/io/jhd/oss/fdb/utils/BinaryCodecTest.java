package io.jhd.oss.fdb.utils;

import org.junit.Test;

import java.util.Random;

import static org.assertj.core.api.Assertions.assertThat;

public class BinaryCodecTest {

    @Test
    public void decode() {
        assertThat(BinaryCodec.decode("\\x02hello\\x00")).isEqualTo(new byte[]{2, 104, 101, 108, 108, 111, 0});
    }

    @Test
    public void encode() {
        assertThat(BinaryCodec.encode(new byte[]{2, 104, 101, 108, 108, 111, 0})).isEqualTo("\\x02hello\\x00");
    }

    @Test
    public void biDirectional() {
        Random random = new Random(0);
        for (int i = 0; i < 100; i++) {
            byte[] bytes = new byte[random.nextInt(512)];
            random.nextBytes(bytes);

            assertThat(BinaryCodec.decode(BinaryCodec.encode(bytes))).isEqualTo(bytes);
        }
    }
}
