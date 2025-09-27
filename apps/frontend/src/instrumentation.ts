export async function register() {
  if (process.env.USE_LOGGER !== 'true') {
    return;
  }

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      // Use require for CommonJS modules
      require('pino');
      console.log('Pino imported successfully');

      require('next-logger');
      console.log('next-logger imported successfully');
    } catch (error) {
      console.error('Error initializing logger:', error);
    }
  }
}
