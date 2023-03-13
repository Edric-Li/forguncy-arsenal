import PCUpload from '../pc-upload';
import React, { useEffect, useRef } from 'react';

interface Props {
  componentName: string;
  cellType: CellType;
}

const ReactCellTypeWrapper = (props: Props) => {
  const ref = useRef<ReactCellTypeRef>(null);

  useEffect(() => {
    const containerId = props.cellType.getContainer().attr('id');

    window.__reactCellTypes[containerId] = {
      cellType: props.cellType,
      component: ref.current as ReactCellTypeRef,
    };

    props.cellType.onReactComponentLoaded();
  }, [ref, props.cellType]);

  let Component: any = React.Fragment;

  if (props.componentName === 'PCUpload') {
    Component = PCUpload;
  }

  return <Component ref={ref} cellType={props.cellType} />;
};

export default ReactCellTypeWrapper;
