import CellTypeBase = Forguncy.Plugin.CellTypeBase;

declare class CellType extends CellTypeBase {
    onReactComponentLoaded();
}

interface Window {
    __reactCellTypes: {
        [key: string]: CellType
    };

    createReactComponent: (cellType: CellType, componentName: string) => void;
}
