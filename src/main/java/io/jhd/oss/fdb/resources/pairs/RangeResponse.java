package io.jhd.oss.fdb.resources.pairs;

import java.util.List;

public class RangeResponse {
    private List<Pair> hits;

    public enum ValueEncoding {
        UTF8,
        BASE64;
    }

    public static class Pair {
        /**
         * Custom-encoded
         */
        private String key;

        /**
         * Variable-encoding
         */
        private String value;

        private ValueEncoding encoding;

        public String getKey() {
            return key;
        }

        public void setKey(String key) {
            this.key = key;
        }

        public String getValue() {
            return value;
        }

        public void setValue(String value) {
            this.value = value;
        }

        public ValueEncoding getEncoding() {
            return encoding;
        }

        public void setEncoding(ValueEncoding encoding) {
            this.encoding = encoding;
        }
    }

    public List<Pair> getHits() {
        return hits;
    }

    public void setHits(List<Pair> hits) {
        this.hits = hits;
    }
}
