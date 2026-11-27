import { model, Schema, Types } from "mongoose";
import { IUser } from "../../common/interface/user.interface";
import { RoleEnums } from "../../common/enums/user.enums";



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
    },
    role: {
        type: Number,
        enum: RoleEnums,
        default: RoleEnums.User
    },
    followers : [{
        type: Types.ObjectId,
        ref: "user"
    }],
    following : [{
        type: Types.ObjectId,
        ref: "user"
    }],
    followRequests: [{
        type: Types.ObjectId,
        ref: "user"
    }],
    isPrivate: {
        type: Boolean,
        default: false
    }
})


export const userModel = model<IUser>("user", userSchema)