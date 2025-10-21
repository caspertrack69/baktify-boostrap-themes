/* ========================================
   BAKTIFY BOOTSTRAP THEMES - MAIN SCRIPT
   Dashboard Interactivity & Components
======================================== */

'use strict';

// ========================================
// SIDEBAR TOGGLE
// ========================================
class SidebarController {
    constructor() {
        this.sidebar = document.querySelector('.sidebar');
        this.toggleBtn = document.querySelector('.sidebar-toggle');
        this.overlay = document.querySelector('.sidebar-overlay');
        
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
document.addEventListener('DOMContentLoaded', () => {
    const themeController = new ThemeController();
    if (typeof window !== 'undefined') {
        window.baktifyTheme = themeController;
    }
    
    // Initialize all controllers
    new SidebarController();
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
    
    console.log('🎨 Baktify Dashboard Theme Loaded Successfully!');
});

// ========================================
// EXPORT FOR MODULE USE
// ========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SidebarController,
        SearchController,
        NotificationController,
        StatsAnimator,
        ThemeController,
        ChartManager,
        Utils
    };
}
