interface Window {
    __reactCellTypes: {
        [key: string]: CellType
    };

    createReactComponent: (cellType: CellType, componentName: string) => void;
}