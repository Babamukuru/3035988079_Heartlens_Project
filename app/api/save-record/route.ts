// app/api/save-record/route.ts
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;
if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable in .env.local'
  );
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalWithMongoose = global as typeof global & {
  mongoose?: MongooseCache;
};

// Cache to reuse an existing connection
let cached = globalWithMongoose.mongoose;
if (!cached) {
  cached = globalWithMongoose.mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<typeof mongoose>  {
  if (!cached) throw new Error('Mongoose cache not initialized'); // This should never happen
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = { bufferCommands: false };
    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Define the schema with an extra field for ppgData
const RecordSchema = new mongoose.Schema({
  heartRate: {
    bpm: { type: Number, required: true },
    confidence: { type: Number, required: true },
  },
  hrv: {
    sdnn: { type: Number, required: true },
    confidence: { type: Number, required: true },
  },
  ppgData: { type: [Number], required: true },
  timestamp: { type: Date, default: Date.now },
});

// Use an existing model if available or compile a new one
const Record = mongoose.models.Record || mongoose.model('Record', RecordSchema);

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Create a new record including the entire ppgData array
    const newRecord = await Record.create({
      heartRate: body.heartRate,
      hrv: body.hrv,
      ppgData: body.ppgData, // The whole ppgData array is posted here
      timestamp: body.timestamp || new Date(),
    });

    return NextResponse.json(
      { success: true, data: newRecord },
      { status: 201 }
    );
  } catch (error: unknown) {
    let errorMessage: string;

    if (error instanceof Error) {
      errorMessage = error.message;  // Safe, since we checked type
    } else if (typeof error === "string") {
      errorMessage = error;          // Handle thrown strings
    } else {
      errorMessage = "Unknown error occurred";
    }
  
    return NextResponse.json(
      { success: false, error: errorMessage},
      { status: 400 }
    );
  }
}
