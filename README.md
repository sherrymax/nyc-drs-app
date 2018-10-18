
<h1 align="center">Alfresco Process Workspace</h1>

## Installing

To run or build the app without hassles, make sure that your machine is running Node version 8.2.0 or higher. Install required libraries by using below command.

```sh
npm install
```

## Run in development mode

```sh
npm start
```

This command compiles and starts the project in watch mode.
Browser will automatically reload upon changes.
Upon start you can navigate to `http://localhost:3000` with your preferred browser. Navigate to settings page(`http://localhost:3000/#/settings`) to configure the APS url.

## Production build

```sh
npm run build
```

This command builds project in `production` mode.
All output is placed to `dist` folder and can be served from your preferred APS web server or from any other web server.
You should need no additional files outside the `dist` folder

## Test build

```sh
npm run test-single-run
```

This command runs unit test cases written in the project.

## Application settings (server-side)

All server-side application settings are stored in the `app.config.json` file. 
By default the configuration file has the content similar to the following one:

```json
{
    "bpmHost": "http://{hostname}{:port}",
    "contextRootBpm": "my-custom-activiti-app",
    "application": {
        "name": "Alfresco Process Workspace"
    }
}
```

You can change the default APS end point here, by default it takes the ip and port number of the server where the application is hosted. If you are running the activiti instance in a custom context (the default one is activiti-app) you can change it through the property contextRootBpm. For instance in the above example we are using a custom context called 'my-custom-activiti-app' .

