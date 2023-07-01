import React, { useEffect, useRef } from 'react';
import { message } from 'antd';
import moduleLoader from '../../../../common/module-loader';
import requestHelper from '../../../../common/request-helper';

/**
 * Excel 预览组件
 * @param props
 * @constructor
 */
const ExcelPreview = (props: IPreviewComponentProps) => {
  const rootRef: React.RefObject<HTMLDivElement> = useRef(null);
  const spreadRef = useRef<any>(null);
  const excelIoRef = useRef<any>(null);

  const getSpread = () => {
    if (!spreadRef.current) {
      spreadRef.current = new window.GC.Spread.Sheets.Workbook(rootRef.current, {
        calcOnDemand: true,
        showTabStrip: false,
      });
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
    moduleLoader.loadSpreadCss();
  }, []);

  useEffect(() => {
    (async () => {
      if (props.url === null) {
        return;
      }

      await moduleLoader.loadImportExcelModule();

      const file = await requestHelper.getSpreadFile(props.url);

      getExcelIo().open(
        file,
        function (json: any) {
          const spread = getSpread();
          spread.fromJSON(json);
          // 禁用右键菜单
          spread.contextMenu = false;

          spread.sheets.forEach((sheet: any) => {
            sheet.options.isProtected = true;
            sheet.options.protectionOptions.allowResizeColumns = true;
            sheet.options.protectionOptions.allowResizeRows = true;

            spread.options.newTabVisible = false;
            sheet.showRow(0, -1);
            sheet.showColumn(0, -1);
          });
        },
        function (e: any) {
          message.error(e.errorMessage);
        },
      );
    })();

    return () => {
      rootRef.current?.remove();
    };
  }, [props.url]);

  return <div ref={rootRef} style={{ width: '100%', height: '100%', overflow: 'auto' }} />;
};

export default ExcelPreview;
