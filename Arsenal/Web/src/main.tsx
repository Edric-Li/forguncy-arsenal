import React from 'react';
import ReactDOM from 'react-dom/client';
import ReactCellTypeWrapper from './components/react-cell-type-wrapper/reactCellTypeWrapper';

function createReactComponent(cellType: CellType, componentName: ComponentName) {
  ReactDOM.createRoot(cellType.getContainer()[0]).render(
    <ReactCellTypeWrapper cellType={cellType} componentName={componentName} />,
  );
}

window.createReactComponent = createReactComponent;
