package io.jhd.oss.fdb.api;

import java.util.ArrayList;
import java.util.List;

public class DirectoryPairsResponse {

    /**
     * Directory key, not repeated for every tuples in directory
     */
    private String key;

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    private List<Pair> pairs;

    public List<Pair> getPairs() {
        if (pairs == null) {
            pairs = new ArrayList<>();
        }
        return pairs;
    }

    public void setPairs(List<Pair> pairs) {
        this.pairs = pairs;
    }
}
