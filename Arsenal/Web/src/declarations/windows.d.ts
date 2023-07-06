interface IProps {
  cellType: CellType;
}

interface IPreviewComponentProps {
  url: string;
  suffix: string;
}

enum ComponentName {
  PCUpload = 'PCUpload',
  ExcelPreview = 'ExcelPreview',
}

enum CommandName {
  Upload = 'Upload',
}

interface Window {
  __reactCellTypes: {
    [key: string]: CellType;
  };

  createReactComponent: (cellType: CellType, componentName: ComponentName) => void;
  createReactCommand: (commandBase: Forguncy.Plugin.CommandBase, commandName: CommandName) => void;

  $: JQueryStatic;

  GC: {
    Spread: {
      Sheets: {
        Workbook;
      };
      Excel: {
        IO;
      };
    };
  };
}
