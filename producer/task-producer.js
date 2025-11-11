const amqp = require('amqplib');

async function sendTasks() {
  const connection = await amqp.connect('amqp://admin:admin123@localhost:5672');
  const channel = await connection.createChannel();
  
  const queue = 'tasks';
  await channel.assertQueue(queue, { durable: true });
  
  for (let i = 1; i <= 10; i++) {
    const task = { taskId: i, data: `Task ${i}` };
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(task)), {
      persistent: true
    });
    console.log(`[Producer] Sent task ${i}`);
  }
  
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}

sendTasks().catch((error) => {
  console.error(error);
});