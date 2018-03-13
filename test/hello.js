const express = require('express');

const app = express();

// Define request response in root URL (/)
app.get('/', (req, res) => {
  res.send('Hello');
});

// Launch listening server on port 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT);
