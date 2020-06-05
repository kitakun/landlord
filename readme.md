# Landlord
### The name come from `Landing` and `Overlord`

Here we can view `Node.js` server project, that's hosting multiple apps on multiple ports with control panel.

I think it can be helpful and easy to set up fast and simple multiple web-sites.

### How it works

Main part of application takes default (`3000`) port, and can be changed with `Environment.PORT` variable.

From this main app we can create/start/stop new sites.

Every new instance will be hosted in same process but in other port (`default_port + 1`). Also ports can be changed in main app.

_____
### Settings

At the project, we have `database.json` file with database configuration and `settings.json` with security protection of main-app accessing from the web.

![Home Page](/readme/GlobalsPage.png)
At first launch we need to open `Globals` tab, and click on `Create Database from zero`. (NOT CREATION, ONLY FILLING EXISTING DATABASE WITH TABLES)

___
![Home Page](/readme/HomePage.png)
For landing control we have `Enable` and `Disable` buttons on `Home` tab.
Also, LandingEntity has a field `run from startup` - that's mean on Node.js process being started -> we automatically will start other instances.

___
![Home Page](/readme/CreateNewPage.png)
Creation new record in database on `Create New` page, after this action on server in content directory will be created folder for new space.
___
## Used packages
 * express
 * mustache
 * ts-node `dev`
 * pg

 ## Used for admin-console
 * Vue
 * Vue router
 * Axios
 * vue-notification