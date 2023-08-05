import React, { useEffect, useRef, useState } from 'react';
import { message, Spin } from 'antd';
import moduleLoader from '../../../../common/module-loader';
import requestHelper from '../../../../common/request-helper';
import getExtname from '../../../../common/get-extname';
import FileUploadEngine from '../../../../common/file-upload-engine';

/**
 * Excel 预览组件
 * @param props
 * @constructor
 */
const ExcelPreview = (props: IPreviewComponentProps) => {
  const rootRef: React.RefObject<HTMLDivElement> = useRef(null);
  const spreadRef = useRef<any>(null);
  const [showSpin, setShowSpin] = useState<boolean>(true);
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

      let url = props.url;

      // 如果不是excel文件，先转换为excel
      if (getExtname(props.url) !== '.xlsx') {
        const res = await requestHelper.createFileConversionTask(props.url, 'xlsx');

        if (res.result) {
          url = FileUploadEngine.getConvertedFileUrl(props.url, 'xlsx');
        }
      }

      const file = await requestHelper.getSpreadFile(url);

      getExcelIo().open(
        file,
        function (json: any) {
          setShowSpin(false);

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

  return (
    <>
      <div ref={rootRef} style={{ width: '100%', height: '100%', overflow: 'auto' }} />
      {showSpin && (
        <div className='arsenal-spin-centered'>
          <Spin />
        </div>
      )}
    </>
  );
};

export default ExcelPreview;
