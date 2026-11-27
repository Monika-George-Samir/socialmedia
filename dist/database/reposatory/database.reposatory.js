"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseReposatory = void 0;
class DatabaseReposatory {
    model;
    constructor(model) {
        this.model = model;
    }
    create(data) {
        return this.model.create(data);
    }
    findOne({ filter, select, populate }) {
        let query = this.model.findOne(filter);
        if (select) {
            query = query.select(select);
        }
        if (populate) {
            query = query.populate(populate);
        }
        return query;
    }
    findAll({ filter, select, limit, populate }) {
        let query = this.model.find(filter);
        if (select) {
            query = query.select(select);
        }
        if (limit) {
            query = query.limit(limit);
        }
        if (populate) {
            query = query.populate(populate);
        }
        return query;
    }
    findByID(id) {
        return this.model.findById(id);
    }
    updateOne({ filter, updateData, options = { new: true } }) {
        let query = this.model.findOneAndUpdate(filter, updateData, { new: true, ...options });
        return query;
    }
    deleteOne({ filter }) {
        return this.model.deleteOne(filter);
    }
}
exports.DatabaseReposatory = DatabaseReposatory;
