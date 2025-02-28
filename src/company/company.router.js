import { Router } from "express";
import { register,
         viewCompany,
         generateExcel,
         viewCompanyById,
         updateCompany} from '../company/company.controller.js'
import { validateJwt, isAdmin } from "../../middlewares/validate.jwt.js";
import { companyValidator } from '../../middlewares/validators.js';

const company = Router();

company.get('/viewCompany', validateJwt, isAdmin, viewCompany);
company.get('/viewCompany/:id', validateJwt, isAdmin, viewCompanyById);
company.get('/exceljs', validateJwt, isAdmin, generateExcel);
company.post('/addCompany', companyValidator, validateJwt, isAdmin, register);
company.put('/updateCompany/:id', companyValidator, validateJwt, isAdmin, updateCompany);

export default company;