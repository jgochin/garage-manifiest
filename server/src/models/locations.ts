import { Schema, model } from 'mongoose';
import { ILocation } from '@/models/types';

const locationSchema = new Schema<ILocation>({
    location: {
        type: String,
        required: true, 
        index: true,
        unique: true
    },
    imageFileName: {
        type: String,
    },
    contentType: {
        type: String,
    },
    contentLength: {
        type: Number,
    },
});

const Location = model<ILocation>('Location', locationSchema);

export default Location