import { Schema, model } from 'mongoose';
import { IManifestItem } from '@/models/types';

const manifestItemSchema = new Schema<IManifestItem>({
    location: {
        type: String,
        required: true,
    },
    item: {
        type: String,
        required: true,
    },
    hash: {
        type: String,
        required: true,
        index: true,
        unique: true,
    }
});
manifestItemSchema.index({ item: 'text' });

const ManifestItem = model<IManifestItem>('ManifestItem', manifestItemSchema);

export default ManifestItem