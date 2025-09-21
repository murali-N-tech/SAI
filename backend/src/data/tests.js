import mongoose from 'mongoose';

const tests = [
    {
        _id: new mongoose.Types.ObjectId('60d0fe4f5311236168a109ca'),
        name: 'Vertical Jump',
        description: 'Test your explosive leg power.'
    },
    {
        _id: new mongoose.Types.ObjectId('60d0fe4f5311236168a109cb'),
        name: 'Sit-ups',
        description: 'Measure your core muscular endurance.'
    },
    {
        _id: new mongoose.Types.ObjectId('60d0fe4f5311236168a109cc'),
        name: 'Endurance Run',
        description: 'A proxy test for cardiovascular fitness.'
    },
    {
        _id: new mongoose.Types.ObjectId('60d0fe4f5311236168a109cd'),
        name: 'Shuttle Run',
        description: 'Test your agility and speed.'
    }
];

export default tests;