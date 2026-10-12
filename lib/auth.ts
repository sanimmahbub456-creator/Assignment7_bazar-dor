
import { MongoClient } from "mongodb";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const mongoUri = process.env.BETTER_AUTH_DB_URL;

if (!mongoUri) {
  throw new Error("BETTER_AUTH_DB_URL is missing");
}

const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient;
  mongoClientPromise?: Promise<MongoClient>;
};

const client =
  globalForMongo.mongoClient ?? new MongoClient(mongoUri);

const clientPromise =
  globalForMongo.mongoClientPromise ?? client.connect();

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = client;
  globalForMongo.mongoClientPromise = clientPromise;
}

const databaseName = new URL(mongoUri).pathname
  .split("/")
  .filter(Boolean)[0];

if (!databaseName) {
  throw new Error("Database name is missing from BETTER_AUTH_DB_URL");
}

const database = client.db(databaseName);

export async function connectMongo(): Promise<void> {
  await clientPromise;
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  secret: process.env.BETTER_AUTH_SECRET,

  database: mongodbAdapter(database, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },

     github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },

 account: {
  accountLinking: {
    enabled: true,
    trustedProviders: ["google"],
    requireLocalEmailVerified: false,
  },
},
});
