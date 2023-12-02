import { GarageManifestConfig } from "@/config/types";

export default {
    cors: {
        origin: ['http://razzie1.gochin.home', 'http://garage.gochin.home']
    },
    mongo: {
        url: 'mongodb://127.0.0.1:27017/garageManifest'
    }
} as GarageManifestConfig