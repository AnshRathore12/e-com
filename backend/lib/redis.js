import { Redis } from '@upstash/redis';
import dotenv from "dotenv";

 dotenv.config()
 export const redis = new Redis({
  url: process.env.UPSTASH_URI,
  token: process.env.UPSTASH_TOKEN
})


