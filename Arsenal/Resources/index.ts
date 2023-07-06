function runDev() {
    const origin = "http://localhost:5173";

    const fragment = document.createDocumentFragment();

    const creatModuleScriptElement = (src) => {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = origin + src;
        return script;
    };

    const reactRefreshScript = document.createElement('script');
    reactRefreshScript.type = 'module';
    reactRefreshScript.innerHTML = `  
    import RefreshRuntime from "http://localhost:5173/@react-refresh"
    RefreshRuntime.injectIntoGlobalHook(window)
    window.$RefreshReg$ = () => {}
    window.$RefreshSig$ = () => (type) => type
    window.__vite_plugin_react_preamble_installed__ = true`;

    fragment.append(reactRefreshScript);
    fragment.append(creatModuleScriptElement(`/@vite/client`));
    fragment.append(creatModuleScriptElement('/src/main.tsx?t=1678179320265'));
    document.head.appendChild(fragment);
}

window.__reactCellTypes = window.__reactCellTypes || {};
runDev();


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
    }

    export class FilePreview extends ReactCellType {
        ComponentName = 'FilePreview';
    }

    export class UploadCommand extends Forguncy.Plugin.CommandBase {
        ComponentName = 'Upload';

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

    Forguncy.Plugin.CellTypeHelper.registerCellType('Arsenal.Arsenal, Arsenal', PCUpload);
    Forguncy.Plugin.CellTypeHelper.registerCellType('Arsenal.FilePreview, Arsenal', FilePreview);
    Forguncy.Plugin.CommandFactory.registerCommand("Arsenal.UploadCommand, Arsenal", UploadCommand);
}
