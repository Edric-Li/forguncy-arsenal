/// <reference path="./forguncy.d.ts" />

/**
 */
declare namespace Forguncy.Plugin {
  /**
   * <cn>单元格的水平对齐方式。</cn>
   */
  enum CellHorizontalAlignment {
    /**
     * <cn>左对齐。</cn>
     */
    Left = 0,
    /**
     * <cn>居中对齐。</cn>
     */
    Center = 1,
    /**
     * <cn>右对齐。</cn>
     */
    Right = 2,
    /**
     * <cn>默认对齐方式。</cn>
     */
    General = 3,
  }

  /**
   * <cn>单元格的垂直对齐方式</cn>
   */
  enum CellVerticalAlignment {
    /**
     * <cn>顶部对齐</cn>
     */
    Top = 0,
    /**
     * <cn>居中对齐</cn>
     */
    Center = 1,
    /**
     * <cn>底部对齐</cn>
     */
    Bottom = 2,
  }

  /**
   * <cn>单元格在设计器中设置的样式数据。</cn>
   */
  interface StyleMetaData {
    /**
     * <cn>单元格的字体。</cn>
     */
    FontFamily?: string;
    /**
     * <cn>单元格的字体大小。</cn>
     */
    FontSize?: number;
    /**
     * <cn>单元格的字体粗细，值为`Bold`或`Normal`。</cn>
     */
    FontWeight?: string;
    /**
     * <cn>单元格的字体风格，值为`Italic`或`Normal`。</cn>
     */
    FontStyle?: string;
    /**
     * <cn>单元格是否显示下划线。</cn>
     */
    Underline?: boolean;
    /**
     * <cn>单元格是否显示删除线。</cn>
     */
    Strikethrough?: boolean;
    /**
     * <cn>单元格的背景颜色。</cn>
     */
    Background?: string;
    /**
     * <cn>单元格的字体颜色。</cn>
     */
    Foreground?: string;
    /**
     * <cn>单元格的水平对齐方式。</cn>
     */
    HorizontalAlignment?: CellHorizontalAlignment;
    /**
     * <cn>单元格的垂直对齐方式。</cn>
     */
    VerticalAlignment?: CellVerticalAlignment;

    /**
     * <cn>单元格是否设置折行。</cn>
     */
    WordWrap?: boolean;

    /**
     * <cn>单元格格式字符串。</cn>
     */
    Formatter?: string;
  }

  /**
   * <cn>表示在设计器中设计的单元格 UI 元素。</cn>
   */
  interface CellContentElement {
    /**
     * <cn>C# 单元格类型的属性。</cn>
     */
    CellType?: object;
    /**
     * <cn>设计器中设置的单元格的样式信息。</cn>
     */
    StyleInfo: StyleMetaData;
    /**
     * <cn>单元格的快速样式模板。</cn>
     */
    StyleTemplate?: CellTypeStyleTemplate;
    /**
     * <cn>设计时元素的宽度。</cn>
     */
    Width?: number;
    /**
     * <cn>设计时元素的高度。</cn>
     */
    Height?: number;
  }

  /**
   * <cn>单元格类型的默认值。</cn>
   */
  interface ICellTypeDefaultValue {
    /**
     * <cn>默认值。</cn>
     */
    Value: any;
  }

  /**
   * <cn>表示单元格的样式模板。</cn>
   */
  interface CellTypeStyleTemplate {
    /**
     * <cn>样式的唯一键。</cn>
     */
    Key: string;
    /**
     * <cn>样式的目录分类。</cn>
     */
    Category: string;
    /**
     * <cn>所有子样式。</cn>
     */
    Styles: { [key: string]: TemplatePartStyle };
  }

  /**
   * <cn>单元格样式模板的子样式。</cn>
   */
  interface TemplatePartStyle {
    /**
     * <cn>单元格状态改变时的动画周期。</cn>
     */
    Transition?: string;
    /**
     * <cn>普通状态时的样式。</cn>
     */
    NormalStyle?: PartStyleUnit;
    /**
     * <cn>鼠标在单元格上方时的样式。</cn>
     */
    HoverStyle?: PartStyleUnit;
    /**
     * <cn>单元格获得焦点时的样式。</cn>
     */
    FocusStyle?: PartStyleUnit;
    /**
     * <cn>单元格激活时的样式。比如按下按钮时。</cn>
     */
    ActiveStyle?: PartStyleUnit;
    /**
     * <cn>单元格禁用时的样式。</cn>
     */
    DisableStyle?: PartStyleUnit;
    /**
     * <cn>单元格选中时的样式。比如选中菜单类型单元格的某个子菜单。</cn>
     */
    SelectedStyle?: PartStyleUnit;
  }

