// Function to calculate total price
function calculateTotal() {

    // Get values from HTML elements
    let quantity = Number(document.getElementById("quantity").value);
    let price = Number(document.getElementById("price").value);

    // Validation
    if (quantity <= 0 || price < 0) {
        alert("Please enter valid quantity and price.");
        return;
    }

    // Calculate total
    let total = quantity * price;

    // Display total in webpage
    document.getElementById("total").innerHTML = total;
}

// Event listener for button
document.getElementById("calculateBtn").addEventListener("click", calculateTotal);

// Calculate automatically whenever quantity changes
document.getElementById("quantity").addEventListener("input", calculateTotal);

// Calculate automatically whenever price changes
document.getElementById("price").addEventListener("input", calculateTotal);