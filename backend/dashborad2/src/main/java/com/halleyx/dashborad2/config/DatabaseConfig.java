package com.halleyx.dashborad2.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;

@Configuration
public class DatabaseConfig {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseConfig.class);

    @Bean
    @Primary
    public DataSource dataSource(DataSourceProperties properties) {
        String dbUrlProp = System.getenv("DATABASE_URL");
        if (dbUrlProp == null || dbUrlProp.isEmpty()) {
            dbUrlProp = System.getenv("SPRING_DATASOURCE_URL");
        }

        if (dbUrlProp != null && (dbUrlProp.startsWith("postgres://") || dbUrlProp.startsWith("postgresql://"))) {
            logger.info("Detected PostgreSQL URL format in environment variable. Converting to JDBC...");
            try {
                URI dbUri = new URI(dbUrlProp);
                String userInfo = dbUri.getUserInfo();
                String username = "";
                String password = "";

                if (userInfo != null && userInfo.contains(":")) {
                    String[] parts = userInfo.split(":");
                    username = parts[0];
                    password = parts[1];
                } else if (userInfo != null) {
                    username = userInfo;
                }

                int port = dbUri.getPort();
                String portStr = (port == -1) ? "5432" : String.valueOf(port);
                String dbName = dbUri.getPath();

                String jdbcUrl = "jdbc:postgresql://" + dbUri.getHost() + ":" + portStr + dbName;
                
                logger.info("Configuring PostgreSQL DataSource with URL: {}", jdbcUrl);

                return DataSourceBuilder.create()
                        .url(jdbcUrl)
                        .username(username)
                        .password(password)
                        .driverClassName("org.postgresql.Driver")
                        .build();
            } catch (URISyntaxException | NullPointerException e) {
                logger.error("Failed to parse PostgreSQL URL: {}. Falling back to default properties.", dbUrlProp, e);
            }
        }

        logger.info("Using default DataSource configuration from application properties.");
        try {
            return properties.initializeDataSourceBuilder().build();
        } catch (Exception e) {
            logger.error("Failed to initialize default DataSource. Check your spring.datasource settings.", e);
            throw e;
        }
    }
}
