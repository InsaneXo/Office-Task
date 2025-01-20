import mongoose, { Document, Schema } from "mongoose";

interface OTP extends Document {
    otp: string,
    email: string,
    expireAt: Date
}

const otpSchema: Schema = new mongoose.Schema<OTP>({
    otp: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    expireAt: {
        type: Date,
        default: () => new Date(Date.now() + 120 * 1000)
    },
})

// Create a TTL index on the expireAt field
otpSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const OtpModel = mongoose.model<OTP>("Otp", otpSchema)

export default OtpModel