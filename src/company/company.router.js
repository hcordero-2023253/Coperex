import { Router } from "express";
import { register,
         viewCompany} from '../company/company.controller.js'
import { validateJwt, isAdmin } from "../../middlewares/validate.jwt.js";
import { companyValidator } from '../../middlewares/validators.js';

const company = Router();

company.post('/addCompany', companyValidator, validateJwt, isAdmin, register);
company.get('/viewCompany', validateJwt, viewCompany);

export default company;