interface IProps {
  cellType: CellType;
}

interface IPreviewComponentProps extends IPreviewOptions {
  url: string;
  suffix: string;
}

interface IPreviewWatermarkSettings {
  gap: string;
  height: number;
  rotate: number;
  width: number;
  zIndex: number;
  content: string;
  font: {
    color: string;
    fontFamily: string;
    fontSize: string;
    fontStyle: 'none' | 'normal' | 'italic' | 'oblique';
    fontWeight: 'normal' | 'light' | 'weight' | number;
  };
  offset: string;
}

interface IPreviewOptions {
  hideTabsWhenOnlyOneFile: boolean;
  enableWatermark?: boolean;
  watermarkSettings?: IPreviewWatermarkSettings;
  disableContextMenu?: boolean;
  pdfSettings?: {
    hideSaveButton: boolean;
    hidePrintButton: boolean;
  };
}

interface CustomFile extends File {
  uid: string;
  relativePath?: string;
}

enum ComponentName {
  PCUpload = 'PCUpload',
  ExcelPreview = 'ExcelPreview',
}

enum CommandName {
  Upload = 'Upload',
}

interface Window {
  Arsenal: {
    createReactComponent: (cellType: CellType, componentName: ComponentName) => void;
    createReactCommand: (commandBase: Forguncy.Plugin.CommandBase, commandName: CommandName) => void;
    canceledTokenSet: Set<string>;
  };

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
