interface IProps {
  cellType: CellType;
}

interface IPreviewComponentProps extends IPreviewOptions {
  url: string;
  suffix: string;
  evaluateFormula: (formula: string) => unknown;
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

enum IVideoSize {
  Fill,
  Original,
}

interface IPreviewOptions {
  hideTabsWhenOnlyOneFile: boolean;
  enableWatermark?: boolean;
  watermarkSettings: IPreviewWatermarkSettings;
  videoSettings: {
    autoPlay: boolean;
    controls: boolean;
    disableDownload: boolean;
    disablePictureInPicture: boolean;
    loop: boolean;
    muted: boolean;
    size: IVideoSize;
    backgroundColor: string;
  };
  audioSettings: {
    autoPlay: boolean;
    controls: boolean;
    disableDownload: boolean;
    loop: boolean;
  };
  disableContextMenu?: boolean;
  pdfSettings: {
    hideSaveButton: boolean;
    hidePrintButton: boolean;
  };
  wordSettings?: {
    allowSwitchPreviewMode: boolean;
    defaultPreviewMode: 'auto' | 'docx' | 'pdf';
  };
  powerPointSettings?: {
    allowSwitchPreviewMode: boolean;
    defaultPreviewMode: 'auto' | 'image' | 'pdf';
  };
}

enum ContextMenuStatus {
  Enable,
  Disable,
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
    convertableFileExtensions?: Set<string>;
    __originalWindowMethods: { [key: string]: Function };
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
