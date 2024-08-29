package vn.edu.iuh.sv.vcarbe;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class VCarBeApplication {

    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.load();

        System.setProperty("INFURA_URL", dotenv.get("INFURA_URL"));
        System.setProperty("PRIVATE_KEY", dotenv.get("PRIVATE_KEY"));
        System.setProperty("CONTRACT_ADDRESS", dotenv.get("CONTRACT_ADDRESS"));

        SpringApplication.run(VCarBeApplication.class, args);
    }

}
