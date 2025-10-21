/* ========================================
   BAKTIFY BOOTSTRAP THEMES - MAIN SCRIPT
   Dashboard Interactivity & Components
======================================== */

'use strict';

// ========================================
// COMPONENT LOADER
// ========================================
class ComponentLoader {
    static async loadAll(maxDepth = 5) {
        for (let depth = 0; depth < maxDepth; depth++) {
            const targets = document.querySelectorAll('[data-include]');
            if (!targets.length) {
                break;
            }

            await Promise.all(
                Array.from(targets).map(async (el) => {
                    const src = el.getAttribute('data-include');
                    if (!src) {
                        return;
                    }

                    try {
                        const response = await fetch(src, { cache: 'no-cache' });
                        if (!response.ok) {
                            throw new Error(response.statusText);
                        }

                        const html = await response.text();
                        const template = document.createElement('template');
                        template.innerHTML = html.trim();
                        const fragment = template.content.cloneNode(true);
                        el.replaceWith(fragment);
                    } catch (error) {
                        console.error(`[ComponentLoader] Failed to load ${src}`, error);
                    }
                })
            );
        }
    }
}

// ========================================
// SIDEBAR TOGGLE
// ========================================
class SidebarController {
    constructor() {
        this.sidebar = document.querySelector('.sidebar');
        this.toggleBtn = document.querySelector('.sidebar-toggle');
        this.overlay = document.querySelector('.sidebar-overlay');
        this.activeRoute = document.body.dataset.page || '';
        this.healthDisplay = this.sidebar ? this.sidebar.querySelector('[data-sidebar-health]') : null;
        this.healthBar = this.sidebar ? this.sidebar.querySelector('.sidebar-progress .progress-bar') : null;
        
        this.init();
    }
    
    init() {
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.toggle());
        }
        
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.close());
        }
        
        // Close sidebar on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.sidebar.classList.contains('active')) {
                this.close();
            }
        });

        this.highlightActive();
        this.updateWorkspaceHealth();
    }
    
    toggle() {
        this.sidebar.classList.toggle('active');
        if (this.overlay) {
            this.overlay.classList.toggle('active');
        }
    }
    
    close() {
        this.sidebar.classList.remove('active');
        if (this.overlay) {
            this.overlay.classList.remove('active');
        }
    }

    highlightActive() {
        if (!this.sidebar || !this.activeRoute) {
            return;
        }

        const links = this.sidebar.querySelectorAll('.sidebar-menu-link');
        links.forEach(link => {
            const route = link.dataset.route;
            link.classList.toggle('active', route === this.activeRoute);
        });
    }

    updateWorkspaceHealth() {
        if (!this.healthDisplay) {
            return;
        }

        const value = document.body.dataset.sidebarHealth;
        if (!value) {
            return;
        }

        this.healthDisplay.textContent = value;
        if (this.healthBar) {
            const numeric = parseInt(value, 10);
            const width = Number.isFinite(numeric) ? Math.max(0, Math.min(100, numeric)) : 0;
            this.healthBar.style.width = `${width}%`;
        }
    }
}

// ========================================
// SEARCH FUNCTIONALITY
// ========================================
class SearchController {
    constructor() {
        this.searchInput = document.querySelector('.search-input');
        this.searchResults = document.querySelector('.search-results');
        
        this.init();
    }
    
    init() {
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }
    }
    
    handleSearch(query) {
        if (query.length < 2) {
            if (this.searchResults) {
                this.searchResults.style.display = 'none';
            }
            return;
        }
        
        // Implement your search logic here
        console.log('Searching for:', query);
    }
}

// ========================================
// NOTIFICATIONS
// ========================================
class NotificationController {
    constructor() {
        this.notificationBtn = document.querySelector('[data-notification-toggle]');
        this.notificationDropdown = document.querySelector('.notification-dropdown');
        
        this.init();
    }
    
    init() {
        if (this.notificationBtn) {
            this.notificationBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggle();
            });
        }
        
        // Close on outside click
        document.addEventListener('click', () => {
            if (this.notificationDropdown && this.notificationDropdown.classList.contains('active')) {
                this.close();
            }
        });
    }
    
    toggle() {
        if (this.notificationDropdown) {
            this.notificationDropdown.classList.toggle('active');
        }
    }
    
    close() {
        if (this.notificationDropdown) {
            this.notificationDropdown.classList.remove('active');
        }
    }
}

// ========================================
// NAVBAR CUSTOMISATION
// ========================================
class NavbarController {
    constructor() {
        this.navbar = document.querySelector('.navbar-custom');
        if (!this.navbar) {
            return;
        }

        this.searchInput = this.navbar.querySelector('[data-navbar-search]');
        this.extraContainer = this.navbar.querySelector('[data-navbar-extra]');
        this.notificationBadge = this.navbar.querySelector('[data-notification-count]');
        this.notificationButton = this.navbar.querySelector('[data-notification-toggle]');
        this.messageBadge = this.navbar.querySelector('[data-message-count]');
        this.messageButton = this.navbar.querySelector('[data-messages-toggle]');
        this.avatar = this.navbar.querySelector('[data-navbar-avatar]');
        this.userName = this.navbar.querySelector('[data-navbar-name]');
        this.userRole = this.navbar.querySelector('[data-navbar-role]');

        this.applyConfig();
    }

