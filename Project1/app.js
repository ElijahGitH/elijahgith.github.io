let totalWater = 0;
let dailyGoal = 2000; // Set default goal
let history = []; // Store daily history

// Log Water Function
function logWater() {
    const waterInput = document.getElementById("water").value;
    const waterAmount = parseInt(waterInput) || 0;

    // Confirmation dialog
    const confirmAction = confirm(`You are about to log ${waterAmount}ml of water. Confirm?`);
    if (confirmAction) {
        totalWater += waterAmount;
        updateProgress();

        // Save to history
        const today = new Date().toLocaleDateString();
        history.push({ date: today, amount: waterAmount });
        updateHistory();
    }
}

// Update Progress
function updateProgress() {
    document.getElementById("progress").innerText = `Total Water Today: ${totalWater}ml`;
    document.getElementById("goal").innerText = `Goal: ${dailyGoal}ml`;
}

// Update History
function updateHistory() {
    const historyDiv = document.getElementById("history");
    historyDiv.innerHTML = ""; // Clear old history

    history.forEach((entry) => {
        const entryElement = document.createElement("p");
        entryElement.innerText = `${entry.date}: ${entry.amount}ml`;
        historyDiv.appendChild(entryElement);
    });
}
