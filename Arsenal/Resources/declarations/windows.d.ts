import CellTypeBase = Forguncy.Plugin.CellTypeBase;

interface ReactCellTypeRef {
  setValue: (values: string) => void;
  getValue: () => string;
}

declare class CellType extends CellTypeBase {
  onReactComponentLoaded();
}

interface Window {
  __reactCellTypes: {
    [key: string]: {
      cellType: CellType;
      component?: ReactCellTypeRef;
    };
  };

  createReactComponent: (cellType: CellType) => void;
}
