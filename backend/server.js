const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

// --- CONFIGURATION ---

// 1. MongoDB Connection - Using Environment Variable
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// 2. Cloudinary Configuration
cloudinary.config({
    cloud_name: 'dok8okwg1',
    api_key: '486188673554489',
    api_secret: '9oc1qlXm9eTg316kmpjifusnyRI'
});

// 3. Multer Storage (Cloudinary)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'portfolio_uploads', // Folder name in Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'mp4', 'webm'],
        resource_type: 'auto' // Auto-detect image or video
    }
});

const upload = multer({ storage: storage });


// --- MIDDLEWARE ---
app.use(cors());
app.use(bodyParser.json());
// 4. Serve static files from frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve index.html for root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});


// --- DATABASE SCHEMAS ---

// Single schema to hold all site settings (mirroring the old settings.json structure)
const settingsSchema = new mongoose.Schema({
    header: {
        logoUrl: String,
        logoHeight: String,
        logoText: String,        // NEW - Logo text fallback
        nameText: String,         // NEW - Developer name (this is what the admin panel sends!)
        developerName: String,    // Keep for backward compat
        siteTitle: String,        // Keep for backward compat
        linkSpacing: String,      // NEW - Nav link spacing
        fontFamily: String,       // NEW - Header font
        backgroundColor: String,  // NEW - Header background color
        textColor: String,        // NEW - Header text color
        navLinks: [Object]
    },
    banner: {
        heading: String,
        subheading: String,
        mediaUrl: String,
        mediaType: String,
        videoUrl: String,
        // NEW FIELDS FROM ADMIN PANEL
        title: String,
        buttonSpacing: String,
        buttonGamesText: String,
        buttonGamesColor: String,
        buttonGamesBg: String,
        buttonAssetsText: String,
        buttonAssetsColor: String,
        buttonAssetsBg: String
    },
    featured: {
        heading: String,
        description: String,
        mediaUrl: String,
        mediaType: String,
        // NEW FIELDS FROM ADMIN PANEL
        sectionTitle: String,
        projectTitle: String,
        projectCardWidth: String,
        projectImageHeight: String,
        sectionGap: String,
        cubeSize: String,
        selectedProjectId: String,
        letterboxColor: String
    },
    games: {
        heading: String,
        description: String,
        mediaUrl: String,
        mediaType: String,
        // NEW FIELDS FROM ADMIN PANEL
        sectionTitle: String,
        projectTitle: String,
        projectCardWidth: String,
        projectImageHeight: String,
        sectionGap: String,
        cubeSize: String,
        cubeMarginLeft: String,
        cubeMarginRight: String,
        cubeMarginTop: String,
        rightOffset: String,
        selectedProjectId: String,
        letterboxColor: String
    },
    assets: {
        heading: String,
        projectTitle: String,
        mediaUrl: String,
        mediaType: String,
        projectCardWidth: String,
        sectionGap: String,
        cubeSize: String,
        leftMargin: String,
        contentGap: String,
        projectImageHeight: String,
        // NEW FIELDS FROM ADMIN PANEL
        sectionTitle: String,
        selectedProjectId: String,
        letterboxColor: String
    },
    contact: {
        heading: String,
        email: String,
        phone: String,
        mediaUrl: String,
        mediaType: String,
        profileUrl: String,
        socialLinks: [Object],
        formTitle: String,
        // FIELDS FROM ADMIN PANEL
        sectionTitle: String,
        profileName: String,
        role: String,
        contactEmail: String,
        contactPhone: String,
        socialMediaTitle: String,
        description: String,      // NEW - profile description text
        linkedinUrl: String,      // NEW - LinkedIn button link
        githubUrl: String,        // NEW - GitHub button link
        leftMargin: String,       // NEW - content left margin
        contentGap: String        // NEW - gap between pic and text
    },
    gamesPage: {
        logoUrl: String,
        pageTitle: String,
        developerName: String,
        logoHeight: String,
        sections: [{ mediaUrl: String, mediaType: String }], // Array of 5 sections
        projects: [{
            id: String,
            title: String,
            description: String,
            sectionIndex: Number,
            imageUrl: String
        }]
    },
    assetsPage: {
        logoUrl: String,
        pageTitle: String,
        developerName: String,
        logoHeight: String,
        sections: [{ mediaUrl: String, mediaType: String }],
        projects: [{
            id: String,
            title: String,
            description: String,
            sectionIndex: Number,
            imageUrl: String
        }]
    }
});

const Settings = mongoose.model('Settings', settingsSchema);

