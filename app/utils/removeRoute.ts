import express = require('express');

function _findRoute(path: string, stack: any) {
    var routes: any[] = [];
    stack.forEach(function (layer: any) {
        if (!layer)
            return;
        if (layer && !layer.match(path))
            return;
        if (['query', 'expressInit'].indexOf(layer.name) != -1)
            return;

        if (layer.name == 'router') {
            routes = routes.concat(_findRoute(trimPrefix(path, layer.path), layer.handle.stack));
        } else if (layer.name == 'bound dispatch') {
            routes.push({ route: layer || null, stack: stack });
        }
    });

    return routes;
}

function findRoute(app: express.Application, path: string) {
    var stack;
    stack = app._router.stack;
    return _findRoute(path, stack);
}

function trimPrefix(path: string, prefix: string) {
    // This assumes prefix is already at the start of path.
    return path.substr(prefix.length);
}

function removeRoute(app: express.Application, path: string, method?: string | undefined) {
    let found, route, stack, idx;

    found = findRoute(app, path);

    (found || []).forEach(function (layer) {
        route = layer.route;
        stack = layer.stack;

        if (route) {
            if (!method) {  // if no method delete all resource with the given path
                idx = stack.indexOf(route);
                stack.splice(idx, 1);
            } else if (JSON.stringify(route.route.methods).toUpperCase().indexOf(method.toUpperCase()) >= 0) {  // if method defined delete only the resource with the given ath and method
                idx = stack.indexOf(route);
                stack.splice(idx, 1);
            }
        }
    });

    return true;
};

export = { removeRoute };