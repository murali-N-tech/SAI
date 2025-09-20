// in backend/src/config/dotenv.config.js
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
    path: path.resolve(process.cwd(), '.env')
});