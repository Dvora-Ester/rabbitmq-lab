const amqp = require('amqplib');

async function receiveOrders() {
  const connection = await amqp.connect('amqp://admin:admin123@localhost:5672');
  const channel = await connection.createChannel();
  
  const queue = 'orders';
  await channel.assertQueue(queue, { durable: false });
  
  console.log('[Email Service] Waiting for orders...');
  
  channel.consume(queue, (msg) => {
    const order = JSON.parse(msg.content.toString());
    console.log(`[Email Service] Received order: ${JSON.stringify(order)}`);
    console.log(`[Email Service] Sending email for order #${order.orderId}...`);
    console.log(`[Email Service] Email sent successfully!`);
    channel.ack(msg);
  });
}

receiveOrders().catch((error) => {
  console.error(error);
});