import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import { Test } from './src/models/test.model.js';
import tests from './src/data/tests.js';

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

const importData = async () => {
    try {
        // Clear existing tests to avoid duplicates
        await Test.deleteMany();

        // Insert the new test data
        await Test.insertMany(tests);

        console.log('✅ Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error importing data: ${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Test.deleteMany();
        console.log('🗑️ Data Destroyed Successfully!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error destroying data: ${error}`);
        process.exit(1);
    }
};

// Check for command-line arguments to run the correct function
if (process.argv[2] === '-d') {
    destroyData();
} else if (process.argv[2] === '-i') {
    importData();
}