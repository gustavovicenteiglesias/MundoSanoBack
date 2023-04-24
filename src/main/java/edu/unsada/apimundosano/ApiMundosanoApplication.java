package edu.unsada.apimundosano;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@ComponentScan({"edu.unsada.apimundosano.repositorio","edu.unsada.apimundosano.Controller"})
@SpringBootApplication

public class ApiMundosanoApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiMundosanoApplication.class, args);
    }

}
