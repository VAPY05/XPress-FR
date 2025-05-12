const { Router } = require('express');

class RouteClass {
    constructor() {
        this.router = Router();
        this.path = '';
        this.initRoutes();
    }

    initRoutes() {
        this.router.get("/",)
    }

    sendResponse(res, data, statusCode = 200) {
        res.status(statusCode).json({ data });
    }

    sendError(res, message, statusCode = 400) {
        res.status(statusCode).json({ error: message });
    }
}

module.exports = RouteClass;
