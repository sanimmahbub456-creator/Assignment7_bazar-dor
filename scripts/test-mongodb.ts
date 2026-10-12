import { loadEnvConfig } from "@next/env";
import { MongoClient } from "mongodb";
loadEnvConfig(process.cwd());
async function testMongoDB() {
  const uri = process.env.BETTER_AUTH_DB_URL;

  if (!uri) {
    console.error(
      "ERROR: BETTER_AUTH_DB_URL is missing."
    );
    return;
  }

  const client = new MongoClient(uri);

  try {
    console.log("Testing MongoDB connection...");

    await client.connect();
    console.log("MongoDB connected!");

    await client.db().command({ ping: 1 });
    console.log("MongoDB ping successful!");

    console.log(
      "Database:",
      client.db().databaseName
    );
  } catch (error) {
    console.error("MongoDB connection failed:");

    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
    } else {
      console.error(error);
    }
  } finally {
    await client.close().catch(() => {});
  }
}

testMongoDB().catch((error: unknown) => {
  console.error("Unexpected test error:", error);
});