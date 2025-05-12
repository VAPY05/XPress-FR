#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

program
  .version('1.0.0')
  .description('CLI for XPress Framework');

program
  .command('new <projectName>')
  .description('Create a new XPress project')
  .action((projectName) => {
    console.log(`Creating new XPress project: ${projectName}`);
    
    // Create project directory
    fs.mkdirSync(projectName);
    process.chdir(projectName);

    // Initialize npm project
    execSync('npm init -y');

    // Create project structure
    const dirs = [
      'core',
      'files/models',
      'files/routes'
    ];

    dirs.forEach(dir => fs.mkdirSync(dir, { recursive: true }));

    // Install dependencies
    execSync('npm install express mongoose cookie-parser');
    
    console.log('✅ Project created successfully!');
  });

program
  .command('generate')
  .alias('g')
  .description('Generate project components')
  .argument('<type>', 'Type to generate (model/route/both)')
  .argument('<name>', 'Name of the component')
  .action((type, name) => {
    switch(type) {
      case 'model':
        generateModel(name);
        break;
      case 'route':
        generateRoute(name);
        break;
      case 'both':
        generateModel(name);
        generateRoute(name);
        break;
      default:
        console.error('Invalid type. Use model, route, or both');
    }
  });

function generateModel(name) {
    const template = `const BaseModel = require('../../core/Classes/ModelClass.js');
const mongoose = require('mongoose');

class ${name}Model extends BaseModel {
    constructor() {
        const schema = new mongoose.Schema({
            title: { type: String, required: true },
            description: String,
            createdAt: { type: Date, default: Date.now }
        });

        super('${name}', schema);
    }
}

module.exports = new ${name}Model();`;

    fs.writeFileSync(`files/models/${name}.js`, template);
    console.log(`✅ Model ${name} created successfully`);
}

function generateRoute(name) {
    const template = `const BaseRoute = require('../../core/Classes/RouteClass.js');
const ${name}Model = require('../models/${name}.js');

class ${name}Route extends BaseRoute {
    constructor() {
        super();
        this.path = '/${name.toLowerCase()}';
        this.initRoutes();
    }

    initRoutes() {
        this.router.get('/', this.getAll.bind(this));
        this.router.get('/:id', this.getOne.bind(this));
        this.router.post('/', this.create.bind(this));
        this.router.put('/:id', this.update.bind(this));
        this.router.delete('/:id', this.delete.bind(this));
    }

    async getAll(req, res) {
        try {
            const items = await ${name}Model.find();
            this.sendResponse(res, items);
        } catch (err) {
            this.sendError(res, err.message);
        }
    }

    async getOne(req, res) {
        try {
            const item = await ${name}Model.findById(req.params.id);
            this.sendResponse(res, item);
        } catch (err) {
            this.sendError(res, err.message);
        }
    }

    async create(req, res) {
        try {
            const item = await ${name}Model.create(req.body);
            this.sendResponse(res, item, 201);
        } catch (err) {
            this.sendError(res, err.message);
        }
    }

    async update(req, res) {
        try {
            const item = await ${name}Model.update(req.params.id, req.body);
            this.sendResponse(res, item);
        } catch (err) {
            this.sendError(res, err.message);
        }
    }

    async delete(req, res) {
        try {
            await ${name}Model.delete(req.params.id);
            this.sendResponse(res, { message: 'Deleted successfully' });
        } catch (err) {
            this.sendError(res, err.message);
        }
    }
}

module.exports = new ${name}Route();`;

    fs.writeFileSync(`files/routes/${name}.js`, template);
    console.log(`✅ Route ${name} created successfully`);
}

program.parse(process.argv);