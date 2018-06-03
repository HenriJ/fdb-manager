package io.jhd.oss.fdb;

import com.apple.foundationdb.Cluster;
import com.apple.foundationdb.Database;
import com.apple.foundationdb.FDB;
import io.dropwizard.Application;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import io.jhd.oss.fdb.resources.ClusterResource;
import io.jhd.oss.fdb.resources.DirectoryResource;
import io.jhd.oss.fdb.resources.PairsResource;
import org.eclipse.jetty.servlets.CrossOriginFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.DispatcherType;
import javax.servlet.FilterRegistration;
import java.util.EnumSet;
import java.util.stream.Stream;

public class FdbManagerApplication extends Application<FdbManagerConfiguration> {
    private static final Logger LOGGER = LoggerFactory.getLogger(FdbManagerApplication.class);

    private static Cluster cluster;
    private static Database db;

    public static void main(String[] args) throws Exception {
        FDB fdb = FDB.selectAPIVersion(510);

        cluster = fdb.createCluster(null);
        db = cluster.openDatabase();
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            LOGGER.info("Closing cluster connection");
            db.close();
            cluster.close();
        }));

        new FdbManagerApplication().run(args);
    }

    @Override
    public String getName() {
        return "FoundationDB Manager";
    }

    @Override
    public void initialize(Bootstrap<FdbManagerConfiguration> bootstrap) {
    }

    private void configureCors(Environment environment) {
        final FilterRegistration.Dynamic cors = environment.servlets().addFilter("CORS", CrossOriginFilter.class);

        // Configure CORS parameters
        cors.setInitParameter(CrossOriginFilter.ALLOWED_ORIGINS_PARAM, "http://localhost:3000");
        cors.setInitParameter(CrossOriginFilter.ALLOWED_HEADERS_PARAM, "*");
        cors.setInitParameter(CrossOriginFilter.ALLOWED_METHODS_PARAM, "*");
        cors.setInitParameter(CrossOriginFilter.ALLOW_CREDENTIALS_PARAM, "true");

        // Add URL mapping
        cors.addMappingForUrlPatterns(EnumSet.allOf(DispatcherType.class), true, "/*");
    }

    @Override
    public void run(
            FdbManagerConfiguration configuration,
            Environment environment
    ) {
        configureCors(environment);

        Stream.of(
                new ClusterResource(db),
                new PairsResource(db),
                new DirectoryResource(db)
        ).forEach(environment.jersey()::register);
    }
}
