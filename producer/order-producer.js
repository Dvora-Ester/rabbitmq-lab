const amqp = require('amqplib');

async function sendOrder() {
  const connection = await amqp.connect('amqp://admin:admin123@localhost:5672');
  const channel = await connection.createChannel();
  
  const queue = 'orders';
  await channel.assertQueue(queue, { durable: false });
  
  const order = {
    orderId: Math.floor(Math.random() * 10000),
    product: 'Laptop',
    quantity: 1,
    timestamp: new Date()
  };
  
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(order)));
  console.log(`[Producer] Sent order: ${JSON.stringify(order)}`);
  
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}

sendOrder().catch((error) => {
  console.error(error);
});