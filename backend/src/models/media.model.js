const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the structure of a media document
const mediaSchema = new Schema({
    fileName: {
        type: String,
        required: true,
        trim: true // Removes whitespace from both ends
    },
    filePath: {
        type: String,
        required: true,
        unique: true // Ensures no two files have the same path
    },
    fileType: {
        type: String,
        required: true,
        enum: ['image/jpeg', 'image/png', 'video/mp4', 'application/pdf'] // Restricts to specific MIME types
    },
    size: {
        type: Number, // Size in bytes
        required: true
    },
    altText: {
        type: String,
        default: 'Media file' // Default value for accessibility
    },
    uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Creates a reference to the User model
        required: true
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create the Media model from the schema
const Media = mongoose.model('Media', mediaSchema);

// Export the model so it can be used elsewhere in the application
module.exports = Media;