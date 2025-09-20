import mongoose from 'mongoose';

const testSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    // A demo video URL showing how to perform the test
    demoUrl: { type: String }, 
}, { timestamps: true });

export const Test = mongoose.model("Test", testSchema);