package io.jhd.oss.fdb.api;

import java.util.ArrayList;
import java.util.List;

public class ExplicitTuple {

    public static class Item {
        private Object value;
        private TupleType type;

        public Object getValue() {
            return value;
        }

        public void setValue(Object value) {
            this.value = value;
        }

        public TupleType getType() {
            return type;
        }

        public void setType(TupleType type) {
            this.type = type;
        }
    }

    public static enum TupleType {
        NULL,
        BYTE,
        UNICODE,
        NESTED,
        // ... https://github.com/apple/foundationdb/blob/master/design/tuple.md
    }

    private List<Item> items;

    public List<Item> getItems() {
        if (items == null) {
            items = new ArrayList<>();
        }
        return items;
    }

    public void setItems(List<Item> items) {
        this.items = items;
    }
}
