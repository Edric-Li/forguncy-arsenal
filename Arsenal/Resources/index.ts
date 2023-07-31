namespace Arsenal {

    interface IMethodTasks {
        name: string;
        args: any[];
    }

    function waitForCondition(callback, interval) {
        return new Promise((resolve) => {
            const checkCondition = () => {
                if (callback()) {
                    resolve(true);
                    clearInterval(intervalId);
                }
            };

            const intervalId = setInterval(checkCondition, interval);
        });
    }


    export class ReactCellType extends Forguncy.Plugin.CellTypeBase {
        ComponentName: string;

        _reactComponentLoaded = false;

        _methodExecutionQueue: IMethodTasks[] = [];

        _originalMethods: { [key: string]: Function } = {};

        __reactComponent: IReactCellTypeRef;

        _reactComponentMethods: string[] = [
            "setValueToElement",
        ];

        constructor(...args) {
            super(...args);
            const self = this;
            this._originalMethods = {};

            this._reactComponentMethods.forEach(methodName => {
                this._originalMethods[methodName] = this[methodName].bind(self);

                this[methodName] = (...args: any[]) => {
                    if (self._reactComponentLoaded) {
                        this[methodName] = this._originalMethods[methodName].bind(self);
                        this[methodName](...args);
                    } else {
                        self._methodExecutionQueue.push({name: methodName, args});
                    }
                }
            });

            this.onDependenceCellValueChanged(() => {
                this.__reactComponent?.onDependenceCellValueChanged?.();
            })
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

        onReactComponentLoaded() {
            this._reactComponentLoaded = true;

            if (this._methodExecutionQueue.length) {
                this._methodExecutionQueue.forEach(task => {
                    this[task.name] = this._originalMethods[task.name].bind(this);
                    this[task.name](...task.args);
                });
            }
        }

        onPageLoaded(info) {
            waitForCondition(() => window.Arsenal.createReactComponent, 25).then(() => {
                window.Arsenal.createReactComponent(this, this.ComponentName);
            });
        }

        createContent() {
            return $('<div/>');
        }
    }

    class ReactCommand extends Forguncy.Plugin.CommandBase {
        protected ComponentName;

        __reactCommandExecutor: () => void = null;

        constructor() {
            super();

            waitForCondition(() => window.Arsenal && window.Arsenal.createReactCommand, 25).then(() => {
                this.__reactCommandExecutor = window.Arsenal.createReactCommand(this, this.ComponentName);
            });
        }

        execute() {
            return new Promise((resolve) => {
                if (this.__reactCommandExecutor) {
                    this.__reactCommandExecutor();
                    return resolve(null);
                }

                waitForCondition(() => this.__reactCommandExecutor, 25).then(() => {
                    this.__reactCommandExecutor();
                    resolve(null);
                });
            })
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

        UploadFolder(...args) {
            this.__reactComponent.runtimeMethod["uploadFolder"](...args);
        }
    }

    export class FilePreview extends ReactCellType {
        ComponentName = 'FilePreview';
    }

    export class TableView extends ReactCellType {
        ComponentName = 'TableView';
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

    export class CancelCommand extends ReactCommand {
        ComponentName = 'Cancel';
    }

    Forguncy.Plugin.CellTypeHelper.registerCellType('Arsenal.UploadCellType, Arsenal', PCUpload);
    Forguncy.Plugin.CellTypeHelper.registerCellType('Arsenal.PreviewCellType, Arsenal', FilePreview);
    Forguncy.Plugin.CellTypeHelper.registerCellType('Arsenal.TableViewCellType, Arsenal', TableView);
    Forguncy.Plugin.CommandFactory.registerCommand("Arsenal.UploadCommand, Arsenal", UploadCommand);
    Forguncy.Plugin.CommandFactory.registerCommand("Arsenal.UploadFolderCommand, Arsenal", UploadFolderCommand);
    Forguncy.Plugin.CommandFactory.registerCommand("Arsenal.DownloadFileCommand, Arsenal", DownloadFileCommand);
    Forguncy.Plugin.CommandFactory.registerCommand("Arsenal.GetFileAccessUrlCommand, Arsenal", GetFileAccessUrlCommand);
    Forguncy.Plugin.CommandFactory.registerCommand("Arsenal.GetDownloadUrlCommand, Arsenal", GetDownloadUrlCommand);
    Forguncy.Plugin.CommandFactory.registerCommand("Arsenal.ZipFileAndDownloadCommand, Arsenal", ZipFileAndDownloadCommand);
    Forguncy.Plugin.CommandFactory.registerCommand("Arsenal.GetDifferenceFileKeysCommand, Arsenal", GetDifferenceFileKeysCommand);
    Forguncy.Plugin.CommandFactory.registerCommand("Arsenal.CancelCommand, Arsenal", CancelCommand);

    window.Arsenal.canceledTokenSet = new Set<string>;
}