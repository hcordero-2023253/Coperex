import { Schema, model } from "mongoose";

const userSchema = Schema({
    name:{
        type:String,
        required: [true, 'Name is required'],
        maxLength: [50, 'Name is too long'],
        unique: [true, 'Name is already taken']
    },
    username:{
        type: String,
        required: [true, 'Username is required'],
        unique: [true, 'Username is already in use'],
        unique: [true, 'Username is already in use'],
    },
    email:{
        type: String,
        required: [true, 'emal is required'],
        unique: [true, 'Email is already in use']
    },
    password:{
        type: String,
        required: [true,'Password is required'],
        minLength: [8, 'Password must be at least 8 characters long'],
    },
    role:{
        type: String,
        default: process.env.ROLE
    }
})

userSchema.methods.toJSON =  function() {
    const {__v, password, ...user} = this.toObject();
    return user;
}

export default model('User',userSchema)