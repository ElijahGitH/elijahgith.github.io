document.addEventListener("DOMContentLoaded", () => {
    let totalWater = 0;
    const goal = 2000;

    // Update visual elements
    function updateProgress() {
        const percentage = Math.min((totalWater / goal) * 100, 100);
        document.getElementById('progress-fill').style.height = percentage + '%';
        document.getElementById('progress').textContent = `${totalWater} / ${goal} ml`;
        document.getElementById('goalProgress').textContent = `${Math.round(percentage)}%`;

        // Update water fill color based on progress
        const fill = document.getElementById('progress-fill');
        if (percentage < 33) {
            fill.style.background = 'linear-gradient(180deg, #ff9999, #ff6666)';
        } else if (percentage < 66) {
            fill.style.background = 'linear-gradient(180deg, #99ccff, #66b3ff)';
        } else {
            fill.style.background = 'linear-gradient(180deg, #99ff99, #66cc66)';
        }
    }

    // Add water from quick buttons
    function addWater(amount) {
        totalWater += amount;
        updateProgress();
        addHistoryItem(amount);
    }

    // Log custom amount
    function logWater() {
        const input = document.getElementById('water');
        const amount = parseInt(input.value);

        if (!isNaN(amount) && amount > 0) {
            addWater(amount);
            input.value = '250'; // Reset to default
        }
    }

    // Add history entry
    function addHistoryItem(amount) {
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <span class="time">${time}</span>
            <span class="amount">${amount}ml</span>
        `;

        const historyList = document.getElementById('history');
        historyList.insertBefore(historyItem, historyList.firstChild);

        const lastDrink = document.getElementById('lastDrink');
        if (lastDrink) lastDrink.textContent = 'Just now';
    }

    // Initialize click handlers for quick-add buttons
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const amount = parseInt(e.target.textContent.match(/\d+/)[0]);
            addWater(amount);
        });
    });

    // Initialize custom amount button
    const addBtn = document.querySelector('.add-btn');
    if (addBtn) addBtn.addEventListener('click', logWater);

    // Handle input validation for negative values
    const waterInput = document.getElementById('water');
    if (waterInput) {
        waterInput.addEventListener('input', (e) => {
            if (e.target.value < 0) e.target.value = 0;
        });
    }

    // Initialize notifications toggle if present
    const toggleInput = document.querySelector('.toggle input');
    const intervalSelect = document.querySelector('.interval-select');

    if (toggleInput && intervalSelect) {
        toggleInput.addEventListener('change', (e) => {
            intervalSelect.disabled = !e.target.checked;
        });
    }

    
});