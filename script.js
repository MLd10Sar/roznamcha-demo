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
        finalMessage: document.getElementById('final-message'),
        finalScore: document.getElementById('final-score'),
        soundSuccess: document.getElementById('sound-success'),
        soundWin: document.getElementById('sound-win'),
        soundLose: document.getElementById('sound-lose'),
    };

    // --- Game Logic ---
    function startTimer() {
        timerInterval = setInterval(() => {
            timeLeft--;
            ui.timer.textContent = timeLeft;
            if (timeLeft <= 5) {
                ui.timer.style.color = '#fff';
                ui.timer.style.backgroundColor = '#c82333';
            }
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
            setTimeout(() => endGame(true), 500); // Win with a slight delay
        }
    }

    function updateDashboardValue(key, change) {
        const el = ui[key];
        let currentValue = parseFloat(el.textContent.replace(/,/g, '')) || 0;
        const newValue = currentValue + change;
        
        // Animate the update
        el.style.transform = 'scale(1.2)';
        el.style.color = '#00BFA5';
        setTimeout(() => {
            el.textContent = newValue.toLocaleString('en-US');
            el.style.transform = 'scale(1)';
            el.style.color = '#212529';
        }, 200);
    }

    function endGame(isWin) {
        clearInterval(timerInterval);
        ui.btnPurchase.disabled = true;
        ui.btnSale.disabled = true;
        
        if (isWin) {
            ui.finalTitle.textContent = "عالی بود!";
            ui.finalMessage.textContent = "شما با موفقیت حسابات را منظم کردید. دیدید که با روزنامچه چقدر آسان است!";
            ui.finalScore.textContent = timeLeft * 10; // Score based on time left
            playSound(ui.soundWin);
        } else {
            ui.finalTitle.textContent = "وقت تمام شد!";
            ui.finalMessage.textContent = "مدیریت حسابات میتواند سخت باشد، اما روزنامچه آنرا آسان میسازد.";
            ui.finalScore.textContent = 0;
            playSound(ui.soundLose);
        }
        ui.finalScreen.classList.add('show');
    }
    
    function playSound(soundElement) {
        if (soundElement) {
            soundElement.currentTime = 0;
            soundElement.play();
        }
    }

    // --- Event Listeners ---
    ui.btnPurchase.addEventListener('click', () => {
        if (tasks[currentTaskIndex].action === 'purchase') {
            const task = tasks[currentTaskIndex];
            updateDashboardValue('totalPurchases', task.amount);
            updateDashboardValue('inventoryCount', task.inventoryChange);
            playSound(ui.soundSuccess);
            nextTask();
        }
    });

    ui.btnSale.addEventListener('click', () => {
        if (tasks[currentTaskIndex].action === 'sale') {
            const task = tasks[currentTaskIndex];
            updateDashboardValue('totalSales', task.amount);
            updateDashboardValue('inventoryCount', task.inventoryChange);
            updateDashboardValue('receivableAhmad', task.receivable);
            playSound(ui.soundSuccess);
            nextTask();
            
            // This is the check inventory task
            setTimeout(() => {
                 if (tasks[currentTaskIndex].action === 'check') {
                    tasks[currentTaskIndex].el.querySelector('div').innerHTML += ` <strong>پاسخ: ${ui.inventoryCount.textContent} دانه</strong>`;
                    playSound(ui.soundSuccess);
                    nextTask();
                }
            }, 500);
        }
    });
    
    // --- Start Game ---
    startTimer();
});