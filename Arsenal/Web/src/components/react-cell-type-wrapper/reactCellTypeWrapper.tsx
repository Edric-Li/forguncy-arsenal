import PCUpload from '../pc-upload';
import React, { useEffect, useRef } from 'react';

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
  }

  return <Component cellType={props.cellType} />;
};

export default ReactCellTypeWrapper;
