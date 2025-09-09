// script.js

// Wait for the entire HTML document to be loaded and parsed before running any code.
document.addEventListener('DOMContentLoaded', () => {

    // Get all the elements from the HTML
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

    // Check if all essential elements were found. If not, log an error and stop.
    if (!fab || !addSaleDialog || !saveSaleButton || !totalSalesEl) {
        console.error("Demo script failed: One or more essential HTML elements could not be found.");
        return;
    }

    const initialValues = { sales: 0, inventory: 10, cash: 50000 };

    // --- The Guided Tour Logic ---
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
        
        setTimeout(() => {
            inventoryMetricEl.classList.add('highlight');
            guidanceStep2.classList.add('show');
        }, 1300);

        setTimeout(() => {
            inventoryMetricEl.classList.remove('highlight');
            guidanceStep2.classList.remove('show');
            finalScreen.classList.add('show');
        }, 4000);
    }

    // --- Helper function for number animation ---
    function animateValue(element, start, end, duration, unit) {
        if (!element) return; // Safety check
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentValue = Math.floor(progress * (end - start) + start);
            
            // Format with commas and add the unit
            element.innerText = `${currentValue.toLocaleString('en-US')}.00${unit}`;
            
            if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
    }
    
    // Start the tour after a short delay
    setTimeout(startTour, 500);

}); // End of DOMContentLoaded listener