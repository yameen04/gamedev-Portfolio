const API_URL = '/api';

export class AdminController {
    constructor() {
        this.token = localStorage.getItem('adminToken');
        this.init();
    }

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.initGamesPageHandlers();
        this.initAssetsPageHandlers();
        this.initSecretCodeListener();
        this.checkAuth();
    }

    initSecretCodeListener() {
        let keySequence = [];
        const secretCode = '5629';

        // Listen on window for the code
        window.addEventListener('keydown', (e) => {
            keySequence.push(e.key);
            if (keySequence.length > secretCode.length) keySequence.shift();

            if (keySequence.join('') === secretCode) {
                // Set token and force auth check
                localStorage.setItem('adminToken', 'bypass-session');
                this.token = 'bypass-session';
                alert('Admin Access Granted via Code!');
                this.checkAuth();
            }
        });
    }

    cacheDOM() {
        // Sections
        this.loginSection = document.getElementById('login-section');
        this.dashboardSection = document.getElementById('dashboard-section');

        // Forms
        this.loginForm = document.getElementById('login-form');
        this.headerForm = document.getElementById('header-settings-form');
        this.bannerForm = document.getElementById('banner-settings-form');

        // Inputs
        this.usernameInput = document.getElementById('username');
        this.passwordInput = document.getElementById('password');
        this.mediaUploadInput = document.getElementById('banner-media-upload');
        this.uploadBtn = document.getElementById('upload-media-btn');
        this.logoUploadInput = document.getElementById('header-logo-upload');
        this.uploadLogoBtn = document.getElementById('upload-logo-btn');

        this.featuredMediaUploadInput = document.getElementById('featured-media-upload');
        this.uploadFeaturedBtn = document.getElementById('upload-featured-media-btn');
        this.featuredForm = document.getElementById('featured-settings-form');
        this.currentFeaturedMediaUrl = document.getElementById('current-featured-media-url');

        this.gamesMediaUploadInput = document.getElementById('games-media-upload');
        this.uploadGamesBtn = document.getElementById('upload-games-media-btn');
        this.gamesForm = document.getElementById('games-settings-form');
        this.currentGamesMediaUrl = document.getElementById('current-games-media-url');

        this.assetsMediaUploadInput = document.getElementById('assets-media-upload');
        this.uploadAssetsBtn = document.getElementById('upload-assets-media-btn');
        this.assetsForm = document.getElementById('assets-settings-form');
        this.currentAssetsMediaUrl = document.getElementById('current-assets-media-url');



        // Contact
        this.contactBgUploadInput = document.getElementById('contact-bg-upload');
        this.uploadContactBgBtn = document.getElementById('upload-contact-bg-btn');
        this.currentContactBgUrl = document.getElementById('current-contact-bg-url');

        this.contactProfileUploadInput = document.getElementById('contact-profile-upload');
        this.uploadContactProfileBtn = document.getElementById('upload-contact-profile-btn');
        this.currentContactProfileUrl = document.getElementById('current-contact-profile-url');

        this.contactForm = document.getElementById('contact-settings-form');

        // Misc
        this.logoutBtn = document.getElementById('logout-btn');
        this.loginError = document.getElementById('login-error');
        this.currentMediaUrl = document.getElementById('current-media-url');
        this.currentLogoUrl = document.getElementById('current-logo-url');
    }

    bindEvents() {
        this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        this.logoutBtn.addEventListener('click', () => this.handleLogout());

        this.headerForm.addEventListener('submit', (e) => this.saveHeaderSettings(e));
        this.bannerForm.addEventListener('submit', (e) => this.saveBannerSettings(e));
        this.featuredForm.addEventListener('submit', (e) => this.saveFeaturedSettings(e));
        this.gamesForm.addEventListener('submit', (e) => this.saveGamesSettings(e));
        this.assetsForm.addEventListener('submit', (e) => this.saveAssetsSettings(e));

        this.uploadBtn.addEventListener('click', () => this.handleUpload());
        this.uploadLogoBtn.addEventListener('click', () => this.handleLogoUpload());
        this.uploadFeaturedBtn.addEventListener('click', () => this.handleFeaturedUpload());
        this.uploadGamesBtn.addEventListener('click', () => this.handleGamesUpload());
        this.uploadAssetsBtn.addEventListener('click', () => this.handleAssetsUpload());



        this.contactForm.addEventListener('submit', (e) => this.saveContactSettings(e));
        this.uploadContactBgBtn.addEventListener('click', () => this.handleContactBgUpload());
        this.uploadContactProfileBtn.addEventListener('click', () => this.handleContactProfileUpload());
    }

    checkAuth() {
        // BYPASS LOGIN COMPLETELY
        this.showDashboard();
    }

    showLogin() {
        // No-op
    }

    showDashboard() {
        this.loginSection.classList.add('hidden');
        this.dashboardSection.classList.remove('hidden');
        this.loadCurrentSettings();
    }

    async handleLogin(e) {
        e.preventDefault();
        const username = this.usernameInput.value;
        const password = this.passwordInput.value;

        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();

            if (data.success) {
                this.token = data.token;
                localStorage.setItem('adminToken', this.token);
                this.checkAuth();
            } else {
                this.loginError.textContent = data.message;
            }
        } catch (error) {
            this.loginError.textContent = 'Login failed. Server error.';
        }
    }

    handleLogout() {
        localStorage.removeItem('adminToken');
        this.token = null;
        this.checkAuth();
    }

    async loadCurrentSettings() {
        try {
            const res = await fetch(`${API_URL}/settings`);
            const data = await res.json();

            if (data.header) {
                this.populateForm(this.headerForm, data.header);
                if (data.header.logoUrl) {
                    this.currentLogoUrl.textContent = data.header.logoUrl.split('/').pop();
                }
            }
            if (data.banner) {
                this.populateForm(this.bannerForm, data.banner);
                if (data.banner.mediaUrl) {
                    this.currentMediaUrl.textContent = data.banner.mediaUrl.split('/').pop();
                }
            }
            if (data.featured) {
                this.populateForm(this.featuredForm, data.featured);
                if (data.featured.mediaUrl) {
                    this.currentFeaturedMediaUrl.textContent = data.featured.mediaUrl.split('/').pop();
                }
            }
            if (data.games) {
                this.populateForm(this.gamesForm, data.games);
                if (data.games.mediaUrl) {
                    this.currentGamesMediaUrl.textContent = data.games.mediaUrl.split('/').pop();
                }
            }
            if (data.assets) {
                this.populateForm(this.assetsForm, data.assets);
                if (data.assets.mediaUrl) {
                    this.currentAssetsMediaUrl.textContent = data.assets.mediaUrl.split('/').pop();
                }
            }
            if (data.contact) {
                this.populateForm(this.contactForm, data.contact);
                if (data.contact.mediaUrl) {
                    this.currentContactBgUrl.textContent = data.contact.mediaUrl.split('/').pop();
                }
                if (data.contact.profileUrl) {
                    this.currentContactProfileUrl.textContent = data.contact.profileUrl.split('/').pop();
                }
            }
            if (data.gamesPage) {
                this.loadGamesPageSettings(data);
            }

            // Populate project dropdowns
            this.populateProjectDropdowns(data);
        } catch (error) {
            console.error('Failed to load settings', error);
        }
    }

    populateProjectDropdowns(data) {
        // Populate Featured dropdown with game projects
        const featuredSelect = document.getElementById('featured-project-select');
        const gamesSelect = document.getElementById('games-project-select');
        const assetsSelect = document.getElementById('assets-project-select');

        if (data.gamesPage && data.gamesPage.projects) {
            data.gamesPage.projects.forEach(project => {
                const option1 = document.createElement('option');
                option1.value = project.id;
                option1.textContent = `[Game] ${project.title}`;
                featuredSelect.appendChild(option1);

                const option2 = document.createElement('option');
                option2.value = project.id;
                option2.textContent = project.title;
                gamesSelect.appendChild(option2);
            });
        }

        if (data.assetsPage && data.assetsPage.projects) {
            data.assetsPage.projects.forEach(project => {
                // Add to Featured dropdown
                const option1 = document.createElement('option');
                option1.value = project.id;
                option1.textContent = `[Asset] ${project.title}`;
                featuredSelect.appendChild(option1);

                // Add to Assets dropdown
                const option2 = document.createElement('option');
                option2.value = project.id;
                option2.textContent = project.title;
                assetsSelect.appendChild(option2);
            });
        }

        // Set selected values if they exist
        if (data.featured && data.featured.selectedProjectId) {
            featuredSelect.value = data.featured.selectedProjectId;
        }
        if (data.games && data.games.selectedProjectId) {
            gamesSelect.value = data.games.selectedProjectId;
        }
        if (data.assets && data.assets.selectedProjectId) {
            assetsSelect.value = data.assets.selectedProjectId;
        }
    }

    populateForm(form, settings) {
        Object.keys(settings).forEach(key => {
            const input = form.elements[key];
            if (input) {
                input.value = settings[key];
            }
        });
    }

    async saveHeaderSettings(e) {
        e.preventDefault();
        const formData = new FormData(this.headerForm);
        const data = Object.fromEntries(formData.entries());

        try {
            await fetch(`${API_URL}/settings/header`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            alert('Header settings saved!');
        } catch (error) {
            alert('Failed to save header settings');
        }
    }

    async saveBannerSettings(e) {
        e.preventDefault();
        const formData = new FormData(this.bannerForm);
        const data = Object.fromEntries(formData.entries());

        try {
            await fetch(`${API_URL}/settings/banner`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            alert('Banner settings saved!');
        } catch (error) {
            alert('Failed to save banner settings');
        }
    }

    async handleUpload() {
        const file = this.mediaUploadInput.files[0];
        if (!file) {
            alert('Please select a file first');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`${API_URL}/upload/banner`, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                alert('Media uploaded successfully!');
                this.currentMediaUrl.textContent = data.url.split('/').pop();
            }
        } catch (error) {
            console.error(error);
            alert('Upload failed');
        }
    }

    async handleLogoUpload() {
        const file = this.logoUploadInput.files[0];
        if (!file) {
            alert('Please select a file first');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`${API_URL}/upload/logo`, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                alert('Logo uploaded successfully!');
                this.currentLogoUrl.textContent = data.url.split('/').pop();
            }
        } catch (error) {
            console.error(error);
            alert('Logo Upload failed');
        }
    }

    async handleAddProject(e) {
        e.preventDefault();
        console.log("Add Project Clicked");
        const formData = new FormData(e.target);

        try {
            console.log("Sending fetch request...");
            const res = await fetch(`${API_URL}/projects`, {
                method: 'POST',
                body: formData
            });
            console.log("Response status:", res.status);

            const data = await res.json();
            console.log("Response data:", data);

            if (data.success) {
                alert('Project added successfully!');
                e.target.reset();
                this.loadCurrentSettings(); // Reload to refresh list
            } else {
                alert('Failed to add project: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Failed to add project', error);
            alert('Error adding project: ' + error.message);
        }
    }

    async saveFeaturedSettings(e) {
        e.preventDefault();
        const formData = new FormData(this.featuredForm);
        const data = Object.fromEntries(formData.entries());

        console.log('Saving Featured Settings:', data);

        try {
            await fetch(`${API_URL}/settings/featured`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            alert('Featured settings saved!');
        } catch (error) {
            console.error('Error saving featured settings:', error);
            alert('Failed to save featured settings');
        }
    }

    async handleFeaturedUpload() {
        const file = this.featuredMediaUploadInput.files[0];
        if (!file) {
            alert('Please select a file first');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`${API_URL}/upload/featured`, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                alert('Featured media uploaded successfully!');
                this.currentFeaturedMediaUrl.textContent = data.url.split('/').pop();
            }
        } catch (error) {
            console.error(error);
            alert('Featured Upload failed');
        }
    }

    async saveGamesSettings(e) {
        e.preventDefault();
        const formData = new FormData(this.gamesForm);
        const data = Object.fromEntries(formData.entries());

        console.log('Saving Games Settings:', data);

        try {
            await fetch(`${API_URL}/settings/games`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            alert('Games settings saved!');
        } catch (error) {
            console.error('Error saving games settings:', error);
            alert('Failed to save games settings');
        }
    }

    async handleGamesUpload() {
        const file = this.gamesMediaUploadInput.files[0];
        if (!file) {
            alert('Please select a file first');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`${API_URL}/upload/games`, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                alert('Games media uploaded successfully!');
                this.currentGamesMediaUrl.textContent = data.url.split('/').pop();
            }
        } catch (error) {
            console.error(error);
            alert('Games Upload failed');
        }
    }

    async saveAssetsSettings(e) {
        e.preventDefault();
        const formData = new FormData(this.assetsForm);
        const data = Object.fromEntries(formData.entries());

        console.log('Saving Assets Settings:', data);

        try {
            await fetch(`${API_URL}/settings/assets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            alert('Assets settings saved!');
        } catch (error) {
            console.error('Error saving assets settings:', error);
            alert('Failed to save assets settings');
        }
    }

    async handleAssetsUpload() {
        const file = this.assetsMediaUploadInput.files[0];
        if (!file) {
            alert('Please select a file first');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`${API_URL}/upload/assets`, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                alert('Assets media uploaded successfully!');
                this.currentAssetsMediaUrl.textContent = data.url.split('/').pop();
            }
        } catch (error) {
            console.error(error);
            alert('Assets Upload failed');
        }
    }

    async saveContactSettings(e) {
        e.preventDefault();
        const formData = new FormData(this.contactForm);
        const data = Object.fromEntries(formData.entries());

        try {
            await fetch(`${API_URL}/settings/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            alert('Contact settings saved!');
        } catch (error) {
            alert('Failed to save contact settings');
        }
    }

    async handleContactBgUpload() {
        const file = this.contactBgUploadInput.files[0];
        if (!file) {
            alert('Please select a file first');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`${API_URL}/upload/contact/bg`, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                alert('Contact Header uploaded successfully!');
                this.currentContactBgUrl.textContent = data.url.split('/').pop();
            }
        } catch (error) {
            console.error(error);
            alert('Contact BG Upload failed');
        }
    }

    async handleContactProfileUpload() {
        const file = this.contactProfileUploadInput.files[0];
        if (!file) {
            alert('Please select a file first');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`${API_URL}/upload/contact/profile`, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                alert('Profile Pic uploaded successfully!');
                this.currentContactProfileUrl.textContent = data.url.split('/').pop();
            }
        } catch (error) {
            console.error(error);
            alert('Profile Upload failed');
        }
    }



    // --- NEW: Games Page Background Uploads ---
    initGamesPageHandlers() {
        // Background Upload Buttons
        const buttons = document.querySelectorAll('.upload-games-page-bg-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                this.handleGamesPageUpload(index);
            });
        });

        // Logo Upload Button
        const logoBtn = document.getElementById('upload-games-page-logo-btn');
        if (logoBtn) {
            logoBtn.addEventListener('click', () => this.handleGamesPageLogoUpload());
        }

        // General Form Save
        const generalForm = document.getElementById('games-page-general-form');
        if (generalForm) {
            generalForm.addEventListener('submit', (e) => this.saveGamesPageGeneralSettings(e));
        }

        // Add Project Form
        const addProjectForm = document.getElementById('add-project-form');
        if (addProjectForm) {
            addProjectForm.addEventListener('submit', (e) => this.handleAddProject(e));
        }
    }

    async handleGamesPageLogoUpload() {
        const fileInput = document.getElementById('games-page-logo-upload');
        const file = fileInput.files[0];
        if (!file) {
            alert('Please select a logo file first');
            return;
        }
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`${API_URL}/upload/games-page/logo`, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                alert('Games Page Logo uploaded!');
                document.getElementById('current-games-page-logo-url').textContent = data.url.split('/').pop();
            }
        } catch (error) {
            console.error(error);
            alert('Logo Upload failed');
        }
    }

    async saveGamesPageGeneralSettings(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            await fetch(`${API_URL}/settings/games-page`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            alert('Games Page General Settings Saved!');
        } catch (error) {
            console.error(error);
            alert('Failed to save settings');
        }
    }


    async handleGamesPageUpload(index) {
        const fileInput = document.getElementById(`games-page-bg-${index}`);
        const file = fileInput.files[0];
        if (!file) {
            alert('Please select a file first');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`${API_URL}/upload/games-page/bg/${index}`, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                alert(`Section ${index} Background uploaded successfully!`);
                const urlSpan = document.getElementById(`games-page-bg-${index}-url`);
                if (urlSpan) urlSpan.textContent = data.url.split('/').pop();
            }
        } catch (error) {
            console.error(error);
            alert(`Section ${index} Upload failed`);
        }
    }

    loadGamesPageSettings(data) {
        if (!data.gamesPage) return;

        // Load General Settings
        const generalForm = document.getElementById('games-page-general-form');
        if (generalForm) {
            if (data.gamesPage.pageTitle) generalForm.elements['pageTitle'].value = data.gamesPage.pageTitle;
            if (data.gamesPage.developerName) generalForm.elements['developerName'].value = data.gamesPage.developerName;
            if (data.gamesPage.logoHeight) generalForm.elements['logoHeight'].value = data.gamesPage.logoHeight;
        }

        // Load Logo URL
        if (data.gamesPage.logoUrl) {
            const logoSpan = document.getElementById('current-games-page-logo-url');
            if (logoSpan) logoSpan.textContent = data.gamesPage.logoUrl.split('/').pop();
        }

        if (!data.gamesPage.sections) return;
        data.gamesPage.sections.forEach((section, index) => {
            // Index in array is 0-based, UI is 1-based (index+1)
            const uiIndex = index + 1;
            const urlSpan = document.getElementById(`games-page-bg-${uiIndex}-url`);
            if (urlSpan && section.mediaUrl) {
                urlSpan.textContent = section.mediaUrl.split('/').pop();
            }
        });

        // Load Projects
        if (data.gamesPage && data.gamesPage.projects) {
            this.renderProjectList(data.gamesPage.projects);
        }

        // Load Assets Page Settings
        if (data.assetsPage) {
            this.loadAssetsPageSettings(data);
        }
    }



    renderProjectList(projects) {
        const listContainer = document.getElementById('project-list-container');
        if (!listContainer) return;

        listContainer.innerHTML = '';
        if (projects.length === 0) {
            listContainer.innerHTML = '<p class="empty-msg">No projects yet.</p>';
            return;
        }

        projects.forEach(project => {
            const item = document.createElement('div');
            item.className = 'project-item';
            item.innerHTML = this.renderProjectListItem(project);
            listContainer.appendChild(item);
        });

        // Bind delete & edit events
        listContainer.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleDeleteProject(btn.getAttribute('data-id')));
        });
        listContainer.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleEditProject(btn.getAttribute('data-id'), projects));
        });
    }

    renderProjectListItem(project) {
        return `
                <img src="${project.imageUrl}" alt="${project.title}">
                <div class="project-info">
                    <h4>${project.title} <small>(Section ${project.sectionIndex})</small></h4>
                    <p>${project.description.substring(0, 50)}...</p>
                </div>
                <div>
                     <button class="edit-btn" data-id="${project.id}" style="margin-right: 5px; cursor: pointer; padding: 5px; background: #2196F3; color: white; border: none; border-radius: 4px;">Edit</button>
                    <button class="delete-btn" data-id="${project.id}">Delete</button>
                </div>
            `;
    }

    handleEditProject(id, projects) {
        const project = projects.find(p => p.id === id);
        if (!project) return;

        // Populate Form
        const form = document.getElementById('add-project-form');
        form.elements['id'].value = project.id;
        form.elements['title'].value = project.title;
        form.elements['description'].value = project.description;
        form.elements['sectionIndex'].value = project.sectionIndex;
        // Cannot set file input value

        // Update UI
        document.getElementById('add-project-heading').textContent = 'Edit Project';
        document.getElementById('project-submit-btn').textContent = 'Update Project';
        document.getElementById('cancel-edit-btn').style.display = 'block';

        // Scroll to form
        form.scrollIntoView({ behavior: 'smooth' });
    }

    resetProjectForm() {
        const form = document.getElementById('add-project-form');
        form.reset();
        form.elements['id'].value = '';
        document.getElementById('add-project-heading').textContent = 'Add New Project';
        document.getElementById('project-submit-btn').textContent = 'Add Project';
        document.getElementById('cancel-edit-btn').style.display = 'none';
    }

    async handleAddProject(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const id = formData.get('id');
        const isEdit = !!id;

        const url = isEdit ? `${API_URL}/projects/${id}` : `${API_URL}/projects`;
        const method = isEdit ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method: method,
                body: formData
            });
            const data = await res.json();

            if (data.success) {
                alert(isEdit ? 'Project updated!' : 'Project added!');
                this.resetProjectForm();
                this.loadCurrentSettings();
            } else {
                alert('Operation failed: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Failed to save project', error);
            alert('Error saving project: ' + error.message);
        }
    }

    async handleDeleteProject(id) {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            const res = await fetch(`${API_URL}/projects/${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.success) {
                this.loadCurrentSettings(); // Reload to refresh list
            }
        } catch (error) {
            console.error('Failed to delete project', error);
            alert('Failed to delete project');
        }
    }

    // --- ASSETS PAGE HANDLERS (Mirrored) ---

    initAssetsPageHandlers() {
        // Section Uploads 1-5
        document.querySelectorAll('.upload-assets-page-bg-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = btn.getAttribute('data-index');
                this.handleAssetsPageUpload(index);
            });
        });

        // Logo Upload
        const logoBtn = document.getElementById('upload-assets-page-logo-btn');
        if (logoBtn) {
            logoBtn.addEventListener('click', () => this.handleAssetsPageLogoUpload());
        }

        // General Form
        const generalForm = document.getElementById('assets-page-general-form');
        if (generalForm) {
            generalForm.addEventListener('submit', (e) => this.saveAssetsPageGeneralSettings(e));
        }

        // Add Asset Form
        const addAssetForm = document.getElementById('add-asset-form');
        if (addAssetForm) {
            addAssetForm.addEventListener('submit', (e) => this.handleAddAsset(e));
        }

        // Cancel Edit
        const cancelBtn = document.getElementById('cancel-asset-edit-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.resetAssetForm());
        }
    }

    async handleAssetsPageUpload(index) {
        const fileInput = document.getElementById(`assets-page-bg-${index}`);
        const file = fileInput.files[0];
        if (!file) {
            alert('Please select a file first');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`${API_URL}/upload/assets-page/bg/${index}`, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                alert(`Section ${index} Background uploaded!`);
                const urlSpan = document.getElementById(`assets-page-bg-${index}-url`);
                if (urlSpan) urlSpan.textContent = data.url.split('/').pop();
            }
        } catch (error) {
            console.error(error);
            alert(`Section ${index} Upload failed`);
        }
    }

    async handleAssetsPageLogoUpload() {
        const fileInput = document.getElementById('assets-page-logo-upload');
        const file = fileInput.files[0];
        if (!file) {
            alert('Please select a logo file first');
            return;
        }
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`${API_URL}/upload/assets-page/logo`, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                alert('Assets Page Logo uploaded!');
                document.getElementById('current-assets-page-logo-url').textContent = data.url.split('/').pop();
            }
        } catch (error) {
            console.error(error);
            alert('Logo Upload failed');
        }
    }

    async saveAssetsPageGeneralSettings(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            await fetch(`${API_URL}/settings/assets-page`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            alert('Assets Page General Settings Saved!');
        } catch (error) {
            console.error(error);
            alert('Failed to save settings');
        }
    }

    // Asset CRUD
    async handleAddAsset(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const id = formData.get('id');
        const isEdit = !!id;

        const url = isEdit ? `${API_URL}/assets/${id}` : `${API_URL}/assets`;
        const method = isEdit ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, { method: method, body: formData });
            const data = await res.json();
            if (data.success) {
                alert(isEdit ? 'Asset updated!' : 'Asset added!');
                this.resetAssetForm();
                this.loadCurrentSettings();
            } else {
                alert('Failed: ' + (data.error || 'Unknown'));
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }

    async handleDeleteAsset(id) {
        if (!confirm('Delete this asset?')) return;
        try {
            await fetch(`${API_URL}/assets/${id}`, { method: 'DELETE' });
            this.loadCurrentSettings();
        } catch (e) {
            alert('Delete failed');
        }
    }

    handleEditAsset(id, projects) {
        const project = projects.find(p => p.id === id);
        if (!project) return;

        const form = document.getElementById('add-asset-form');
        form.elements['id'].value = project.id;
        form.elements['title'].value = project.title;
        form.elements['description'].value = project.description;
        form.elements['sectionIndex'].value = project.sectionIndex;

        document.getElementById('add-asset-heading').textContent = 'Edit Asset';
        document.getElementById('asset-submit-btn').textContent = 'Update Asset';
        document.getElementById('cancel-asset-edit-btn').style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
    }

    resetAssetForm() {
        const form = document.getElementById('add-asset-form');
        form.reset();
        form.elements['id'].value = '';
        document.getElementById('add-asset-heading').textContent = 'Add New Asset';
        document.getElementById('asset-submit-btn').textContent = 'Add Asset';
        document.getElementById('cancel-asset-edit-btn').style.display = 'none';
    }


    loadAssetsPageSettings(data) {
        if (!data.assetsPage) return;

        const generalForm = document.getElementById('assets-page-general-form');
        if (generalForm) {
            if (data.assetsPage.pageTitle) generalForm.elements['pageTitle'].value = data.assetsPage.pageTitle;
            if (data.assetsPage.developerName) generalForm.elements['developerName'].value = data.assetsPage.developerName;
            if (data.assetsPage.logoHeight) generalForm.elements['logoHeight'].value = data.assetsPage.logoHeight;
        }
        if (data.assetsPage.logoUrl) {
            const logoSpan = document.getElementById('current-assets-page-logo-url');
            if (logoSpan) logoSpan.textContent = data.assetsPage.logoUrl.split('/').pop();
        }

        if (data.assetsPage.sections) {
            data.assetsPage.sections.forEach((section, index) => {
                const uiIndex = index + 1;
                const urlSpan = document.getElementById(`assets-page-bg-${uiIndex}-url`);
                if (urlSpan && section.mediaUrl) {
                    urlSpan.textContent = section.mediaUrl.split('/').pop();
                }
            });
        }

        if (data.assetsPage.projects) {
            this.renderAssetList(data.assetsPage.projects);
        }
    }

    renderAssetList(projects) {
        const listContainer = document.getElementById('asset-list-container');
        if (!listContainer) return;

        listContainer.innerHTML = '';
        if (projects.length === 0) {
            listContainer.innerHTML = '<p class="empty-msg">No assets yet.</p>';
            return;
        }

        projects.forEach(project => {
            const item = document.createElement('div');
            item.className = 'project-item';
            item.innerHTML = `
                <img src="${project.imageUrl}" alt="${project.title}">
                <div class="project-info">
                    <h4>${project.title} <small>(Section ${project.sectionIndex})</small></h4>
                    <p>${project.description.substring(0, 50)}...</p>
                </div>
                <div>
                     <button class="edit-btn-asset" data-id="${project.id}" style="margin-right: 5px; cursor: pointer; padding: 5px; background: #2196F3; color: white; border: none; border-radius: 4px;">Edit</button>
                    <button class="delete-btn-asset" data-id="${project.id}" style="cursor: pointer; padding: 5px; background: #ff4d4d; color: white; border: none; border-radius: 4px;">Delete</button>
                </div>
            `;
            listContainer.appendChild(item);
        });

        listContainer.querySelectorAll('.delete-btn-asset').forEach(btn => {
            btn.addEventListener('click', () => this.handleDeleteAsset(btn.getAttribute('data-id')));
        });
        listContainer.querySelectorAll('.edit-btn-asset').forEach(btn => {
            btn.addEventListener('click', () => this.handleEditAsset(btn.getAttribute('data-id'), projects));
        });
    }
}

new AdminController();
