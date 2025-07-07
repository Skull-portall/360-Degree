// Dashboard Management System for 360 Degree Hotel

// Sample data structure - In real implementation, this would come from a database
let ordersData = [
    {
        id: 'ORD001',
        customer: 'John Doe',
        phone: '+234 901 234 5678',
        service: 'rooms',
        serviceName: 'Standard Room',
        amount: 15000,
        date: '2024-01-15',
        status: 'pending',
        details: {
            nights: 2,
            checkin: '2024-01-16',
            checkout: '2024-01-18',
            guests: 2
        }
    },
    {
        id: 'ORD002',
        customer: 'Jane Smith',
        phone: '+234 902 345 6789',
        service: 'food',
        serviceName: 'Jollof Rice with Salad',
        amount: 15000,
        date: '2024-01-15',
        status: 'confirmed',
        details: {
            quantity: 1,
            instructions: 'No spicy food'
        }
    },
    {
        id: 'ORD003',
        customer: 'Mike Johnson',
        phone: '+234 903 456 7890',
        service: 'sports',
        serviceName: 'Football Field',
        amount: 15000,
        date: '2024-01-14',
        status: 'completed',
        details: {
            hours: 1,
            date: '2024-01-15'
        }
    },
    {
        id: 'ORD004',
        customer: 'Sarah Wilson',
        phone: '+234 904 567 8901',
        service: 'gateTickets',
        serviceName: 'Gate Entry Ticket',
        amount: 3000,
        date: '2024-01-15',
        status: 'confirmed',
        details: {
            days: 3,
            people: 3,
            entryDate: '2024-01-16'
        }
    },
    {
        id: 'ORD005',
        customer: 'David Brown',
        phone: '+234 905 678 9012',
        service: 'nightclub',
        serviceName: 'VIP Lounge Experience',
        amount: 25000,
        date: '2024-01-13',
        status: 'completed',
        details: {
            people: 5,
            date: '2024-01-14',
            time: '20:00'
        }
    }
];

let currentOrderId = null;
let filteredOrders = [...ordersData];

// Service name mappings
const serviceNames = {
    rooms: 'Room Booking',
    food: 'Food Order',
    sports: 'Sports Booking',
    gateTickets: 'Gate Tickets',
    services: 'Services',
    nightclub: 'Nightclub'
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    updateStats();
    renderOrdersTable();
    updateAnalytics();
    
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    document.getElementById('startDate').value = firstDay;
    document.getElementById('endDate').value = today;
});

function initializeDashboard() {
    console.log('🚀 Dashboard initialized');
    
    // Update notification count
    const pendingCount = ordersData.filter(order => order.status === 'pending').length;
    document.getElementById('notificationCount').textContent = pendingCount;
    
    // Show orders section by default
    showSection('orders');
}

function updateStats() {
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Calculate stats
    const pendingOrders = ordersData.filter(order => order.status === 'pending').length;
    const confirmedToday = ordersData.filter(order => 
        order.date === today && order.status === 'confirmed'
    ).length;
    
    const todayRevenue = ordersData
        .filter(order => order.date === today && order.status !== 'cancelled')
        .reduce((sum, order) => sum + order.amount, 0);
    
    const monthlyRevenue = ordersData
        .filter(order => {
            const orderDate = new Date(order.date);
            return orderDate.getMonth() === currentMonth && 
                   orderDate.getFullYear() === currentYear &&
                   order.status !== 'cancelled';
        })
        .reduce((sum, order) => sum + order.amount, 0);
    
    // Update UI
    document.getElementById('pendingOrders').textContent = pendingOrders;
    document.getElementById('confirmedOrders').textContent = confirmedToday;
    document.getElementById('todayRevenue').textContent = `₦${todayRevenue.toLocaleString()}`;
    document.getElementById('monthlyRevenue').textContent = `₦${monthlyRevenue.toLocaleString()}`;
}

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionName + 'Section');
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update analytics if analytics section is shown
    if (sectionName === 'analytics') {
        updateAnalytics();
    }
}

function filterOrders() {
    const orderFilter = document.getElementById('orderFilter').value;
    const serviceFilter = document.getElementById('serviceFilter').value;
    
    filteredOrders = ordersData.filter(order => {
        const statusMatch = orderFilter === 'all' || order.status === orderFilter;
        const serviceMatch = serviceFilter === 'all' || order.service === serviceFilter;
        return statusMatch && serviceMatch;
    });
    
    renderOrdersTable();
}

