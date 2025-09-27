const pino = require('pino');

const logger = (defaultConfig) => {
  return pino({
    ...defaultConfig,
    messageKey: 'message',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss.SSS',
      },
    },
    // mixin: () => ({ name: "custom-pino-instance" }),
  });
};

module.exports = {
  logger,
};
