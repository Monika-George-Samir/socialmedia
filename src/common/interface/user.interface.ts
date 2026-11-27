import { RoleEnums } from "../enums/user.enums";


export interface IUser {
    _id?: string | undefined,
    name: string,
    email: string,
    password: string,
    isVerified?: boolean,
    confirmPassword?: string,
    phone?: string | undefined,
    age?: number | undefined,
    role?: RoleEnums | undefined,
    followers?: string[],
    following?: string[],
    followRequests?: string[]
    isPrivate?: boolean
}