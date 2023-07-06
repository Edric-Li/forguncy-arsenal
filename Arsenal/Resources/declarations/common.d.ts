import CellTypeBase = Forguncy.Plugin.CellTypeBase;

type IReactCellTypeRef = Partial<{
    getValue(): any;

    setValue(value: any);

    setReadOnly(isReadOnly: boolean);

    setDisable(isDisabled: boolean);

    upload: () => void;
}>


declare class CellType extends CellTypeBase {
    onReactComponentLoaded();

    __reactComponent: IReactCellTypeRef;
}