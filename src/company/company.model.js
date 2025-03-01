import { Schema, model} from 'mongoose';

const clientSchema = new Schema({
    name:{
        type:String,
        required: [true, 'Name is required'],
        maxLength: [50, 'Name is too long'],
        unique: [true, 'Name is already taken']
    },
    impact:{
        type: String,
        required: [true, "Impact is required"],
        enum:['LOW','HALF','HIGH']
    },
    level:{
        type: String,
        required: [true, "Level is required"],
        enum:['LOCAL','WORLD']
    },
    year:{
        type: Number,
        required: [true, "Year is required"],
        min: [1900, "Year is too old"],
        max: [2022, "Year is too new"]
    },
    category:{
        type: String,
        required: [true, "Category is required"],
    },
    admin:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
})

clientSchema.methods.toJSON = function() {
    const {__v, password, ...client} = this.toObject();
    return client;
}

export default model('Client', clientSchema);