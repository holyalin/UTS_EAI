const express = require('express');
const app = express();
const port = 8040; 

app.use(express.json());

app.post('/receive-data', (req, res) => {
  const data = req.body;
  const receiveTime = Date.now();
  console.log(`Receiver 1 received data: `, data, `at ${new Date(receiveTime).toISOString()}`);
  res.send('Receiver 1 received the data with timestamp');
});

app.listen(port, () => {
  console.log(`Receiver 1 listening on port ${port}`);
});
