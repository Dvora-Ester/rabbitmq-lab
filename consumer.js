const amqp = require('amqplib');

async function receive() {
  const conn = await amqp.connect('amqp://admin:admin123@localhost:5672');
  const ch = await conn.createChannel();
  const q = 'hello';
  
  await ch.assertQueue(q);
  console.log('Waiting for messages...');
  
  ch.consume(q, (msg) => {
    console.log('Received:', msg.content.toString());
  }, { noAck: true });
}

receive();