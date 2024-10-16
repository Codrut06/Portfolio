import java.util.HashMap;
import java.util.Map;

@SuppressWarnings("ClassEscapesDefinedScope")
public class CoffeeMachine {
    // Total earnings from all drinks sold
    private static double totalEarnings = 0.0;

    // Stock of ingredients available in the coffee machine
    private static final Map<String, Integer> stock = new HashMap<>() {{
        put("water", 1000);  // 1000ml of water
        put("coffee", 500);  // 500g of coffee
        put("milk", 500);    // 500ml of milk
    }};

    // Menu of available drinks with their names, costs, and ingredients
    public static Map<String, Drink> MENU = new HashMap<>() {{
        put("espresso", new Drink("Espresso", 1.50, new HashMap<>() {{
            put("water", 30);  // 30ml of water for espresso
            put("coffee", 8);  // 8g of coffee for espresso
        }}));
        put("latte", new Drink("Latte", 2.50, new HashMap<>() {{
            put("water", 200); // 200ml of water for latte
            put("coffee", 20); // 20g of coffee for latte
            put("milk", 100);  // 100ml of milk for latte
        }}));
        put("cappuccino", new Drink("Cappuccino", 2.80, new HashMap<>() {{
            put("water", 100); // 100ml of water for cappuccino
            put("coffee", 20); // 20g of coffee for cappuccino
            put("milk", 100);  // 100ml of milk for cappuccino
        }}));
        put("mocha", new Drink("Mocha", 3.00, new HashMap<>() {{
            put("water", 200); // 200ml of water for mocha
            put("coffee", 20); // 20g of coffee for mocha
            put("milk", 100);  // 100ml of milk for mocha
        }}));
        put("americano", new Drink("Americano", 2.00, new HashMap<>() {{
            put("water", 200); // 200ml of water for americano
            put("coffee", 10); // 10g of coffee for americano
        }}));
        put("flat white", new Drink("Flat White", 2.70, new HashMap<>() {{
            put("water", 200); // 200ml of water for flat white
            put("coffee", 20); // 20g of coffee for flat white
            put("milk", 120);  // 120ml of milk for flat white
        }}));
    }};

    // Method to retrieve the menu of drinks
    public static String getMenu() {
        StringBuilder menu = new StringBuilder("Available Drinks:\n");
        for (Drink drink : MENU.values()) {
            menu.append(drink.name()).append(" - €").append(drink.cost()).append("\n");
        }
        return menu.toString(); // Return the complete menu as a string
    }

    // Method to retrieve the current stock status
    public static String getStock() {
        StringBuilder stockReport = new StringBuilder("Stock Status:\n");
        for (Map.Entry<String, Integer> entry : stock.entrySet()) {
            stockReport.append(entry.getKey()).append(": ").append(entry.getValue()).append("ml/g\n");
        }
        return stockReport.toString(); // Return the stock report as a string
    }

    // Method to refill a specific ingredient in the stock
    public static String refillStock(String ingredient, int amount) {
        if (stock.containsKey(ingredient)) {
            stock.put(ingredient, stock.get(ingredient) + amount); // Add the amount to the current stock
            return ingredient + " refilled by " + amount + ". Current stock: " + stock.get(ingredient) + "ml/g.";
        } else {
            return "Ingredient not recognized."; // Return an error message if the ingredient is not found
        }
    }

    // Method to generate a report of total earnings and stock status
    public static String generateReport() {
        StringBuilder report = new StringBuilder("====== COFFEE MACHINE REPORT ======\n");
        report.append("Total Earnings: €").append(String.format("%.2f", totalEarnings)).append("\n\n");
        report.append("Stock Report:\n");

        for (Map.Entry<String, Integer> entry : stock.entrySet()) {
            report.append(entry.getKey()).append(": ").append(entry.getValue()).append("ml/g\n");
        }

        return report.toString(); // Return the complete report as a string
    }

    // Method to add earnings to the total
    public static void addEarnings(double amount) {
        totalEarnings += amount; // Increment total earnings by the specified amount
    }

    // Drink class as a record, which holds information about each drink
    record Drink(String name, double cost, Map<String, Integer> ingredients) {
    }
}
