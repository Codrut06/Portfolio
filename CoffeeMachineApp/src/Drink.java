import java.util.Map;

public class Drink {
    // Name of the drink
    private String name;

    // Map that holds the ingredients and their respective quantities needed for the drink
    private Map<String, Integer> ingredients;

    // Cost of the drink
    private double cost;

    // Constructor to initialize a Drink object with name, ingredients, and cost
    public Drink(String name, Map<String, Integer> ingredients, double cost) {
        this.name = name; // Set the drink name
        this.ingredients = ingredients; // Set the drink ingredients
        this.cost = cost; // Set the drink cost
    }

    // Getter method to retrieve the name of the drink
    public String getName() {
        return name;
    }

    // Getter method to retrieve the ingredients required for the drink
    public Map<String, Integer> getIngredients() {
        return ingredients;
    }

    // Getter method to retrieve the cost of the drink
    public double getCost() {
        return cost;
    }
}
