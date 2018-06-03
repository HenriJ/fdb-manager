package io.jhd.oss.fdb.api;

import java.util.ArrayList;
import java.util.List;

public class DirectoryListResponse {

    private String key;

    private List<String> subDirectories;

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public List<String> getSubDirectories() {
        if (subDirectories == null) {
            subDirectories = new ArrayList<>();
        }
        return subDirectories;
    }

    public void setSubDirectories(List<String> subDirectories) {
        this.subDirectories = subDirectories;
    }
}
