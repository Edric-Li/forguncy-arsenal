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
    import RefreshRuntime from "${origin}/@react-refresh"
    RefreshRuntime.injectIntoGlobalHook(window)
    window.$RefreshReg$ = () => {}
    window.$RefreshSig$ = () => (type) => type
    window.__vite_plugin_react_preamble_installed__ = true`;

    fragment.append(reactRefreshScript);
    fragment.append(creatModuleScriptElement(`/@vite/client`));
    fragment.append(creatModuleScriptElement('/src/main.tsx?t=1678179320265'));
    document.head.appendChild(fragment);
}

runDev();
