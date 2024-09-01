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
        System.setProperty("VNP_SECRET_KEY", dotenv.get("VNP_SECRET_KEY"));
        System.setProperty("VNP_VERSION", dotenv.get("VNP_VERSION"));
        System.setProperty("VNP_TMN", dotenv.get("VNP_TMN"));
        System.setProperty("VNP_URL", dotenv.get("VNP_URL"));
        System.setProperty("VNP_RETURN_URL", dotenv.get("VNP_RETURN_URL"));
        System.setProperty("VNP_API_URL", dotenv.get("VNP_API_URL"));
        System.setProperty("VNP_COMMAND", dotenv.get("VNP_COMMAND"));

        SpringApplication.run(VCarBeApplication.class, args);
    }

}
