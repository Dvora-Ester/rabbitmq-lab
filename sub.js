const amqp = require('amqplib');

// Publisher
async function publisher() {
  const conn = await amqp.connect('amqp://admin:admin123@localhost:5672');
  const ch = await conn.createChannel();
  const ex = 'logs';
  
  await ch.assertExchange(ex, 'fanout', { durable: false });
  
  setInterval(() => {
    const msg = `Log message at ${new Date().toISOString()}`;
    ch.publish(ex, '', Buffer.from(msg));
    console.log('[Publisher] Sent:', msg);
  }, 2000);
}

// Subscriber
async function subscriber(name) {
  const conn = await amqp.connect('amqp://admin:admin123@localhost:5672');
  const ch = await conn.createChannel();
  const ex = 'logs';
  
  await ch.assertExchange(ex, 'fanout', { durable: false });
  const q = await ch.assertQueue('', { exclusive: true });
  ch.bindQueue(q.queue, ex, '');
  
  console.log(`[${name}] Waiting for logs...`);
  
  ch.consume(q.queue, (msg) => {
    console.log(`[${name}] Received:`, msg.content.toString());
  }, { noAck: true });
}

// Run
publisher();
subscriber('Service-1');
subscriber('Service-2');
subscriber('Service-3');