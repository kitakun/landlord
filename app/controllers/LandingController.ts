import path from 'path';
import fs from 'fs';

import express from 'express';
import mustache from 'mustache';

import dbAccess = require('../db/index');
import IInjectableController from './InjectableController';

export default class LandingController implements IInjectableController {
    public Inject(app: express.Application): void {

        app.get('/landing', (req, res) => {
            const view = {
                title: "Joe",
                calc: function () {
                    return 2 + 4;
                }
            };

            const template = "{{title}} spends {{calc}}";
            dbAccess;
            var html = mustache.render(template, view);

            res.send(html);
        });

        const testNamespaces = ['test', 'test2'];
        const supportedStaticFormats = ['.css', '.js'];

        testNamespaces.forEach(namespace => {
            const namespaceRootFoldier = path.join(__dirname, `../content/${namespace}`);
            const allSupportedFiles = fs.readdirSync(namespaceRootFoldier);

            // All static files in content foldier
            allSupportedFiles.forEach(staticFile => {
                if (supportedStaticFormats.filter(f => staticFile.endsWith(f)).length > 0) {
                    app.get(`/landing/${namespace}/${staticFile}`, (req, res) => {
                        res.sendfile(path.join(namespaceRootFoldier, staticFile));
                    });
                }
            });

            // Main mustache page
            app.get(`/landing/${namespace}`, (req, res) => {
                const templatePath = path.join(__dirname, `../content/${namespace}/index.html`);
                fs.readFile(templatePath, function (err, data) {
                    if (err)
                        throw err;

                    var html = mustache.render(data.toString('utf8'), {});

                    res.send(html);
                })
            })
        });
    }
}