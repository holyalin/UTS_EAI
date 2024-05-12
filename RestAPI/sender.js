const express = require('express');
const axios = require('axios');
const app = express();
const port = 803;

// Middleware to parse JSON bodies
app.use(express.json());

// Function to send data to receivers
function sendData() {
  const data = { message: 'Hello, this is a periodic message' };
  const timestamp = new Date().toISOString().replace('Z', `.${new Date().getMilliseconds()}Z`); // Get current timestamp with milliseconds
  const payload = { ...data, timestamp }; // Add timestamp to data

  const services = [
    'http://localhost:8040/receive-data',
    'http://localhost:8050/receive-data'
  ];

  services.forEach(service => {
    const sendTime = Date.now(); // Record send time in milliseconds
    axios.post(service, payload)
      .then(response => {
        const receiveTime = Date.now(); // Record receive time when response is received
        const latency = receiveTime - sendTime;
        console.log(`Data sent to ${service} with status ${response.status}. Latency: ${latency}ms`);
      })
      .catch(error => {
        // Improved error logging
        if (error.response) {
          console.error(`Error sending data to ${service}:`, error.response.status, error.response.data);
        } else {
          console.error(`Error sending data to ${service}:`, error.message);
        }
      });
  });
}

// Start sending data periodically
setInterval(sendData, 1000); // Send data every 1 seconds

// Endpoint to manually trigger data send
app.post('/send-data', (req, res) => {
  sendData(); // Call sendData function
  res.send('Data sent to all services successfully');
});

// Start the server
app.listen(port, () => {
  console.log(`Sender listening on port ${port}`);
});