  /**
   * <cn>样式模板子样式的具体属性。</cn>
   */
  interface PartStyleUnit {
    /**
     * <cn>字体颜色。</cn>
     */
    FontColor?: string;
    /**
     * <cn>背景色。</cn>
     */
    Background?: string;
    /**
     * <cn>边框 CSS 样式。它的优先级低于位置更具体的边框 CSS 字符串。</cn>
     */
    BorderString?: string;
    /**
     * <cn>边框圆角 CSS 样式。</cn>
     */
    BorderRadiusString?: string;
    /**
     * <cn>阴影 CSS 样式。</cn>
     */
    BoxShadowString?: string;
    /**
     * <cn>上边框 CSS 样式。</cn>
     */
    BorderTopString?: string;
    /**
     * <cn>右边框 CSS 样式。</cn>
     */
    BorderRightString?: string;
    /**
     * <cn>下边框 CSS 样式。</cn>
     */
    BorderBottomString?: string;
    /**
     * <cn>左边框 CSS 样式。</cn>
     */
    BorderLeftString?: string;
    /**
     * <cn>水平对齐的 CSS 样式。</cn>
     */
    CellHorizontalAlignment?: string;
    /**
     * <cn>垂直对齐的 CSS 样式。</cn>
     */
    CellVerticalAligment?: string;
    /**
     * <cn>左内边距的 CSS 样式。</cn>
     */
    PaddingLeft?: number;
    /**
     * <cn>右内边距的 CSS 样式。</cn>
     */
    PaddingRight?: number;
    /**
     * <cn>上内边距的 CSS 样式。</cn>
     */
    PaddingTop?: number;
    /**
     * <cn>下内边距的 CSS 样式。</cn>
     */
    PaddingBottom?: number;
    /**
     * <cn>左外边距的 CSS 样式。</cn>
     */
    MarginLeft?: number;
    /**
     * <cn>右外边距的 CSS 样式。</cn>
     */
    MarginRight?: number;
    /**
     * <cn>上外边距的 CSS 样式。</cn>
     */
    MarginTop?: number;
    /**
     * <cn>下外边距的 CSS 样式。</cn>
     */
    MarginBottom?: number;
  }

  /**
   * <cn>单元格类型基类。通过插件实现的单元格类型需要从这个类继承。</cn>
   */
  class CellTypeBase {
    /**
     * <cn>单元格的唯一键。</cn>
     */
    ID: string;
    /**
     * <cn>在设计器中设置的单元格数据。</cn>
     */
    CellElement: CellContentElement;
    /**
     * <cn>指定单元格是否在母版页中。</cn>
     */
    IsInMasterPage: boolean;

