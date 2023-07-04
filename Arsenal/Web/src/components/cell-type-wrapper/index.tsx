import PCUpload from '../upload';
import React, { useEffect, useRef } from 'react';
import FilePreview from '../file-preview';

interface Props {
  componentName: string;
  cellType: CellType;
}

const Index = (props: Props) => {
  const ref = useRef<IReactCellTypeRef>();

  useEffect(() => {
    props.cellType.__reactComponent = ref.current as IReactCellTypeRef;
    props.cellType.onReactComponentLoaded();
  }, [ref, props.cellType]);

  let Component: any = React.Fragment;

  if (props.componentName === 'PCUpload') {
    Component = PCUpload;
  } else if (props.componentName === 'FilePreview') {
    Component = FilePreview;
  }

  return <Component cellType={props.cellType} ref={ref} />;
};

export default Index;
