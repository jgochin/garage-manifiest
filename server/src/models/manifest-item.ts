import { Schema, model } from 'mongoose';
import { IManifestItem } from '@/models/types';

const manifestItemSchema = new Schema<IManifestItem>({
    locationId: {
        type: String,
        required: true,
    },
    item: {
        type: String,
        required: true,
    }
});
manifestItemSchema.index({ item: 'text'});
manifestItemSchema.index({ locationId: 1 });

const ManifestItem = model<IManifestItem>('ManifestItem', manifestItemSchema);

export default ManifestItem