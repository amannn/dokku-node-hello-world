import express from 'express';

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';

const server = express();

server.get('/', (req, res) => res.send('Hello World!'));
server.get('/bye', (req, res) => res.send('Goodbye World!'));

server.listen(PORT, HOST, () => {
  console.log(`Listening on ${HOST}:${PORT}`);
});
