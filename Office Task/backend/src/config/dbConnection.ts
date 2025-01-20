import mongoose from "mongoose";

const connectionDB = async (): Promise<void> => {
    const dataBaseConnection = await mongoose.connect(process.env.MONGO_DB_URL as string)
    if (dataBaseConnection) {
        console.log("Mongo DB Connected Successfully")
    }
    else {
        console.log("Mongo DB is not Connected")
    }
}

export default connectionDB