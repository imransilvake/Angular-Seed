# Angular CLI
Angular CLI based seed application incorporating many best practices typically needed in Enterprise apps. It includes:
- [X] HttpClient: `getAPI`, `postAPI`
	- Ensure secure HTTPs calls
	- HTTP Caching
	- HTTP Error Handling
- [X] Angular Routing
- [X] Custom Pipes `firstKey`
- [X] Web Storage API: `local`, `session`, `memory`
- [X] Angular Material Components `input`, `select`, `dialog`, `tree`, `sidenav`
- [X] Icons from Material and Fontawesome

![Alt text](preview.png?raw=true "Angular Seed")


## Content
Please follow the link for the documentation: [GUIDE](./GUIDE.md)

#### Configuration
- [X] SCSS Inclusion
- [X] Linting: `scss, ts`
- [X] Build Environments: `dev, stag, next, prod`

#### Development
- [X] Loading Animation
- [X] Notification: `success`, `error`, `info`, `warning`
- [X] Dialog: `confirmation`
- [X] Error Handler: `common`, `system`
- [X] Storage: `local`, `session`, `memory`
- [X] Proxy: `getAPI`, `postAPI`


## Libraries and Frameworks

#### Internal
- [X] [SCSS Framework](https://github.com/imransilvake/SCSS-Framework)

#### External 
- [X] [Angular CLI](https://cli.angular.io/)
- [X] [Redux](https://github.com/angular-redux/store)
- [X] [Redux Devtools](https://github.com/ngrx/store-devtools)
- [X] [Angular Material](https://material.angular.io/)
- [X] [Moment](https://momentjs.com/)
- [X] [CryptoJS](https://github.com/brix/crypto-js)
- [X] [HammerJS](https://hammerjs.github.io/)
- [X] [Fontawesome](https://fontawesome.com/)


## Environments
|Serve|Script|Description|
|---|---|---|
|Development|`npm start`|Serve the application @ `localhost:4200`|
|Staging|`npm run serve.app.stag`|Serve the application @ `localhost:6000`|
|Next|`npm run serve.app.next`|Serve the application @ `localhost:5000`|
|Production|`npm run serve.app.prod`|Serve the application @ `localhost:7000`|
|Production@en|`npm run serve.app.prod-en`|Serve the application @ `localhost:7000/en` directory|
|Production@de|`npm run serve.app.prod-de`|Serve the application @ `localhost:7000/de` directory|

|Build|Script|Description|
|---|---|---|
|Development|`npm run build`|Build the application to `./dist` directory|
|Staging|`npm run build.app.stag`|Build the application to `./dist` directory|
|Next|`npm run build.app.next`|Build the application to `./dist` directory|
|Production|`npm run build.app.prod`|Build the application to `./dist` directory|
|Production@en|`npm run build.app.prod-en`|Build the application to `./dist/app-en/` directory|
|Production@de|`npm run build.app.prod-de`|Build the application to `./dist/app-de/` directory|


## Linting
|Script|Description|
|---|---|
|`npm run lint:ts`|Lint Typescript|
|`npm run lint:scss`|Lint SCSS|


## SCSS
Include this import in each component to get access to [SCSS variables and functions](https://github.com/imransilvake/SCSS-Framework/blob/master/documentation/guide.md).
```
@import 'main';
```
