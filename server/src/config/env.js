import "dotenv/config";

const requiredEnvVariables = [
  "PORT",
  "CLIENT_URL",
  "MONGO_URL",
  "NODE_ENV",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
];
for (const variable of requiredEnvVariables) {
  if (!process.env[variable]) {
    throw new Error(`Missing required environment variable: ${variable}`);
  }
}

const port = Number(process.env.PORT);

if (!Number.isInteger(port) || port <= 0 || port > 65535) {
  throw new Error("PORT must be a valid number between 1 and 65535");
}

if (process.env.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters long");
}

const env = {
  port,
  clientUrl: process.env.CLIENT_URL,
  mongoUri: process.env.MONGO_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
};

export default env;