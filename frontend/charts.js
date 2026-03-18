/**
 * Charting Module
 */

const charts = {
    // Professional MNC Color Palette for Charts
    colors: {
        primary: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'],
        vibrant: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'],
        status: {
            DELIVERED: '#10b981',
            PENDING: '#f59e0b',
            SHIPPED: '#3b82f6',
            CANCELLED: '#ef4444'
        }
    },

    /**
     * Initialize a Bar Chart for Product Quantities
     */
    renderProductBarChart: (canvasId, data) => {
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        const productStats = data.reduce((acc, order) => {
            acc[order.product] = (acc[order.product] || 0) + 1;
            return acc;
        }, {});

        const labels = Object.keys(productStats);
        const values = Object.values(productStats);

        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Orders per Product',
                    data: values,
                    backgroundColor: 'rgba(59, 130, 246, 0.6)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
                    x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                }
            }
        });
    },

    /**
     * Initialize a Pie Chart for Order Status
     */
    renderStatusPieChart: (canvasId, data) => {
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        const statusStats = data.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {});

        const labels = Object.keys(statusStats);
        const values = Object.values(statusStats);
        const backgroundColors = labels.map(l => charts.colors.status[l] || '#64748b');

        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: backgroundColors,
                    borderWidth: 0,
                    hoverOffset: 15
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 1500,
                    easing: 'easeOutQuart'
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#94a3b8', padding: 20, usePointStyle: true }
                    }
                },
                hover: {
                    mode: 'nearest',
                    intersect: true,
                    animationDuration: 400
                }
            }
        });
    }
};
