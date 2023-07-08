import React, { forwardRef, MutableRefObject, useEffect } from 'react';

import PCUpload, { IOptions } from '../upload';
import _ from 'lodash';

export interface IUploadCellType extends CellType {
  Upload(directory: boolean): void;
}

export interface IProps {
  cellType: IUploadCellType;
}

const PCUploadWrapper = forwardRef<IReactCellTypeRef, IProps>((props, ref) => {
  useEffect(() => {
    props.cellType.Upload = (directory: boolean) => {
      ((ref as MutableRefObject<IReactCellTypeRef>).current.upload || _.noop)(directory);
    };
  }, []);

  return (
    <PCUpload
      ref={ref}
      options={props.cellType.CellElement.CellType as IOptions}
      commitValue={props.cellType.commitValue.bind(props.cellType)}
      evaluateFormula={props.cellType.evaluateFormula.bind(props.cellType)}
    />
  );
});

export default PCUploadWrapper;
