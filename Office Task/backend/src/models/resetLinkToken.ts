import mongoose, { Document, Schema } from "mongoose";

export interface Token extends Document {
    token: string,
    email: string,
    issueAt: Date,
    expireAt: Date
    reloadCount: number
}



const resetLinkTokenSchema: Schema = new mongoose.Schema<Token>({
    token: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    issueAt: {
        type: Date,
        default: Date.now
    },
    expireAt: {
        type: Date,
        default: () => new Date(Date.now() + 120 * 1000)
    },
    reloadCount: {
        type: Number,
        default: 1
    }
})

resetLinkTokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 })

const ResetLinkTokenModel = mongoose.model<Token>("ResetToken", resetLinkTokenSchema)

export default ResetLinkTokenModel