    constructor(...params: any[]);
    /**
     * <cn>创建该单元格类型的元素。需要在子类实现。</cn>
     * <cn></cn>
     */
    createContent(): JQuery;
    /**
     * <cn>获取该单元类型的默认值。页面加载后，单元格会显示默认值。如果默认值不是在设计器中设置的单元格值，则实现此方法。</cn>
     * <cn>jQuery，包含单元格类型元素的容器。</cn>
     */
    getDefaultValue(): ICellTypeDefaultValue;
    /**
     * <cn>执行一组命令。当需要在子类中执行命令时调用此方法。</cn>
     * <cn>一组命令的信息。</cn>
     */
    executeCommand(commands: object[]): void;
    /**
     * <cn>附加一个处理函数在依赖的单元格的值发生变化时进行处理。如果c#类实现了IDependenceCells接口，则在子类中通过该方法附加一个处理函数。</cn>
     * <cn>当依赖单元值发生变化时，每次执行的函数。</cn>
     */
    onDependenceCellValueChanged(valueChangedCallback: Function): void;
    /**
     * <cn>获取该单元类型是否具有焦点。需要在子类实现。</cn>
     */
    hasFocus(): boolean;
    /**
     * <cn>设置焦点到该单元格类型。需要在子类实现。</cn>
     */
    setFocus(): void;
    /**
     * <cn>获取单元格类型元素的容器。</cn>
     */
    getContainer(): JQuery;
    /**
     * <cn>设置该单元类型的值。如果单元格的值发生更改，该单元格需要做出改动，则实现此方法。</cn>
     * <cn>赋予给单元格的值。</cn>
     */
    setValueToElement(jelement: JQuery, value: any): void;
    /**
     * <cn>获取该单元类型的值。如果此单元格类型更改单元格的值，则实现此方法。</cn>
     * <cn>单元格的值。</cn>
     */
    protected getValueFromElement(): any;
    /**
     * <cn>提交该单元格类型的值。当单元格类型的值由UI改变时，调用此方法来提交值。</cn>
     */
    commitValue(): void;
    /**
     * <cn>数据校验。</cn>
     */
    validate(): void;
    /**
     * <cn>获取该单元类型是否禁用。</cn>
     */
    isDisabled(): boolean;
    /**
     * <cn>禁用这个单元格类型。如果此单元类型支持禁用状态，则实现此方法。</cn>
     */
    disable(): void;
    /**
     * <cn>启用这个单元格类型。如果此单元类型支持禁用状态，则实现此方法。</cn>
     */
    enable(): void;
    /**
     * <cn>获取该单元类型是否只读。</cn>
     */
    isReadOnly(): boolean;
    /**
     * <cn>设置单元格类型的只读状态。如果该单元格类型支持只读模式，则实现此方法</cn>
     * <cn>是否只读？</cn>
     */
    setReadOnly(value: boolean): void;
    /**
     * <cn>为该单元格类型设置字体样式。如果该单元格类型显示单元格的字体设置，则实现此方法。</cn>
     * <cn>新的字体样式</cn>
     */
    setFontStyle(styleInfo: StyleMetaData): void;
    /**
     * <cn>设置单元格的背景色。</cn>
     * <cn>新的背景色</cn>
     */
    setBackColor(color: string): void;
    /**
     * <cn>如果这个单元格需要在所有单元格创建完成并添加到页面之后做一些事情，则实现此方法。</cn>
     */
    onLoad(): void;
    /**
     * <cn>销毁这个单元格类型。如果这个单元格在页面跳转时需要做一些事情，则实现此方法。</cn>
     */
    destroy(): void;
    /**
     * <cn>重新加载此单元格类型的数据。如果该单元格类型使用表或视图的数据，则实现此方法。当表的数据可能发生更改时，将触发此方法。</cn>
     */
    reload(): void;

    /**
     * <cn>隐藏数据校验的Tooltip。</cn>
     */
    hideValidateTooltip(): void;

    /**
     * <cn>计算公式的值。</cn>
     * <cn>公式。</cn>
     * <cn>计算结果。</cn>
     */
    evaluateFormula(formula: string): any;

    /**
     * Internal use
     */
    setContextVariableValue(variableName: string, value: any): void;

    /**
     * Internal use
     */
    clearContextVariableValue(variableName: string): void;

    /**
     * <cn>获取用于公式计算的数据上下文。</cn>
     */
    getFormulaCalcContext(): FormulaCalcContext;
    /**
     * <cn>获取单元格的可见或可用权限信息。</cn>
     * <cn>单元格权限类型，如可用性权限。</cn>
     */
    protected getUIPermission(scope: UIPermissionScope): UIPermission;
    /**
     * <cn>检查当前用户对于单元是否有可见或可用权限。</cn>
     * <cn>单元格权限类型，如可用性权限。</cn>
     * <cn>如果当前用户有权限返回True，否则返回False。</cn>
     */
    protected checkAuthority(scope: UIPermissionScope): boolean;
    /**
     * <cn>检查当前用户是否在有权限的角色列表中。</cn>
     * <cn>有权限的角色列表。</cn>
     * <cn>如果当前用户有权限返回True，否则返回False。</cn>
     */
    protected checkRoleAuthority(allowRoles: string[]): boolean;

    /**
     * <cn>执行自定义命令对象列表。</cn>
     * @param command
     * <cn>命令。</cn>
     * @param initParam
     * <cn>上下文参数值。</cn>
     * @param eventType
     * <cn>事件类型（可选，用于区分不同命令）。</cn>
     */
    executeCustomCommandObject(
      command: ICustomCommandObject,
      initParam: { [paramName: string]: any },
      eventType?: string,
    );

    /**
     * <cn>获取数据库数据。</cn>
     * @param bindingDataSourceModel
     * <cn>数据源查询模型，从设计器的BindingDataSourceProperty生成。</cn>
     * @param options
     * <cn>查询配置。</cn>
     * @param callback
     * <cn>查询结果回调</cn>
     */
    getBindingDataSourceValue(bindingDataSourceModel: any, options: queryDataOption, callback: Function): void;

