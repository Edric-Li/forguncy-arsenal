import CellTypeBase = Forguncy.Plugin.CellTypeBase;

declare class CellType extends CellTypeBase {
  onReactComponentLoaded();
}

interface IProps {
  cellType: CellType;
}

enum ComponentName {
  PCUpload = 'PCUpload',
  ExcelPreview = 'ExcelPreview',
}

interface Window {
  __reactCellTypes: {
    [key: string]: CellType;
  };

  createReactComponent: (cellType: CellType, componentName: ComponentName) => void;

  GC: {
    Spread: {
      Sheets: {
        Workbook
      }
      Excel: {
        IO
      }
    }
  }
}