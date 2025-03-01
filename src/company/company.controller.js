import Client from './company.model.js';
import User from '../admin/admin.model.js'
import ExcelJS from 'exceljs';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

/*Este register solo lo puede hacer el administrador*/
export const register = async (req, res) => {
    try {
        let data = req.body

        const existingClient = await Client.findOne({ name: data.name });
        if(existingClient)return res.status(400).send({
            success: false,
            message: 'Client with this name already exists.',
        });

        let client = new Client(data)
        await client.save()
        
        return res.status(200).send({
            success: true,
            message: `Register ${client.name} successfully`
        })
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Error registering',error
        });
    }
}

/*Listamos todos los clientes utilizando los parametros year, category, sort, junto a los de paginacion
esta forma podemos obtener paginacion con la forma de filtrar los datos:

**Year para filtrar los años
**Category para filtrar por categoria
**Sort para filtrar por orden A-Z o Z-A
*/
export const viewCompany = async (req, res) => {
    const { year, category, sort, skip, limit } = req.query;
    try {
        const query = {}

        if(year){
            query.year = year
        }

        if(!year){
            return res.status(400).send({
                success: false,
                message: 'Year dont not valid',
            });
        }

        const numericYear = Number(year)
        if(isNaN(numericYear) || !Number.isInteger(numericYear)){
            return res.status(400).send({
                success: false,
                message: 'Year must be a valid integer',
            });
        }
        query.year = numericYear;

        if(category){
            query.category = category
        }

        const companiesCount = await Client.countDocuments(query);
        
        if (companiesCount === 0) {
            return res.status(404).send({
                success: false,
                message: `No companies found for year ${numericYear}`,
            });
        }

        let companies = await Client.find(query).sort(sort).skip(skip).limit(limit)

        if(sort){
            if(sort === 'A-Z'){
                companies = companies.sort((a, b) => a.name.localeCompare(b.name))
            }else if(sort === 'Z-A'){
                companies = companies.sort((a, b) => b.name.localeCompare(a.name))
            }else if(sort === 'years'){
                companies = companies.sort((a, b) => b.impact - a.impact)
            }
        }

        return res.status(200).send({
            success: true,
            message: 'Companies', companies
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Error when listing',error
        });
    }
}

export const viewCompanyById = async (req, res) => {
    const { id } = req.params;
    try {
        const company = await Client.findById(id)
        if (!company) {
            return res.status(404).send({
                success: false,
                message: 'Company not found',
            });
        }
        return res.status(200).send({
            success: true,
            message: 'Company', company
        })
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Error when listing',
            error
        });
    }
}

export const updateCompany = async (req, res) => {
    try {
        let id = req.params.id
        let data = req.body;
        let company = await Client.findByIdAndUpdate(id, data, { new: true });
        if (!company) {
            return res.status(404).send({
                success: false,
                message: 'Company not found',
            });
        }
        return res.status(200).send({
            success: true,
            message: 'Company updated',
            company
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Error when update',
            error
        });
    }
}

export const generateExcel = async (req, res) => {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    try {
        const user = await User.findById({
            _id: req.user.uid
        })
        if(!user) return res.status(403).send({
            success: false,
            message: 'You are not authorized to perform this action',
        })
        const company = await Client.find().populate({
            path: 'admin',
            select: 'name email role'
        })
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'COPEREX'
        workbook.created = new Date()
        const sheet = workbook.addWorksheet('Registered companies');

        sheet.columns = [
            { header: 'Company Name', key: 'name', width: 20 },
            { header: 'Impact', key: 'impact', width: 20 },
            { header: 'Admin', key: 'admin', width: 50 },
            { header: 'Level', key: 'level', width: 50 },
            { header: 'Years', key: 'year', width: 50 },
            { header: 'Category', key: 'category', width: 50 },
        ]

        sheet.getRow(1).font = {
            name: 'Arial',
            bold: true,
            size: 14
        }

        sheet.getRow(1).alignment = {vertical: 'middle', horizontal: 'center'}
        sheet.getRow(1).fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'FFC080'}}
        company.forEach(company => {
            sheet.addRow({
                name: company.name,
                impact: company.impact,
                admin: company.admin ? `${company.name}` : 'Desconocido',
                level: company.level,
                year: company.year,
                category: company.category
            })
        })
        const filePath = path.join(__dirname, '../excels', `Report_Company_${Date.now()}.xlsx`)
        await fs.mkdir(path.dirname(filePath), { recursive: true })
        await workbook.xlsx.writeFile(filePath)
        console.log(`Save file to ${filePath}`)
        res.setHeader('Conetent-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        res.setHeader('Conetent-Disposition', 'attachment; filename=Report_Company.xlsx')
        const buffer = await workbook.xlsx.writeBuffer()
        res.send(buffer)
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Internal Server Error',
            error
        })
    }
}