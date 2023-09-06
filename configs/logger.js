const development = {
  transport: {
    target: "pino-pretty",
    options: {
      translateTime: "HH:MM:ss Z",
      ignore: "pid,hostname",
    },
  },
};

export const envLogger = {
  development,
  production: true,
  dev: development,
};
