import React, { forwardRef } from 'react';
import PCUpload, { IOptions } from '../../upload';

export interface IProps {
  cellType: CellType;
}

const PCUploadWrapper = forwardRef<IReactCellTypeRef, IProps>((props, ref) => {
  return (
    <PCUpload
      ref={ref}
      container={props.cellType.getContainer()}
      options={props.cellType.CellElement.CellType as IOptions}
      commitValue={props.cellType.commitValue.bind(props.cellType)}
      evaluateFormula={props.cellType.evaluateFormula.bind(props.cellType)}
    />
  );
});

export default PCUploadWrapper;
