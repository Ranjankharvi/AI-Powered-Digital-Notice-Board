require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectMongo = require('./config/mongo');

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  await connectMongo();

  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`🚀 API server listening on port ${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});

