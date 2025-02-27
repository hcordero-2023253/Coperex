import { Router } from "express";
import {login} from './admin.controller.js';

const api = Router();

api.post('/login', login);

export default api;