const amqp = require('amqplib');

async function sendPersistentMessage() {
  const connection = await amqp.connect('amqp://admin:admin123@localhost:5672');
  const channel = await connection.createChannel();
  
  const queue = 'persistent_queue';
  await channel.assertQueue(queue, { durable: true });
  
  const message = {
    id: 1,
    data: 'Important message',
    timestamp: new Date()
  };
  
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
    persistent: true
  });
  
  console.log('[Producer] Sent persistent message');
  console.log('Try restarting RabbitMQ - message will survive!');
  
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}

sendPersistentMessage().catch((error) => {
  console.error(error);
});