function renderOrdersTable() {
    const tbody = document.getElementById('ordersTableBody');
    tbody.innerHTML = '';
    
    filteredOrders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${order.id}</strong></td>
            <td>
                <div>${order.customer}</div>
                <small style="color: #7f8c8d;">${order.phone}</small>
            </td>
            <td>${order.serviceName}</td>
            <td><strong>₦${order.amount.toLocaleString()}</strong></td>
            <td>${formatDate(order.date)}</td>
            <td><span class="status-badge status-${order.status}">${order.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-small btn-view" onclick="viewOrder('${order.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${order.status === 'pending' ? `
                        <button class="btn-small btn-confirm" onclick="quickConfirmOrder('${order.id}')">
                            <i class="fas fa-check"></i>
                        </button>
                    ` : ''}
                    ${order.status === 'confirmed' ? `
                        <button class="btn-small btn-complete" onclick="quickCompleteOrder('${order.id}')">
                            <i class="fas fa-check-double"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function viewOrder(orderId) {
    const order = ordersData.find(o => o.id === orderId);
    if (!order) return;
    
    currentOrderId = orderId;
    
    const detailsHtml = `
        <div style="margin-bottom: 1.5rem;">
            <h3>Order #${order.id}</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
                <div>
                    <strong>Customer:</strong><br>
                    ${order.customer}<br>
                    <small>${order.phone}</small>
                </div>
                <div>
                    <strong>Service:</strong><br>
                    ${order.serviceName}
                </div>
                <div>
                    <strong>Amount:</strong><br>
                    ₦${order.amount.toLocaleString()}
                </div>
                <div>
                    <strong>Date:</strong><br>
                    ${formatDate(order.date)}
                </div>
                <div>
                    <strong>Status:</strong><br>
                    <span class="status-badge status-${order.status}">${order.status}</span>
                </div>
            </div>
        </div>
        <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px;">
            <h4>Order Details:</h4>
            <div style="margin-top: 0.5rem;">
                ${formatOrderDetails(order)}
            </div>
        </div>
    `;
    
    document.getElementById('orderDetails').innerHTML = detailsHtml;
    document.getElementById('orderModal').style.display = 'block';
}

function formatOrderDetails(order) {
    const details = order.details;
    let html = '';
    
    switch (order.service) {
        case 'rooms':
            html = `
                <p><strong>Nights:</strong> ${details.nights}</p>
                <p><strong>Check-in:</strong> ${formatDate(details.checkin)}</p>
                <p><strong>Check-out:</strong> ${formatDate(details.checkout)}</p>
                <p><strong>Guests:</strong> ${details.guests}</p>
            `;
            break;
        case 'food':
            html = `
                <p><strong>Quantity:</strong> ${details.quantity}</p>
                ${details.instructions ? `<p><strong>Instructions:</strong> ${details.instructions}</p>` : ''}
            `;
            break;
        case 'sports':
            html = `
                <p><strong>Hours:</strong> ${details.hours}</p>
                <p><strong>Date:</strong> ${formatDate(details.date)}</p>
            `;
            break;
        case 'gateTickets':
            html = `
                <p><strong>Days:</strong> ${details.days}</p>
                <p><strong>People:</strong> ${details.people}</p>
                <p><strong>Entry Date:</strong> ${formatDate(details.entryDate)}</p>
            `;
            break;
        case 'nightclub':
            html = `
                <p><strong>People:</strong> ${details.people}</p>
                <p><strong>Date:</strong> ${formatDate(details.date)}</p>
                <p><strong>Time:</strong> ${details.time}</p>
            `;
            break;
        default:
            html = '<p>No additional details available</p>';
    }
    
    return html;
}

function quickConfirmOrder(orderId) {
    const order = ordersData.find(o => o.id === orderId);
    if (order) {
        order.status = 'confirmed';
        updateStats();
        renderOrdersTable();
        showToast('Order confirmed successfully!', 'success');
    }
}

function quickCompleteOrder(orderId) {
    const order = ordersData.find(o => o.id === orderId);
    if (order) {
        order.status = 'completed';
        updateStats();
        renderOrdersTable();
        showToast('Order marked as completed!', 'success');
    }
}

function confirmOrder() {
    if (currentOrderId) {
        quickConfirmOrder(currentOrderId);
        closeOrderModal();
    }
}

function completeOrder() {
    if (currentOrderId) {
        quickCompleteOrder(currentOrderId);
        closeOrderModal();
    }
}

function cancelOrder() {
    if (currentOrderId) {
        const order = ordersData.find(o => o.id === currentOrderId);
        if (order) {
            order.status = 'cancelled';
            updateStats();
            renderOrdersTable();
            showToast('Order cancelled', 'error');
            closeOrderModal();
        }
    }
}

function closeOrderModal() {
    document.getElementById('orderModal').style.display = 'none';
    currentOrderId = null;
}

function updateAnalytics() {
    const period = document.getElementById('periodFilter').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    let filteredData = [...ordersData];
    
    // Filter by period
    if (period !== 'custom') {
        const now = new Date();
        let filterDate;
        
        switch (period) {
            case 'today':
                filterDate = now.toISOString().split('T')[0];
                filteredData = ordersData.filter(order => order.date === filterDate);
                break;
            case 'week':
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                filteredData = ordersData.filter(order => new Date(order.date) >= weekAgo);
                break;
            case 'month':
                filteredData = ordersData.filter(order => {
                    const orderDate = new Date(order.date);
                    return orderDate.getMonth() === now.getMonth() && 
                           orderDate.getFullYear() === now.getFullYear();
                });
                break;
            case 'year':
                filteredData = ordersData.filter(order => {
                    const orderDate = new Date(order.date);
                    return orderDate.getFullYear() === now.getFullYear();
                });
                break;
        }
    } else if (startDate && endDate) {
        filteredData = ordersData.filter(order => 
            order.date >= startDate && order.date <= endDate
        );
    }
    
    // Update service statistics
    updateServiceStats(filteredData);
    updateQuickStats(filteredData);
    
    // Update charts (placeholder)
    updateCharts(filteredData);
}

function updateServiceStats(data) {
    const serviceStats = {};
    
    data.forEach(order => {
        if (order.status !== 'cancelled') {
            if (!serviceStats[order.service]) {
                serviceStats[order.service] = { count: 0, revenue: 0 };
            }
            serviceStats[order.service].count++;
            serviceStats[order.service].revenue += order.amount;
        }
    });
    
    const container = document.getElementById('serviceStats');
    container.innerHTML = '';
    
    Object.entries(serviceStats).forEach(([service, stats]) => {
        const div = document.createElement('div');
        div.className = 'service-stat';
        div.innerHTML = `
            <span class="service-stat-name">${serviceNames[service] || service}</span>
            <span class="service-stat-value">₦${stats.revenue.toLocaleString()}</span>
        `;
        container.appendChild(div);
    });
}

function updateQuickStats(data) {
    const validOrders = data.filter(order => order.status !== 'cancelled');
    const totalOrders = validOrders.length;
    const totalRevenue = validOrders.reduce((sum, order) => sum + order.amount, 0);
    const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Find top service
    const serviceCounts = {};
    validOrders.forEach(order => {
        serviceCounts[order.service] = (serviceCounts[order.service] || 0) + 1;
    });
    const topService = Object.keys(serviceCounts).reduce((a, b) => 
        serviceCounts[a] > serviceCounts[b] ? a : b, 'None'
    );
    
    // Calculate completion rate
    const completedOrders = data.filter(order => order.status === 'completed').length;
    const completionRate = totalOrders > 0 ? (completedOrders / totalOrders * 100).toFixed(1) : 0;
    
    // Update UI
    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('avgOrder').textContent = `₦${avgOrder.toLocaleString()}`;
    document.getElementById('topService').textContent = serviceNames[topService] || topService;
    document.getElementById('completionRate').textContent = `${completionRate}%`;
}

function updateCharts(data) {
    // Placeholder for chart updates
    // In a real implementation, you would use Chart.js or similar library
    const revenueChart = document.getElementById('revenueChart');
    const ordersChart = document.getElementById('ordersChart');
    
    revenueChart.textContent = 'Revenue chart will be displayed here';
    ordersChart.textContent = 'Orders trend chart will be displayed here';
}

function generateReport(type) {
    showToast(`Generating ${type} report...`, 'info');
    
    // Simulate report generation
    setTimeout(() => {
        showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} report generated successfully!`, 'success');
    }, 2000);
}

function refreshData() {
    showToast('Refreshing data...', 'info');
    
    // Simulate data refresh
    setTimeout(() => {
        updateStats();
        renderOrdersTable();
        updateAnalytics();
        showToast('Data refreshed successfully!', 'success');
    }, 1500);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        showToast('Logging out...', 'info');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1000);
    }
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const icon = toast.querySelector('.toast-icon');
    const messageEl = toast.querySelector('.toast-message');
    
    // Set icon based on type
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle'
    };
    
    icon.className = `toast-icon ${icons[type]}`;
    messageEl.textContent = message;
    toast.className = `toast ${type} show`;
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('orderModal');
    if (event.target === modal) {
        closeOrderModal();
    }
}

// Handle period filter change
document.addEventListener('DOMContentLoaded', function() {
    const periodFilter = document.getElementById('periodFilter');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    
    if (periodFilter) {
        periodFilter.addEventListener('change', function() {
            const isCustom = this.value === 'custom';
            startDate.style.display = isCustom ? 'block' : 'none';
            endDate.style.display = isCustom ? 'block' : 'none';
        });
    }
});