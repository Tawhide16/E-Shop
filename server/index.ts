import { app, ensureDatabaseConnected } from './app';
import { isDbConnected } from './db';

const PORT = process.env.PORT || 5000;

async function startServer() {
  await ensureDatabaseConnected();

  app.listen(PORT, () => {
    console.log(`🚀 E-Shop Express API Server running on port ${PORT}`);
    console.log(`📡 Health endpoint: http://localhost:${PORT}/api/health`);
    console.log(`📦 MongoDB status: ${isDbConnected() ? 'CONNECTED' : 'DISCONNECTED (Offline fallback mode)'}`);
  });
}

startServer();
