document.addEventListener('DOMContentLoaded', () => {
    // --- Game State & Data ---
    const tasks = [
        { type: 'purchase', prompt: '۱۰ بکس نوشابه به قیمت ۴۰۰ (نقدی) خریداری شد. لطفاً آنرا ثبت کنید.', amount: 4000, inventoryChange: 10, receivableChange: 0 },
        { type: 'sale', prompt: '۲ بکس نوشابه به قیمت ۵۰۰ به "احمد" (قرضه) فروخته شد. لطفاً آنرا ثبت کنید.', amount: 1000, inventoryChange: -2, receivableChange: 1000 },
        { type: 'end', prompt: 'آفرین! تمام معاملات امروز را ثبت کردید.' }
    ];
    let gameState = { currentTask: 0, inventory: 0, receivable: 0, score: 0, timeLeft: 60 };
    let timerInterval;

    // --- UI Elements ---
    const ui = {
        timer: document.getElementById('timer'),
        inventoryCount: document.getElementById('inventory-count'),
        receivableTotal: document.getElementById('receivable-total'),
        taskText: document.getElementById('task-text'),
        btnPurchase: document.getElementById('btn-purchase'),
        btnSale: document.getElementById('btn-sale'),
        transactionList: document.getElementById('transaction-list'),
        finalScreen: document.getElementById('final-screen'),
        finalTitle: document.getElementById('final-title'),
        finalMessage: document.getElementById('final-message'),
        finalScore: document.getElementById('final-score'),
        soundSuccess: document.getElementById('sound-success'),
        soundWin: document.getElementById('sound-win'),
        soundLose: document.getElementById('sound-lose'),
    };

    // --- Game Functions ---
    function startTimer() { /* ... unchanged ... */ }
    function playSound(sound) { /* ... unchanged ... */ }
    function endGame(isWin) { /* ... unchanged, but with score based on timeLeft ... */ }

    function updateDashboard() {
        const animateEl = (el, value, unit) => {
            el.textContent = `${value.toLocaleString('en-US')} ${unit}`;
            el.style.transform = 'scale(1.2)';
            setTimeout(() => { el.style.transform = 'scale(1)'; }, 200);
        };
        animateEl(ui.inventoryCount, gameState.inventory, 'دانه');
        animateEl(ui.receivableTotal, gameState.receivable, 'افغانی');
    }

    function addTransactionToLedger(task) {
        const item = document.createElement('div');
        item.className = 'transaction-item';
        const isSale = task.type === 'sale';
        item.innerHTML = `
            <div>
                <div class="description">${isSale ? 'فروش نوشابه' : 'خرید نوشابه'}</div>
                <div class="customer">${isSale ? 'مشتری: احمد' : 'نقدی'}</div>
            </div>
            <div class="amount ${isSale ? 'sale' : 'purchase'}">
                ${isSale ? '+' : '-'}${task.amount.toLocaleString('en-US')}
            </div>
        `;
        ui.transactionList.appendChild(item);
    }
    
    function setTask(taskIndex) {
        const task = tasks[taskIndex];
        ui.taskText.textContent = task.prompt;

        ui.btnPurchase.disabled = task.type !== 'purchase';
        ui.btnSale.disabled = task.type !== 'sale';

        if (task.type === 'end') {
            endGame(true);
        }
    }

    // --- Event Listeners ---
    ui.btnPurchase.addEventListener('click', () => {
        const task = tasks[gameState.currentTask];
        if (task.type !== 'purchase') return;
        
        gameState.inventory += task.inventoryChange;
        addTransactionToLedger(task);
        updateDashboard();
        playSound(ui.soundSuccess);
        
        gameState.currentTask++;
        setTask(gameState.currentTask);
    });

    ui.btnSale.addEventListener('click', () => {
        const task = tasks[gameState.currentTask];
        if (task.type !== 'sale') return;
        
        gameState.inventory += task.inventoryChange;
        gameState.receivable += task.receivableChange;
        addTransactionToLedger(task);
        updateDashboard();
        playSound(ui.soundSuccess);

        gameState.currentTask++;
        setTask(gameState.currentTask);
    });

    // --- Initialize Game ---
    startTimer();
    setTask(0); // Start with the first task
});