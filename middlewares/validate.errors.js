import { validationResult } from "express-validator";

export const validateErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(errors)
    }
    next()
}

export const validateErrorsFiles = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({
            success: false,
            message: 'Error in file upload',
            errors: errors.errors,
        })
    }
}