const amqp = require('amqplib/callback_api');
const os = require('os'); // Use OS module to get system metrics

// Connect to RabbitMQ server
amqp.connect('amqp://localhost', (err, connection) => {
  if (err) throw err; // Handle connection error

  // Create a channel
  connection.createChannel((err, channel) => {
    if (err) throw err; // Handle channel creation error

    const exchange = 'system_monitor_fanout'; // Unique exchange name
    channel.assertExchange(exchange, 'fanout', { durable: true }); // Ensure durable is true

    // Function to send system metrics with timestamp
    function sendMetrics() {
      const freeMemory = os.freemem();
      const totalMemory = os.totalmem();
      const cpuUsage = os.loadavg(); // Array of CPU averages

      // Get current time including milliseconds
      const now = new Date();
      const timestamp = now.toISOString();
      const sendTime = now.getTime(); // Get time in milliseconds

      // Create a message with memory and CPU usage, and sendTime
      const message = JSON.stringify({
        timestamp: timestamp,
        memoryUsage: ((totalMemory - freeMemory) / totalMemory * 100).toFixed(2),
        cpuLoad: cpuUsage[0].toFixed(2),
        sendTime: sendTime
      });

      // Publish message to the fanout exchange
      channel.publish(exchange, '', Buffer.from(message));
      console.log(`[x] Sent '${message}'`);

      setTimeout(sendMetrics, 1000); // Send metrics every 1 second
    }

    sendMetrics(); // Start sending metrics
  });
});
