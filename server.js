import fastify from 'fastify';
import fastifyCors from 'fastify/cors';

const server = fastify();

server.register(fastifyCors, {
  origin: 'https://secret-chat-project.onrender.com',
  methods: 'GET,POST',
  optionsSuccessStatus: 204,
});

server.listen(5001, (err, address) => {
  if (err) throw err;
  console.log(`Server listening on ${address}`);
});

export default server;