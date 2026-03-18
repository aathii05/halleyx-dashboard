/**
 * Utility Functions
 */

const utils = {
    /**
     * Generate a unique ID for widgets
     */
    generateUUID: () => {
        return 'w-' + Math.random().toString(36).substr(2, 9);
    },

    /**
     * Format numbers as currency
     */
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    },

    /**
     * Show a toast notification
     */
    showToast: (message, type = 'info') => {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        container.appendChild(toast);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    },

    /**
     * Export data to CSV (Excel compatible)
     */
    exportToCSV: (data, fileName = 'order_export.csv') => {
        if (!data || !data.length) {
            utils.showToast("No data available to export", "error");
            return;
        }

        // Add UTF-8 BOM for Excel compatibility
        const BOM = '\uFEFF';
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(obj => 
            Object.values(obj).map(val => 
                typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
            ).join(',')
        );

        const csvContent = BOM + [headers, ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', fileName);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            utils.showToast("File exported successfully", "success");
        } else {
            utils.showToast("Export not supported in this browser", "error");
        }
    }
};
