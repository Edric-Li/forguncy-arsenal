function runDev(){
    const fragment = document.createDocumentFragment();

    const creatModuleScriptElement = (src) => {
        const script = document.createElement('script');
        script.type ='module';
        script.src = src;
        return script;
    };

    const script1 = document.createElement('script');
    script1.type ='module';
    script1.innerHTML = `  
    import RefreshRuntime from "http://localhost:5173/@react-refresh"
    RefreshRuntime.injectIntoGlobalHook(window)
    window.$RefreshReg$ = () => {}
    window.$RefreshSig$ = () => (type) => type
    window.__vite_plugin_react_preamble_installed__ = true`;

    fragment.append(script1);
    fragment.append(creatModuleScriptElement('http://localhost:5173/@vite/client'));
    fragment.append(creatModuleScriptElement('http://localhost:5173/src/main.tsx?t=1678179320265'));
    document.head.appendChild(fragment);
}

window.__reactCellTypes = window.__reactCellTypes || {};

runDev();

namespace Arsenal {
    
    function test(constructor:Function){
        console.log(123456,Object.keys(constructor.prototype));
    }
    @test
    export class ArsenalCellType extends Forguncy.Plugin.CellTypeBase {

        _cumulativeData = null;

        _reactComponentLoaded = false;

        _reactComponent = null;

        // 只是没有类型引用,但实际有使用,请勿删除
        onReactComponentLoaded() {
            this._reactComponent = window.__reactCellTypes[this.getContainer().attr("id")]?.component;
            this._reactComponentLoaded = true;
            this._reactComponent.setValue(this._cumulativeData);
        }

        setValueToElement(jelement, value) {
            if (this._reactComponentLoaded) {
                this._reactComponent.setValue(value);
            } else {
                this._cumulativeData = value;
            }
        }

        getValueFromElement() {
            return this._reactComponent?.getValue();
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

    Forguncy.Plugin.CellTypeHelper.registerCellType('Arsenal.Arsenal, Arsenal', Arsenal.ArsenalCellType);
}