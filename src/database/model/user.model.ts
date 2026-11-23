import { model, Schema } from "mongoose";
import { IUser } from "../../common/interface/user.interface";



const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true
    }, 
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
    },
    age: {
        type: Number,
    }
})


export const userModel = model<IUser>("user", userSchema)