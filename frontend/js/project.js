export class ProjectDetailController {
    constructor() {
        this.titleEl = document.getElementById('project-title');
        this.imageEl = document.getElementById('project-image');
        this.descEl = document.getElementById('project-description');

        this.init();
    }

    async init() {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        const type = params.get('type'); // 'game' or 'asset'

        if (!id || !type) {
            this.showError('Invalid Project Parameters');
            return;
        }

        await this.loadProject(id, type);
    }

    async loadProject(id, type) {
        try {
            const response = await fetch('https://gamedev-portfolio-l7d3.onrender.com/api/settings');
            const data = await response.json();

            let projects = [];
            let sections = [];

            if (type === 'game' && data.gamesPage) {
                projects = data.gamesPage.projects || [];
                sections = data.gamesPage.sections || [];
            } else if (type === 'asset' && data.assetsPage) {
                projects = data.assetsPage.projects || [];
                sections = data.assetsPage.sections || [];
            }

            const project = projects.find(p => p.id === id);

            if (project) {
                this.render(project, sections);
            } else {
                this.showError('Project Not Found');
            }

        } catch (error) {
            console.error('Failed to load project details:', error);
            this.showError('Error Loading Project');
        }
    }

    render(project, sections) {
        // Title
        document.title = `${project.title} - Yameen's Portfolio`;
        this.titleEl.textContent = project.title;

        // Image
        if (project.imageUrl) {
            this.imageEl.src = project.imageUrl;
            this.imageEl.style.display = 'block';
        } else {
            // Optional: Show placeholder or keep hidden
            this.imageEl.parentElement.innerHTML = '<div style="color:#666; text-align:center;">No Image Available</div>';
        }

        // Description
        this.descEl.textContent = project.description || 'No description available.';

        // Backgrounds - wait for DOM to update, then calculate needed sections
        requestAnimationFrame(() => {
            this.renderBackgrounds(sections);
        });
    }

    renderBackgrounds(sections) {
        const container = document.getElementById('project-background-container');
        container.innerHTML = ''; // Clear existing

        // Calculate how many sections we need based on content height
        const contentContainer = document.getElementById('project-detail-container');
        const contentHeight = contentContainer.scrollHeight;
        const viewportHeight = window.innerHeight;

        // Calculate number of sections needed (minimum 1, maximum 5)
        const sectionsNeeded = Math.min(5, Math.max(1, Math.ceil(contentHeight / viewportHeight)));

        console.log(`Content height: ${contentHeight}px, Viewport: ${viewportHeight}px, Sections needed: ${sectionsNeeded}`);

        // Only render the needed sections
        for (let i = 0; i < sectionsNeeded; i++) {
            const sectionData = sections[i];
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'project-bg-section';

            if (sectionData && sectionData.mediaUrl) {
                const mediaType = sectionData.mediaType || 'image';
                const media = document.createElement(mediaType === 'video' ? 'video' : 'img');
                media.className = 'project-bg-media';
                media.src = this.getOptimizedUrl(sectionData.mediaUrl, mediaType);

                if (mediaType === 'video') {
                    media.autoplay = true;
                    media.muted = true;
                    media.loop = true;
                    media.playsInline = true;
                }
                sectionDiv.appendChild(media);
            }

            container.appendChild(sectionDiv);
        }
    }

    getOptimizedUrl(url, type) {
        if (!url.includes('cloudinary.com')) return url;
        const uploadIndex = url.indexOf('/upload/');
        if (uploadIndex === -1) return url;
        let transformations = 'f_auto,q_auto';
        if (type === 'video') transformations += ',ac_none';
        return url.slice(0, uploadIndex + 8) + transformations + '/' + url.slice(uploadIndex + 8);
    }

    showError(msg) {
        this.titleEl.textContent = msg;
        this.descEl.textContent = '';
        this.imageEl.style.display = 'none';
    }
}

new ProjectDetailController();
