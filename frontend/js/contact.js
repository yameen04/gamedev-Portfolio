export class ContactController {
    constructor() {
        this.container = document.querySelector('#contact-section');
        this.init();
    }

    async init() {
        await this.loadSettings();
    }

    async loadSettings() {
        try {
            const response = await fetch('http://localhost:3000/api/settings');
            const data = await response.json();
            if (data && data.contact) {
                this.render(data.contact);
            } else {
                this.renderDefault();
            }
        } catch (error) {
            console.error('Failed to load contact settings:', error);
            this.renderDefault();
        }
    }

    render(settings) {
        this.container.innerHTML = '';

        // Apply Styles
        if (settings.backgroundColor) this.container.style.backgroundColor = settings.backgroundColor;

        // Background Media
        if (settings.mediaUrl) {
            const media = document.createElement(settings.mediaType === 'video' ? 'video' : 'img');
            media.className = 'contact-section-bg';
            media.src = settings.mediaUrl;
            if (settings.mediaType === 'video') {
                media.autoplay = true;
                media.muted = true;
                media.loop = true;
            }
            this.container.appendChild(media);
        }

        // Heading (Top Left)
        const heading = document.createElement('h2');
        heading.className = 'contact-heading';
        heading.textContent = settings.sectionTitle || 'Contact';
        this.container.appendChild(heading);

        // Main Content Wrapper
        const content = document.createElement('div');
        content.className = 'contact-content';

        // Apply Left Margin Setting (Moves the whole content block)
        if (settings.leftMargin) {
            content.style.marginLeft = `${settings.leftMargin}px`;
        } else {
            content.style.marginLeft = '100px'; // Default
        }

        // 1. Profile Area (Image + Description)
        const profileArea = document.createElement('div');
        profileArea.className = 'profile-area';

        // Apply Spacing (Gap between Pic and Description)
        if (settings.contentGap) {
            profileArea.style.gap = `${settings.contentGap}px`;
        } else {
            profileArea.style.gap = '50px'; // Default
        }

        // Profile Pic
        const picContainer = document.createElement('div');
        picContainer.className = 'profile-pic-container';
        const pic = document.createElement('img');
        pic.className = 'profile-pic';
        pic.src = settings.profileUrl || 'https://via.placeholder.com/250';
        picContainer.appendChild(pic);
        profileArea.appendChild(picContainer);

        // Description (Now direct child of profileArea)
        const desc = document.createElement('div');
        desc.className = 'profile-desc';
        desc.innerHTML = (settings.description || 'Game Developer based in the Metaverse.').replace(/\n/g, '<br>');
        profileArea.appendChild(desc);

        content.appendChild(profileArea);

        // 2. Buttons Area (Separate Row, below Profile Area)
        const buttonsArea = document.createElement('div');
        buttonsArea.className = 'contact-buttons';

        // Row 1: Email & LinkedIn
        const buttonsRow = document.createElement('div');
        buttonsRow.className = 'buttons-row';

        // Email Button
        const emailBtn = document.createElement('a');
        emailBtn.className = 'contact-btn btn-email';
        emailBtn.textContent = 'Send Me An Email';
        // Open Gmail compose in new tab instead of mailto:
        emailBtn.href = settings.email ? `https://mail.google.com/mail/?view=cm&fs=1&to=${settings.email}` : '#';
        emailBtn.target = '_blank';
        buttonsRow.appendChild(emailBtn);

        // LinkedIn Button
        const linkedInBtn = document.createElement('a');
        linkedInBtn.className = 'contact-btn btn-linkedin';
        linkedInBtn.textContent = 'Connect on LinkedIn';
        linkedInBtn.href = settings.linkedinUrl || '#';
        linkedInBtn.target = '_blank';
        buttonsRow.appendChild(linkedInBtn);

        buttonsArea.appendChild(buttonsRow);

        // Row 2: 3rd Button (Centered Below)
        const thirdBtn = document.createElement('a');
        thirdBtn.className = 'contact-btn btn-github';
        thirdBtn.href = settings.githubUrl || '#';
        thirdBtn.target = '_blank';

        const btnText = document.createElement('span');
        btnText.textContent = 'Connect ON GITHUB';
        thirdBtn.appendChild(btnText);

        buttonsArea.appendChild(thirdBtn);

        content.appendChild(buttonsArea);

        this.container.appendChild(content);
    }

    renderDefault() {
        this.container.innerHTML = `
            <h2 class="contact-heading">CONTACT</h2>
            <div class="contact-content">
                <div class="profile-area">
                    <img class="profile-pic" src="https://via.placeholder.com/250" alt="Profile">
                    <div class="profile-desc">
                        Hi! I'm a Game Developer. I love creating immersive worlds and fun gameplay mechanics.
                    </div>
                </div>
                <div class="contact-buttons">
                    <div class="buttons-row">
                        <a href="https://mail.google.com/mail/?view=cm&fs=1&to=yameenshabbir39@gmail.com" target="_blank" class="contact-btn btn-email">Send Me An Email</a>
                        <a href="#" class="contact-btn btn-linkedin">Connect on LinkedIn</a>
                    </div>
                    <a href="#" class="contact-btn btn-github"><span>Connect ON GITHUB</span></a>
                </div>
            </div>
        `;
    }
}

new ContactController();
