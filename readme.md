# Landlord
### Name come from `Landing` and `Owerlord`

Here we can view `Node.js` server project, thats hosting multiple ports and apps with control panel.

I think it can be helpfull and easy to setup fast and simple multiple web-sites.

### How it works

Main part of application takes default (`3000`) port, and can be changed with `Environment.PORT`.

From this main app we can create/start/stop new sites.

Every new instance will be hosted in same process but in other port (`default_port + 1`). Also ports can be changed in main app.

_____
### Settings

At project we have `database.json` file with database configuration and `settings.json` with security protection of main-app accessing from web.

At first launch we need to call `[GET] /ultra/createdb` method for database filling (NOT CREATION, ONLY FILLING EXISTING DATABASE WITH TABLES)

___
For landing control we have `[GET] /ultra/startlanding/:name` and `[GET] /ultra/stoplanding/:name`
Also LandingEntity have field `run from startup` - that's mean on Node.js process being started -> we automatically will start other instances.

___
## Used packages
 * express
 * mustache
 * ts-node `dev`
 * pg