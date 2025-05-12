const express = require('express');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const Database = require('../core/Database');

class EntryPoint {
    constructor(port = 3000, dbUri= null,routesDir = 'files/routes') {
        this.app = express();
        this.port = port;
        this.routesDir = routesDir;

        this.setupMiddleware();
        this.loadRoutes();

        if (dbUri) {
            Database.connect(dbUri);
        }

    }

    setupMiddleware() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
    }

    loadRoutes() {
        const routesPath = path.resolve(__dirname, '..', this.routesDir);

        fs.readdirSync(routesPath).forEach((file) => {
            if (file.endsWith('.js')) {
                const RouteClass = require(path.join(routesPath, file));
                const routeInstance = new RouteClass();

                if (routeInstance.path && routeInstance.router) {
                    this.app.use(routeInstance.path, routeInstance.router);
                } else {
                    console.warn(`[WARN] Route ${file} е без .path или .router`);
                }
            }
        });
    }

    start() {
        this.app.listen(this.port, () => {
            console.log("\n" +
                "██╗░░██╗██████╗░██████╗░███████╗░██████╗░██████╗\n" +
                "╚██╗██╔╝██╔══██╗██╔══██╗██╔════╝██╔════╝██╔════╝\n" +
                "░╚███╔╝░██████╔╝██████╔╝█████╗░░╚█████╗░╚█████╗░\n" +
                "░██╔██╗░██╔═══╝░██╔══██╗██╔══╝░░░╚═══██╗░╚═══██╗\n" +
                "██╔╝╚██╗██║░░░░░██║░░██║███████╗██████╔╝██████╔╝\n" +
                "╚═╝░░╚═╝╚═╝░░░░░╚═╝░░╚═╝╚══════╝╚═════╝░╚═════╝░\n"
            );
            console.log(`The server is working on http://localhost:${this.port}`);
        });
    }
    
}

module.exports = EntryPoint;
