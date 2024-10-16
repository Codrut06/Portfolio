// Function to simulate joystick data
function simulateJoystickData() {
    var randomX = Math.random().toFixed(4);
    var randomY = Math.random().toFixed(4);
    var buttonPressed = Math.random() < 0.5 ? "Pressed" : "Not pressed";

    var directions = ["left", "right", "up", "down", "forward", "backward"];
    var randomDirection = directions[Math.floor(Math.random() * directions.length)];

    // Correlating the direction with X and Y coordinates
    switch (randomDirection) {
        case "left":
            randomX = (Math.random() * 0.5).toFixed(4);
            break;
        case "right":
            randomX = (Math.random() * 0.5 + 0.5).toFixed(4);
            break;
        case "up":
            randomY = (Math.random() * 0.5 + 0.5).toFixed(4);
            break;
        case "down":
            randomY = (Math.random() * 0.5).toFixed(4);
            break;
        default:
            break;
    }

    // Simulating the joystick data string
    var simulatedData = "Joystick X: " + randomX + "\nJoystick Y: " + randomY + "\nButton: " + buttonPressed + "\nDirection: " + randomDirection;

    return simulatedData;
}

// Function to update joystick data in the textarea
function updateJoystickData() {
    var textareas = document.getElementsByClassName("joystick-data");
    for (var i = 0; i < textareas.length; i++) {
        textareas[i].value = simulateJoystickData();
    }
}

// Update joystick data at regular intervals (e.g., every 500ms)
setInterval(updateJoystickData, 500);
