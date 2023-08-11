import React, { useEffect, useMemo, useRef } from 'react';
import { renderAsync } from 'docx-preview';
import requestHelper from '../../../../common/request-helper';
import { Button, Tooltip } from 'antd';
import { SwitcherOutlined } from '@ant-design/icons';
import PDFViewer from '../pdf';
import NotSupport from '../../not-support';

enum PreviewMode {
  Docx,
  Pdf,
}

const WordPreview = (props: IPreviewComponentProps) => {
  const rootRef: React.RefObject<HTMLDivElement> = useRef(null);
  const [showSwitcher, setShowSwitcher] = React.useState<boolean>(false);
  const [previewMode, setPreviewMode] = React.useState<PreviewMode | null>(null);
  const [isNotSupport, setIsNotSupport] = React.useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (props.suffix === 'doc') {
        setPreviewMode(PreviewMode.Pdf);
        return;
      }

      // 如果服务端不支持转换pptx为pdf，直接显示图片
      if (!window.Arsenal.convertableFileExtensions?.has('docx')) {
        setPreviewMode(PreviewMode.Docx);
        return;
      }

      const { defaultPreviewMode, allowSwitchPreviewMode } = props.wordSettings || {
        defaultPreviewMode: true,
        allowSwitchPreviewMode: 'auto',
      };

      // 如果不允许切换预览模式，并且服务端支持转换pptx为pdf，直接显示pdf
      if (!allowSwitchPreviewMode) {
        setPreviewMode(PreviewMode.Pdf);
        return;
      }

      // 如果设置了默认预览模式，直接显示
      if (defaultPreviewMode !== 'auto') {
        setPreviewMode(defaultPreviewMode === 'docx' ? PreviewMode.Docx : PreviewMode.Pdf);
        setShowSwitcher(true);
        return;
      }

      // 如果是自动模式，检查是否已经转换为pdf，如果已经转换为pdf，显示pdf，否则显示图片
      const exists = await requestHelper.checkConvertedFileExists(props.url, 'pdf');
      setPreviewMode(exists ? PreviewMode.Pdf : PreviewMode.Docx);
      setShowSwitcher(true);
    })();
  }, [props.url]);

  useEffect(() => {
    (async () => {
      if (previewMode === PreviewMode.Docx) {
        try {
          const buffer = await requestHelper.getBlob(props.url);
          await renderAsync(buffer, rootRef.current as HTMLElement);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);

          if (window.Arsenal.convertableFileExtensions?.has('docx')) {
            // 如果转换失败，则直接显示pdf,并且不允许切换
            setPreviewMode(PreviewMode.Pdf);
            setShowSwitcher(false);
          } else {
            setIsNotSupport(true);
          }
        }
      }
    })();
  }, [previewMode, props.url]);

  const floatButtonTooltip = useMemo(() => {
    return previewMode === PreviewMode.Docx ? '切换PDF模式' : '切换文档模式';
  }, [previewMode]);

  const renderContent = () => {
    if (previewMode === PreviewMode.Pdf) {
      return (
        <PDFViewer
          url={props.url}
          suffix={'.docx'}
          evaluateFormula={props.evaluateFormula}
          hideTabsWhenOnlyOneFile={props.hideTabsWhenOnlyOneFile}
          watermarkSettings={props.watermarkSettings}
          videoSettings={props.videoSettings}
          audioSettings={props.audioSettings}
          pdfSettings={props.pdfSettings}
          disableContextMenu={props.disableContextMenu}
        />
      );
    }

    return <div ref={rootRef} style={{ width: '100%', height: '100%', overflow: 'auto' }} />;
  };

  if (isNotSupport) {
    return <NotSupport />;
  }

  if (previewMode) {
    return null;
  }

  return (
    <>
      {renderContent()}
      {showSwitcher && (
        <Tooltip title={floatButtonTooltip}>
          <Button
            shape='circle'
            icon={<SwitcherOutlined />}
            size={'large'}
            style={{ position: 'absolute', right: 50, bottom: 35, opacity: showSwitcher ? 1 : 0 }}
            onClick={() => {
              setPreviewMode(previewMode === PreviewMode.Docx ? PreviewMode.Pdf : PreviewMode.Docx);
            }}
          />
        </Tooltip>
      )}
      )
    </>
  );
};

export default WordPreview;
