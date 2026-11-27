import dotenv from "dotenv"
import path from "path"

dotenv.config({path: path.resolve(`./.env.${process.env.NODE_ENV}`)})

const port = process.env.PORT
const databaseURI = process.env.DATABASE_URI as string
const salt = process.env.SALT_ROUNDS as string
const mood = process.env.MOOD
const userSignature = process.env.ACCESS_SIGNATURE_USER as string
const userRefreshSignature = process.env.REFRESH_SIGNATURE_USER as string
const adminSignature = process.env.ACCESS_SIGNATURE_ADMIN as string
const adminRefreshSignature = process.env.REFRESH_SIGNATURE_ADMIN as string
const emailUser = process.env.EMAIL
const appPassword = process.env.APP_PASSWORD
const redisURI = process.env.REDIS_URI as string
const accessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN as string

export const env = {
    port,
    databaseURI,
    salt,
    mood,
    userSignature,
    userRefreshSignature,
    adminSignature,
    adminRefreshSignature,
    emailUser,
    appPassword,
    redisURI,
    accessTokenExpiresIn
}