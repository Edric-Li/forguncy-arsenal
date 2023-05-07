import React, {useEffect, useRef} from 'react';
import loadScript from '../../../../common/load-script';
import getFileObjectFromUrl from '../../../../common/get-file-object-from-url';
import loadStyle from '../../../../common/load-style';
import {message} from 'antd';

/**
 * Excel 预览组件
 * @param props
 * @constructor
 */
const ExcelPreview = (props:IPreviewComponentProps) => {
    const rootRef: React.RefObject<HTMLDivElement> = useRef(null);
    const spreadRef = useRef<any>(null);
    const excelIoRef = useRef<any>(null);

    const getSpread = () => {
        if (!spreadRef.current) {
            spreadRef.current = new window.GC.Spread.Sheets.Workbook(rootRef.current, {calcOnDemand: true,showTabStrip:false});
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
        loadStyle(Forguncy.Helper.SpecialPath.getBaseUrl() + 'Resources/Content/gc.spread.sheets.excel2013lightGray.css');
    }, []);


    useEffect(() => {
        (async () => {
            if (props.url === null) {
                return;
            }

            if (!window.GC.Spread.Excel) {
                await loadScript(Forguncy.Helper.SpecialPath.getBaseUrl() + 'Resources/Scripts/SpreadJS/interop/gc.spread.excelio.min.js');
            }

            const file = await getFileObjectFromUrl(props.url);

            getExcelIo().open(file, function (json: any) {
                const spread = getSpread();
                spread.fromJSON(json);
                // 禁用右键菜单
                spread.contextMenu = false;

                const sheet = getSpread().getActiveSheet();
                spread.options.newTabVisible = false;
                sheet.showRow(0, -1);
                sheet.showColumn(0, -1);

            }, function (e: any) {
                message.error(e.errorMessage);
            });
        })();

        return ()=>{
            rootRef.current?.remove();
        };
    }, [props.url]);

    return <div ref={rootRef} style={{width:'100%',height:'100%',overflow:'auto'}}/>;

};

export default ExcelPreview;
