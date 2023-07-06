import React, { ForwardedRef, forwardRef, MutableRefObject, useEffect, useRef } from 'react';

import PCUpload, { CellTypeConfig } from '../upload';
import _ from 'lodash';

export interface IUploadCellType extends CellType {
  Upload(): void;
}

export interface IProps {
  cellType: IUploadCellType;
}

const PCUploadWrapper = forwardRef<IReactCellTypeRef, IProps>((props, ref) => {
  useEffect(() => {
    props.cellType.Upload = () => {
      ((ref as MutableRefObject<IReactCellTypeRef>).current.upload || _.noop)();
    };
  }, []);

  return (
    <PCUpload
      ref={ref}
      options={props.cellType.CellElement.CellType as CellTypeConfig}
      commitValue={props.cellType.commitValue}
      evaluateFormula={props.cellType.evaluateFormula}
    />
  );
});

export default PCUploadWrapper;
