import { GarageManifestConfig } from '@/config/types'
import dotenv from 'dotenv'

dotenv.config()

export default function (environment: string = process.env.NODE_ENV): GarageManifestConfig {
    const config = require(`./${environment}`).default

    global.config = config

    return config
}