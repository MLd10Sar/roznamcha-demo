document.addEventListener('DOMContentLoaded', () => {
    const fab = document.getElementById('fab-plus');
    const addSaleDialog = document.getElementById('add-sale-dialog');
    const saveSaleButton = document.getElementById('save-sale-button');
    const totalSalesEl = document.getElementById('total-sales');
    const inventoryCountEl = document.getElementById('inventory-count');
    const cashOnHandEl = document.getElementById('cash-on-hand');
    const finalScreen = document.getElementById('final-screen');
    const guidanceStep1 = document.getElementById('guidance-step-1');
    const guidanceStep2 = document.getElementById('guidance-step-2');
    const inventoryMetricEl = document.getElementById('inventory-metric');

    const initialValues = { sales: 0, inventory: 10, cash: 50000 };

    // --- THE GUIDED TOUR LOGIC ---
    function startTour() {
        fab.classList.add('highlight');
        guidanceStep1.classList.add('show');
    }

    fab.addEventListener('click', () => {
        fab.classList.remove('highlight');
        guidanceStep1.classList.remove('show');
        addSaleDialog.classList.add('show');
    });

    saveSaleButton.addEventListener('click', () => {
        addSaleDialog.classList.remove('show');
        animateDashboardUpdate();
    });

    function animateDashboardUpdate() {
        const saleAmount = 500;
        const newInventory = 8;
        const newCash = initialValues.cash + saleAmount;

        animateValue(totalSalesEl, initialValues.sales, saleAmount, 1000, " افغانی");
        animateValue(inventoryCountEl, initialValues.inventory, newInventory, 800, " دانه");
        animateValue(cashOnHandEl, initialValues.cash, newCash, 1200, " افغانی");
        
        // Highlight the inventory row
        setTimeout(() => {
            inventoryMetricEl.classList.add('highlight');
            guidanceStep2.classList.add('show');
        }, 1300); // Show guidance after numbers finish animating

        // Show final screen
        setTimeout(() => {
            inventoryMetricEl.classList.remove('highlight');
            guidanceStep2.classList.remove('show');
            finalScreen.classList.add('show');
        }, 4000); // Show final screen after 4 seconds
    }

    // --- Helper function for number animation ---
    function animateValue(element, start, end, duration, unit) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentValue = Math.floor(progress * (end - start) + start);
            element.innerText = `${currentValue.toLocaleString('en-US')}.00${unit}`;
            if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
    }
    
    // Start the tour
    setTimeout(startTour, 500);
});