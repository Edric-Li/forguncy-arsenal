import React, {useEffect, useRef, useState} from 'react';
import loadScript from '../../common/load-script';
import getFileObjectFromUrl from '../../common/get-file-object-from-url';
import FileUpload from '../../common/file-upload';

/**
 * Excel 预览组件
 * @param props
 * @constructor
 */
const ExcelPreview = (props:IProps) => {
    const [url, setUrl] = useState<string | null>(null);
    const spreadRef = useRef<any>(null);
    const excelIoRef = useRef<any>(null);

    const setValidUrl = (url: string) => {
        if (!url) {
            return;
        }
        // 如果不是http开头的，认为是活字格的内置的文件
        if (!url.startsWith('http')) {
            url = FileUpload.getFileUrl(url);
        }
        setUrl(url);
    };

    useEffect(() => {
        props.cellType.setValueToElement = (jelement, value) => {
            setValidUrl(value);
        };

        setValidUrl(props.cellType.getValueFromDataModel());
    }, []);

    const getSpread = () => {
        if (!spreadRef.current) {
            spreadRef.current = new window.GC.Spread.Sheets.Workbook(props.cellType.getContainer()[0], {calcOnDemand: true});
        }
        return spreadRef.current;
    };

    const getExcelIo = () => {
        if (!excelIoRef.current) {
            excelIoRef.current = new window.GC.Spread.Excel.IO();
        }
        return excelIoRef.current;
    };

    useEffect(() => {
        (async () => {
            if (url === null) {
                return;
            }

            if (!window.GC.Spread.Excel) {
                await loadScript(Forguncy.Helper.SpecialPath.getBaseUrl() + 'Resources/Scripts/SpreadJS/interop/gc.spread.excelio.min.js');
            }

            const file = await getFileObjectFromUrl(url);

            getExcelIo().open(file, function (json: any) {
                getSpread().fromJSON(json);
            }, function (e: any) {
                console.error(e.errorMessage);
            });
        })();
    }, [url]);

    return null;
};

export default ExcelPreview;
