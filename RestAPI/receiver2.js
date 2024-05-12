const express = require('express');
const app = express();
const port = 8050; 

app.use(express.json());

app.post('/receive-data', (req, res) => {
  const data = req.body;
  const receiveTime = Date.now();
  console.log(`Receiver 2 received data: `, data, `at ${new Date(receiveTime).toISOString()}`);
  res.send('Receiver 2 received the data with timestamp');
});

app.listen(port, () => {
  console.log(`Receiver 2 listening on port ${port}`);
});
