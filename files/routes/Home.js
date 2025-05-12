const BaseRoute = require('../../core/RouteClass.js');
const isAdmin = require('../../core/AdminMiddleware.js');

class HomeRoute extends BaseRoute {
    constructor() {
        super();
        this.path = '/';
        this.initRoutes();
    }

    initRoutes() {
        this.router.get('/', isAdmin ,this.getAll);
    }

    getAll(req, res) {
        res.send('Hello from home, admin!');
    }
}

module.exports = HomeRoute;
