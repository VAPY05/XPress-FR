const mongoose = require('mongoose');

class BaseModel {
    constructor(name, schemaDefinition) {
        const schema = new mongoose.Schema(schemaDefinition, { timestamps: true });
        this.model = mongoose.model(name, schema);
    }

    async create(data) {
        return this.model.create(data);
    }

    async find(query = {}) {
        return this.model.find(query);
    }

    findOne(filter) {
        return this.model.findOne(filter);
    }

    async findById(id) {
        return this.model.findById(id);
    }

    async update(id, data) {
        return this.model.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return this.model.findByIdAndDelete(id);
    }
}

module.exports = BaseModel;
