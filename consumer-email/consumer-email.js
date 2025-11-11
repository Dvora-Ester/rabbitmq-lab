const amqp = require('amqplib');

async function emailService() {
  const connection = await amqp.connect('amqp://admin:admin123@localhost:5672');
  const channel = await connection.createChannel();
  
  const exchange = 'user_events';
  await channel.assertExchange(exchange, 'fanout', { durable: false });
  
  const q = await channel.assertQueue('', { exclusive: true });
  channel.bindQueue(q.queue, exchange, '');
  
  console.log('[Email Service] Waiting for user registrations...');
  
  channel.consume(q.queue, (msg) => {
    const user = JSON.parse(msg.content.toString());
    console.log(`[Email Service] Sending welcome email to ${user.email}`);
  }, { noAck: true });
}

emailService().catch((error) => {
  console.error(error);
});