import javax.swing.*;
import java.awt.*;

public class CoffeeMachineGUI {
    private static boolean isMachineOn = false;
    private static final String[] drinks = {"Espresso", "Latte", "Cappuccino", "Mocha", "Americano", "Flat White"};
    private static final String[] sizes = {"Small", "Medium", "Large"};

    public static void main(String[] args) {
        // Create the main frame
        JFrame frame = new JFrame("Coffee Machine Menu");
        frame.setSize(400, 450);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setLayout(new BorderLayout());

        // Create a text area to display the menu
        JTextArea textArea = new JTextArea();
        textArea.setEditable(false);

        // Obtain the menu from the CoffeeMachine class and set it in the text area
        String menuText = CoffeeMachine.getMenu();
        textArea.setText(menuText);

        // Add the text area into a JScrollPane in case of long text
        JScrollPane scrollPane = new JScrollPane(textArea);
        frame.add(scrollPane, BorderLayout.CENTER);

        // Panel for buttons
        JPanel buttonPanel = new JPanel();
        buttonPanel.setLayout(new GridLayout(0, 2)); // 2 columns

        // Button for Power On/Off
        JButton toggleButton = getjButton(frame, textArea);
        buttonPanel.add(toggleButton);

        // ComboBox for selecting the drink
        JComboBox<String> drinkComboBox = new JComboBox<>(drinks);
        buttonPanel.add(drinkComboBox);

        // ComboBox for selecting the size
        JComboBox<String> sizeComboBox = new JComboBox<>(sizes);
        buttonPanel.add(sizeComboBox);

        // Button to order a drink
        JButton orderButton = new JButton("Order Drink");
        orderButton.addActionListener(_ -> {
            if (!isMachineOn) {
                JOptionPane.showMessageDialog(frame, "Please turn on the coffee machine.");
                return;
            }
            String selectedDrink = (String) drinkComboBox.getSelectedItem();
            assert selectedDrink != null;
            double cost = CoffeeMachine.MENU.get(selectedDrink.toLowerCase()).cost(); // Cost of the drink

            // Ask the user to enter the payment amount
            String input = JOptionPane.showInputDialog(frame, "Your total is €" + cost + ". Enter payment amount:");
            if (input != null) {
                double payment = Double.parseDouble(input);
                if (payment >= cost) {
                    double change = payment - cost;
                    CoffeeMachine.addEarnings(cost); // Add the revenue to total
                    JOptionPane.showMessageDialog(frame, "You ordered a " + selectedDrink + ". Enjoy!\nChange: €" + String.format("%.2f", change));
                } else {
                    JOptionPane.showMessageDialog(frame, "Insufficient funds. Please enter a higher amount.");
                }
            }
        });
        buttonPanel.add(orderButton);

        // Button to check stock
        JButton checkStockButton = new JButton("Check Stock");
        checkStockButton.addActionListener(_ -> {
            if (!isMachineOn) {
                JOptionPane.showMessageDialog(frame, "Please turn on the coffee machine.");
                return;
            }
            String stockText = CoffeeMachine.getStock();
            JOptionPane.showMessageDialog(frame, stockText);
        });
        buttonPanel.add(checkStockButton);

        // Button to refill stock
        JButton refillButton = new JButton("Refill Stock");
        refillButton.addActionListener(_ -> {
            if (!isMachineOn) {
                JOptionPane.showMessageDialog(frame, "Please turn on the coffee machine.");
                return;
            }
            String ingredient = JOptionPane.showInputDialog(frame, "Enter ingredient to refill (water/coffee/milk):");
            String amountStr = JOptionPane.showInputDialog(frame, "Enter amount to refill (in ml/g):");
            if (ingredient != null && amountStr != null) {
                try {
                    int amount = Integer.parseInt(amountStr);
                    String refillMessage = CoffeeMachine.refillStock(ingredient, amount);
                    JOptionPane.showMessageDialog(frame, refillMessage);
                } catch (NumberFormatException ex) {
                    JOptionPane.showMessageDialog(frame, "Invalid amount entered.");
                }
            }
        });
        buttonPanel.add(refillButton);

        // Button to generate report
        JButton reportButton = new JButton("Generate Report");
        reportButton.addActionListener(_ -> {
            if (!isMachineOn) {
                JOptionPane.showMessageDialog(frame, "Please turn on the coffee machine.");
                return;
            }
            String reportText = CoffeeMachine.generateReport();
            JOptionPane.showMessageDialog(frame, reportText);
        });
        buttonPanel.add(reportButton);

        // Add the button panel to the frame
        frame.add(buttonPanel, BorderLayout.SOUTH);

        // Make the frame visible
        frame.setVisible(true);
    }

    private static JButton getjButton(JFrame frame, JTextArea textArea) {
        JButton toggleButton = new JButton("Power On/Off");
        toggleButton.addActionListener(_ -> {
            isMachineOn = !isMachineOn;
            String status = isMachineOn ? "ON" : "OFF";
            JOptionPane.showMessageDialog(frame, "Coffee Machine is " + status);
            if (!isMachineOn) {
                textArea.setText(""); // Clear the menu when the machine is off
            } else {
                textArea.setText(CoffeeMachine.getMenu());
            }
        });
        return toggleButton;
    }
}
