import { createClient, RedisClientType } from "redis";
import { env } from "../../config/env.service";



export class RedisService {
    private client : RedisClientType
    constructor(){
        this.client = createClient({
            url: env.redisURI
        })

        this.handleConnection()
    }


    handleConnection(){
        this.client.on("error", (error)=>{
        console.log(error);
                
        })
    }



    connect(){
        this.client.connect()
        console.log("redis connected");
            
    }




    get(key:string){
        return this.client.get(key)
    }

    set(key:string, value:string, EX:number){
        return this.client.set(key, value, {EX: EX})
    }   

    del(key:string){
        return this.client.del(key)
    }

    exists(key:string){
        return this.client.exists(key)
    }

    ttl(key:string){
        return this.client.ttl(key)
    }

    incr(key:string){
        return this.client.incr(key)
    }

    decr(key:string){
        return this.client.decr(key)
    }

}


export const redisService = new RedisService()