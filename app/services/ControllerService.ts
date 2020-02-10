import path = require('path');
import fs = require('fs');

import express = require('express');

import IInjectableController from '../controllers/InjectableController';

var isAlreadyInited: Boolean = false;

export interface IControllerService {
    /**
     * Load all controllers and inject them in express instance
     * @param server express instance
     */
    Init(server: express.Application): void;
}

const singletoneService: IControllerService = {
    Init: function (server: express.Application) {

        if (isAlreadyInited)
            return console.warn('[ControllersService] Controllers already inited!');

        const directoryPath = path.join(__dirname, '../controllers');

        var files = fs.readdirSync(directoryPath);

        files.forEach(function (file) {
            var Controller = require(path.join(directoryPath, file)).default;
            if (Controller) {
                var controllerInstance: IInjectableController = new Controller();

                controllerInstance.Inject(server);

                console.log(`[ControllersService] Controller ${file} setted`);
            }
        });

        isAlreadyInited = true;
    }
}

export { singletoneService };
