/**
 * Widget Management Module
 */

const widgets = {
    templates: {
        'kpi-group': (id, data) => {
            const totalOrders = data.length;
            const totalRevenue = data.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
            const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

            return `
                <div class="widget kpi-group" id="${id}" data-type="kpi-group" style="grid-column: span 12;">
                    <div class="widget-header">
                        <span class="widget-title">Performance Summary</span>
                        <div class="widget-actions">
                            <button class="action-btn" onclick="widgets.remove('${id}')"><ion-icon name="close-outline"></ion-icon></button>
                        </div>
                    </div>
                    <div class="kpi-container">
                        <div class="kpi-card">
                            <p class="kpi-label">Total Orders</p>
                            <p class="kpi-value">${totalOrders}</p>
                        </div>
                        <div class="kpi-card">
                            <p class="kpi-label">Total Revenue</p>
                            <p class="kpi-value">${utils.formatCurrency(totalRevenue)}</p>
                        </div>
                        <div class="kpi-card">
                            <p class="kpi-label">Avg Order Value</p>
                            <p class="kpi-value">${utils.formatCurrency(avgOrderValue)}</p>
                        </div>
                    </div>
                </div>`;
        },
        'bar-chart': (id) => `
            <div class="widget chart-widget" id="${id}" data-type="bar-chart" style="grid-column: span 6;">
                <div class="widget-header">
                    <span class="widget-title">Orders by Product</span>
                    <div class="widget-actions">
                        <button class="action-btn" onclick="widgets.remove('${id}')"><ion-icon name="close-outline"></ion-icon></button>
                    </div>
                </div>
                <div style="height: 300px;"><canvas id="canvas-${id}"></canvas></div>
            </div>`,
        'pie-chart': (id) => `
            <div class="widget chart-widget" id="${id}" data-type="pie-chart" style="grid-column: span 6;">
                <div class="widget-header">
                    <span class="widget-title">Order Status Distribution</span>
                    <div class="widget-actions">
                        <button class="action-btn" onclick="widgets.remove('${id}')"><ion-icon name="close-outline"></ion-icon></button>
                    </div>
                </div>
                <div style="height: 300px;"><canvas id="canvas-${id}"></canvas></div>
            </div>`,
        'table': (id, data) => `
            <div class="widget table-widget" id="${id}" data-type="table" style="grid-column: span 12;">
                <div class="widget-header">
                    <span class="widget-title">Recent Orders</span>
                    <div class="widget-actions">
                        <button class="action-btn" onclick="widgets.remove('${id}')"><ion-icon name="close-outline"></ion-icon></button>
                    </div>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Product</th>
                                <th>Qty</th>
                                <th>Total</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map(order => `
                                <tr>
                                    <td style="font-weight: 500;">${order.firstName} ${order.lastName}</td>
                                    <td>${order.product}</td>
                                    <td>${order.quantity}</td>
                                    <td style="font-weight: 600;">$${order.totalAmount}</td>
                                    <td><span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>`
    },

    add: (type, data, existingId = null) => {
        const id = existingId || utils.generateUUID();
        const grid = document.getElementById('dashboardGrid');
        const templateFn = widgets.templates[type];
        const widgetHtml = templateFn(id, data);
        grid.insertAdjacentHTML('beforeend', widgetHtml);

        // Apply staggered animation delay
        const newWidget = document.getElementById(id);
        if (newWidget) {
            const index = grid.children.length - 1;
            newWidget.style.animationDelay = `${index * 0.1}s`;
        }

        // Post-render logic for charts
        if (type === 'bar-chart') charts.renderProductBarChart(`canvas-${id}`, data);
        else if (type === 'pie-chart') charts.renderStatusPieChart(`canvas-${id}`, data);

        if (!existingId) widgets.save();
    },

    remove: (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.remove();
            widgets.save();
        }
    },

    save: () => {
        const grid = document.getElementById('dashboardGrid');
        const layout = Array.from(grid.children).map(child => ({
            id: child.id,
            type: child.dataset.type
        }));
        localStorage.setItem('halleyx-dash-layout', JSON.stringify(layout));
    },

    load: (data) => {
        const savedLayout = localStorage.getItem('halleyx-dash-layout');
        if (savedLayout) {
            const layout = JSON.parse(savedLayout);
            layout.forEach(w => widgets.add(w.type, data, w.id));
        } else {
            widgets.add('kpi-group', data);
            widgets.add('bar-chart', data);
            widgets.add('pie-chart', data);
            widgets.add('table', data);
        }
    },

    reset: (data) => {
        if (confirm('Reset dashboard layout?')) {
            localStorage.removeItem('halleyx-dash-layout');
            document.getElementById('dashboardGrid').innerHTML = '';
            widgets.load(data);
        }
    }
};
