import {Sequelize} from 'sequelize-typescript';
import dotenv from "dotenv";
import {Color, Type} from './models/models';

dotenv.config();

function parseDatabaseUrl(url:any) {
    let pattern = /^(?:([^:\/?#\s]+):\/{2})?(?:([^@\/?#\s]+)@)?([^\/?#\s]+)?(?:\/([^?#\s]*))?(?:[?]([^#\s]+))?\S*$/;
    let matches: any =  url.match(pattern);
    let params: any = {};
    if (matches[5] != undefined) {
        matches[5].split('&').map(function(x:string){
            let a = x.split('=');
            params[a[0]]=a[1];
        });
    }

    return {
        database: 'd57np5javc2q7k',
        // protocol: matches[1],
        username: matches[2] != undefined ? matches[2].split(':')[0] : undefined,
        password: matches[2] != undefined ? matches[2].split(':')[1] : undefined,
        // hostname: matches[3],
        host: matches[3] != undefined ? matches[3].split(/:(?=\d+$)/)[0] : undefined,
        port: matches[3] != undefined ? matches[3].split(/:(?=\d+$)/)[1] : undefined,
        // segments : matches[4] != undefined ? matches[4].split('/') : undefined,
        // params: params,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    };
}


interface ParsedDatabaseOptions {
    protocol: string | undefined
    host: string | undefined
    username: string | undefined
    password: string | undefined
    database: string | undefined
}

const  optionsProduction = parseDatabaseUrl(process.env.DATABASE_URL)
const optionsDevelopment = {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST
}
console.log(optionsProduction);
// Create conditional Sequelize database options here


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
});

