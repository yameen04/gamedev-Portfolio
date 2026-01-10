export class HeaderController {
    constructor() {
        this.header = document.querySelector('#main-header');
        this.lastScrollTop = 0;
        this.delta = 5;
        this.init();
        this.loadSettings();
    }

    init() {
        // Debounce or toggle directly
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    handleScroll() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Prevent negative scroll logic (iOS bounce etc)
        if (currentScrollTop < 0) return;

        // Always show if near top
        if (currentScrollTop < 50) {
            this.header.classList.remove('hidden');
            this.lastScrollTop = currentScrollTop;
            return;
        }

        if (Math.abs(this.lastScrollTop - currentScrollTop) <= this.delta) return;

        if (currentScrollTop > this.lastScrollTop) {
            // Scroll Down -> Hide
            this.header.classList.add('hidden');
        } else {
            // Scroll Up -> Show
            this.header.classList.remove('hidden');
        }

        this.lastScrollTop = currentScrollTop;
    }

    async loadSettings() {
        try {
            const response = await fetch('/api/settings');
            const data = await response.json();
            if (data && data.header) {
                this.applySettings(data.header);
            }
        } catch (error) {
            console.error('Failed to load header settings:', error);
        }
    }

    applySettings(settings) {
        // Logo Handling: Image > Text
        const logoContainer = document.querySelector('.logo');
        if (settings.logoUrl) {
            const height = settings.logoHeight || 50;
            logoContainer.innerHTML = `<img src="${settings.logoUrl}" alt="Logo" style="height: ${height}px; object-fit: contain;">`;
        } else {
            if (settings.logoText) logoContainer.textContent = settings.logoText;
        }

        if (settings.nameText) document.querySelector('.dev-name').textContent = settings.nameText;

        // Styles
        if (settings.fontFamily) this.header.style.fontFamily = settings.fontFamily;
        if (settings.backgroundColor) this.header.style.backgroundColor = settings.backgroundColor;
        if (settings.textColor) this.header.style.color = settings.textColor;

        // Link Spacing
        if (settings.linkSpacing) {
            const nav = document.querySelector('.header-left nav');
            if (nav) nav.style.gap = `${settings.linkSpacing}px`;
        }
    }
}

// Initialize
new HeaderController();

// --- Secret Code Listener for Admin Panel ---
let keySequence = [];
const secretCode = '5629';

window.addEventListener('keydown', (e) => {
    // Accumulate key
    keySequence.push(e.key);

    // Keep sequence length same as code length
    if (keySequence.length > secretCode.length) {
        keySequence.shift();
    }

    // Check match
    if (keySequence.join('') === secretCode) {
        localStorage.setItem('adminToken', 'bypass-session'); // Auto-login
        window.location.href = 'admin.html';
    }
});
