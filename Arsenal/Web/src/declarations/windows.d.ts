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
    playsInline: boolean;
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
    sidebarViewOnLoad: number;
    cursorToolOnLoad: number;
    scrollModeOnLoad: number;
    spreadModeOnLoad: number;
    hideOpenFileButton: boolean;
    hideSaveButton: boolean;
    hidePrintButton: boolean;
    disableEdit: boolean;
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
    convertableFileExtensions?: Set<string>;
    pdfInfo: Map<
      string,
      {
        url: string;
        preferences: any;
      }
    >;
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
