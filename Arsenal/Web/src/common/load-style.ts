/**
 * 加载样式
 * @param url
 */
const loadStyle = (url: string) => {
        const link = document.createElement('link');
        link.href = url;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
};

export default loadStyle;
