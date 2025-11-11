const amqp = require('amqplib');

async function send() {
  const conn = await amqp.connect('amqp://admin:admin123@localhost:5672');
  const ch = await conn.createChannel();
  const q = 'hello';
  
  await ch.assertQueue(q);
  ch.sendToQueue(q, Buffer.from('Hello World!'));
  console.log('Sent: Hello World!');
  
  setTimeout(() => { conn.close(); process.exit(0); }, 500);
}

send();