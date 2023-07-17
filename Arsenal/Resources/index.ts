namespace Arsenal {

    interface IMethodTasks {
        name: string;
        args: any[];
    }

    export class ReactCellType extends Forguncy.Plugin.CellTypeBase {

        ComponentName: string;

        _reactComponentLoaded = false;

        _methodExecutionQueue: IMethodTasks[] = [];

        _originalMethods: { [key: string]: Function } = {};

        _prototype: { [key: string]: Function } = {};

        __reactComponent: IReactCellTypeRef;

        _reactComponentMethods: string[] = [
            "setValueToElement",
            "getValueFromElement"
        ];

        constructor(...args) {
            super(...args);
            const self = this;
            this._originalMethods = {};

            // @ts-ignore
            const originalPrototype = this._prototype;
            // @ts-ignore
            this._prototype = ReactCellType.prototype.__proto__;

            this._reactComponentMethods.forEach(methodName => {
                this._originalMethods[methodName] = this[methodName];

                this._prototype[methodName] = (...args: any[]) => {
                    if (self._reactComponentLoaded) {
                        this._prototype[methodName] = this._originalMethods[methodName];
                        this._originalMethods[methodName](...args);
                    } else {
                        self._methodExecutionQueue.push({name: methodName, args});
                    }
                }
            });
            this._prototype = originalPrototype;
        }

        public getValueFromElement(): any {
            return this.__reactComponent?.getValue?.();
        }

        public setValueToElement(jelement, value) {
            this.__reactComponent?.setValue?.(value);
        }

        setReadOnly(isReadOnly: boolean) {
            super.setReadOnly(isReadOnly);
            this.__reactComponent?.setReadOnly?.(this.isReadOnly());
        }

        disable() {
            super.disable();
            this.__reactComponent?.setDisable?.(this.isDisabled());
        }

        enable() {
            super.enable();
            this.__reactComponent?.setDisable?.(this.isDisabled());
        }

        // 只是没有类型引用,但实际有使用,请勿删除
        onReactComponentLoaded() {
            this._reactComponentLoaded = true;

            if (this._methodExecutionQueue.length) {
                this._methodExecutionQueue.forEach(task => {
                    this._originalMethods[task.name](...task.args);
                    this._prototype[task.name] = this._originalMethods[task.name];
                });
            }
        }

        onPageLoaded(info) {
            const timer = setInterval(() => {
                if (window.createReactComponent) {
                    window.createReactComponent(this, this.ComponentName);
                    return clearInterval(timer);
                }
            }, 25);
        }

        createContent() {
            return $('<div/>');
        }
    }

    export class PCUpload extends ReactCellType {
        ComponentName = 'PCUpload';

        SetElementDisplayState(...args) {
            this.__reactComponent.runtimeMethod["setElementDisplayState"](...args);
        }

        Upload(...args) {
            this.__reactComponent.runtimeMethod["upload"](...args);
        }
    }

    export class FilePreview extends ReactCellType {
        ComponentName = 'FilePreview';
    }

    class ReactCommand extends Forguncy.Plugin.CommandBase {
        protected ComponentName;

        __reactCommandExecutor: () => void = null;

        constructor() {
            super();

            const timer = setInterval(() => {
                if (window.createReactCommand) {
                    this.__reactCommandExecutor = window.createReactCommand(this, this.ComponentName);
                    return clearInterval(timer);
                }
            }, 25);
        }

        execute() {
            return new Promise((resolve) => {
                if (this.__reactCommandExecutor) {
                    this.__reactCommandExecutor();
                    return resolve(null);
                }

                const timer = setInterval(() => {
                    if (this.__reactCommandExecutor) {
                        this.__reactCommandExecutor();
                        clearInterval(timer);
                        resolve(null);
                    }
                }, 25)
            })
        }
    }

    export class UploadCommand extends ReactCommand {
        ComponentName = 'Upload';
    }

    export class UploadFolderCommand extends ReactCommand {
        ComponentName = 'UploadFolder';
    }

    export class DownloadFileCommand extends ReactCommand {
        ComponentName = 'DownloadFile';
    }

    export class GetFileAccessUrlCommand extends ReactCommand {
        ComponentName = 'GetFileAccessUrl';
    }

    export class GetDownloadUrlCommand extends ReactCommand {
        ComponentName = 'GetDownloadUrl';
    }

    export class ZipFileAndDownloadCommand extends ReactCommand {
        ComponentName = 'ZipFileAndDownload';
    }

    export class GetDifferenceFileKeysCommand extends ReactCommand {
        ComponentName = 'GetDifferenceFileKeys';
    }

    Forguncy.Plugin.CellTypeHelper.registerCellType('Arsenal.UploadCellType, Arsenal', PCUpload);
    Forguncy.Plugin.CellTypeHelper.registerCellType('Arsenal.PreviewCellType, Arsenal', FilePreview);
    Forguncy.Plugin.CommandFactory.registerCommand("Arsenal.UploadCommand, Arsenal", UploadCommand);
    Forguncy.Plugin.CommandFactory.registerCommand("Arsenal.UploadFolderCommand, Arsenal", UploadFolderCommand);
    Forguncy.Plugin.CommandFactory.registerCommand("Arsenal.DownloadFileCommand, Arsenal", DownloadFileCommand);
    Forguncy.Plugin.CommandFactory.registerCommand("Arsenal.GetFileAccessUrlCommand, Arsenal", GetFileAccessUrlCommand);
    Forguncy.Plugin.CommandFactory.registerCommand("Arsenal.GetDownloadUrlCommand, Arsenal", GetDownloadUrlCommand);
    Forguncy.Plugin.CommandFactory.registerCommand("Arsenal.ZipFileAndDownloadCommand, Arsenal", ZipFileAndDownloadCommand);
    Forguncy.Plugin.CommandFactory.registerCommand("Arsenal.GetDifferenceFileKeysCommand, Arsenal", GetDifferenceFileKeysCommand);
}