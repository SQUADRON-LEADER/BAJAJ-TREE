const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const bfhlRouter = require('./route');
const { startTimer } = require('./utils/timer');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Serve the frontend (index.html) as a static file
app.use(express.static(path.join(__dirname, '..')));

app.use((req, res, next) => {
  const getElapsed = startTimer();
  const timestamp = new Date().toISOString();

  res.on('finish', () => {
    const responseTimeMs = getElapsed();
    console.log(
      `${timestamp} ${req.method} ${req.path} ${res.statusCode} Processed in ${responseTimeMs.toFixed(2)}ms`
    );
  });

  next();
});

app.get('/health', (req, res) => {
  return res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use('/', bfhlRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
