const amqp = require('amqplib');

async function setupDLQ() {
  const connection = await amqp.connect('amqp://admin:admin123@localhost:5672');
  const channel = await connection.createChannel();
  
  const dlq = 'failed_tasks';
  const mainQueue = 'tasks_with_dlq';
  
  await channel.assertQueue(dlq, { durable: true });
  await channel.assertQueue(mainQueue, {
    durable: true,
    arguments: {
      'x-dead-letter-exchange': '',
      'x-dead-letter-routing-key': dlq
    }
  });
  
  console.log('[Consumer] Waiting for tasks...');
  
  channel.consume(mainQueue, (msg) => {
    const task = JSON.parse(msg.content.toString());
    console.log(`[Consumer] Processing task ${task.taskId}`);
    
    if (task.taskId % 3 === 0) {
      console.log(`[Consumer] Task ${task.taskId} failed! Rejecting...`);
      channel.nack(msg, false, false);
    } else {
      console.log(`[Consumer] Task ${task.taskId} succeeded`);
      channel.ack(msg);
    }
  });
}

setupDLQ().catch((error) => {
  console.error(error);
});