    applyConfig() {
        const body = document.body.dataset;

        if (this.searchInput) {
            const placeholder = body.searchPlaceholder || this.searchInput.getAttribute('placeholder');
            this.searchInput.setAttribute('placeholder', placeholder);
        }

        if (this.notificationBadge) {
            const count = Number(body.notificationCount ?? this.notificationBadge.textContent) || 0;
            this.notificationBadge.textContent = count;
            if (count <= 0 && this.notificationButton) {
                this.notificationBadge.classList.add('d-none');
            } else {
                this.notificationBadge.classList.remove('d-none');
            }
            if (body.showNotifications === 'false' && this.notificationButton) {
                this.notificationButton.style.display = 'none';
            }
        }

        if (this.messageBadge && this.messageButton) {
            const count = Number(body.messageCount ?? this.messageBadge.textContent) || 0;
            this.messageBadge.textContent = count;
            if (count <= 0) {
                this.messageBadge.classList.add('d-none');
            } else {
                this.messageBadge.classList.remove('d-none');
            }
            if (body.showMessages === 'false') {
                this.messageButton.style.display = 'none';
            }
        }

        if (this.avatar && body.userAvatar) {
            this.avatar.src = body.userAvatar;
        }
        if (this.userName && body.userName) {
            this.userName.textContent = body.userName;
        }
        if (this.userRole && body.userRole) {
            this.userRole.textContent = body.userRole;
        }

        if (this.extraContainer) {
            const extras = this.buildExtraActions(body.navbarActions || '');
            if (extras.length) {
                extras.forEach(action => this.extraContainer.appendChild(action));
            } else {
                this.extraContainer.style.display = 'none';
            }
        }
    }

    buildExtraActions(actionKey) {
        const actions = [];
        switch (actionKey) {
            case 'analytics':
                actions.push(
                    this.createButton({
                        innerHTML: '<i class="bi bi-funnel me-1"></i>Segments',
                        attributes: { id: 'btnAnalyticsSegments' }
                    }),
                    this.createButton({
                        innerHTML: '<i class="bi bi-download me-1"></i>Export',
                        attributes: { id: 'btnAnalyticsExport' }
                    })
                );
                break;
            case 'projects':
                actions.push(
                    this.createButton({
                        innerHTML: '<i class="bi bi-plus-lg me-1"></i>New Project',
                        attributes: { id: 'btnNavbarNewProject' }
                    })
                );
                break;
            case 'users':
                actions.push(
                    this.createButton({
                        innerHTML: '<i class="bi bi-person-plus me-1"></i>Invite',
                        attributes: { id: 'btnNavbarInvite' }
                    })
                );
                break;
            case 'reports':
                actions.push(
                    this.createButton({
                        innerHTML: '<i class="bi bi-bar-chart me-1"></i>Generate',
                        attributes: { id: 'btnNavbarGenerateReport' }
                    }),
                    this.createButton({
                        innerHTML: '<i class="bi bi-file-earmark-pdf me-1"></i>Export PDF',
                        attributes: { id: 'btnNavbarReportExport' }
                    })
                );
                break;
            case 'calendar':
                actions.push(
                    this.createButton({
                        innerHTML: '<i class="bi bi-plus-lg me-1"></i>New Event',
                        attributes: { id: 'btnNavbarNewEvent' }
                    }),
                    this.createButton({
                        innerHTML: '<i class="bi bi-arrow-repeat me-1"></i>Sync',
                        attributes: { id: 'btnNavbarSyncCalendar' }
                    })
                );
                break;
            case 'billing':
                actions.push(
                    this.createButton({
                        innerHTML: '<i class="bi bi-receipt-cutoff me-1"></i>New Invoice',
                        attributes: { id: 'btnNavbarInvoice' }
                    })
                );
                break;
            case 'support':
                actions.push(
                    this.createButton({
                        innerHTML: '<i class="bi bi-life-preserver me-1"></i>New Ticket',
                        attributes: { id: 'btnNavbarSupportTicket' }
                    })
                );
                break;
            default:
                break;
        }
        return actions;
    }

    createButton({ innerHTML = '', className = 'btn-glass', attributes = {} }) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = className;
        button.innerHTML = innerHTML;
        Object.entries(attributes).forEach(([key, value]) => {
            button.setAttribute(key, value);
        });
        return button;
    }
}

// ========================================
// STATS COUNTER ANIMATION
// ========================================
class StatsAnimator {
    constructor() {
        this.statValues = document.querySelectorAll('.stat-value');
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateValue(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        this.statValues.forEach(stat => observer.observe(stat));
    }
    
    animateValue(element) {
        const target = parseFloat(element.textContent.replace(/[^0-9.]/g, ''));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = this.formatNumber(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = this.formatNumber(target);
            }
        };
        
        updateCounter();
    }
    
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return Math.floor(num).toString();
    }
}

