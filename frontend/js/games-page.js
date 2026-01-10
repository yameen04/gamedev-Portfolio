export class GamesPageController {
    constructor() {
        this.sections = document.querySelectorAll('.games-section');
        this.init();
    }

    async init() {
        await this.loadSettings();
        this.renderPlaceholders();
    }

    async loadSettings() {
        try {
            const response = await fetch('http://localhost:3000/api/settings');
            const data = await response.json();

            if (data && data.gamesPage && data.gamesPage.sections) {
                this.applyBackgrounds(data.gamesPage.sections);
            }

            // Render Projects
            if (data && data.gamesPage && data.gamesPage.projects) {
                this.renderProjects(data.gamesPage.projects);
            }

            // Apply Header Settings with Games Page Overrides
            if (data && data.header) {
                this.applyHeaderSettings(data.header, data.gamesPage);
            }
        } catch (error) {
            console.error('Failed to load games page settings:', error);
        }
    }

    applyHeaderSettings(settings, gamesPageSettings) {
        // Games Page Specific overrides
        const specificLogoUrl = gamesPageSettings && gamesPageSettings.logoUrl;
        const specificDevName = gamesPageSettings && gamesPageSettings.developerName;
        const specificLogoHeight = gamesPageSettings && gamesPageSettings.logoHeight;

        // Logo
        const logoContainer = document.querySelector('.logo');
        if (logoContainer) {
            // Priority: GamesPage Specific -> Global Settings -> Default Text
            const logoUrl = specificLogoUrl || settings.logoUrl;

            if (logoUrl) {
                const height = specificLogoHeight || settings.logoHeight || 50;
                logoContainer.innerHTML = `<img src="${logoUrl}" alt="Logo" style="height: ${height}px; object-fit: contain;">`;
            } else if (settings.logoText) {
                logoContainer.textContent = settings.logoText;
            }
        }

        // Dev Name
        const devName = document.querySelector('.dev-name');
        if (devName) {
            const name = specificDevName || settings.nameText;
            if (name) devName.textContent = name;
        }

        // Header Colors (Optional but good for consistency)
        const header = document.querySelector('#main-header');
        if (header) {
            if (settings.fontFamily) header.style.fontFamily = settings.fontFamily;
            if (settings.backgroundColor) header.style.backgroundColor = settings.backgroundColor;
            if (settings.textColor) header.style.color = settings.textColor;
        }
    }

    applyBackgrounds(sectionsData) {
        this.sections.forEach((section, index) => {
            const data = sectionsData[index];
            if (data && data.mediaUrl) {
                // Remove existing bg if any
                const existingBg = section.querySelector('.games-section-bg');
                if (existingBg) existingBg.remove();

                const media = document.createElement(data.mediaType === 'video' ? 'video' : 'img');
                media.className = 'games-section-bg';

                // OPTIMIZE: Apply Cloudinary transformations if it's a Cloudinary URL
                media.src = this.getOptimizedUrl(data.mediaUrl, data.mediaType);

                if (data.mediaType === 'video') {
                    media.autoplay = true;
                    media.muted = true;
                    media.loop = true;
                    media.playsInline = true; // Better mobile support
                }

                // Prepend to section so it sits behind content
                section.prepend(media);
            }
        });
    }

    getOptimizedUrl(url, type) {
        if (!url.includes('cloudinary.com')) return url;

        // Find the upload/ insertion point
        const uploadIndex = url.indexOf('/upload/');
        if (uploadIndex === -1) return url;

        // Default transformations
        let transformations = 'f_auto,q_auto';

        // Video specific optimizations
        if (type === 'video') {
            transformations += ',ac_none'; // Remove audio channel
            // transform += ',w_1920'; // Optional: cap width if needed
        }

        // Insert transformations after /upload/
        return url.slice(0, uploadIndex + 8) + transformations + '/' + url.slice(uploadIndex + 8);
    }


    renderProjects(projects) {
        // Clear all grids first
        this.sections.forEach(section => {
            const grid = section.querySelector('.projects-grid');
            if (grid) grid.innerHTML = '';
        });

        // Loop through projects and append to correct section
        projects.forEach(project => {
            // sectionIndex is 1-based (1-5)
            // corresponding section ID is games-section-{index}
            const section = document.getElementById(`games-section-${project.sectionIndex}`);
            if (section) {
                const grid = section.querySelector('.projects-grid');
                if (grid) {
                    const card = this.createProjectCard(project);
                    grid.innerHTML += card;
                }
            }
        });
    }

    createProjectCard(project) {
        return `
            <a href="project.html?type=game&id=${project.id}" style="text-decoration: none; color: inherit; display: block;">
                <div class="project-card">
                    ${project.imageUrl ?
                `<img src="${project.imageUrl}" alt="${project.title}">` :
                `<div class="project-image-placeholder">No Image</div>`
            }
                    <h3 class="project-title">${project.title}</h3>
                </div>
            </a>
        `;
    }
}

new GamesPageController();

// Initial Render
// The instruction implies renderGamesPage() should be called, but it's not defined.
// Assuming the intent was to instantiate the controller, which is already done above.

// --- Header Scroll Logic (Inline Fix) ---
const header = document.querySelector('#main-header');
let lastScrollTop = 0;
const delta = 5;

window.addEventListener('scroll', () => {
    const currentScrollTop = window.scrollY || document.documentElement.scrollTop;

    // Always show if near top
    if (currentScrollTop < 50) {
        header.classList.remove('hidden');
        lastScrollTop = currentScrollTop;
        return;
    }

    if (Math.abs(lastScrollTop - currentScrollTop) <= delta) return;

    if (currentScrollTop > lastScrollTop) {
        // Scroll Down -> Hide
        header.classList.add('hidden');
    } else {
        // Scroll Up -> Show
        header.classList.remove('hidden');
    }
    lastScrollTop = currentScrollTop;
});
