# Documentation
- [X] Loading Animation
- [X] Notification: `success`, `error`, `info`, `warning`
- [X] Dialog: `confirmation`
- [X] Error Handler: `common`, `system`
- [X] Proxy: `getAPI`, `postAPI`
- [X] Storage: `local`, `session`, `memory`


## Loading Animation
```
Module: LoadingAnimationModule
Service: LoadingAnimationService

Usage:
constructor(private _loadingAnimationService: LoadingAnimationService) {
	// start loading animation
	this._loadingAnimationService.startLoadingAnimation();
	
	// stop loading animation
	this._loadingAnimationService.stopLoadingAnimation();
}
```


## Notification
```
Service: _store: Store<NotificationInterface>

Notification Types:
NotificationActions.NotificationInfo
NotificationActions.NotificationWarning
NotificationActions.NotificationError
NotificationActions.NotificationSuccess
NotificationActions.NotificationClose
NotificationActions.NotificationCloseAll

Usage:
const payload = {
	text: 'Text',
	keepAfterNavigationChange: true
};
this._store.dispatch(new NotificationActions.NotificationWarning(payload));
```


## Dialog
```
Module: DialogModule
Service: DialogService

Usage:
const data = {
    type: DialogTypeEnum.CONFIRMATION,
    payload: {
        title: 'Confirmation',
        message: 'Please confirm your status!',
        buttonTexts: ['Yes', 'No']
    }
};
this._dialogService
	.showDialog(data)
	.subscribe((status) => { });
```


## Error Handler
```
Service: _store: Store<ErrorHandlerInterface>

Usage:
const data = {
    type: ErrorHandlerTypeEnum.SYSTEM_ERROR,
    payload: {
        title: 'System Error',
        message: 'The system is down at the moment.',
        buttonTexts: ['Close']
    }
};
this._store.dispatch(new ErrorHandlerActions.ErrorHandlerSystem(data));
```


## Proxy
```
Module: ProxyModule
Service: ProxyService

Methods:
getAPI(service: AppServicesInterface, params?: Object, urlParts?: string, matrixParams?: Object)
postAPI(service: AppServicesInterface, params?: Object)
```


## Storage
```
Module: StorageModule
Service: StorageService

Methods:
put(key: string, value: any, storageType?: StorageTypeEnum)
get(key: string, storageType?: StorageTypeEnum)
remove(key: string, storageType?: StorageTypeEnum)
exist(key: string, storageType?: StorageTypeEnum)

clearAllLocalStorageItems()
clearAllSessionStorageItems()
clearStorageItems(['item-1', 'item-2'])
```
