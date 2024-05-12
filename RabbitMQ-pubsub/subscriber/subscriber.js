const amqp = require('amqplib/callback_api');

// Connect to RabbitMQ server
amqp.connect('amqp://localhost', (err, connection) => {
  if (err) throw err; // Handle connection error

  // Create a channel
  connection.createChannel((err, channel) => {
    if (err) throw err; // Handle channel creation error

    const exchange = 'system_monitor_fanout'; // Unique exchange name
    channel.assertExchange(exchange, 'fanout', { durable: true }); // Ensure durable is true

    // Assert a queue and bind it to the exchange
    channel.assertQueue('', { exclusive: true }, (err, q) => { // Auto-generated queue name
      if (err) throw err; // Handle queue assertion error
      channel.bindQueue(q.queue, exchange, ''); // Bind queue to exchange with no routing key

      console.log(`[*] Waiting for system metrics in '${q.queue}'. To exit press CTRL+C`);

      // Consume messages from the queue
      channel.consume(q.queue, (msg) => {
        // Get current time including milliseconds
        const now = new Date();
        const receiveTimestamp = now.toISOString();
        const receiveTime = now.getTime(); // Get time in milliseconds

        // Parse the message
        const content = JSON.parse(msg.content.toString());
        const sendTime = content.sendTime;
        const latency = receiveTime - sendTime;

        console.log(`[x] Received at ${receiveTimestamp}: '${msg.content.toString()}'`);
        console.log(`Latency: ${latency}ms`);
      }, { noAck: true });
    });
  });
});
