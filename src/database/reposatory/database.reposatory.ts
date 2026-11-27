import { HydratedDocument, Model, PopulateOptions, QueryFilter, QueryOptions, UpdateQuery } from "mongoose";


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
        select?: string | null,
        populate?: PopulateOptions | PopulateOptions[] | undefined
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
        limit,
        populate
    }: {
        filter: QueryFilter<TRaw>,
        select?: string,
        limit?: number,
        populate?: PopulateOptions | PopulateOptions[]
    }){
        let query = this.model.find(filter)
        if (select) {
            query = query.select(select)
        }
        if (limit) {
            query = query.limit(limit)
        }
        if (populate) {
            query = query.populate(populate)
        }
        return query
    }


    findByID(id: string){
        return this.model.findById(id)
    }


    updateOne({
        filter,
        updateData,
        options = {new: true}
    }: {
        filter: QueryFilter<TRaw>,
        updateData: UpdateQuery<TRaw>,
        options?: QueryOptions<TRaw>
    }){
        let query = this.model.findOneAndUpdate(filter, updateData, {new: true, ...options})
        return query
    }


    deleteOne({filter}: {filter: QueryFilter<TRaw>}){
        return this.model.deleteOne(filter)
    }
    
}