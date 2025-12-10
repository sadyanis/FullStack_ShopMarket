package fr.fullstack.shopapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
// import org.springframework.data.domain.Pageable;
// import org.springframework.validation.Errors;
import org.springdoc.core.models.GroupedOpenApi;
// import org.springframework.boot.SpringApplication;
// import org.springframework.boot.autoconfigure.SpringBootApplication;
// import org.springframework.context.annotation.Bean;


@SpringBootApplication
public class ShopAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShopAppApplication.class, args);
    }

    @Bean
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
                .group("public")
                .packagesToScan("fr.fullstack.shopapp.controller")
                .pathsToMatch("/**")
                .build();
    }
}
