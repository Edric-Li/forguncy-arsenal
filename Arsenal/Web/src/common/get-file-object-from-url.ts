import getBlobObjectFromUrl from './get-blob-object-from-url';

/**
 * 通过Url获取文件对象
 * @param url
 */

const fileTypeMap:{[key:string]:string} = {
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'xls': 'application/vnd.ms-excel',
    'unknown': 'unknown',
};

const getFileObjectFromUrl = (url:string):Promise<File>=> {
    return new Promise((resolve) => {
        const fileExt = url?.split('.').pop() ?? 'unknown';

        getBlobObjectFromUrl(url)
            .then(blob => resolve(new File([blob], 'file.' + fileExt, {type: blob.type || fileTypeMap[fileExt]})));
    });
};

export default getFileObjectFromUrl;
