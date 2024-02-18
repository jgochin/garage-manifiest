import { createObjectId } from '@/utils'
import mongoose, { ObjectId } from 'mongoose'
import { Readable } from 'stream'
import streamToBuffer from 'stream-to-buffer'

const saveImage = async (file: any): Promise<mongoose.mongo.BSON.ObjectId> => {
    const conn = mongoose.connection
    const bucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'locationImages' })

    // Use Promises and async/await for better readability
    return new Promise((resolve, reject) => {
        const uploadStream = bucket.openUploadStream(file.originalname)
        const readableStream = new Readable()

        readableStream.push(file.buffer)
        readableStream.push(null)

        readableStream.pipe(uploadStream)

        uploadStream.on('finish', async (info) => {
            resolve(uploadStream.id)
        })

        uploadStream.on('error', (error) => {
            reject(error)
        })
    })
}

const findImage = async (imageFileName: string) => {
    const conn = mongoose.connection
    const bucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'locationImages' })

    try {
        const cursor = await bucket.find({ filename: imageFileName })
        const matches = await cursor.toArray()

        // This is for auto-cleanup while developing file upload.
        if (matches.length > 1) {
            await matches.forEach(async (file) => await bucket.delete(file._id))

            return null
        } else {
            return matches[0] || null
        }
    } catch (error) {
        throw error
    }
}

const deleteImage = async (id: string | mongoose.mongo.BSON.ObjectId) => {
    const conn = mongoose.connection
    const bucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'locationImages' })

    try {
        return await bucket.delete(createObjectId(id))
    } catch(error) {

    }
}

const getImageStream = (imageFileName: string) => {
    const conn = mongoose.connection
    const bucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'locationImages' })
    const downloadStream: mongoose.mongo.GridFSBucketReadStream = bucket.openDownloadStreamByName(imageFileName)

    return downloadStream
}

const getImageBuffer = (fileStream: mongoose.mongo.GridFSBucketReadStream): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        streamToBuffer(fileStream, (err, buffer) => {
            if (err) {
                throw err
            }

            resolve(buffer)
        });
    })
}

export { saveImage, findImage, deleteImage, getImageStream, getImageBuffer }