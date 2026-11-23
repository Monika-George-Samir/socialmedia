import { HydratedDocument, Model, PopulateOptions, QueryFilter } from "mongoose";


export class DatabaseReposatory<TRaw> {
    private readonly model: Model<TRaw>
    constructor(model: Model<TRaw>){
        this.model = model
    }


    create(data: TRaw){
        return this.model.create(data)
    }


    findOne({
        filter,
        select,
        populate
    }:{
        filter: QueryFilter<TRaw>,
        select?: string,
        populate?: PopulateOptions | PopulateOptions[]
    }): Promise<HydratedDocument<TRaw> | null>{
        let query = this.model.findOne(filter)
        if (select) {
            query = query.select(select)
        }
        if (populate) {
            query = query.populate(populate)
        }
        return query
    }


    findAll({
        filter,
        select,
        populate
    }: {
        filter: QueryFilter<TRaw>,
        select?: string,
        populate?: PopulateOptions | PopulateOptions[]
    }){
        let query = this.model.find(filter)
        if (select) {
            query = query.select(select)
        }
        if (populate) {
            query = query.populate(populate)
        }
        return query
    }


    findByID(id: string){
        return this.model.findById(id)
    }


    // updateByID({
    //     filter,
    //     data,
    //     options
    // }: {
    //     filter: QueryFilter<TRaw>,
    //     data:  
    // }){

    // }



    
}