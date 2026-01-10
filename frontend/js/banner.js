export class BannerController {
    constructor() {
        this.container = document.querySelector('#banner-section');
        this.init();
    }

    async init() {
        await this.loadSettings();
    }

    async loadSettings() {
        try {
            const response = await fetch('http://localhost:3000/api/settings');
            const data = await response.json();
            if (data && data.banner) {
                this.render(data.banner);
            } else {
                this.renderDefault();
            }
        } catch (error) {
            console.error('Failed to load banner settings:', error);
            this.renderDefault();
        }
    }

    render(settings) {
        this.container.innerHTML = ''; // Clear existing

        // Background Media
        const mediaElement = document.createElement(settings.mediaType === 'video' ? 'video' : 'img');
        mediaElement.id = 'banner-bg';

        // Helper to optimize Cloudinary URL
        const optimizeUrl = (url) => {
            if (url && url.includes('cloudinary.com') && url.includes('/upload/')) {
                return url.replace('/upload/', '/upload/f_auto,q_auto/');
            }
            return url;
        };

        // Handle empty mediaUrl better or provide placeholder
        if (settings.mediaUrl) {
            mediaElement.src = optimizeUrl(settings.mediaUrl);
        } else {
            // Placeholder or solid color if no image
            mediaElement.style.backgroundColor = '#1a1a1a';
        }

        if (settings.mediaType === 'video') {
            mediaElement.autoplay = true;
            mediaElement.muted = true;
            mediaElement.loop = true;
            mediaElement.playsInline = true; // Important for mobile
            // Preload metadata to start faster
            mediaElement.preload = 'auto';
        }
        this.container.appendChild(mediaElement);

        // Content Wrapper
        const content = document.createElement('div');
        content.className = 'banner-content';

        // Title (Optional, if in settings)
        if (settings.title) {
            const title = document.createElement('h1');
            title.className = 'banner-title';
            title.textContent = settings.title;
            content.appendChild(title);
        }

        // Buttons Container
        const btnContainer = document.createElement('div');
        btnContainer.className = 'banner-buttons';
        if (settings.buttonSpacing) {
            btnContainer.style.gap = `${settings.buttonSpacing}px`;
        }
        // Increase default gap slightly if not set, or leave to CSS (20px)

        // Games Button
        const gamesBtn = document.createElement('button');
        gamesBtn.className = 'btn btn-games';
        gamesBtn.textContent = settings.buttonGamesText || 'Games';
        // Add click listener to navigate to games.html
        gamesBtn.onclick = () => window.location.href = 'games.html';

        // Apply dynamic styles if provided
        if (settings.buttonGamesBg) gamesBtn.style.backgroundColor = settings.buttonGamesBg;
        if (settings.buttonGamesColor) gamesBtn.style.color = settings.buttonGamesColor;

        // Assets Button
        const assetsBtn = document.createElement('button');
        assetsBtn.className = 'btn btn-assets';
        assetsBtn.textContent = settings.buttonAssetsText || 'Assets';
        // Add click listener to navigate to assets.html
        assetsBtn.onclick = () => window.location.href = 'assets.html';
        // Apply dynamic styles if provided
        if (settings.buttonAssetsBg) assetsBtn.style.backgroundColor = settings.buttonAssetsBg;
        if (settings.buttonAssetsColor) assetsBtn.style.color = settings.buttonAssetsColor;

        btnContainer.appendChild(gamesBtn);
        btnContainer.appendChild(assetsBtn);
        content.appendChild(btnContainer);

        this.container.appendChild(content);
    }

    renderDefault() {
        // Fallback static content if API fails
        this.container.innerHTML = `
            <div style="background-color: #333; position: absolute; top:0; left:0; width:100%; height:100%;"></div>
            <div class="banner-content">
                <h1 class="banner-title">WELCOME</h1>
                <div class="banner-buttons">
                    <button class="btn btn-games">Games</button>
                    <button class="btn btn-assets">Assets</button>
                </div>
            </div>
        `;
    }
}

new BannerController();
