const prometheus = require('prom-client');
const collectDefaultMetrics = prometheus.collectDefaultMetrics;
const Registry = prometheus.Registry;
const register = new Registry();
collectDefaultMetrics({ register });

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('./models/db');
const app = express();

// Define custom metrics
const requestCounter = new prometheus.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'status_code'],
});

const httpRequestDurationSeconds = new prometheus.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Histogram of HTTP request durations in seconds',
    buckets: [0.1, 0.3, 1.5, 5, 10],
});

const activeUsersGauge = new prometheus.Gauge({
    name: 'active_users',
    help: 'Current number of active users',
});

// Middleware to track HTTP requests and their durations
app.use((req, res, next) => {
    const end = httpRequestDurationSeconds.startTimer();
    res.on('finish', () => {
        requestCounter.inc({
            method: req.method,
            status_code: res.statusCode,
        });
        end();
    });
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.send('NodeJS service responded');
});

// Metrics endpoint
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

// Production setup
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendfile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
app.listen(PORT, '0.0.0.0', () => {
  console.log(`App running on port ${PORT}`);
});

// app.listen(PORT, () => console.log(`App running on port ${PORT}`));
