import {Sequelize} from 'sequelize-typescript'
import dotenv from "dotenv"
import {Color, Type} from './models/models'

dotenv.config()

const optionsProduction = {
    database: process.env.DB_NAME_SER,
    username: process.env.DB_USER_SER,
    password: process.env.DB_PASSWORD_SER,
    host: process.env.DB_HOST_SER,
    // port: process.env.DB_PORT_SER,
    dialectOptions: {ssl: {require: true, rejectUnauthorized: false}}
}

const optionsDevelopment = {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST
}

const sequelizeOptions = process.env.NODE_ENV === 'production'
    ? optionsProduction
    : optionsDevelopment

export const sequelize = new Sequelize({
    dialect: 'postgres',
    logging: false,
    ...sequelizeOptions, // Spread options here
    models: [Color, Type],
    // storage: ':memory:',
    // models: [__dirname + '/models'], // or [Player, Team],
})


