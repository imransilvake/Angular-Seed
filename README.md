# Angular CLI
Angular CLI based seed application incorporating many best practices typically needed in Enterprise apps.

- Custom Modules:
	- Loading Animation
	- Notification: `success, error, info, warning`
	- Dialog: `confirmation, notice`
	- Error Handler: `common, system`
	- Storage: `local, session, memory`
	- Proxy: `getAPI, postAPI`
		- Ensure secure HTTPs calls
		- HTTP Caching
		- HTTP Error Handling
- Custom Pipes
- Usage of Angular Material Framework: `input`, `select`, `dialog`, `tree`, `sidenav`
- Icons support from Material and Fontawesome


## Content
- [X] SCSS Inclusion
- [X] Linting: `scss, ts`
- [X] Build Environments: `dev, next, prod`
- [X] Translation (i18n)


## Libraries and Frameworks

#### Internal
- [X] [SCSS Framework](https://github.com/imransilvake/SCSS-Framework)

#### External 
- [X] [Angular CLI](https://cli.angular.io/)
- [X] [Angular Material](https://material.angular.io/)
- [X] [RxJs](https://rxjs.dev/)
- [X] [HammerJS](https://hammerjs.github.io/)
- [X] [Moment](https://momentjs.com/)
- [X] [FontAwesome](https://fontawesome.com/)


## Environments
|Serve|Script|Description|
|---|---|---|
|Development|`yarn start`|Serve the application @ `localhost:1500`|
|Next|`yarn serve.app.next`|Serve the application @ `localhost:2000`|
|Production|`yarn serve.app.prod`|Serve the application @ `localhost:3000`|
|Production@en|`yarn serve.app.prod-en`|Serve the application @ `localhost:3001/en` directory|
|Production@de|`yarn serve.app.prod-de`|Serve the application @ `localhost:3002/de` directory|

|Build|Script|Description|
|---|---|---|
|Development|`yarn build`|Build the application to `./dist` directory|
|Next|`yarn build.app.next`|Build the application to `./dist` directory|
|Production|`yarn build.app.prod`|Build the application to `./dist` directory|
|Production@en|`yarn build.app.prod-en`|Build the application to `./dist/app-en/` directory|
|Production@de|`yarn build.app.prod-de`|Build the application to `./dist/app-de/` directory|

## Translation
|Script|Description|
|---|---|
|`yarn translate`|Fetch translation content from *.html files|
|`yarn translate:ts`|Fetch translation content from *.ts files|

## Linting
|Script|Description|
|---|---|
|`yarn lint:ts`|Lint Typescript|
|`yarn lint:scss`|Lint SCSS|


## SCSS
Include this import in each component to get access to [SCSS variables and functions](https://github.com/imransilvake/SCSS-Framework/blob/master/documentation/guide.md).
```
@import 'main';
```
