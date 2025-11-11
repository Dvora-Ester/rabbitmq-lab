const amqp = require('amqplib');

async function worker(workerName) {
  const connection = await amqp.connect('amqp://admin:admin123@localhost:5672');
  const channel = await connection.createChannel();
  
  const queue = 'tasks';
  await channel.assertQueue(queue, { durable: true });
  channel.prefetch(1);
  
  console.log(`[${workerName}] Waiting for tasks...`);
  
  channel.consume(queue, (msg) => {
    const task = JSON.parse(msg.content.toString());
    console.log(`[${workerName}] Processing task ${task.taskId}...`);
    
    setTimeout(() => {
      console.log(`[${workerName}] Task ${task.taskId} completed`);
      channel.ack(msg);
    }, 1000);
  });
}

const workerName = process.argv[2] || 'Worker-1';
worker(workerName).catch((error) => {
  console.error(error);
});