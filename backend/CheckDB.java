
import java.sql.*;

public class CheckDB {
    public static void main(String[] args) throws Exception {
        String url = "jdbc:mysql://localhost:3306/productmgmt?allowPublicKeyRetrieval=true&useSSL=false";
        String user = "root";
        String password = "root";

        try (Connection conn = DriverManager.getConnection(url, user, password)) {
            System.out.println("Connected to DB");
            try (Statement stmt = conn.createStatement()) {
                ResultSet rs = stmt.executeQuery("SELECT email, role FROM users");
                while (rs.next()) {
                    System.out.println("User: " + rs.getString("email") + ", Role: " + rs.getString("role"));
                }
            }
        }
    }
}
