import dotenv from 'dotenv'

dotenv.config()

const MONGO_OPTIONS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    //poolSize: 50,
    autoIndex: false,
    retryWrites: false
};

const APP_PORT = Number(process.env.APP_PORT) || 8443
const APP_HOST = process.env.APP_HOST || 'localhost'
const ENDPOINT_HOST = process.env.ENDPOINT_HOST || 'localhost'
const BOT_API_TOKEN = process.env.BOT_API_TOKEN || ''
const MONGO_USERNAME = process.env.MONGO_USERNAME
const MONGO_PASSWORD = process.env.MONGO_PASSWORD
const MONGO_HOST = process.env.MONGO_HOST
const VK_HANDLER_PORT = process.env.VK_HANDLER_PORT || 8081
const VK_HANDLER_HOST = process.env.APP_HOST || '127.0.0.1'
const VK_HANDLER_PROTOCOL = process.env.VK_HANDLER_PROTOCOL || 'http'
const SECRETS = process.env.SECRETS

export const constants = {
    masterLink: 'https://t.me/worstlosing',
    masterId: 439154730,
    version: '0.3.0',
    apiKeyTestPageId: 'yandex'
}

const config = {
    APP_HOST,
    APP_PORT,
    ENDPOINT_HOST,
    BOT_API_TOKEN,
    MONGO_URL:`mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}`,
    MONGO_OPTIONS,
    VK_HANDLER_HOST,
    VK_HANDLER_PORT,
    VK_HANDLER_PROTOCOL,
    SECRETS
}

export default config