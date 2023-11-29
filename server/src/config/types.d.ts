import { CorsOptions } from "cors"

export interface GarageManifestConfig {
    cors: CorsOptions
    mongo: {
        url: string
    }
}