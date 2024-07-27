import mongoose from "mongoose";
var isConnected = false ;


export const connectToDB = async () => {
    mongoose.set("strictQuery", true)
    
    if (!process.env.MONGODB_URL) {
        return console.log("MONGODB_URL NOT FOUND");
    }
    if (isConnected) return console.log("Already connected to DB");
    try {
        await mongoose.connect(process.env.MONGODB_URL,{
            dbName : "Threads",
        });
        isConnected = true;
    } catch (error) {
        console.log("ERROR", error);
    }
}