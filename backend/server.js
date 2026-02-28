require('dotenv').config();

const app = require('./src/app');
const { testConnection } = require('./src/config/database');
const { initializeSchema } = require('./src/config/init-schema');

const configuredPort = Number(process.env.PORT || 5000);

const bootstrap = async () => {
  await testConnection();
  try {
    // Preferred path when sequelize is available.
    const { syncSchema } = require('./src/sequelize-models');
    await syncSchema();
    console.log('Schema initialized');
  } catch (error) {
    // Fallback for restricted environments where sequelize cannot be installed.
    if (error && error.code === 'MODULE_NOT_FOUND') {
      await initializeSchema();
      console.log('Schema initialized');
    } else {
      throw error;
    }
  }
  app.listen(configuredPort, () => {
    console.log(`Backend running on http://localhost:${configuredPort}`);
  });
};

bootstrap().catch((error) => {
  console.error('Failed to bootstrap server:', error?.message || error);
  if (error?.stack) {
    console.error(error.stack);
  }
  process.exit(1);
});
