import 'dotenv/config'
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { manageRouter, searchRouter, locationRouter, itemRouter } from '@/routes';
import mongoose, { ConnectOptions } from 'mongoose';
import configureAppSecurity from "@/app-security"
import useConfig from '@/config'
import morgan from 'morgan'
import path from 'path'

const config = useConfig()

function requireXGarageAppHeader(req: Request, res, next) {
    const customHeader = req.headers['x-garage-app'];

    // Check if the custom header is missing
    if (!req.url.startsWith('/location/image')) {
        // Redirect or handle the request accordingly
        return res.redirect('/'); // Redirect to the root route
        // Alternatively, you can handle the request without redirecting
        // res.status(403).send('Custom header is missing'); 
    }

    // Custom header is present, proceed to the next middleware or route
    next();
}

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

    app.use((req, res, next) => {
        res.setHeader('Cache-Control', 'no-store');
        next();
    });
    
    app.get('/heartbeat', (req: Request, res: Response): any => {
        res.status(200).send('OK').end()
    });

    app.use(express.static(path.join(__dirname, 'public')));

    // app.use(requireXGarageAppHeader);

    app.use('/api/items', manageRouter);
    app.use('/api/location', locationRouter);
    app.use('/api/search', searchRouter);
    app.use('/api/item', itemRouter);
    
    app.get('/', (req: Request, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    const port: number = Number(process.env.PORT || 3001) 
    const server = app.listen(port, '0.0.0.0', () => {
        console.log('Server is running on port', port);
    });

    process.addListener('exit', async (info) => {
        console.log(info)

        server.closeIdleConnections()

        await mongoose.disconnect()
        await server.close()

        console.log('Server closed')
    })

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
