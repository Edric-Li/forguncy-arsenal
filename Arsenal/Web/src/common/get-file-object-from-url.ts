const getFileObjectFromUrl = (url:string):Promise<File>=> {
    return new Promise((resolve) => {
        fetch(url)
            .then(res => res.blob())
            .then(blob => resolve(new File([blob], 'xlsx.xlsx', {type: blob.type})));
    });
};

export default getFileObjectFromUrl;
