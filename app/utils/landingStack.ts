import * as http from 'http';
import express from 'express';

import rr from './removeRoute';
// removeRoute.removeRoute(app, '/landing');

interface ILandingInWork {
    namespace: string;
    expressApp: express.Application;
    server?: http.Server;

    mustacheRoutes?: string[];
    htmlRoutes?: string[];
    resourcesRoutes?: string[];
}

const stack = {
    /**
     * All landings in work
     */
    inWork: new Array<ILandingInWork>(),
    /**
     * Remove landing with all resources from app
     * @param namespace landing name
     * @param app express app
     */
    removeNamespace: function (namespace: string, app: express.Application): boolean {
        var targetedNs = this.inWork.find(f => f.namespace == namespace);
        if (targetedNs) {

            if (targetedNs.htmlRoutes) {
                targetedNs.htmlRoutes.forEach(htmlRoute => rr.removeRoute(app, htmlRoute));
            }

            if (targetedNs.mustacheRoutes) {
                targetedNs.mustacheRoutes.forEach(mustacheRoute => rr.removeRoute(app, mustacheRoute));
            }

            if (targetedNs.resourcesRoutes) {
                targetedNs.resourcesRoutes.forEach(resRoute => rr.removeRoute(app, resRoute));
            }

            var nsIndex = this.inWork.findIndex(f => f.namespace == namespace);
            this.inWork.splice(nsIndex, 1);

            return true;
        }

        return false;
    },
    /**
     * Close epxress instance and free special port
     * @param namespace landing name
     */
    shutdownLanding: function (namespace: string) {
        var targetedNs = this.inWork.find(f => f.namespace == namespace);
        if (targetedNs) {
            targetedNs.server!.close();

            var nsIndex = this.inWork.findIndex(f => f.namespace == namespace);
            this.inWork.splice(nsIndex, 1);

            return true;
        }
        return false;
    }
};

export { stack, ILandingInWork };