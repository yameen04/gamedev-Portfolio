export class FeaturedController {
    constructor() {
        this.container = document.querySelector('#featured-section');
        this.init();
    }

    async init() {
        await this.loadSettings();
    }

    async loadSettings() {
        try {
            const response = await fetch('http://localhost:3000/api/settings');
            const data = await response.json();
            if (data && data.featured) {
                // Get the selected project if ID exists
                let selectedProject = null;
                let projectType = 'game'; // default
                if (data.featured.selectedProjectId) {
                    // Search in games first
                    if (data.gamesPage && data.gamesPage.projects) {
                        selectedProject = data.gamesPage.projects.find(p => p.id === data.featured.selectedProjectId);
                        if (selectedProject) projectType = 'game';
                    }
                    // If not found, search in assets
                    if (!selectedProject && data.assetsPage && data.assetsPage.projects) {
                        selectedProject = data.assetsPage.projects.find(p => p.id === data.featured.selectedProjectId);
                        if (selectedProject) projectType = 'asset';
                    }
                }
                this.render(data.featured, selectedProject, projectType);
            } else {
                this.renderDefault();
            }
        } catch (error) {
            console.error('Failed to load featured settings:', error);
            this.renderDefault();
        }
    }

    render(settings, selectedProject = null, projectType = 'game') {
        this.container.innerHTML = '';

        // Apply Styles
        if (settings.backgroundColor) this.container.style.backgroundColor = settings.backgroundColor;
        if (settings.textColor) this.container.style.color = settings.textColor;
        if (settings.fontFamily) this.container.style.fontFamily = settings.fontFamily;

        // Background Media (Applied to whole section)
        if (settings.mediaUrl) {
            const media = document.createElement(settings.mediaType === 'video' ? 'video' : 'img');
            media.className = 'featured-section-bg';
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
        heading.className = 'featured-heading';
        heading.textContent = settings.sectionTitle || 'Featured Project';
        this.container.appendChild(heading);

        // Grid Content
        const content = document.createElement('div');
        content.className = 'featured-content';
        if (settings.sectionGap) {
            content.style.gap = `${settings.sectionGap}px`;
        }

        // LEFT SIDE
        const left = document.createElement('div');
        left.className = 'featured-left';

        // Wrap in link if project is selected
        if (selectedProject) {
            const projectLink = document.createElement('a');
            projectLink.href = `project.html?type=${projectType}&id=${selectedProject.id}`;
            projectLink.style.textDecoration = 'none';
            projectLink.style.color = 'inherit';
            projectLink.style.display = 'block';

            // Project Block
            const productDisplay = document.createElement('div');
            productDisplay.className = 'product-display';
            if (settings.projectCardWidth) {
                productDisplay.style.width = settings.projectCardWidth;
                // Also ensure parent flex doesn't force it if fixed width is used
                left.style.flex = 'none';
            }

            // Media Placeholder - Show selected project image
            const mediaPlaceholder = document.createElement('div');
            mediaPlaceholder.className = 'product-media-placeholder';
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
            projTitle.className = 'product-title';
            projTitle.textContent = selectedProject.title;
            productDisplay.appendChild(projTitle);

            projectLink.appendChild(productDisplay);
            left.appendChild(projectLink);
        } else {
            // No project selected - show placeholder
            const productDisplay = document.createElement('div');
            productDisplay.className = 'product-display';
            if (settings.projectCardWidth) {
                productDisplay.style.width = settings.projectCardWidth;
                left.style.flex = 'none';
            }

            const mediaPlaceholder = document.createElement('div');
            mediaPlaceholder.className = 'product-media-placeholder';
            mediaPlaceholder.textContent = 'Project Image (Empty)';
            if (settings.projectImageHeight) {
                mediaPlaceholder.style.height = `${settings.projectImageHeight}px`;
            }
            productDisplay.appendChild(mediaPlaceholder);

            const projTitle = document.createElement('h3');
            projTitle.className = 'product-title';
            projTitle.textContent = settings.projectTitle || 'Project Title';
            productDisplay.appendChild(projTitle);

            left.appendChild(productDisplay);
        }

        content.appendChild(left);

        // RIGHT SIDE (Neon Cube)
        const right = document.createElement('div');
        right.className = 'featured-right';
        right.style.border = 'none'; // Remove placeholder border
        right.style.background = 'none'; // Remove placeholder bg
        right.style.opacity = '1';

        // Cube Size
        const cubeSizeStyle = settings.cubeSize ? `style="--cube-size: ${settings.cubeSize}px;"` : '';

        // Cube HTML Structure
        const cubeHTML = `
            <div class="cube-container" ${cubeSizeStyle}>
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
        right.innerHTML = cubeHTML;

        content.appendChild(right);

        this.container.appendChild(content);
    }

    renderDefault() {
        this.container.innerHTML = `
            <h2 class="featured-heading">FEATURED PROJECT</h2>
            <div class="featured-content">
                <div class="featured-left">
                    <div class="product-display">
                        <div style="width:100%; height:300px; background:#222; display:flex; justify-content:center; align-items:center;">NO MEDIA</div>
                        <h3 class="product-title">My Awesome Game</h3>
                    </div>
                </div>
                <div class="featured-right">Right Side (Empty)</div>
            </div>
        `;
    }
}

new FeaturedController();
