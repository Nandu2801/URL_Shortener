const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/urlShortener', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Set up the view engine and middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

// Define routes
app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find();
    res.render('index', { shortUrls: shortUrls });
});

app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl });
    res.redirect('/');
});

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
    if (shortUrl == null) return res.sendStatus(404);

    shortUrl.clicks++;
    shortUrl.save();

    res.redirect(shortUrl.full);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
