import React, { useEffect, useRef } from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

import FilePreview from '../file-preview';
import PCUploadWrapper from './uploadWrapper';

interface Props {
  componentName: string;
  cellType: CellType;
}

const CellTypeWrapper = (props: Props) => {
  const ref = useRef<IReactCellTypeRef>();

  useEffect(() => {
    props.cellType.__reactComponent = ref.current as IReactCellTypeRef;
    props.cellType.onReactComponentLoaded();
  }, [ref, props.cellType]);

  let Component: any = React.Fragment;

  if (props.componentName === 'PCUpload') {
    Component = PCUploadWrapper;
  } else if (props.componentName === 'FilePreview') {
    Component = FilePreview;
  }

  return (
    <ConfigProvider locale={zhCN}>
      <Component cellType={props.cellType} ref={ref} />
    </ConfigProvider>
  );
};

export default CellTypeWrapper;
