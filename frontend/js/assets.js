export class AssetsController {
    constructor() {
        this.container = document.querySelector('#assets-section');
        this.init();
    }

    async init() {
        await this.loadSettings();
    }

    async loadSettings() {
        try {
            const response = await fetch('/api/settings');
            const data = await response.json();
            if (data && data.assets) {
                // Get the selected project if ID exists
                let selectedProject = null;
                if (data.assets.selectedProjectId && data.assetsPage && data.assetsPage.projects) {
                    selectedProject = data.assetsPage.projects.find(p => p.id === data.assets.selectedProjectId);
                }
                this.render(data.assets, selectedProject);
            } else {
                this.renderDefault();
            }
        } catch (error) {
            console.error('Failed to load assets settings:', error);
            this.renderDefault();
        }
    }

    render(settings, selectedProject = null) {
        this.container.innerHTML = '';

        // Apply Styles
        if (settings.backgroundColor) this.container.style.backgroundColor = settings.backgroundColor;
        if (settings.textColor) this.container.style.color = settings.textColor;
        if (settings.fontFamily) this.container.style.fontFamily = settings.fontFamily;

        // Background Media (Applied to whole section)
        if (settings.mediaUrl) {
            const media = document.createElement(settings.mediaType === 'video' ? 'video' : 'img');
            media.className = 'assets-section-bg';
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
        heading.className = 'assets-heading';
        heading.textContent = settings.sectionTitle || 'Assets';
        this.container.appendChild(heading);

        // Grid Content
        const content = document.createElement('div');
        content.className = 'assets-content';
        if (settings.sectionGap) {
            content.style.gap = `${settings.sectionGap}px`;
        }

        // LEFT SIDE (Project Card)
        const left = document.createElement('div');
        left.className = 'assets-left';

        // Wrap in link if project is selected
        if (selectedProject) {
            const projectLink = document.createElement('a');
            projectLink.href = `project.html?type=asset&id=${selectedProject.id}`;
            projectLink.style.textDecoration = 'none';
            projectLink.style.color = 'inherit';
            projectLink.style.display = 'block';

            // Project Block
            const productDisplay = document.createElement('div');
            productDisplay.className = 'assets-product-display';
            if (settings.projectCardWidth) {
                productDisplay.style.width = settings.projectCardWidth;
                left.style.flex = 'none';
            }

            // Media Placeholder - Show selected project image
            const mediaPlaceholder = document.createElement('div');
            mediaPlaceholder.className = 'assets-media-placeholder';
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
            projTitle.className = 'assets-title';
            projTitle.textContent = selectedProject.title;
            productDisplay.appendChild(projTitle);

            projectLink.appendChild(productDisplay);
            left.appendChild(projectLink);
        } else {
            // No project selected - show placeholder
            const productDisplay = document.createElement('div');
            productDisplay.className = 'assets-product-display';
            if (settings.projectCardWidth) {
                productDisplay.style.width = settings.projectCardWidth;
                left.style.flex = 'none';
            }

            const mediaPlaceholder = document.createElement('div');
            mediaPlaceholder.className = 'assets-media-placeholder';
            mediaPlaceholder.textContent = 'Asset Image (Empty)';
            if (settings.projectImageHeight) {
                mediaPlaceholder.style.height = `${settings.projectImageHeight}px`;
            }
            productDisplay.appendChild(mediaPlaceholder);

            const projTitle = document.createElement('h3');
            projTitle.className = 'assets-title';
            projTitle.textContent = settings.projectTitle || 'Asset Title';
            productDisplay.appendChild(projTitle);

            left.appendChild(productDisplay);
        }

        content.appendChild(left);

        // RIGHT SIDE (Neon Cube)
        const right = document.createElement('div');
        right.className = 'assets-right';
        right.style.border = 'none';
        right.style.background = 'none';
        right.style.opacity = '1';

        // Cube Size Setting
        const cubeSize = settings.cubeSize || 200;
        const sizeStyle = `style="--cube-size: ${cubeSize}px;"`;

        // Cube HTML Structure (Using classes from cube.css)
        const cubeHTML = `
            <div class="cube-container" ${sizeStyle}>
                <div class="cube">
                    <div class="cube-face face-front">ASSET</div>
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
            <h2 class="assets-heading">ASSETS</h2>
            <div class="assets-content">
                <div class="assets-left">
                    <div class="assets-product-display">
                        <div style="width:100%; height:300px; background:#222; display:flex; justify-content:center; align-items:center;">NO MEDIA</div>
                        <h3 class="assets-title">My Awesome Asset</h3>
                    </div>
                </div>
                <div class="assets-right">
                    <!-- Default Cube -->
                     <div class="cube-container" style="--cube-size: 200px;">
                        <div class="cube">
                            <div class="cube-face face-front">ASSET</div>
                            <div class="cube-face face-back">LOVE</div>
                            <div class="cube-face face-right">CODE</div>
                            <div class="cube-face face-left">ART</div>
                            <div class="cube-face face-top"></div>
                            <div class="cube-face face-bottom"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

new AssetsController();
