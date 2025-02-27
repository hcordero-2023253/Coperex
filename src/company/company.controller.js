import Client from './company.model.js';

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

        if(category){
            query.category = category
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