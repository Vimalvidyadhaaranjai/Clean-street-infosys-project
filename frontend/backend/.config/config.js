import dotenv from "dotenv";
import path from "path";

import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const config = {
  MONGO_URL: process.env.MONGO_URL || process.env.MongoDBURL || null,
  PORT: process.env.PORT || 3002,
  JWT_USER_SECRET: process.env.JWT_USER_SECRET || process.env.JWT_SECRET || null,
  JWT_ADMIN_SECRET: process.env.JWT_ADMIN_SECRET || process.env.JWT_SECRET || null,
  NODE_ENV : process.env.NODE_ENV || 'development'
};

export default config;