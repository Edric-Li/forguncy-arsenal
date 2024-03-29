import CellTypeBase = Forguncy.Plugin.CellTypeBase;

type IReactCellTypeRef = Partial<{
    getValue(): any;

    setValue(value: any);

    setReadOnly(isReadOnly: boolean);

    setDisable(isDisabled: boolean);

    runtimeMethod: { [key: string]: (...args: any) => void }

    onDependenceCellValueChanged: () => void;
}>


declare class CellType extends CellTypeBase {
    runTimePageName: string;

    onReactComponentLoaded();

    __reactComponent: IReactCellTypeRef;
}