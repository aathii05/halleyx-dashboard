/**
 * API Integration Module
 * Handles data fetching and fallback for the Dashboard
 */

const API_CONFIG = {
    // Replace the production URL with your actual deployed backend URL
    BASE_URL: (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:8080/orders'
        : 'https://halleyx-backend.onrender.com/orders', 
    TIMEOUT: 5000
};

// Demo Data for Fallback
const DEMO_DATA = [
    { id: 101, firstName: "Alice", lastName: "Johnson", email: "alice.j@example.com", product: "Fiber Internet 1 Gmps", quantity: 1, unitPrice: 89.99, totalAmount: 89.99, status: "DELIVERED" },
    { id: 102, firstName: "Bob", lastName: "Smith", email: "bob.s@example.com", product: "5G Unlimited Mobile Plan", quantity: 2, unitPrice: 45.00, totalAmount: 90.00, status: "SHIPPED" },
    { id: 103, firstName: "Charlie", lastName: "Davis", email: "charlie.d@example.com", product: "Fiber Internet 300 Mbps", quantity: 1, unitPrice: 59.99, totalAmount: 59.99, status: "PENDING" },
    { id: 104, firstName: "Diana", lastName: "Prince", email: "diana.p@example.com", product: "VoIP Corporate Package", quantity: 5, unitPrice: 20.00, totalAmount: 100.00, status: "DELIVERED" },
    { id: 105, firstName: "Ethan", lastName: "Hunt", email: "ethan.h@example.com", product: "Business Internet 500 Mbps", quantity: 1, unitPrice: 129.99, totalAmount: 129.99, status: "PENDING" },
];

/**
 * Fetch orders from the backend API
 */
async function fetchOrders() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    try {
        const response = await fetch(API_CONFIG.BASE_URL, {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`API error: ${response.status}`);

        const data = await response.json();
        const finalData = data.length > 0 ? data : DEMO_DATA;
        updateStatusIndicator(true);
        return finalData;

    } catch (error) {
        clearTimeout(timeoutId);
        console.warn('Backend API unavailable, switching to demo data.', error.message);
        updateStatusIndicator(false);
        return new Promise(resolve => {
            setTimeout(() => resolve(DEMO_DATA), 800);
        });
    }
}

/**
 * Track orders by email
 */
async function trackOrders(email) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/track?email=${encodeURIComponent(email)}`, {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`API error: ${response.status}`);

        const data = await response.json();
        updateStatusIndicator(true);
        return data;

    } catch (error) {
        clearTimeout(timeoutId);
        console.warn('Backend API unavailable, switching to demo data.', error.message);
        updateStatusIndicator(false);
        // Filter demo data by email
        return new Promise(resolve => {
            setTimeout(() => resolve(DEMO_DATA.filter(order => order.email === email)), 800);
        });
    }
}

/**
 * Update UI to show API connectivity status
 */
function updateStatusIndicator(isConnected) {
    const statusText = document.getElementById('apiStatusText');
    const pulseDot = document.querySelector('.pulse-dot');
    
    if (statusText && pulseDot) {
        if (isConnected) {
            statusText.textContent = 'Live System (Connected)';
            pulseDot.style.background = 'var(--accent-success)';
        } else {
            statusText.textContent = 'Demo Mode (Offline)';
            pulseDot.style.background = 'var(--accent-warning)';
        }
    }
}

// Make functions globally available
window.fetchOrders = fetchOrders;
window.trackOrders = trackOrders;
