
import session from 'express-session';
import { GetVerificationKey, expressjwt as jwt } from "express-jwt";
import cors from 'cors';
import jwksRsa from 'jwks-rsa';

function configureSession(app) {
    const MongoDBStore = require('connect-mongodb-session')(session);

    // Configure the MongoDBStore to manage sessions
    const store = new MongoDBStore({
        uri: process.env.MONGO_URL, // Replace with your MongoDB connection string
        collection: 'sessions', // The collection to store sessions
    });

    // Set up express-session middleware
    app.use(
        session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            store: store, // Use the MongoDBStore for session storage
            cookie: {
                maxAge: 1000 * 60 * 60 * 24, // Session expiration time (e.g., 1 day)
            },
        })
    );

}

export default function (app) {    
    app.use(cors(global.config.cors))

    configureSession(app)

    // const jwtMiddleware = jwt({
    //     secret: jwksRsa.expressJwtSecret({
    //         cache: true,
    //         rateLimit: true,
    //         jwksRequestsPerMinute: 5,
    //         jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`, // Replace with the JWKS endpoint URL for your issuer
    //     }) as GetVerificationKey,
    //     algorithms: ['RS256'],
    // });

    // app.use(jwtMiddleware)


    // if (process.env.NODE_ENV === "production") {
    //     // Serve secure cookies, requires HTTPS
    //     session.cookie.secure = true;
    // }


    // app.use(passport.initialize());
    // app.use(passport.session());

    // Define Passport serialization and deserialization functions
    // passport.serializeUser((user: any, done) => {
    //     console.log(user)
    //     done(null, user);
    // });

    // passport.deserializeUser((user: any, done) => {
    //     // Retrieve user from the database based on the serialized user object
    //     done(null, user);
    // });
}

