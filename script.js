document.addEventListener('DOMContentLoaded', () => {
    // --- Game State & Data ---
    const tasks = [
        {
            type: 'purchase',
            prompt: 'یک خرید نقدی ثبت کنید: ۱۰ بکس نوشابه به قیمت ۴۰۰.',
            buttons: [{ label: 'ثبت خرید', action: 'purchase' }, { label: 'ثبت فروش', action: 'sale', disabled: true }],
            data: { description: 'خرید نوشابه', customer: 'پرداخت نقدی', amount: -4000, type: 'purchase', inventoryChange: 10, receivableChange: 0 }
        },
        {
            type: 'sale',
            prompt: 'یک فروش قرضه به "احمد" ثبت کنید: ۲ بکس نوشابه به قیمت ۵۰۰.',
            buttons: [{ label: 'ثبت خرید', action: 'purchase', disabled: true }, { label: 'ثبت فروش', action: 'sale' }],
            data: { description: 'فروش نوشابه', customer: 'مشتری: احمد', amount: 1000, type: 'sale', inventoryChange: -2, receivableChange: 1000 }
        },
        {
            type: 'settle',
            prompt: '"احمد" نصف قرضه خود را پرداخت کرد. یک رسید برایش ثبت کنید.',
            buttons: [{ label: 'ثبت رسید', action: 'settle' }, { label: 'ثبت مصرف', action: 'expense', disabled: true }],
            data: { description: 'رسید از احمد', customer: 'پرداخت نقدی', amount: 500, type: 'sale', inventoryChange: 0, receivableChange: -500 }
        },
        {
            type: 'end',
            prompt: 'آفرین! شما تمام معاملات امروز را مدیریت کردید.',
            buttons: []
        }
    ];
    let gameState = { currentTask: 0, inventory: 0, receivable: 0, timeLeft: 90 };
    let timerInterval = null;

    // --- UI Elements ---
    const ui = {
        timer: document.getElementById('timer'),
        inventoryCount: document.getElementById('inventory-count'),
        receivableTotal: document.getElementById('receivable-ahmad'),
        taskText: document.getElementById('task-text'),
        btnAction1: document.getElementById('btn-action-1'),
        btnAction2: document.getElementById('btn-action-2'),
        transactionList: document.getElementById('transaction-list'),
        finalScreen: document.getElementById('final-screen'),
        finalTitle: document.getElementById('final-title'),
        finalMessage: document.getElementById('final-message'),
        finalScore: document.getElementById('final-score'),
        timeBonus: document.getElementById('time-bonus'),
        soundSuccess: document.getElementById('sound-success'),
        soundWin: document.getElementById('sound-win'),
        soundLose: document.getElementById('sound-lose'),
        soundClick: document.getElementById('sound-click'),
        taskPrompt: document.getElementById('task-prompt')
    };

    // --- Game Logic Functions ---
    function startTimer() {
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            gameState.timeLeft--;
            ui.timer.textContent = gameState.timeLeft;
            if (gameState.timeLeft <= 10 && !ui.timer.classList.contains('warning')) {
                ui.timer.classList.add('warning');
            }
            if (gameState.timeLeft <= 0) {
                endGame(false); // Lose
            }
        }, 1000);
    }

    function playSound(soundElement) {
        if (soundElement) {
            soundElement.currentTime = 0;
            soundElement.play().catch(e => console.error("Sound play failed:", e));
        }
    }

    function updateDashboard() {
        const animateEl = (el, value, unit) => {
            el.textContent = `${value.toLocaleString('en-US')} ${unit}`;
            el.style.transform = 'scale(1.25)';
            setTimeout(() => { el.style.transform = 'scale(1)'; }, 250);
        };
        animateEl(ui.inventoryCount, gameState.inventory, 'دانه');
        animateEl(ui.receivableTotal, gameState.receivable, 'افغانی');
    }

    function addTransactionToLedger(data) {
        const item = document.createElement('div');
        item.className = 'transaction-item';
        item.innerHTML = `
            <div>
                <div class="description">${data.description}</div>
                <div class="customer">${data.customer}</div>
            </div>
            <div class="amount ${data.type}">
                ${data.type === 'sale' ? '+' : '-'}${Math.abs(data.amount).toLocaleString('en-US')}
            </div>
        `;
        ui.transactionList.appendChild(item);
        ui.transactionList.scrollTop = ui.transactionList.scrollHeight; // Auto-scroll
    }

    function setTask(taskIndex) {
        const task = tasks[taskIndex];
        ui.taskText.textContent = task.prompt;
        ui.taskPrompt.classList.remove('completed');

        const buttons = [ui.btnAction1, ui.btnAction2];
        if (task.buttons.length > 0) {
            task.buttons.forEach((btnConfig, i) => {
                buttons[i].textContent = btnConfig.label;
                buttons[i].dataset.action = btnConfig.action;
                buttons[i].disabled = btnConfig.disabled || false;
                buttons[i].classList.toggle('active', !buttons[i].disabled);
            });
        }

        if (task.type === 'end') {
            endGame(true);
        }
    }

    function handleAction(action) {
        const task = tasks[gameState.currentTask];
        if (action !== task.type) return;

        playSound(ui.soundClick);
        setTimeout(() => playSound(ui.soundSuccess), 150);

        const data = task.data;
        gameState.inventory += data.inventoryChange;
        gameState.receivable += data.receivableChange;
        
        addTransactionToLedger(data);
        updateDashboard();
        
        ui.taskPrompt.classList.add('completed');
        
        gameState.currentTask++;
        setTimeout(() => setTask(gameState.currentTask), 500); // Small delay for next task
    }

    function endGame(isWin) {
        clearInterval(timerInterval);
        ui.btnAction1.disabled = true;
        ui.btnAction2.disabled = true;

        if (isWin) {
            ui.finalTitle.textContent = "عالی بود!";
            ui.finalMessage.textContent = "شما با موفقیت حسابات را منظم کردید. دیدید که با روزنامچه چقدر آسان است!";
            const score = gameState.timeLeft * 100;
            ui.finalScore.textContent = score;
            ui.timeBonus.textContent = `${gameState.timeLeft}s`;
            playSound(ui.soundWin);
        } else {
            ui.finalTitle.textContent = "وقت تمام شد!";
            ui.finalMessage.textContent = "مدیریت حسابات میتواند سخت باشد، اما روزنامچه آنرا آسان میسازد.";
            ui.finalScore.textContent = 0;
            ui.timeBonus.textContent = "0s";
            playSound(ui.soundLose);
        }
        ui.finalScreen.classList.add('show');
    }

    // --- Event Listeners ---
    [ui.btnAction1, ui.btnAction2].forEach(button => {
        button.addEventListener('click', () => {
            handleAction(button.dataset.action);
        });
    });

    // --- Initialize Game ---
    startTimer();
    setTask(0);
});