// nav-loader.js
document.addEventListener("DOMContentLoaded", () => {
    const placeholder = document.getElementById('nav-placeholder'); // Finds the bridge in index.html
    if (placeholder) {
        fetch('Nav.html') // Grabs your separate Navbar file
            .then(response => response.text())
            .then(html => {
                placeholder.innerHTML = html; // Injects the Navbar into the Index
                
                // OPTIONAL: Simple logic for the logo click after it loads
                const logo = document.getElementById('logoButton');
                if (logo) {
                    logo.addEventListener('click', () => {
                        window.location.href = 'index.html'; 
                    });
                }
            })
            .catch(err => console.error('Failed to load navbar:', err));
    }
});

        // Enhanced Application State
        const AppState = {
            LANDING: 'landing',
            MODULE: 'module'
        };

        let currentState = AppState.LANDING;
        let currentModule = null;
        let currentPage = 'dashboard';
        let currentTab = 'overview';
        let securityChart = null;
        let systemChart = null;
        let ticketsChart = null;

        // DOM Elements
        const elements = {
            logoButton: document.getElementById('logoButton'),
            moduleButtonsHeader: document.getElementById('moduleButtonsHeader'),
            securityButton: document.getElementById('securityButton'),
            adminButton: document.getElementById('adminButton'),
            helpdeskButton: document.getElementById('helpdeskButton'),
            securityHeaderBtn: document.getElementById('securityHeaderBtn'),
            adminHeaderBtn: document.getElementById('adminHeaderBtn'),
            helpdeskHeaderBtn: document.getElementById('helpdeskHeaderBtn'),
            landingContainer: document.getElementById('landingContainer'),
            mainSidebar: document.getElementById('mainSidebar'),
            mainContent: document.getElementById('mainContent'),
            securityModule: document.getElementById('securityModule'),
            adminModule: document.getElementById('adminModule'),
            helpdeskModule: document.getElementById('helpdeskModule'),
            userProfile: document.getElementById('userProfile'),
            userDropdown: document.getElementById('userDropdown')
        };

        // Initialize the application
        document.addEventListener('DOMContentLoaded', function() {
            initializeApplication();
            setupEventListeners();
            updateUIForState();
            initializeCharts();
            
            console.log('Enhanced CLaaS2SaaS Control Centre initialized');
        });

        function initializeApplication() {
            currentState = AppState.LANDING;
            currentModule = null;
            currentPage = 'dashboard';
            currentTab = 'overview';
        }

        function setupEventListeners() {
            // Logo click - always returns to landing
            elements.logoButton.addEventListener('click', returnToLanding);
            
            // Landing page module buttons
            elements.securityButton.addEventListener('click', () => selectModule('security'));
            elements.adminButton.addEventListener('click', () => selectModule('admin'));
            elements.helpdeskButton.addEventListener('click', () => selectModule('helpdesk'));
            
            // Header module buttons
            elements.securityHeaderBtn.addEventListener('click', () => switchModule('security'));
            elements.adminHeaderBtn.addEventListener('click', () => switchModule('admin'));
            elements.helpdeskHeaderBtn.addEventListener('click', () => switchModule('helpdesk'));
            
            // Global search
            document.getElementById('globalSearch').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    performGlobalSearch(this.value);
                }
            });
            
            // Notification button
            document.getElementById('notificationButton').addEventListener('click', showNotifications);
            
            // User profile dropdown
            elements.userProfile.addEventListener('click', function(e) {
                e.stopPropagation();
                elements.userDropdown.classList.toggle('show');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function() {
                elements.userDropdown.classList.remove('show');
            });
            
            // Sidebar navigation items
            document.querySelectorAll('.nav-item').forEach(item => {
                item.addEventListener('click', function() {
                    const page = this.getAttribute('data-page');
                    navigateToPage(page);
                });
            });
            
            // Tab navigation buttons
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const tab = this.getAttribute('data-tab');
                    switchTab(tab);
                });
            });
        }

        function initializeCharts() {
            // Initialize security chart
            const securityCtx = document.getElementById('securityChart')?.getContext('2d');
            if (securityCtx) {
                securityChart = new Chart(securityCtx, {
                    type: 'line',
                    data: {
                        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        datasets: [{
                            label: 'High Severity',
                            data: [2, 3, 1, 4, 3, 2, 1],
                            borderColor: getComputedStyle(document.documentElement).getPropertyValue('--color-danger'),
                            backgroundColor: 'rgba(153, 21, 71, 0.1)',
                            tension: 0.4
                        }, {
                            label: 'Medium Severity',
                            data: [5, 6, 4, 7, 5, 6, 4],
                            borderColor: getComputedStyle(document.documentElement).getPropertyValue('--color-warning'),
                            backgroundColor: 'rgba(233, 172, 83, 0.1)',
                            tension: 0.4
                        }, {
                            label: 'Low Severity',
                            data: [12, 10, 8, 11, 9, 10, 7],
                            borderColor: getComputedStyle(document.documentElement).getPropertyValue('--color-secondary-blue'),
                            backgroundColor: 'rgba(68, 142, 157, 0.1)',
                            tension: 0.4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: false
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Number of Threats'
                                }
                            }
                        }
                    }
                });
            }

            // Initialize system chart
            const systemCtx = document.getElementById('systemChart')?.getContext('2d');
            if (systemCtx) {
                systemChart = new Chart(systemCtx, {
                    type: 'bar',
                    data: {
                        labels: ['CPU Usage', 'Memory', 'Storage', 'Network', 'API Calls', 'Database'],
                        datasets: [{
                            label: 'Utilization %',
                            data: [65, 78, 45, 82, 91, 60],
                            backgroundColor: [
                                'rgba(25, 62, 107, 0.7)',
                                'rgba(68, 142, 157, 0.7)',
                                'rgba(127, 63, 152, 0.7)',
                                'rgba(233, 172, 83, 0.7)',
                                'rgba(95, 128, 37, 0.7)',
                                'rgba(153, 21, 71, 0.7)'
                            ],
                            borderColor: [
                                'rgb(25, 62, 107)',
                                'rgb(68, 142, 157)',
                                'rgb(127, 63, 152)',
                                'rgb(233, 172, 83)',
                                'rgb(95, 128, 37)',
                                'rgb(153, 21, 71)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                max: 100,
                                title: {
                                    display: true,
                                    text: 'Percentage'
                                }
                            }
                        }
                    }
                });
            }

            // Initialize tickets chart
            const ticketsCtx = document.getElementById('ticketsChart')?.getContext('2d');
            if (ticketsCtx) {
                ticketsChart = new Chart(ticketsCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Resolved', 'In Progress', 'Pending', 'Escalated'],
                        datasets: [{
                            data: [65, 20, 10, 5],
                            backgroundColor: [
                                'rgba(95, 128, 37, 0.7)',
                                'rgba(233, 172, 83, 0.7)',
                                'rgba(68, 142, 157, 0.7)',
                                'rgba(153, 21, 71, 0.7)'
                            ],
                            borderColor: [
                                'rgb(95, 128, 37)',
                                'rgb(233, 172, 83)',
                                'rgb(68, 142, 157)',
                                'rgb(153, 21, 71)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        layout: {
                            padding: {
                                top: 10,
                                bottom: 10,
                                left: 10,
                                right: 10
                            }
                        },
                        plugins: {
                            legend: {
                                position: 'right',
                                align: 'center',
                                labels: {
                                    boxWidth: 12,
                                    padding: 15,
                                    font: {
                                        size: 11 // Slightly smaller font for better fit
                                    },
                                    usePointStyle: true
                                }
                            }
                        },
                        cutout: '45%', // Slightly smaller hole for better visual balance
                        // These options help with centering:
                        animation: {
                            animateScale: true,
                            animateRotate: true
                        }
                    }
                });
            }
        }

        function updateSecurityChart(range) {
            // Simulate data update based on range
            console.log('Updating security chart for range:', range);
            // In a real application, this would fetch new data from the server
        }

        function updateTicketsChart(range) {
            console.log('Updating tickets chart for range:', range);
            // Simulate data update
        }

        function refreshSystemMetrics() {
            // Simulate refreshing system metrics
            const metrics = [65, 78, 45, 82, 91, 60];
            metrics.forEach((metric, index) => {
                metrics[index] = Math.min(100, metric + (Math.random() * 10 - 5));
            });
            
            systemChart.data.datasets[0].data = metrics;
            systemChart.update();
            
            showToast('System metrics refreshed successfully');
        }

        // Core Application Functions
       function selectModule(module) {
            if (currentState === AppState.MODULE && currentModule === module) return;
            
            // Update state
            currentState = AppState.MODULE;
            currentModule = module;
            currentPage = 'dashboard';
            
            // Reset tab based on module
            if (module === 'security') {
                currentTab = 'overview';
            } else if (module === 'admin') {
                currentTab = 'system';
            } else if (module === 'helpdesk') {
                currentTab = 'tickets';
            }
            
            // Update UI
            updateUIForState();
            
            console.log(`Selected module: ${module}, tab: ${currentTab}`);
        }
        
        function switchModule(module) {
            if (currentModule === module) return;
            
            // Update state
            currentModule = module;
            currentPage = 'dashboard';
            
            // Reset tab based on module
            if (module === 'security') {
                currentTab = 'overview';
            } else if (module === 'admin') {
                currentTab = 'system';
            } else if (module === 'helpdesk') {
                currentTab = 'tickets';
            }
            
            // Update UI
            updateModuleUI();
            
            console.log(`Switched to module: ${module}, tab: ${currentTab}`);
        }

        function returnToLanding() {
            if (currentState === AppState.LANDING) return;
            
            // Update state
            currentState = AppState.LANDING;
            currentModule = null;
            currentPage = 'dashboard';
            currentTab = 'overview';
            
            // Update UI for landing state
            updateUIForState();
            
            console.log('Returned to landing page');
        }

        function navigateToPage(page) {
            if (currentPage === page) return;
            
            currentPage = page;
            updateSidebarActiveItem();
            console.log(`Navigated to page: ${page} in module: ${currentModule}`);
        }

        function switchTab(tab) {
            if (currentTab === tab) return;
            
            currentTab = tab;
            updateTabUI();
            console.log(`Switched to tab: ${tab}`);
        }

        function updateUIForState() {
            if (currentState === AppState.LANDING) {
                // Show landing page content
                elements.landingContainer.style.display = 'flex';
                
                // Hide module buttons in header
                elements.moduleButtonsHeader.classList.remove('visible');
                
                // Hide all module content containers
                document.querySelectorAll('.module-container').forEach(module => {
                    module.classList.remove('active');
                });
                
                // Add landing styling to sidebar
                elements.mainSidebar.classList.add('sidebar-landing');
                
                // Show the landing sidebar content
                const landingSidebar = document.querySelector('.sidebar-landing');
                if (landingSidebar) {
                    landingSidebar.style.display = 'flex';
                }
                
                // Hide ALL sidebar modules (force hide)
                document.querySelectorAll('.sidebar-module').forEach(module => {
                    module.classList.remove('active');
                    module.style.display = 'none';
                });
                
                // Reset header buttons
                document.querySelectorAll('.module-btn-header').forEach(btn => {
                    btn.classList.remove('active');
                });
                
            } else if (currentState === AppState.MODULE) {
                // Hide landing page content
                elements.landingContainer.style.display = 'none';
                
                // Show module buttons in header
                elements.moduleButtonsHeader.classList.add('visible');
                
                // Update module UI (which will show the selected module)
                updateModuleUI();
            }
        }

        function updateModuleUI() {
            // Hide all module content containers
            document.querySelectorAll('.module-container').forEach(module => {
                module.classList.remove('active');
            });
            
            // Show current module content container
            const currentModuleElement = document.querySelector(`.module-container[data-module="${currentModule}"]`);
            if (currentModuleElement) {
                currentModuleElement.classList.add('active');
            }
            
            // Remove landing styling from sidebar
            elements.mainSidebar.classList.remove('sidebar-landing');
            
            // Hide the landing sidebar content
            const landingSidebar = document.querySelector('.sidebar-landing');
            if (landingSidebar) {
                landingSidebar.style.display = 'none';
            }
            
            // Hide ALL sidebar modules first (force hide)
            document.querySelectorAll('.sidebar-module').forEach(module => {
                module.classList.remove('active');
                module.style.display = 'none';
            });
            
            // Show ONLY the current sidebar module
            const currentSidebarModule = document.querySelector(`.sidebar-module[data-module="${currentModule}"]`);
            if (currentSidebarModule) {
                currentSidebarModule.style.display = 'flex';
                currentSidebarModule.classList.add('active');
            }
            
            // Update header buttons
            document.querySelectorAll('.module-btn-header').forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-module') === currentModule) {
                    btn.classList.add('active');
                }
            });
            
            // Reset to dashboard tab
            updateTabUI();
            
            // Reset sidebar active item
            updateSidebarActiveItem();
        }

        function updateSidebarActiveItem() {
            const currentSidebar = document.querySelector(`.sidebar-module[data-module="${currentModule}"]`);
            if (currentSidebar) {
                currentSidebar.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('data-page') === currentPage) {
                        item.classList.add('active');
                    }
                });
            }
        }

        function updateTabUI() {
            const currentModuleElement = document.querySelector(`.module-container[data-module="${currentModule}"]`);
            if (currentModuleElement) {
                currentModuleElement.querySelectorAll('.tab-btn').forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.getAttribute('data-tab') === currentTab) {
                        btn.classList.add('active');
                    }
                });
                
                currentModuleElement.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                    if (content.getAttribute('data-tab') === currentTab) {
                        content.classList.add('active');
                    }
                });
            }
        }

        // Enhanced Functionality
        function performGlobalSearch(query) {
            if (!query.trim()) return;
            
            let searchScope = 'across all modules';
            if (currentModule) {
                searchScope = `in ${currentModule} module`;
            }
            
            showToast(`Searching ${searchScope} for: "${query}"`);
            document.getElementById('globalSearch').value = '';
        }

        function showNotifications() {
            const modal = document.getElementById('notificationModal');
            modal.classList.add('show');
        }

        function showNewAlertModal() {
            const modal = document.getElementById('newAlertModal');
            modal.classList.add('show');
        }

        function closeModal(modalId) {
            const modal = document.getElementById(modalId);
            modal.classList.remove('show');
        }

        function saveAlertRule() {
            // In a real application, this would save to a backend
            showToast('Alert rule created successfully');
            closeModal('newAlertModal');
        }

        function startSecurityScan() {
            showToast('Security scan started... This may take a few minutes.');
            // Simulate scan completion
            setTimeout(() => {
                showToast('Security scan completed. 2 new threats detected.');
                // Update threat count
                document.querySelector('.dashboard-card.security .metric-value').textContent = '5';
            }, 3000);
        }

        function generateSecurityReport() {
            showToast('Generating security report...');
            // Simulate report generation
            setTimeout(() => {
                showToast('Security report generated and ready for download.');
            }, 2000);
        }

        function exportSecurityData() {
            showToast('Exporting security data...');
            // Simulate export
            setTimeout(() => {
                showToast('Security data exported successfully.');
            }, 1500);
        }

        function viewEventDetails(eventId) {
            showToast(`Viewing details for event #${eventId}`);
            // In a real application, this would open a detailed view
        }

        function viewActivityDetails(activityId) {
            showToast(`Viewing details for activity #${activityId}`);
        }

        function viewTicketDetails(ticketId) {
            showToast(`Viewing details for ticket ${ticketId}`);
        }

        function createNewTicket() {
            showToast('Creating new support ticket...');
            // In a real application, this would open a ticket creation form
        }

        function filterTickets() {
            showToast('Filtering tickets...');
        }

        function filterAdminActivities() {
            showToast('Filtering admin activities...');
        }

        function showAddUserModal() {
            showToast('Opening add user form...');
        }

        function markAllAsRead() {
            const badge = document.querySelector('.notification-badge');
            badge.textContent = '0';
            badge.style.display = 'none';
            
            document.querySelectorAll('.notification-item.unread').forEach(item => {
                item.classList.remove('unread');
            });
            
            showToast('All notifications marked as read');
        }

        function showToast(message, type = 'info') {
            // Create toast element
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.innerHTML = `
                <div class="toast-content">
                    <i class="fas fa-info-circle"></i>
                    <span>${message}</span>
                </div>
                <button class="toast-close" onclick="this.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            // Add styles if not already added
            if (!document.getElementById('toast-styles')) {
                const style = document.createElement('style');
                style.id = 'toast-styles';
                style.textContent = `
                    .toast {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        background: var(--color-surface);
                        border-radius: 8px;
                        padding: 15px 20px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 15px;
                        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
                        z-index: 9999;
                        animation: slideInUp 0.3s ease;
                        max-width: 400px;
                    }
                    @keyframes slideInUp {
                        from { transform: translateY(100px); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }
                    .toast-content {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                    .toast-close {
                        background: none;
                        border: none;
                        cursor: pointer;
                        color: #666;
                    }
                    .toast-info { border-left: 4px solid var(--color-secondary); }
                    .toast-success { border-left: 4px solid var(--color-success); }
                    .toast-warning { border-left: 4px solid var(--color-warning); }
                    .toast-error { border-left: 4px solid var(--color-danger); }
                `;
                document.head.appendChild(style);
            }
            
            document.body.appendChild(toast);
            
            // Auto-remove toast after 5 seconds
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.remove();
                }
            }, 5000);
        }

        // Handle window resize
        window.addEventListener('resize', function() {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const aspectRatio = (width / height).toFixed(2);
            const isDesktop = (width >= 1280 && width/height >= 4/3);
            
            // Update module buttons header visibility for mobile
            if (width <= 576 && currentState === AppState.MODULE) {
                elements.moduleButtonsHeader.classList.remove('visible');
            } else if (width > 576 && currentState === AppState.MODULE) {
                elements.moduleButtonsHeader.classList.add('visible');
            }
            
            // Update charts if they exist
            if (securityChart) securityChart.resize();
            if (systemChart) systemChart.resize();
            if (ticketsChart) ticketsChart.resize();
        });

        // Add keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            // Ctrl+K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('globalSearch').focus();
            }
            
            // Escape to close modals
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.show').forEach(modal => {
                    modal.classList.remove('show');
                });
            }
            
            // Number keys for quick module switching (1-3)
            if (currentState === AppState.MODULE && e.key >= '1' && e.key <= '3') {
                const modules = ['security', 'admin', 'helpdesk'];
                const moduleIndex = parseInt(e.key) - 1;
                if (moduleIndex < modules.length) {
                    switchModule(modules[moduleIndex]);
                }
            }
        });

        //Session Plan
        const spTableManager = {
    init() {
        this.tbody = document.querySelector('.sp-tb-tbody');
        this.bindEvents();
    },

    bindEvents() {
        this.tbody.addEventListener('click', (e) => {
            if (e.target.classList.contains('sp-tb-btn-add')) {
                this.addRow();
            }
            if (e.target.classList.contains('sp-tb-btn-delete')) {
                this.removeRow(e.target);
            }
        });
    },

    addRow() {
        const rowCount = this.tbody.querySelectorAll('.sp-tb-tr').length + 1;
        const newRow = document.createElement('tr');
        newRow.className = 'sp-tb-tr';
        
        // Using the same sp-tb class naming for dynamic rows
        newRow.innerHTML = `
            <td class="sp-tb-td">${rowCount}</td>
            <td class="sp-tb-td"><select class="sp-tb-select-field"><option>Build - Foundation</option></select></td>
            <td class="sp-tb-td"><select class="sp-tb-select-field"><option>New Unit</option></select></td>
            <td class="sp-tb-td"><select class="sp-tb-select-field"><option>Knowledge IU Session</option></select></td>
            <td class="sp-tb-td"><select class="sp-tb-select-field"><option>Mandatory</option></select></td>
            <td class="sp-tb-td"><select class="sp-tb-select-field"><option>Content Type</option></select></td>
            <td class="sp-tb-td"><input type="text" class="sp-tb-input-field" value="New Topic"></td>
            <td class="sp-tb-td"><input type="number" class="sp-tb-number-field" value="1"></td>
            <td class="sp-tb-td"><input type="number" class="sp-tb-number-field" value="1"></td>
            <td class="sp-tb-td"><input type="number" class="sp-tb-number-field" value="10"></td>
            <td class="sp-tb-td"><select class="sp-tb-select-field"><option>Find items</option></select></td>
            <td class="sp-tb-td sp-tb-action-cell">
                <i class="fas fa-trash-can sp-tb-btn-delete"></i>
                <i class="fas fa-plus sp-tb-btn-add"></i>
            </td>
        `;
        this.tbody.appendChild(newRow);
    },

    removeRow(target) {
        const rows = this.tbody.querySelectorAll('.sp-tb-tr');
        if (rows.length > 1) {
            target.closest('.sp-tb-tr').remove();
        }
    }
};

spTableManager.init();

// sidebar responsive


