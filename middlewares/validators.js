import { body } from 'express-validator';
import { validateErrors, validateErrorsFiles} from './validate.errors.js'

//Company validation
export const companyValidator = [
    body('name', 'Name cannot be empty').notEmpty(),
    body('impact', 'Impact cannot be empty').notEmpty().toUpperCase(),
    body('level', 'Description cannot be empty').notEmpty().toUpperCase(),
    body('category', 'Category cannot be empty').notEmpty(),
    validateErrors
]