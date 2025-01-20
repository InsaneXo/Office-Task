import mongoose, { Document, Schema } from "mongoose";

// Define the Token interface, which extends mongoose's Document
export interface Token extends Document {
    token: string;
    issuesAt: Date;
    expiresAt: Date;
}

// Define the UserToken schema
const adminBlackListTokenSchema: Schema = new mongoose.Schema<Token>({
    token: {
        type: String,
        required: true
    },
    issuesAt: {
        type: Date,
        required: true
    },
    expiresAt: {
        type: Date,
        default: Date.now,
        required: true
    }
});

// Create the model from the schema
const AdminBlackListTokenModel = mongoose.model<Token>("BlackListAdminToken", adminBlackListTokenSchema);

export default AdminBlackListTokenModel;
