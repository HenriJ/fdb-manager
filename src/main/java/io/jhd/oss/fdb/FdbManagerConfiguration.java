package io.jhd.oss.fdb;

import com.fasterxml.jackson.databind.node.TextNode;
import com.google.common.collect.ImmutableMap;
import io.dropwizard.Configuration;
import io.dropwizard.logging.DefaultLoggingFactory;
import io.dropwizard.server.SimpleServerFactory;

public class FdbManagerConfiguration extends Configuration {

    public FdbManagerConfiguration() {
        SimpleServerFactory simpleServerFactory = new SimpleServerFactory();
        simpleServerFactory.setApplicationContextPath("/");
        setServerFactory(simpleServerFactory);

        DefaultLoggingFactory defaultLoggingFactory = new DefaultLoggingFactory();
        defaultLoggingFactory.setLevel("WARN");
        defaultLoggingFactory.setLoggers(ImmutableMap.of(
                "io.jhd.oss.fdb", TextNode.valueOf("DEBUG"),
                "io.dropwizard.setup.AdminEnvironment", TextNode.valueOf("ERROR")
        ));
        setLoggingFactory(defaultLoggingFactory);
    }
}