// --- HELPER FUNCTIONS ---

// Get the single settings document (create if not exists)
const getSettingsDoc = async () => {
    let settings = await Settings.findOne();
    if (!settings) {
        // Initialize with default/empty structure if new DB
        settings = new Settings({
            header: {},
            banner: {},
            featured: {},
            games: {},
            assets: {},
            contact: {},
            gamesPage: { sections: [], projects: [] },
            assetsPage: { sections: [], projects: [] }
        });
        await settings.save();
    }
    return settings;
};


// --- API ENDPOINTS ---

// Get All Settings
app.get('/api/settings', async (req, res) => {
    try {
        const settings = await getSettingsDoc();
        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Header
app.post('/api/settings/header', async (req, res) => {
    try {
        const settings = await getSettingsDoc();
        settings.header = { ...settings.header, ...req.body };
        await settings.save();
        res.json({ success: true, settings });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Update Banner
app.post('/api/settings/banner', async (req, res) => {
    try {
        const settings = await getSettingsDoc();
        settings.banner = { ...settings.banner, ...req.body };
        await settings.save();
        res.json({ success: true, settings });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Update Featured
app.post('/api/settings/featured', async (req, res) => {
    try {
        const settings = await getSettingsDoc();
        settings.featured = { ...settings.featured, ...req.body };
        await settings.save();
        res.json({ success: true, settings });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Update Games Section (Home)
app.post('/api/settings/games', async (req, res) => {
    try {
        const settings = await getSettingsDoc();
        settings.games = { ...settings.games, ...req.body };
        await settings.save();
        res.json({ success: true, settings });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Update Assets Section (Home)
app.post('/api/settings/assets', async (req, res) => {
    try {
        const settings = await getSettingsDoc();
        settings.assets = { ...settings.assets, ...req.body };
        await settings.save();
        res.json({ success: true, settings });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Update Contact
app.post('/api/settings/contact', async (req, res) => {
    try {
        const settings = await getSettingsDoc();
        settings.contact = { ...settings.contact, ...req.body };
        await settings.save();
        res.json({ success: true, settings });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Update Games Page Settings
app.post('/api/settings/games-page', async (req, res) => {
    try {
        const settings = await getSettingsDoc();
        settings.gamesPage = { ...settings.gamesPage, ...req.body };
        await settings.save();
        res.json({ success: true, settings });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Update Assets Page Settings
app.post('/api/settings/assets-page', async (req, res) => {
    try {
        const settings = await getSettingsDoc();
        settings.assetsPage = { ...settings.assetsPage, ...req.body };
        await settings.save();
        res.json({ success: true, settings });
    } catch (err) { res.status(500).json({ error: err.message }); }
});


// --- UPLOAD HANDLERS (Cloudinary) ---
// Generic handler helper
const handleUpload = async (req, res, section, key) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    try {
        const settings = await getSettingsDoc();
        const fileUrl = req.file.path; // Cloudinary URL
        const fileType = req.file.mimetype.startsWith('video') ? 'video' : 'image';

        // Navigate structure dynamically to update nested keys
        // e.g., section='banner', key='mediaUrl'
        if (!settings[section]) settings[section] = {};

        settings[section][key] = fileUrl;
        if (key === 'mediaUrl') settings[section].mediaType = fileType; // Only update type if main media

        await settings.save();
        res.json({ success: true, url: fileUrl, type: fileType });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Upload failed' });
    }
};

app.post('/api/upload/banner', upload.single('file'), (req, res) => handleUpload(req, res, 'banner', 'mediaUrl'));
app.post('/api/upload/logo', upload.single('file'), (req, res) => handleUpload(req, res, 'header', 'logoUrl'));
app.post('/api/upload/featured', upload.single('file'), (req, res) => handleUpload(req, res, 'featured', 'mediaUrl'));
app.post('/api/upload/games', upload.single('file'), (req, res) => handleUpload(req, res, 'games', 'mediaUrl'));
app.post('/api/upload/assets', upload.single('file'), (req, res) => handleUpload(req, res, 'assets', 'mediaUrl'));
app.post('/api/upload/contact/bg', upload.single('file'), (req, res) => handleUpload(req, res, 'contact', 'mediaUrl'));
app.post('/api/upload/contact/profile', upload.single('file'), (req, res) => handleUpload(req, res, 'contact', 'profileUrl'));
app.post('/api/upload/games-page/logo', upload.single('file'), (req, res) => handleUpload(req, res, 'gamesPage', 'logoUrl'));
app.post('/api/upload/assets-page/logo', upload.single('file'), (req, res) => handleUpload(req, res, 'assetsPage', 'logoUrl'));


// Special Case: Section Backgrounds (Array)
app.post('/api/upload/games-page/bg/:sectionIndex', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    try {
        const settings = await getSettingsDoc();
        const sectionIndex = parseInt(req.params.sectionIndex);
        const fileUrl = req.file.path;
        const fileType = req.file.mimetype.startsWith('video') ? 'video' : 'image';

        const sections = settings.gamesPage.sections || [];
        // Ensure index exists
        sections[sectionIndex - 1] = {
            ...sections[sectionIndex - 1],
            mediaUrl: fileUrl,
            mediaType: fileType
        };

        // Mongoose array update requirement
        settings.gamesPage.sections = sections;
        settings.markModified('gamesPage.sections');

        await settings.save();
        res.json({ success: true, url: fileUrl, type: fileType, sectionIndex });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/upload/assets-page/bg/:sectionIndex', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    try {
        const settings = await getSettingsDoc();
        const sectionIndex = parseInt(req.params.sectionIndex);
        const fileUrl = req.file.path;
        const fileType = req.file.mimetype.startsWith('video') ? 'video' : 'image';

        const sections = settings.assetsPage.sections || [];
        sections[sectionIndex - 1] = {
            ...sections[sectionIndex - 1],
            mediaUrl: fileUrl,
            mediaType: fileType
        };

        settings.assetsPage.sections = sections;
        settings.markModified('assetsPage.sections');

        await settings.save();
        res.json({ success: true, url: fileUrl, type: fileType, sectionIndex });
    } catch (err) { res.status(500).json({ error: err.message }); }
});


// --- CRUD: GAME PROJECTS ---

app.post('/api/projects', upload.single('image'), async (req, res) => {
    try {
        const settings = await getSettingsDoc();
        const newProject = {
            id: Date.now().toString(),
            title: req.body.title,
            description: req.body.description,
            sectionIndex: parseInt(req.body.sectionIndex),
            imageUrl: req.file ? req.file.path : ''
        };
        settings.gamesPage.projects.push(newProject);
        await settings.save();
        res.json({ success: true, project: newProject });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/projects/:id', upload.single('image'), async (req, res) => {
    try {
        const settings = await getSettingsDoc();
        const project = settings.gamesPage.projects.find(p => p.id === req.params.id);
        if (!project) return res.status(404).json({ error: 'Project not found' });

        if (req.body.title) project.title = req.body.title;
        if (req.body.description) project.description = req.body.description;
        if (req.body.sectionIndex) project.sectionIndex = parseInt(req.body.sectionIndex);
        if (req.file) project.imageUrl = req.file.path;

        await settings.save();
        res.json({ success: true, project });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/projects/:id', async (req, res) => {
    try {
        const settings = await getSettingsDoc();
        settings.gamesPage.projects = settings.gamesPage.projects.filter(p => p.id !== req.params.id);
        await settings.save();
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});


// --- CRUD: ASSET PROJECTS ---

app.post('/api/assets', upload.single('image'), async (req, res) => {
    try {
        const settings = await getSettingsDoc();
        const newProject = {
            id: Date.now().toString(),
            title: req.body.title,
            description: req.body.description,
            sectionIndex: parseInt(req.body.sectionIndex),
            imageUrl: req.file ? req.file.path : ''
        };
        settings.assetsPage.projects.push(newProject);
        await settings.save();
        res.json({ success: true, project: newProject });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/assets/:id', upload.single('image'), async (req, res) => {
    try {
        const settings = await getSettingsDoc();
        const project = settings.assetsPage.projects.find(p => p.id === req.params.id);
        if (!project) return res.status(404).json({ error: 'Asset not found' });

        if (req.body.title) project.title = req.body.title;
        if (req.body.description) project.description = req.body.description;
        if (req.body.sectionIndex) project.sectionIndex = parseInt(req.body.sectionIndex);
        if (req.file) project.imageUrl = req.file.path;

        await settings.save();
        res.json({ success: true, project });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/assets/:id', async (req, res) => {
    try {
        const settings = await getSettingsDoc();
        settings.assetsPage.projects = settings.assetsPage.projects.filter(p => p.id !== req.params.id);
        await settings.save();
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});


// --- AUTH ---
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    // Updated simple auth for User
    if (username === 'admin' && (password === 'admin123' || password === 'BandwidthBus1')) {
        res.json({ success: true, token: 'cloud-admin-token' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});


app.listen(PORT, () => {
    console.log(`Cloud Server running on http://localhost:${PORT}`);
});
