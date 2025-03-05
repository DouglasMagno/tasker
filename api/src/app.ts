/// <reference path="./@types/express/index.d.ts" />
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import taskRoutes from './routes';
import redisConnection from "./redis/redis";


const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
    req.redis = redisConnection;
    next();
});

app.use('/api', taskRoutes);

export default app;
