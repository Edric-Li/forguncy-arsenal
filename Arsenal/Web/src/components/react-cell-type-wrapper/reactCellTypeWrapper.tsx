import PCUpload from '../pc-upload';
import React, { useEffect, useRef } from 'react';
import FilePreview from '../file-preview';

interface Props {
  componentName: string;
  cellType: CellType;
}

const ReactCellTypeWrapper = (props: Props) => {
  const ref = useRef<Forguncy.Plugin.CellTypeBase>(null);

  useEffect(() => props.cellType.onReactComponentLoaded(), [ref, props.cellType]);

  let Component: any = React.Fragment;

  if (props.componentName === 'PCUpload') {
    Component = PCUpload;
  }else if (props.componentName === 'FilePreview') {
    Component = FilePreview;
  }

  return <Component cellType={props.cellType} />;
};

export default ReactCellTypeWrapper;
