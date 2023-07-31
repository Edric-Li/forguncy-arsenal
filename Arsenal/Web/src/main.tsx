import React from 'react';
import ReactDOM from 'react-dom/client';
import ReactCellTypeWrapper from './components/wrapper/celltype';
import commandWrapper from './components/wrapper/command';
import './index.css';

function createReactComponent(cellType: CellType, componentName: ComponentName) {
  ReactDOM.createRoot(cellType.getContainer()[0]).render(
    <ReactCellTypeWrapper cellType={cellType} componentName={componentName} />,
  );
}

function createReactCommand(commandBase: Forguncy.Plugin.CommandBase, commandName: CommandName) {
  return commandWrapper({
    commandBase,
    commandName,
  });
}

if (!window.Arsenal) {
  window.Arsenal = {
    createReactCommand,
    createReactComponent,
    canceledTokenSet: new Set(),
    __originalWindowMethods: {},
  };
} else {
  window.Arsenal.createReactCommand = createReactCommand;
  window.Arsenal.createReactComponent = createReactComponent;
}
