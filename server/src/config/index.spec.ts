import { GarageManifestConfig } from "./types"
import useConfig from './index'

describe('Testing config', () => {
    test('test config using NODE_ENV', () => {
        const config: GarageManifestConfig = useConfig()

        expect(config)
    })

    test('test config using NODE_ENV set to "development"', () => {
        const config: GarageManifestConfig = useConfig('development')

        expect(config)
    })

    test('test config using NODE_ENV set to "production"', () => {
        const config: GarageManifestConfig = useConfig('production')

        expect(config)

    })
})