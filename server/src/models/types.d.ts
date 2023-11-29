import { Document } from "mongoose"

export interface IManifestItem extends Document {
    _id?: string
    location: string
    item: string
    hash: string
}

export interface ILocation extends Document {
    location: string
    imageFileName: string
    contentType: String,
    contentLength: Number
}

export interface MulterRequest extends Request {
    file: {
        buffer: Buffer;
        mimetype: string;
    };
}

export interface IUser {
    _id?: string,
    userId?: string;
    sub: string;
    name: string;
    given_name?: string;
    family_name?: string;
    nickname?: string;
    email: string;
    email_verified: boolean;
}