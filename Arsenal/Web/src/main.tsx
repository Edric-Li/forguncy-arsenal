import React from 'react';
import ReactDOM from 'react-dom/client';
import ReactCellTypeWrapper from './components/react-cell-type-wrapper/reactCellTypeWrapper';

function createReactComponent(cellType: CellType) {
  ReactDOM.createRoot(cellType.getContainer()[0]).render(
    <ReactCellTypeWrapper cellType={cellType} componentName='PCUpload' />,
  );
}

window.createReactComponent = createReactComponent;
