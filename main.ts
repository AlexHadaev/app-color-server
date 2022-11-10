import dotenv from "dotenv";
import "reflect-metadata";
import express, {Application, Request, Response} from "express";
import {sequelize} from "./src/db";
// import cors from "cors"
import router from "./src/routes";
import errorHandler from './src/middleware/ErrorHandlingMiddleware'

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;
console.log(process.env);
// app.use(cors())
app.use(express.json());
app.use('/', router)

app.use(errorHandler)

const start = async (): Promise<void> => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, ():void => {
            console.log("Server started on port " + PORT);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

void start();