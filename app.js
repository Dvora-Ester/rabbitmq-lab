const amqp = require('amqplib');

let sentCount = 0;
let receivedCount = 0;

async function producerWithStats() {
  const conn = await amqp.connect('amqp://admin:admin123@localhost:5672');
  const ch = await conn.createChannel();
  const q = 'stats_queue';
  
  await ch.assertQueue(q);
  
  setInterval(() => {
    const msg = { id: ++sentCount, timestamp: new Date() };
    ch.sendToQueue(q, Buffer.from(JSON.stringify(msg)));
    console.log(`[Stats] Sent: ${sentCount} messages`);
  }, 1000);
}

async function consumerWithStats() {
  const conn = await amqp.connect('amqp://admin:admin123@localhost:5672');
  const ch = await conn.createChannel();
  const q = 'stats_queue';
  
  await ch.assertQueue(q);
  
  ch.consume(q, (msg) => {
    receivedCount++;
    console.log(`[Stats] Received: ${receivedCount} messages`);
  }, { noAck: true });
}

// Run both
producerWithStats();
consumerWithStats();