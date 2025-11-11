const amqp = require('amqplib');

async function registerUser() {
  const connection = await amqp.connect('amqp://admin:admin123@localhost:5672');
  const channel = await connection.createChannel();
  
  const exchange = 'user_events';
  await channel.assertExchange(exchange, 'fanout', { durable: false });
  
  const user = {
    userId: Math.floor(Math.random() * 10000),
    username: 'john_doe',
    email: 'john@example.com',
    timestamp: new Date()
  };
  
  channel.publish(exchange, '', Buffer.from(JSON.stringify(user)));
  console.log(`[Producer] User registered: ${JSON.stringify(user)}`);
  
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}

registerUser().catch((error) => {
  console.error(error);
});