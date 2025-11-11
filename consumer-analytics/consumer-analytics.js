const amqp = require('amqplib');

async function analyticsService() {
  const connection = await amqp.connect('amqp://admin:admin123@localhost:5672');
  const channel = await connection.createChannel();
  
  const exchange = 'user_events';
  await channel.assertExchange(exchange, 'fanout', { durable: false });
  
  const q = await channel.assertQueue('', { exclusive: true });
  channel.bindQueue(q.queue, exchange, '');
  
  console.log('[Analytics Service] Waiting for user registrations...');
  
  channel.consume(q.queue, (msg) => {
    const user = JSON.parse(msg.content.toString());
    console.log(`[Analytics Service] Tracking user #${user.userId}`);
  }, { noAck: true });
}

analyticsService().catch((error) => {
  console.error(error);
});