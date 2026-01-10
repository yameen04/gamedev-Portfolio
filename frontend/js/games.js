export class GamesController {
    constructor() {
        this.container = document.querySelector('#games-section');
        this.init();
    }

    async init() {
        await this.loadSettings();
    }

    async loadSettings() {
        try {
            const response = await fetch('http://localhost:3000/api/settings');
            const data = await response.json();
            if (data && data.games) {
                // Get the selected project if ID exists
                let selectedProject = null;
                if (data.games.selectedProjectId && data.gamesPage && data.gamesPage.projects) {
                    selectedProject = data.gamesPage.projects.find(p => p.id === data.games.selectedProjectId);
                }
                this.render(data.games, selectedProject);
            } else {
                this.renderDefault();
            }
        } catch (error) {
            console.error('Failed to load games settings:', error);
            this.renderDefault();
        }
    }

    render(settings, selectedProject = null) {
        this.container.innerHTML = '';

        // Apply Styles
        if (settings.backgroundColor) this.container.style.backgroundColor = settings.backgroundColor;
        if (settings.textColor) this.container.style.color = settings.textColor;
        if (settings.fontFamily) this.container.style.fontFamily = settings.fontFamily;

        // Background Media
        if (settings.mediaUrl) {
            const media = document.createElement(settings.mediaType === 'video' ? 'video' : 'img');
            media.className = 'games-section-bg';
            media.src = settings.mediaUrl;
            if (settings.mediaType === 'video') {
                media.autoplay = true;
                media.muted = true;
                media.loop = true;
            }
            this.container.appendChild(media);
        }

        // Heading
        const heading = document.createElement('h2');
        heading.className = 'games-heading';
        heading.textContent = settings.sectionTitle || 'Games'; // Updated Default
        this.container.appendChild(heading);

        // Grid Content
        const content = document.createElement('div');
        content.className = 'games-content';
        if (settings.sectionGap) {
            content.style.gap = `${settings.sectionGap}px`;
        }

        // LEFT SIDE (Neon Cube)
        const left = document.createElement('div');
        left.className = 'games-left';
        left.style.marginLeft = '300px'; // User-requested padding to center the cube

        // Apply any additional Custom Margins from admin panel
        if (settings.cubeMarginRight) {
            left.style.marginRight = `${settings.cubeMarginRight}px`;
        }
        if (settings.cubeMarginTop) {
            left.style.marginTop = `${settings.cubeMarginTop}px`;
        }

        // Size Setting
        const cubeSize = settings.cubeSize || 200;
        const sizeStyle = `style="--cube-size: ${cubeSize}px;"`;

        // Cube HTML (Matching Featured Section)
        const cubeHTML = `
            <div class="cube-container" ${sizeStyle}>
                <div class="cube">
                    <div class="cube-face face-front">GAME</div>
                    <div class="cube-face face-back">LOVE</div>
                    <div class="cube-face face-right">CODE</div>
                    <div class="cube-face face-left">ART</div>
                    <div class="cube-face face-top"></div>
                    <div class="cube-face face-bottom"></div>
                </div>
            </div>
        `;
        left.innerHTML = cubeHTML;

        content.appendChild(left);

        // RIGHT SIDE (Project Card)
        const right = document.createElement('div');
        right.className = 'games-right';

        // Wrap in link if project is selected
        if (selectedProject) {
            const projectLink = document.createElement('a');
            projectLink.href = `project.html?type=game&id=${selectedProject.id}`;
            projectLink.style.textDecoration = 'none';
            projectLink.style.color = 'inherit';
            projectLink.style.display = 'block';

            // Project Block
            const productDisplay = document.createElement('div');
            productDisplay.className = 'games-product-display';
            if (settings.projectCardWidth) {
                productDisplay.style.width = settings.projectCardWidth;
                right.style.flex = 'none';
            }

            // Right Offset
            if (settings.rightOffset) {
                productDisplay.style.marginRight = `${settings.rightOffset}px`;
                right.style.alignItems = 'flex-end';
            }

            // Media Placeholder - Show selected project image
            const mediaPlaceholder = document.createElement('div');
            mediaPlaceholder.className = 'games-media-placeholder';
            mediaPlaceholder.style.backgroundColor = settings.letterboxColor || '#000000';
            const img = document.createElement('img');
            img.src = selectedProject.imageUrl;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain';
            mediaPlaceholder.appendChild(img);
            if (settings.projectImageHeight) {
                mediaPlaceholder.style.height = `${settings.projectImageHeight}px`;
            }
            productDisplay.appendChild(mediaPlaceholder);

            // Title - Use selected project title
            const projTitle = document.createElement('h3');
            projTitle.className = 'games-title';
            projTitle.textContent = selectedProject.title;
            productDisplay.appendChild(projTitle);

            projectLink.appendChild(productDisplay);
            right.appendChild(projectLink);
        } else {
            // No project selected - show placeholder
            const productDisplay = document.createElement('div');
            productDisplay.className = 'games-product-display';
            if (settings.projectCardWidth) {
                productDisplay.style.width = settings.projectCardWidth;
                right.style.flex = 'none';
            }

            if (settings.rightOffset) {
                productDisplay.style.marginRight = `${settings.rightOffset}px`;
                right.style.alignItems = 'flex-end';
            }

            const mediaPlaceholder = document.createElement('div');
            mediaPlaceholder.className = 'games-media-placeholder';
            mediaPlaceholder.textContent = 'Game Image (Empty)';
            if (settings.projectImageHeight) {
                mediaPlaceholder.style.height = `${settings.projectImageHeight}px`;
            }
            productDisplay.appendChild(mediaPlaceholder);

            const projTitle = document.createElement('h3');
            projTitle.className = 'games-title';
            projTitle.textContent = settings.projectTitle || 'Game Title';
            productDisplay.appendChild(projTitle);

            right.appendChild(productDisplay);
        }

        content.appendChild(right);

        this.container.appendChild(content);
    }

    renderDefault() {
        this.container.innerHTML = '<h2>Games Section</h2>';
    }
}

new GamesController();
