import React from 'react';
import ReactDOM from 'react-dom/client';
import ReactCellTypeWrapper from './components/wrapper/cellTyleWrapper';
import commandWrapper from './components/wrapper/commandWrapper';

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

window.createReactCommand = createReactCommand;
window.createReactComponent = createReactComponent;

window.$ = window.jQuery;
