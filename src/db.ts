import {Sequelize} from 'sequelize-typescript';
import dotenv from "dotenv";
import {Color, Type} from './models/models';

dotenv.config();

export const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    dialect: 'postgres',
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    logging: false,
    models: [Color, Type],
    // storage: ':memory:',
    // models: [__dirname + '/models'], // or [Player, Team],
});