// ========================================
// THEME CUSTOMIZATION
// ========================================
class ThemeController {
    constructor() {
        this.themeToggle = document.querySelector('[data-theme-toggle]');
        this.themeLabel = document.querySelector('[data-theme-label]');
        this.themes = [
            { id: 'default', icon: 'bi-moon-stars', label: 'Default Glow' },
            { id: 'dark', icon: 'bi-brightness-high', label: 'Midnight Glass' },
            { id: 'aurora', icon: 'bi-sunrise', label: 'Aurora Frost' }
        ];
        const stored = localStorage.getItem('theme');
        this.currentTheme = this.themes.some(theme => theme.id === stored) ? stored : 'default';
        
        this.init();
    }
    
    init() {
        this.applyTheme(this.currentTheme);
        
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
    
    toggleTheme() {
        const currentIndex = this.themes.findIndex(theme => theme.id === this.currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        this.setTheme(this.themes[nextIndex].id);
    }
    
    setTheme(themeId) {
        if (!this.themes.some(theme => theme.id === themeId)) {
            console.warn(`[ThemeController] Unknown theme "${themeId}"`);
            return;
        }
        this.currentTheme = themeId;
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }
    
    getTheme() {
        return this.currentTheme;
    }
    
    applyTheme(themeId) {
        document.body.setAttribute('data-theme', themeId);
        const themeMeta = this.themes.find(theme => theme.id === themeId) || { id: themeId, icon: 'bi-circle', label: themeId };
        
        if (this.themeToggle) {
            const iconEl = this.themeToggle.querySelector('i');
            if (iconEl) {
                iconEl.className = `bi ${themeMeta.icon}`;
            } else {
                this.themeToggle.innerHTML = `<i class="bi ${themeMeta.icon}"></i>`;
            }
            const tooltip = `Switch theme · ${themeMeta.label}`;
            this.themeToggle.setAttribute('aria-label', `${themeMeta.label} theme aktif - klik untuk ganti`);
            this.themeToggle.setAttribute('title', tooltip);
        }
        
        if (this.themeLabel) {
            this.themeLabel.textContent = themeMeta.label;
        }
        
        if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
            window.dispatchEvent(new CustomEvent('themechange', { detail: themeMeta }));
        }
    }
}

// ========================================
// CHART INITIALIZATION (Placeholder)
// ========================================
class ChartManager {
    constructor() {
        this.charts = {};
        this.init();
    }
    
    init() {
        // Initialize charts if Chart.js is loaded
        if (typeof Chart !== 'undefined') {
            this.initRevenueChart();
            this.initUserChart();
        }
    }
    
    initRevenueChart() {
        const canvas = document.getElementById('revenueChart');
        if (!canvas) return;
        
        // Chart implementation here
        console.log('Revenue chart initialized');
    }
    
    initUserChart() {
        const canvas = document.getElementById('userChart');
        if (!canvas) return;
        
        // Chart implementation here
        console.log('User chart initialized');
    }
}

// ========================================
// SMOOTH SCROLL
// ========================================
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ========================================
// TOOLTIPS & POPOVERS
// ========================================
class TooltipManager {
    constructor() {
        this.init();
    }
    
    init() {
        // Initialize Bootstrap tooltips if available
        if (typeof bootstrap !== 'undefined') {
            const tooltipTriggerList = [].slice.call(
                document.querySelectorAll('[data-bs-toggle="tooltip"]')
            );
            tooltipTriggerList.map(tooltipTriggerEl => {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });
        }
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
const Utils = {
    // Format currency
    formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },
    
    // Format date
    formatDate(date, format = 'short') {
        return new Intl.DateTimeFormat('en-US', {
            dateStyle: format
        }).format(new Date(date));
    },
    
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Generate random color
    randomColor() {
        return '#' + Math.floor(Math.random()*16777215).toString(16);
    }
};

// ========================================
// INITIALIZE ALL COMPONENTS
// ========================================
document.addEventListener('DOMContentLoaded', async () => {
    await ComponentLoader.loadAll();

    const themeController = new ThemeController();
    if (typeof window !== 'undefined') {
        window.baktifyTheme = themeController;
    }
    
    // Initialize all controllers
    new SidebarController();
    new NavbarController();
    new SearchController();
    new NotificationController();
    new StatsAnimator();
    new ChartManager();
    new SmoothScroll();
    new TooltipManager();
    
    // Add fade-in animation to cards
    const cards = document.querySelectorAll('.glass-card, .stat-card, .card-glass');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`; 
        card.classList.add('fade-in-up');
    });
    
    console.log('Baktify Dashboard Theme Loaded Successfully!');
});

// ========================================
// EXPORT FOR MODULE USE
// ========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ComponentLoader,
        SidebarController,
        NavbarController,
        SearchController,
        NotificationController,
        StatsAnimator,
        ThemeController,
        ChartManager,
        Utils
    };
}



