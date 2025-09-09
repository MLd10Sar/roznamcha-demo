document.addEventListener('DOMContentLoaded', () => {
    // --- Game State & Data ---
    const tasks = [
        { id: 'task-1', action: 'purchase', amount: 4000, inventoryChange: 10 },
        { id: 'task-2', action: 'sale', amount: 1000, inventoryChange: -2, receivable: 1000 },
        { id: 'task-3', action: 'check', expectedInventory: 8 }
    ];
    let gameState = {
        purchases: 0, sales: 0, inventory: 0, receivable: 0
    };
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
        finalScreen: document.getElementById('final-screen'),
        finalTitle: document.getElementById('final-title'),
        finalMessage: document.getElementById('final-message'),
        finalScore: document.getElementById('final-score'),
        soundSuccess: document.getElementById('sound-success'),
        soundWin: document.getElementById('sound-win'),
        soundLose: document.getElementById('sound-lose'),
        taskCards: document.querySelectorAll('.task-card'),
        taskButtons: document.querySelectorAll('.task-button')
    };

    // --- Game Logic Functions ---
    function startTimer() {
        timerInterval = setInterval(() => {
            timeLeft--;
            ui.timer.textContent = timeLeft;
            if (timeLeft <= 10 && !ui.timer.parentElement.style.animation) {
                ui.timer.parentElement.style.animation = 'blinker 1s linear infinite';
            }
            if (timeLeft <= 0) {
                endGame(false); // Lose condition
            }
        }, 1000);
    }

    function playSound(soundElement) {
        if (soundElement) {
            soundElement.currentTime = 0;
            soundElement.play().catch(e => console.log("Audio play failed:", e));
        }
    }

    function updateDashboardUI() {
        const animateEl = (el, value) => {
            el.textContent = value.toLocaleString('en-US');
            el.style.transform = 'scale(1.3)';
            el.style.color = 'var(--secondary-color)';
            setTimeout(() => {
                el.style.transform = 'scale(1)';
                el.style.color = 'var(--dark-text)';
            }, 300);
        };
        animateEl(ui.totalPurchases, gameState.purchases);
        animateEl(ui.totalSales, gameState.sales);
        animateEl(ui.inventoryCount, gameState.inventory);
        animateEl(ui.receivableAhmad, gameState.receivable);
    }

    function advanceTask() {
        if (currentTaskIndex < ui.taskCards.length) {
            ui.taskCards[currentTaskIndex].classList.remove('active');
            ui.taskCards[currentTaskIndex].classList.add('completed');
        }
        currentTaskIndex++;
        if (currentTaskIndex < ui.taskCards.length) {
            ui.taskCards[currentTaskIndex].classList.add('active');
            ui.taskCards[currentTaskIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            setTimeout(() => endGame(true), 500); // Win
        }
    }

    function handleTask(action) {
        const currentTask = tasks[currentTaskIndex];
        if (action !== currentTask.action) return; // Ignore clicks on wrong buttons

        playSound(ui.soundSuccess);
        switch(action) {
            case 'purchase':
                gameState.purchases += currentTask.amount;
                gameState.inventory += currentTask.inventoryChange;
                break;
            case 'sale':
                gameState.sales += currentTask.amount;
                gameState.inventory += currentTask.inventoryChange;
                gameState.receivable += currentTask.receivable;
                break;
            case 'check':
                const userInput = parseInt(document.getElementById('inventory-input').value, 10);
                if (userInput !== currentTask.expectedInventory) {
                    alert('اشتباه است! حساب دقیق نشان میدهد که باید ' + currentTask.expectedInventory + ' دانه باقی مانده باشد. دوباره سعی کنید.');
                    return; // Don't advance task on wrong answer
                }
                break;
        }
        updateDashboardUI();
        advanceTask();
    }
    
    function endGame(isWin) {
        clearInterval(timerInterval);
        ui.taskButtons.forEach(btn => btn.disabled = true);
        if (isWin) {
            ui.finalTitle.textContent = "عالی بود!";
            ui.finalMessage.textContent = "شما با موفقیت حسابات را منظم کردید. دیدید که با روزنامچه چقدر آسان است!";
            ui.finalScore.textContent = timeLeft * 10;
            playSound(ui.soundWin);
        } else {
            ui.finalTitle.textContent = "وقت تمام شد!";
            ui.finalMessage.textContent = "مدیریت حسابات میتواند سخت باشد، اما روزنامچه آنرا آسان میسازد.";
            ui.finalScore.textContent = 0;
            playSound(ui.soundLose);
        }
        ui.finalScreen.classList.add('show');
    }

    // --- Initialize Game ---
    function init() {
        ui.taskButtons.forEach(button => {
            button.addEventListener('click', () => handleTask(button.dataset.action));
        });
        ui.taskCards[0].classList.add('active');
        startTimer();
    }

    init();
});