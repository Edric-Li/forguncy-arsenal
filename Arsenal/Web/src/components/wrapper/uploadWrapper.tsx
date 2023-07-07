import React, { forwardRef, MutableRefObject, useEffect } from 'react';

import PCUpload, { IOptions } from '../upload';
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
      options={props.cellType.CellElement.CellType as IOptions}
      commitValue={props.cellType.commitValue.bind(props.cellType)}
      evaluateFormula={props.cellType.evaluateFormula}
    />
  );
});

export default PCUploadWrapper;
