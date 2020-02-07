import path from 'path';
import fs from 'fs';

import express from 'express';
import mustache from 'mustache';

import * as landingStack from '../utils/landingStack';

const supportedStaticFormats = ['.css', '.js', '.ico'];

const landingService = {

    /**
     * Inject all static resources of given namespace to land
     * @param namespace landing name
     */
    InjectSingleSpace: (namespace: string, port: number) => {
        const namespaceRootFoldier = path.join(__dirname, `../content/${namespace}`);
        const allSupportedFiles = fs.readdirSync(namespaceRootFoldier);

        const landingEpxressApp = express();

        const landingInWork: landingStack.ILandingInWork = {
            namespace: namespace,
            expressApp: landingEpxressApp,
        };

        // All static files in content foldier
        allSupportedFiles.forEach(staticFile => {
            if (supportedStaticFormats.filter(f => staticFile.endsWith(f)).length > 0) {
                const resourceRoute = `/${staticFile}`;

                if (!landingInWork.resourcesRoutes) {
                    landingInWork.resourcesRoutes = [];
                }
                landingInWork.resourcesRoutes.push(resourceRoute);

                landingEpxressApp.get(resourceRoute, (req, res) => {
                    res.sendfile(path.join(namespaceRootFoldier, staticFile));
                });
            }
        });

        // html pages
        allSupportedFiles.forEach(staticFile => {
            if (supportedStaticFormats.filter(f => staticFile.endsWith('.html')).length > 0) {
                const resourceRoute = `/${staticFile}`;

                if (!landingInWork.htmlRoutes) {
                    landingInWork.htmlRoutes = [];
                }
                landingInWork.htmlRoutes.push(resourceRoute);

                landingEpxressApp.get(resourceRoute, (req, res) => {
                    res.sendfile(path.join(__dirname, `../content/${namespace}/${staticFile}.html`));
                });
            }
        });

        // mustaches pages
        allSupportedFiles.forEach(staticFile => {
            if (supportedStaticFormats.filter(f => staticFile.endsWith('.mustache')).length > 0) {
                const resourceRoute = `/${staticFile}`;

                if (!landingInWork.mustacheRoutes) {
                    landingInWork.mustacheRoutes = [];
                }
                landingInWork.mustacheRoutes.push(resourceRoute);

                landingEpxressApp.get(resourceRoute, (req, res) => {
                    const templatePath = path.join(__dirname, `../content/${namespace}/${staticFile}.mustache`);
                    fs.readFile(templatePath, function (err, data) {
                        if (err)
                            throw err;

                        var html = mustache.render(data.toString('utf8'), {});

                        res.send(html);
                    });
                });
            }
        });

        // Index
        var indexFile = allSupportedFiles.find(f => f.startsWith('index'))
        if (indexFile) {
            if (indexFile.endsWith('html')) {
                landingEpxressApp.get(`/`, (req, res) => {
                    res.sendfile(path.join(__dirname, `../content/${namespace}/index.html`));
                });
            } else {
                landingEpxressApp.get(`/landing/${namespace}`, (req, res) => {
                    const templatePath = path.join(__dirname, `../content/${namespace}/index.mustache`);
                    fs.readFile(templatePath, function (err, data) {
                        if (err)
                            throw err;

                        var html = mustache.render(data.toString('utf8'), {});

                        res.send(html);
                    });
                });
            }
        }

        landingInWork.server = landingEpxressApp.listen(port, () => {
            console.log(`[LandingController] Landing '${namespace}' started at port ${port}`);
            landingStack.stack.inWork.push(landingInWork);
        });
    },
    
    /**
     * Stop landing server and clean all routes/stacks
     */
    ShutdownLanding: (namespace: string) => landingStack.stack.shutdownLanding(namespace)
};

export default landingService;