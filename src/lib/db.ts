import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
	throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface CachedConnection {
	conn: typeof mongoose | null;
	promise: Promise<typeof mongoose> | null;
}

declare global {
	// eslint-disable-next-line no-var
	var _mongoose: CachedConnection | undefined;
}

const cached: CachedConnection = global._mongoose || { conn: null, promise: null };

if (!global._mongoose) {
	global._mongoose = cached;
}

export default async function dbConnect(): Promise<typeof mongoose> {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		cached.promise = mongoose.connect(MONGODB_URI!, { bufferCommands: false }).then((m) => m);
	}

	try {
		cached.conn = await cached.promise;
	} catch (err) {
		cached.promise = null;
		throw err;
	}

	return cached.conn;
}
