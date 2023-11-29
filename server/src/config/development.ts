import { GarageManifestConfig } from "@/config/types";
 
export default {
    cors: {
        origin: ['http://localhost:3000', 'http://192.168.1.139:3000', 'http://garage.home:3000'] 
    },
    mongo: {
        url: process.env.MONGO_URL
    },
} as GarageManifestConfig