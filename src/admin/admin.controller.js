import User from './admin.model.js'
import { checkPassword, encrypt } from '../../utils/encrypt.js'
import { generateJwt } from '../../utils/jwt.js'


export const login = async (req, res) => {
    try {
        let { userLoggin, password} = req.body
        let user = await User.findOne({
            $or: [//$or sirve para hacer cualquier busqueda
                {username: userLoggin},
                {email: userLoggin}
            ]
        })

        if(user && await checkPassword(user.password, password)){
            let loggerUser={
                uid: user._id,
                name: user.name,
                username: user.username,
                role: user.role
            }
            let token = await generateJwt(loggerUser)
            return res.send({
                success: true,
                message: `Welcome ${user.username} you are logged in`,
                loggerUser,
                token
            })
        }

        return res.status(400).send({
            success: false,
            message: 'Incorrect password or userLoggin',
        })
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message:'Generar error with login',error
        })
    }
}

export const createAdminDefault = async () => {
    try {
        let adminExist = await User.findOne({name: process.env.NAME})

        if(adminExist){
            return console.log("Admin already exist");
            
        }

        if(!adminExist){
            let admin = new User({
                name: process.env.NAME,
                email: process.env.EMAIL,
                username: process.env.DB_USERNAME,
                password: process.env.PASSWORD,
                role: process.env.ROLE
            })
            admin.password = await encrypt(admin.password);
            await admin.save();
        }
        console.log("Admin created")
    } catch (error) {
        console.error(error);
        
    }
}