// Prometheus setup - add at the top with other requires
const prometheus = require('prom-client');
const collectDefaultMetrics = prometheus.collectDefaultMetrics;
const Registry = prometheus.Registry;
const register = new Registry();
collectDefaultMetrics({ register });
// It must be placed above all other 'require' statements
var atatus = require("atatus-nodejs");
atatus.start({
    licenseKey: "lic_apm_1c54876b5704409aa3eb76b79a6cd5ab",
    appName: "checkout-service",
    notifyHost: '10.40.31.24',
    notifyPort: '8091',
    analytics: true,
    logBody: 'all',
    analyticsCaptureOutgoing: true,
    useSSL: false,
    // logLevel: 'debug',
});


const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('./models/db');
const app = express();

// Add this new endpoint for Prometheus metrics
app.get('/metrics', async (req, res) => {
    try {
        res.set('Content-Type', register.contentType);
        const metrics = await register.metrics();
        res.send(metrics);
    } catch (err) {
        res.status(500).send(err);
    }
});

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('cors')());
app.use(require('helmet')());
app.use('/api/students', require('./routes/students'));

// Health check endpoint that returns a status message
app.get('/health', (req, res) => {
  res.send('NodeJS service responded');
});

// Production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendfile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, () => console.log(`App running on port ${PORT}`)  );
