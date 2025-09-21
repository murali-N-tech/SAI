import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
    athlete: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    test: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
        required: true,
    },
    videoUrl: { type: String }, // No longer required
    status: {
        type: String,
        enum: ['pending', 'analyzing', 'completed', 'failed', 'normal_user', 'prospect_approved'], // Added new statuses
        default: 'pending',
    },
    score: { type: Number, default: 0 },
    feedback: { type: String },
}, { timestamps: true });

export const Submission = mongoose.model("Submission", submissionSchema);