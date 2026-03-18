/**
 * Main Application Orchestration
 */

document.addEventListener('DOMContentLoaded', async () => {
    const app = {
        data: [],
        sortable: null,

        init: async () => {
            console.log('Initializing HalleyxDash...');
            app.showLoading(true);

            try {
                // 1. Fetch data
                app.data = await fetchOrders();
                
                // 2. Load widgets
                widgets.load(app.data);

                // 3. Initialize Drag & Drop
                app.initSortable();

                // 4. Bind Events
                app.bindEvents();

                console.log('HalleyxDash ready.');
            } catch (error) {
                console.error('Init error:', error);
                utils.showToast('Failed to initialize dashboard.', 'error');
            } finally {
                app.showLoading(false);
            }
        },

        initSortable: () => {
            const grid = document.getElementById('dashboardGrid');
            app.sortable = new Sortable(grid, {
                animation: 250,
                handle: '.widget-header',
                draggable: '.widget',
                ghostClass: 'sortable-ghost',
                onEnd: () => {
                    widgets.save();
                    utils.showToast('Layout updated', 'info');
                }
            });
        },

        bindEvents: () => {
            document.getElementById('saveLayoutBtn').addEventListener('click', () => {
                widgets.save();
                utils.showToast('Manual save complete', 'success');
            });

            document.getElementById('resetLayoutBtn').addEventListener('click', () => {
                widgets.reset(app.data);
            });

            document.getElementById('exportExcelBtn').addEventListener('click', () => {
                utils.exportToCSV(app.data, 'Halleyx_Orders_Export.csv');
            });

            document.querySelectorAll('.toolbox-item').forEach(item => {
                item.addEventListener('click', () => {
                    const type = item.dataset.type;
                    widgets.add(type, app.data);
                    utils.showToast(`${type} added to dashboard`, 'info');
                });
            });
        },

        showLoading: (show) => {
            const overlay = document.getElementById('loadingOverlay');
            if (overlay) {
                if (show) overlay.classList.remove('hidden');
                else overlay.classList.add('hidden');
            }
        }
    };

    await app.init();
});
