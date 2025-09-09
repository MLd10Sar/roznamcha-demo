document.addEventListener('DOMContentLoaded', () => {
    // --- Game State ---
    let tasks = [
        { id: 1, action: 'purchase', amount: 4000, inventoryChange: 10, completed: false, el: document.getElementById('task-1') },
        { id: 2, action: 'sale', amount: 1000, inventoryChange: -2, receivable: 1000, completed: false, el: document.getElementById('task-2') },
        { id: 3, action: 'check', completed: false, el: document.getElementById('task-3') }
    ];
    let currentTaskIndex = 0;
    let timeLeft = 60;
    let timerInterval;

    // --- UI Elements ---
    const ui = {
        timer: document.getElementById('timer'),
        totalSales: document.getElementById('total-sales'),
        totalPurchases: document.getElementById('total-purchases'),
        inventoryCount: document.getElementById('inventory-count'),
        receivableAhmad: document.getElementById('receivable-ahmad'),
        btnPurchase: document.getElementById('btn-purchase'),
        btnSale: document.getElementById('btn-sale'),
        finalScreen: document.getElementById('final-screen'),
        finalTitle: document.getElementById('final-title'),
        finalMessage: document.getElementById('final-message')
    };

    // --- Game Logic ---
    function startTimer() {
        timerInterval = setInterval(() => {
            timeLeft--;
            ui.timer.textContent = timeLeft;
            if (timeLeft <= 0) {
                endGame(false); // Lose
            }
        }, 1000);
    }

    function nextTask() {
        tasks[currentTaskIndex].el.classList.remove('active');
        tasks[currentTaskIndex].el.classList.add('completed');
        currentTaskIndex++;
        if (currentTaskIndex < tasks.length) {
            tasks[currentTaskIndex].el.classList.add('active');
        } else {
            endGame(true); // Win
        }
    }

    function updateDashboard(change) {
        const updateEl = (el, newValue) => {
            el.textContent = newValue.toLocaleString('en-US');
            el.style.color = '#00BFA5';
            setTimeout(() => { el.style.color = '#212529'; }, 500);
        };
        if (change.purchases) updateDashboardValue('totalPurchases', change.purchases);
        if (change.sales) updateDashboardValue('totalSales', change.sales);
        if (change.inventory) updateDashboardValue('inventoryCount', change.inventory);
        if (change.receivable) updateDashboardValue('receivableAhmad', change.receivable);
    }
    
    function updateDashboardValue(key, change) {
        const el = ui[key];
        let currentValue = parseFloat(el.textContent.replace(/,/g, '')) || 0;
        currentValue += change;
        el.textContent = currentValue.toLocaleString('en-US');
        el.style.color = '#00BFA5';
        setTimeout(() => { el.style.color = '#212529'; }, 500);
    }

    function endGame(isWin) {
        clearInterval(timerInterval);
        if (isWin) {
            ui.finalTitle.textContent = "تبریک!";
            ui.finalMessage.textContent = "شما با موفقیت حسابات را منظم کردید. دیدید که با روزنامچه چقدر آسان است!";
        } else {
            ui.finalTitle.textContent = "وقت تمام شد!";
            ui.finalMessage.textContent = "مدیریت حسابات میتواند سخت باشد، اما روزنامچه آنرا آسان میسازد.";
        }
        ui.finalScreen.classList.add('show');
    }

    // --- Event Listeners ---
    ui.btnPurchase.addEventListener('click', () => {
        if (tasks[currentTaskIndex].action === 'purchase') {
            const task = tasks[currentTaskIndex];
            updateDashboardValue('totalPurchases', task.amount);
            updateDashboardValue('inventoryCount', task.inventoryChange);
            nextTask();
        }
    });

    ui.btnSale.addEventListener('click', () => {
        if (tasks[currentTaskIndex].action === 'sale') {
            const task = tasks[currentTaskIndex];
            updateDashboardValue('totalSales', task.amount);
            updateDashboardValue('inventoryCount', task.inventoryChange);
            updateDashboardValue('receivableAhmad', task.receivable);
            nextTask();
            // This is the check inventory task
            setTimeout(() => {
                 if (tasks[currentTaskIndex].action === 'check') {
                    tasks[currentTaskIndex].el.querySelector('div').innerHTML += ` <strong>پاسخ: ${ui.inventoryCount.textContent} دانه</strong>`;
                    nextTask();
                }
            }, 500);
        }
    });
    
    // --- Start Game ---
    startTimer();
});