    /**
     * <cn>清除“获取数据库数据”构建的缓存。</cn>
     * @param bindingDataSourceModel
     * <cn>数据源查询模型，从设计器的BindingDataSourceProperty生成。</cn>
     * @param options
     * <cn>查询配置。</cn>
     */
    clearBindingDataSourceValueCache(bindingDataSourceModel: any, options: queryDataOption): void;
  }

  /**
   * <cn>自定义命令对象。</cn>
   */
  interface ICustomCommandObject {
    /**
     * <cn>命令列表。</cn>
     */
    Commands: any[];
    /**
     * <cn>上下文参数名配置。</cn>
     */
    ParamProperties: { [name: string]: string };
  }

  /**
   * <cn>数据查询配置。</cn>
   */
  interface queryDataOption {
    /**
     * <cn>最大查询结果行数。</cn>
     */
    top: number;
    /**
     * <cn>跳过的记录数。</cn>
     * */
    offset?: number;
    /**
     * <cn>查询条件。</cn>
     */
    queryConditions: queryCondition[];
    /**
     * <cn>查询条件关系。</cn>
     */
    relationType?: relationType;
    /**
     * <cn>是否去掉重复项。</cn>
     */
    distinct?: boolean;
    /**
     * <cn>分页模式</cn>
     */
    pagerMode?: boolean;
    /**
     * <cn>查询类型</cn>
     */
    queryValueType?: TableValueType;
    /**
     * <cn>开启排序</cn>
     */
    sort?: boolean;
    /**
     * <cn>排序参数</cn>
     */
    orderBySqlParams?: IOrderBySqlParam[];
  }
  /**
   * <cn>排序参数</cn>
   */
  interface IOrderBySqlParam {
    ColumnName: string;
    Order: SqlOrder;
  }
  /**
   * <cn>SqlOrder</cn>
   */
  const enum SqlOrder {
    ASC,
    DESC,
  }
  /**
   * <cn>查询类型</cn>
   */
  const enum TableValueType {
    SingleValue = 0,
    SingleRecord = 1,
    Table = 2,
    Count = 3,
  }
  /**
   * <cn>条件关系。</cn>
   */
  const enum relationType {
    /**
     * <cn>与关系。</cn>
     */
    And,
    /**
     * <cn>或关系。</cn>
     */
    Or,
  }
  /**
   * <cn>查询条件。</cn>
   */
  interface queryCondition {
    /**
     * <cn>列名。</cn>
     */
    columnName: string;
    /**
     * <cn>比较类型。</cn>
     */
    compareType: compareType;
    /**
     * <cn>比较值。</cn>
     */
    compareValue: any;
  }
  /**
   * <cn>比较类型。</cn>
   */
  const enum compareType {
    /**
     * <cn>等于。</cn>
     */
    EqualsTo,
    /**
     * <cn>不等于。</cn>
     */
    NotEqualsTo,

    /**
     * <cn>大于。</cn>
     */
    GreaterThan,
    /**
     * <cn>大等于。</cn>
     */
    GreaterThanOrEqualsTo,

    /**
     * <cn>小于。</cn>
     */
    LessThan,
    /**
     * <cn>小于等于。</cn>
     */
    LessThanOrEqualsTo,

    /**
     * <cn>以指定字符串开头。</cn>
     */
    BeginsWith,
    /**
     * <cn>不以指定字符串开头。</cn>
     */
    NotBeginWith,
    /**
     * <cn>以指定字符串结尾。</cn>
     */
    EndsWith,
    /**
     * <cn>不以指定字符串结尾。</cn>
     */
    NotEndWith,

    /**
     * <cn>包含指定字符串。</cn>
     */
    Contains,
    /**
     * <cn>不包含指定字符串。</cn>
     */
    NotContains,

    /**
     * <cn>在里边。</cn>
     */
    In,
    /**
     * <cn>不在里边。</cn>
     */
    NotIn,
  }

  /**
   * <cn>单元格的权限信息。</cn>
   */
  interface UIPermission {
    /**
     * <cn>单元格的名字或位置。如果单元格有名字，使用名字作为单元格权限的名字，否则使用单元格的位置信息作为名字，如"A1"。</cn>
     */
    Name: string;
    /**
     * <cn>单元格的类型。使用单元格类型作为分类依据，如"按钮"，"文本框"等。</cn>
     */
    Category?: string;
    /**
     * <cn>单元格的权限类型。</cn>
     */
    Scope: UIPermissionScope;
    /**
     * <cn>是否启用单元格权限设置。</cn>
     */
    Enabled: boolean;
    /**
     * <cn>有单元格权限的角色列表。</cn>
     */
    AllowRoles: string[];
    /**
     * <cn>单元格中所有子项的的单元格权限信息。</cn>
     */
    Children?: SubUIPermission[];
  }

