import CommandBase = Forguncy.Plugin.CommandBase;

interface Window {
    Arsenal: {
        createReactComponent: (cellType: CellType, componentName: string) => void;
        createReactCommand: (cellType: CommandBase, commandName: string) => () => void;
    }
}