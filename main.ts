import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "npm:@apollo/server/standalone";
import { MongoClient } from "mongodb";
import { FlightModel } from "./types.ts";
import { schema } from "./schema.ts";
import { resolvers } from "./resolvers.ts";

const MONGO_URL = Deno.env.get("MONGO_URL");

if (!MONGO_URL) {
  throw new Error("Mongo URL not found");
}

const Client = new MongoClient(MONGO_URL);
await Client.connect();

const DB = Client.db("ActividadDirigida");
const FlightsCollection = DB.collection<FlightModel>("vuelos");

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  context: async () => ({ FlightsCollection }),
});

console.info(`Server ready at ${url}`);