  /**
   * <cn>单元格中子项的权限信息，例如菜单各子项的权限信息。</cn>
   */
  interface SubUIPermission {
    /**
     * <cn>可以唯一标时单元格子项的名称。</cn>
     */
    Name: string;
    /**
     * <cn>有单元格权限的角色列表。</cn>
     */
    AllowRoles: string[];
    /**
     * <cn>单元格子项的子项的单元格权限信息。</cn>
     */
    Children?: SubUIPermission[];
  }

  /**
   * <cn>单元格的权限类型。</cn>
   */
  const enum UIPermissionScope {
    /**
     * <cn>无。</cn>
     */
    None = 0,
    /**
     * <cn>可见性权限。</cn>
     */
    Visible = 1,
    /**
     * <cn>可用性权限。</cn>
     */
    Enable = 2,
    /**
     * <cn>可编辑权限。</cn>
     */
    Editable = 4,
    /**
     * <cn>可见性、可用性和可编辑权限。</cn>
     */
    All = 7,
  }

  /**
   * <cn>提供注册单元格类型函数的帮助类。</cn>
   */
  class CellTypeHelper {
    /**
     * <cn>注册一个单元格类型，将`javascript`单元格类型类与`C#`单元格类型类关联起来。</cn>
     * <cn>单元格类型的唯一标识符。标识符格式为: `Namespace.ClassName, AssemblyName`，是 C# 单元格类型类的`Namespace`，`ClassName`以及`AssemblyName`。</cn>
     * <cn>单元格类型的构造函数。</cn>
     * @example
     * ```javascript
     * Forguncy.CellTypeHelper.registerCellType("Namespace.ClassName, AssemblyName", customCellType);
     * Forguncy.CellTypeHelper.registerCellType("CarouselCellType.Carousel, CarouselCellType", CarouselCellType);
     * ```
     */
    static registerCellType(identifier: string, celltype: Function): void;
  }

  /**
   * <cn>命令类型基类。通过插件实现的命令类型需要从这个类继承。</cn>
   */
  class CommandBase {
    constructor();
    /**
     * <cn>C# 命令类属性的数据。</cn>
     */
    CommandParam: object;
    /**
     * <cn>执行这个命令。需要在子类实现。</cn>
     */
    execute();
    /**
     * <cn>将一个公式转换成单元格位置信息。</cn>
     * <cn>Excel 公式，比如`=A1`。</cn>
     * <cn>返回单元格的位置，如果公式不是指向单元格，比如`=SUM(1,2)`，返回 null。</cn>
     */
    protected getCellLocation(formula: string): CellLocationInfo;
    /**
     * <cn>计算公式。</cn>
     * <cn>公式。</cn>
     * <cn>计算结果。</cn>
     */
    evaluateFormula(formula: string): any;
    /**
     * <cn>获取用于公式计算的数据上下文。</cn>
     */
    getFormulaCalcContext(): FormulaCalcContext;

    /**
     * <cn>写日志。</cn>
     * <cn>日志内容。</cn>
     */
    public log(logText: string): void;

    /**
     * <cn>执行自定义命令对象列表。</cn>
     * @param command
     * <cn>命令。</cn>
     * @param initParam
     * <cn>上下文参数值。</cn>
     * @param eventType
     * <cn>事件类型（可选，用于区分不同命令）。</cn>
     */
    executeCustomCommandObject(
      command: ICustomCommandObject,
      initParam: { [paramName: string]: any },
      eventType?: string,
    );
  }

  /**
   * <cn>提供注册自定义命令类型函数的帮助类。</cn>
   */
  class CommandFactory {
    /**
     * <cn>注册一个命令，将`javascript`命令类与`C#`命令类关联起来。</cn>
     * <cn>命令的唯一标识符。标识符格式为: `Namespace.ClassName, AssemblyName`，使用 C# 命令类的`Namespace`，`ClassName`以及`AssemblyName`。</cn>
     * <cn>命令的构造器。</cn>
     * @example
     * ```javascript
     * Forguncy.CommandFactory.RegisterCommand("Namespace.ClassName, AssemblyName", customCommand);
     * ```
     */
    static registerCommand(commandType: string, command: any): void;
  }
}

declare namespace Forguncy {
  interface Cell {
    /**
     * <cn>获取单元格上的单元格类型。</cn>
     */
    getCellType(): Forguncy.Plugin.CellTypeBase;
  }
}
