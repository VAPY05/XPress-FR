const BaseModel = require('../../core/Classes/ModelClass.js');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

class ProfileModel extends BaseModel {
    constructor() {
        const profileSchema = new mongoose.Schema({
            name: { type: String, required: true },
            email: { type: String, required: true, unique: true },
            age: Number,
            role: {
                type: String,
                enum: ['user', 'admin', 'moderator'],
                default: 'user'
            },
            password: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        });

        // Hash password before saving
        profileSchema.pre('save', async function (next) {
            if (this.isModified('password')) {
                this.password = await bcrypt.hash(this.password, 10);
            }
            next();
        });

        // Method to compare passwords
        profileSchema.methods.comparePassword = function (plainPassword) {
            return bcrypt.compare(plainPassword, this.password);
        };

        super('Profile', profileSchema);
    }
}

module.exports = new ProfileModel();
