const mongoose = require('mongoose');

class Database {
    static async connect(uri) {
        try {
            await mongoose.connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log('[DB] Connected successfully');
        } catch (error) {
            console.error('[DB] Connection error:', error);
            process.exit(1);
        }
    }
}

module.exports = Database;
