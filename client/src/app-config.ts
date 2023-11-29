import { ENVIRONMENT } from "./constants"
import { AppConfig, Environments } from "./types"

const environments: Environments = {
    production: {
        apiRoot: 'https://recipes.gochin.com'
    },
    development: {
        apiRoot: 'http://localhost:3000'
    }
}

const getAppConfig = (environment: string = ENVIRONMENT.PROD): AppConfig => {
    return environments[environment]
}

export default getAppConfig
