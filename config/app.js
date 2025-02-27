'use strict'

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import { createAdminDefault } from '../src/admin/admin.controller.js';
import { limiter } from '../middlewares/rate.limit.js';
import adminRouther from '../src/admin/admin.router.js'
import companyRouter from '../src/company/company.router.js';

const config = (app)=>{
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter)
}

const routes = (app)=>{
    app.use('/v1/admin', adminRouther)
    app.use('/v1/company', companyRouter)
}

export const initServer = ()=>{
    const app = express();
    try {
        config(app);
        routes(app);
        createAdminDefault()
        app.listen(process.env.PORT)
        console.log(`Servidor iniciado en el puerto ${process.env.PORT}`)
    } catch (error) {
        console.error('Server init failed', error);
    }
}