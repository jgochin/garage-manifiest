import mongoose from "mongoose"

export const objectSortAscPredicate = (propName: string, a: any, b: any): number => {
    if(a[propName] > b[propName]) return 1
    if (a[propName] < b[propName]) return -1

    return 0
}

export const createObjectId = (id: string | mongoose.mongo.BSON.ObjectId): mongoose.mongo.BSON.ObjectId => {
    if (id instanceof mongoose.mongo.BSON.ObjectId) return id
    
    return mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : undefined
}