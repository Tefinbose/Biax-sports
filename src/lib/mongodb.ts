import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if(!MONGODB_URI){
    throw new Error(
        "Please define the MONGODB_URI enviornment variable in .env.local"
    );
}

type MoongooseCache = {
    conn:typeof mongoose | null ;
    promise: Promise<typeof mongoose> | null;
};

declare global {
    var MoongooseCache:MoongooseCache | undefined;
}

const cached = (globalThis.MoongooseCache ??= {
    conn: null,
    promise: null,
})

export async function connectToDatabase(){
    if(cached.conn){
        return cached.conn;
    }
    if(!cached.promise){
        cached.promise = mongoose.connect(MONGODB_URI!,{
            bufferCommands: false,
        });
    }
    try{
        cached.conn = await cached.promise;
        
    }catch(error){
        cached.promise = null;
        throw error;
    }
    return cached.conn;
}