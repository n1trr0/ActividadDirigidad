import { Collection, ObjectId } from "mongodb";
import { Flight, FlightModel } from "./types.ts";
import { fromModeltoFlight } from "./utils.ts";

export const resolvers = {
    Query: {
        getFlights: async (_: unknown, args:{origen: string, destino: string}, 
            context : {FlightsCollection: Collection<FlightModel>}): Promise<Flight[]> =>{
            if(args.origen && args.destino){
                const flightsDB = await context.FlightsCollection.find({origen: args.origen, destino: args.destino}).toArray();
                return flightsDB.map((u)=> fromModeltoFlight(u));
            }else if(args.origen){
                const flightsDB = await context.FlightsCollection.find({origen: args.origen}).toArray();
                return flightsDB.map((u)=> fromModeltoFlight(u));
            }else if(args.destino){
                const flightsDB = await context.FlightsCollection.find({destino: args.destino}).toArray();
                return flightsDB.map((u)=> fromModeltoFlight(u));
            }else{
                const flightsDB = await context.FlightsCollection.find().toArray();
                return flightsDB.map((u)=> fromModeltoFlight(u));
            }
        },
        getFlight: async (_: unknown,{id}: {id: string}, context : {FlightsCollection: Collection<FlightModel>}): Promise<Flight | null> =>{
            const flightsDB = await context.FlightsCollection.findOne({_id: new ObjectId(id)});
            if(!flightsDB){
                return null;
            }else{
                return fromModeltoFlight(flightsDB);
            }
        }
    },
    Mutation: {
        addFlight: async (_: unknown, args:{origen: string, destino: string, fecha: string},
            context : {FlightsCollection: Collection<FlightModel>}): Promise<Flight> =>{
                const { insertedId } = await context.FlightsCollection.insertOne({
                    origen: args.origen,
                    destino: args.destino,
                    fecha: args.fecha,
                });
                const Flight:Flight = {
                    id: insertedId.toString(),
                    origen: args.origen,
                    destino: args.destino,
                    fecha: args.fecha,
                }
                return Flight;
            }
    }
}