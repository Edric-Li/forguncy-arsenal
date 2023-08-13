import React, { useEffect, useMemo, useRef } from 'react';
import { Button, Tooltip } from 'antd';
import { SwitcherOutlined } from '@ant-design/icons';

import PDFViewer from '../pdf';
import preventDefaultEvent from '../../../../common/prevent-default-event';
import requestHelper from '../../../../common/request-helper';

enum PreviewMode {
  Image,
  Pdf,
}

/**
 * ppt预览组件
 * @param props
 * @constructor
 */
const PowerPointPreview = (props: IPreviewComponentProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [showSwitcher, setShowSwitcher] = React.useState<boolean>(false);
  const [previewMode, setPreviewMode] = React.useState<PreviewMode | null>(null);

  useEffect(() => {
    (async () => {
      if (props.suffix === 'ppt') {
        setPreviewMode(PreviewMode.Pdf);
        return;
      }

      // 如果服务端不支持转换pptx为pdf，直接显示图片,并且不允许切换
      if (!window.Arsenal.convertableFileExtensions?.has('pptx')) {
        setPreviewMode(PreviewMode.Image);
        return;
      }

      // 从props中获取设置。如果没有设置
      const { defaultPreviewMode, allowSwitchPreviewMode } = props.powerPointSettings || {
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
        setPreviewMode(defaultPreviewMode === 'image' ? PreviewMode.Image : PreviewMode.Pdf);
        setShowSwitcher(true);
        return;
      }

      // 如果是自动模式，检查是否已经转换为pdf，如果已经转换为pdf，显示pdf，否则显示图片
      const exists = await requestHelper.checkConvertedFileExists(props.url, 'pdf');
      setPreviewMode(exists ? PreviewMode.Pdf : PreviewMode.Image);
      setShowSwitcher(true);
    })();
  }, [props.url]);

  const src = useMemo(() => {
    return (
      Forguncy.Helper.SpecialPath.getPluginRootPath('8748d7dc-994d-45b8-80f9-f510cfcac6ac') +
      'Resources/PPTXjs/index.html?file=' +
      encodeURIComponent(props.url)
    );
  }, [props.url]);

  const floatButtonTooltip = useMemo(() => {
    return previewMode === PreviewMode.Image ? '切换PDF模式' : '切换图片模式';
  }, [previewMode]);

  const renderContent = () => {
    if (previewMode === PreviewMode.Image) {
      return (
        <iframe
          width={'100%'}
          height={'100%'}
          frameBorder='0'
          src={src}
          ref={iframeRef}
          onLoad={(e) => {
            (e.target as HTMLIFrameElement)?.contentDocument?.addEventListener('contextmenu', preventDefaultEvent);
          }}
        />
      );
    }

    return <PDFViewer {...props} url={props.url} suffix={'.pptx'} />;
  };

  if (previewMode === null) {
    return null;
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {renderContent()}
      {showSwitcher && (
        <Tooltip title={floatButtonTooltip}>
          <Button
            shape='circle'
            icon={<SwitcherOutlined />}
            size={'large'}
            style={{ position: 'absolute', right: 50, bottom: 35, opacity: showSwitcher ? 1 : 0 }}
            onClick={() => {
              setPreviewMode(previewMode === PreviewMode.Image ? PreviewMode.Pdf : PreviewMode.Image);
            }}
          />
        </Tooltip>
      )}
    </div>
  );
};

export default PowerPointPreview;
