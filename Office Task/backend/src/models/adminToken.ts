import mongoose, { Document, Schema } from "mongoose";

interface Token extends Document {
    token: string;
    issuesAt: Date;
    expiresAt: Date
}

const adminTokenSchema: Schema = new mongoose.Schema<Token>({
    token: {
        type: String,
        required: true
    },
    issuesAt: {
        type: Date,
        default: Date.now()
    },
    expiresAt: {
        type: Date,
        required: true
    }
})

const AdminTokenModel = mongoose.model<Token>("AdminToken", adminTokenSchema)

export default AdminTokenModel