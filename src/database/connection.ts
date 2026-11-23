import mongoose from "mongoose"
import { env } from "../config/env.service"

export const DatabaseConnection = ()=>{
    mongoose.connect(env.databaseURI).then(()=>{
        console.log('database connected');
        
    }).catch((err)=>{
        console.log(err);
        
    })
}