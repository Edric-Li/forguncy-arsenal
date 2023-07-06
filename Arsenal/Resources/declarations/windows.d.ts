import CommandBase = Forguncy.Plugin.CommandBase;

interface Window {
    __reactCellTypes: {
        [key: string]: CellType
    };

    createReactComponent: (cellType: CellType, componentName: string) => void;
    createReactCommand: (cellType: CommandBase, commandName: string) => () => void;
}