import dns from "node:dns";
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

// Fix MongoDB SRV DNS lookup
dns.setServers(["1.1.1.1"]);

const mongoUri = process.env.BETTER_AUTH_DB_URL;

if (!mongoUri) {
  throw new Error("BETTER_AUTH_DB_URL is missing");
}

const client = new MongoClient(mongoUri, {
  serverSelectionTimeoutMS: 15000,
});

const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
});