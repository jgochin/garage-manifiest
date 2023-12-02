import 'dotenv/config'
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { manageRouter, searchRouter, locationRouter } from '@/routes';
import mongoose, { ConnectOptions } from 'mongoose';
import configureAppSecurity from "@/app-security"
import useConfig from '@/config'
import morgan from 'morgan'
import path from 'path'

const config = useConfig()

async function initDb() {
    try {
        console.log('Connecting to DB', config.mongo.url)
        await mongoose.connect(config.mongo.url, {
            serverSelectionTimeoutMS: 2000
        } as ConnectOptions)

        console.log('Successfully connected to', config.mongo.url)
    } catch (err) {
        console.error('DB Connection Error:', err)
    }
}

function initApp() {
    const app = express();

    app.use(morgan('tiny'))

    // Configure App Security middleware
    configureAppSecurity(app)

    // Configure token verification middleware
    app.use(bodyParser.json()); // Parse JSON request bodies
    app.use(bodyParser.text())
    app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies

    app.get('/heartbeat', (req: Request, res: Response): any => {
        res.status(200).send('OK').end()
    });

    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/items', manageRouter);
    app.use('/location', locationRouter);
    app.use('/search', searchRouter);
    
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    const port: number = Number(process.env.PORT || 3001) 
    const server = app.listen(port, '0.0.0.0', () => {
        console.log('Server is running on port', port);
    });

    async function closeServer() {
        await server.close()
    }

    return { app, closeServer }
}

initDb()
    .then(() => {
        const { app, closeServer } = initApp()

        if (process.env.TEST) {
            module.exports = { app, closeServer }
        }
    })
