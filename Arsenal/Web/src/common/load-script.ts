const loadScript = async (url: string) => {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        script.onload = () => {
            resolve(null);
        }
        document.body.appendChild(script);
    })
}

export default loadScript;