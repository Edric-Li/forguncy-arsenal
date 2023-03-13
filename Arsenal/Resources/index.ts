function runDev() {
    const origin = "http://localhost:5173";
    
    const fragment = document.createDocumentFragment();

    const creatModuleScriptElement = (src) => {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = origin+src;
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

        _reactComponentLoaded = false;

        _methodExecutionQueue: IMethodTasks[] = [];

        _originalMethods: { [key: string]: Function } = {};

        _prototype: { [key: string]: Function } = {};

        _reactComponentMethods: string[] = [
            "setValueToElement",
            "getValueFromElement",
        ];

        constructor(...args) {
            super(...args);
            const self = this;
            this._originalMethods = {};

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
                    window.createReactComponent(this);
                    return clearInterval(timer);
                }
            }, 25);
        }

        createContent() {
            return $('<div/>');
        }
    }


    Forguncy.Plugin.CellTypeHelper.registerCellType('Arsenal.Arsenal, Arsenal', ReactCellType);
}