/// <reference path="jquery.d.ts" />
/**
 * <en>There are some APIs can be used for only plug-in on this Namespace.</en>
 * <cn>在Forguncy命名空间下，有一些Api是只给插件使用的</cn>
 * <jp>Forguncyで使用可能なクラスやメソッドが含まれています。一部のメソッドは、プラグイン開発でのみ利用可能です。</jp>
 * <kr></kr>
 */
declare namespace Forguncy {
  /**
   * <en>The instance of ForguncyPage.</en>
   * <cn>ForguncyPage 的实例。</cn>
   * <jp>ForguncyPageのインスタンスを表します。</jp>
   * <kr></kr>
   */
  const Page: ForguncyPage;
  const CommandHelper: ForguncyCommandHelper;
  const Helper: ForguncyHelper;

  /**
   * <en>The events of page.</en>
   * <cn>页面事件。</cn>
   * <jp>ページのイベントを表します。</jp>
   * <kr></kr>
   */
  class PageEvents {
    /**
     * <en>Occurs when the page loaded.</en>
     * <cn>在页面加载完成时发生。</cn>
     * <jp>ページがロードされたとき、またはコンテナーセルによりサブページがロードされたときに発生します。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en></en><cn>下面的示例代码中，通过bind方法，给页面添加Loaded事件，当加载页面时，就会弹出一个警告框。</cn><jp>本サンプルコードでは、bindメソッドを使用してページにLoadedイベントを追加する例を示します。</jp><kr></kr>
     * // <en></en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en></en><cn>绑定页面Loaded事件</cn><jp>Loadedイベントにイベントハンドラを関連付ける。</jp><kr></kr>
     * page.bind("loaded", function (arg1, arg2) {
     *     // <en></en><cn>弹出警告框，显示页面1的页面名称</cn><jp>ページ名をダイアログボックスに表示する。</jp><kr></kr>
     *     alert(arg2.pageName);
     * });
     * ```
     */
    static Loaded: string;
    /**
     * <en>Occurs when the page is created and all data has loaded.</en>
     * <cn>在页面的所有数据加载完成时发生。</cn>
     * <jp>ページが作成され、すべてのデータがロードされたとき、またはコンテナーセルによりサブページが作成され、すべてのデータがロードされたときに発生します。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en></en><cn>下面的示例代码中，通过bind方法，给页面绑定PageDefaultDataLoaded事件，当加载页面并加载所有的数据时，就会弹出一个警告框。</cn><jp>本サンプルコードでは、bindメソッドを使用してページにPageDefaultDataLoadedイベントを追加する例を示します。</jp><kr></kr>
     * // <en></en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en></en><cn>绑定页面事件</cn><jp>PageDefaultDataLoadedイベントにイベントハンドラを関連付ける。</jp><kr></kr>
     * page.bind("pageDefaultDataLoaded", function (arg1, arg2) {
     *     // <en></en><cn>弹出警告框，显示页面1的页面名称</cn><jp>ページ名をダイアログボックスに表示する。</jp><kr></kr>
     *     alert(arg2.pageName);
     * });
     * ```
     */
    static PageDefaultDataLoaded: string;
    /**
     * <en>Occurs when current page's sub popup closed.</en>
     * <cn>在当前页面的弹出页关闭时发生。</cn>
     * <jp>現在のページのポップアップページが閉じられたときに発生します。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en></en><cn>下面的示例代码中，通过bind方法，给页面添加PopupClosed事件，当关闭当前页面的弹出页面时，就会弹出一个警告框。</cn><jp>本サンプルコードでは、bindメソッドを使用してページにPopupClosedイベントを追加する例を示します。</jp><kr></kr>
     * // <en></en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en></en><cn>绑定页面事件</cn><jp>PopupClosedイベントにイベントハンドラを関連付ける。</jp><kr></kr>
     * page.bind("popupClosed", function () {
     *     // <en></en><cn>弹出警告框</cn><jp>ダイアログボックスに表示する。</jp><kr></kr>
     *     alert("<en>Forguncy</en><cn>活字格</cn><jp>Forguncy</jp><kr>Forguncy</kr>");
     * });
     * ```
     */
    static PopupClosed: string;
  }

  /**
   * <en>Represents a page in runtime.</en>
   * <cn>页面对象。</cn>
   * <jp>ページオブジェクトを表します。</jp>
   * <kr></kr>
   */
  class ForguncyPage {
    /**
     * <en>Get a cell object by the cell's name.</en>
     * <cn>通过单元格名称获取单元格实例。</cn>
     * <jp>名前を指定してセル（Cellのインスタンス）を取得します。</jp>
     * <kr></kr>
     * @param name <en>The cell's name.</en>
     * <cn>单元格名称。</cn>
     * <jp>取得したいセルの名前。</jp>
     * <kr></kr>
     * @param includeSubPage <en>Specified whether finding cell in sub page. If ignore, the param will be true.</en>
     * <cn>指定是否在子页面中查找单元格。默认为 true。</cn>
     * <jp>コンテナーやタブコントロールのサブページ内を検索するかどうかを指定します。
     * true：検索します。既定値です。
     * false：検索しません。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>This example illustrate how to get a cell through method "getCell" and how to set cell's value by "setValue".</en><cn>下面的示例代码中，通过getCell方法，获取一个单元格实例，并设置单元格的值。</cn><jp>本サンプルコードでは、セルインスタンスを取得し、getCellメソッドによってセルの値を設定します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面。</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get cell by cell's name.</en><cn>获取单元格对象。</cn><jp>セルオブジェクトを取得する。</jp><kr></kr>
     * var cell = page.getCell("myCell");
     * // <en>Set cell's value.</en><cn>设置单元格的值。</cn><jp>セルの値を設定する。</jp><kr></kr>
     * cell.setValue("<en>Forguncy</en><cn>活字格</cn><jp>Forguncy</jp><kr>Forguncy</kr>");
     * ```
     */
    getCell(name: string, includeSubPage?: boolean): Cell;
    /**
     * <en>Get a cell object by the cell's location info.</en>
     * <cn>通过单元格的位置信息获取一个单元格对象。</cn>
     * <jp>セルの位置を指定してセル（Cellのインスタンス）を取得します。</jp>
     * <kr></kr>
     * @param cellLocation <en>The cell's location info.</en>
     * <cn>单元格的位置。</cn>
     * <jp>取得したいセルの位置。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>This example illustrates how to set cell's background color.</en><cn>下面的示例代码中，通过getCellByLocation方法，获取一个单元格对象，并设置其单元格背景色。</cn><jp>本サンプルコードでは、セルオブジェクトを取得し、getCellByLocationメソッドによってセルの背景色を設定します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get cell by it's location.</en><cn>获取单元格对象</cn><jp>セルオブジェクトを取得する。</jp><kr></kr>
     * var cell = page.getCellByLocation({
     * Row: 2,
     * Column: 3,
     * PageName: "<en>Page1</en><cn>页面1</cn><jp>ページ1</jp><kr></kr>"
     * });
     * // <en>Set cell's background color as red.</en><cn>设置单元格的背景色为红色</cn><jp>セルの背景色を赤に設定します。</jp><kr></kr>
     * var setColor = cell.setBackColor("red");
     * ```
     */
    getCellByLocation(cellLocation: CellLocationInfo): Cell;
    /**
     * <en>Get an array of cells with same name.</en>
     * <cn>通过单元格名称获取一组单元格实例。</cn>
     * <jp>名前を指定してセル範囲（Cell[]のインスタンス）を取得します。</jp>
     * <kr></kr>
     * @param name <en>The cells' name.</en>
     * <cn>单元格名称。</cn>
     * <jp>取得したいセル範囲の名前。</jp>
     * <kr></kr>
     * @param includeSubPage <en>Specified whether find cells in sub page. If ignore, the param will be true.</en>
     * <cn>指定是否在子页面中查找单元格。默认为 true。</cn>
     * <jp>コンテナーやタブコントロールのサブページ内を検索するかどうかを指定します。
     * true：検索します。既定値です。
     * false：検索しません。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get cell's array by name.</en><cn>获取单元格对象</cn><jp>セルオブジェクトを取得する。</jp><kr></kr>
     * var cell = page.getCellArray("myCell");
     * // <en>Get cell's length.</en><cn>获取单元格实例的长度</cn><jp>セルのインスタンス数を取得する。</jp><kr></kr>
     * var len = cell.length;
     * // <en>Popup alert window with message of cell's length.</en><cn>弹出警告框，显示单元格实例的长度</cn><jp>セルのインスタンス数をダイアログボックスに表示する。</jp><kr></kr>
     * alert(len);
     * ```
     */
    getCellArray(name: string, includeSubPage?: boolean): Cell[];
    /**
     * <en>Get an array of all content container cells and tab control cells in current page.</en>
     * <cn>获取所有选项卡和页面容器类型的单元格。</cn>
     * <jp>すべてのコンテナーやタブコントロールのセル（Cell[]のインスタンス）を取得します。</jp>
     * <kr></kr>
     * @param includeSubPage <en>Specified whether find cells in sub page. If ignore, the param will be true.</en>
     * <cn>指定是否在子页面中查找单元格。默认为 true。</cn>
     * <jp>コンテナーやタブコントロールのサブページ内を検索するかどうかを指定します。
     * true：検索します。既定値です。
     * false：検索しません。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * var containerCells = Forguncy.Page.getContainerCells();
     * var subPage = containerCells[0].getContentPage();
     * ```
     */
    getContainerCells(includeSubPage?: boolean): ContainerCellBase[];
    /**
     * <en>Get sub page info by page ID.</en>
     * <cn>通过页面 `ID` 获取子页面。</cn>
     * <jp>ページのIDからサブページ（SubPageのインスタンス）を取得します。戻り値はContentContainerCell.getContentPageメソッドやtabControlCell.getTabPageメソッドの戻り値と同様です。
     * アプリケーションの実行時には、各親ページ、サブページは一意なIDを持っています。 CellTypeBase.getFormulaCalcContextメソッド、およびCommandBase.getFormulaCalcContextメソッドを使用してページのIDを取得できます。</jp>
     * <kr></kr>
     * @param pageID <en>The page's unique ID. In browser, a normal page, master page and sub pages of content container cell type and tab control cell type both have its unique ID.</en>
     * <cn>页面的唯一标识符。在浏览器中，每个父页面和子页面都有其唯一的`ID`。</cn>
     * <jp>ページのID</jp>
     * <kr></kr>
     */
    getSubPageInfoByPageID(pageID: string): SubPage;
    /**
     * <en>Get a listview object by its name.</en>
     * <cn>通过表格名称获取表格实例。</cn>
     * <jp>名前を指定してリストビュー（ListViewのインスタンス）を取得します。</jp>
     * <kr></kr>
     * @param name <en>The listview's name.</en>
     * <cn>表格名称。</cn>
     * <jp>取得したいリストビューの名前。</jp>
     * <kr></kr>
     * @param includeSubPage <en>Specified whether find listview in sub page. If ignore, the param will be true.</en>
     * <cn>指定是否在子页面中查找单元格。默认为 true。</cn>
     * <jp>コンテナーやタブコントロールのサブページ内を検索するかどうかを指定します。
     * true：検索します。デフォルトです。
     * false：検索しません。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>This example illustrates how to get a listview by mehtod "getListView".</en><cn>下面的示例代码中，通过getListView方法，获取页面中指定的表格。</cn><jp>本サンプルコードでは、名前を指定してページ内のリストビューを取得します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get listview.</en><cn>获取表格对象</cn><jp>リストビューオブジェクトを取得する。</jp><kr></kr>
     * var listview = page.getListView("<en>table1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     * // <en>Get listview's name</en><cn>获取表格的名称</cn><jp>リストビューの名前を取得する。</jp><kr></kr>
     * var name = listview.getName();
     * // <en>Popup alert showing listview's name.</en><cn>弹出警告框，显示表格的名称</cn><jp>リストビューの名前をダイアログボックスに表示する。</jp><kr></kr>
     * alert(name);
     * ```
     */
    getListView(name: string, includeSubPage?: boolean): ListView;
    /**
     * <en>Get an array of all listviews in current page.</en>
     * <cn>获取页面内所有的表格。</cn>
     * <jp>ページ内のすべてのリストビューを取得します。</jp>
     * <kr></kr>
     * @param includeSubPage <en>Specified whether find listviews in sub page. If ignore, the param will be true.</en>
     * <cn>指定是否在子页面中查找单元格。默认为 true。</cn>
     * <jp>
     * コンテナーやタブコントロールのSubPage内を検索するかどうかを指定します。
     * true：検索します。デフォルトです。
     * false：検索しません。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>This example is about how to get all listviews in a page by method "getListViews".</en><cn>下面的示例代码中，通过getListViews方法，获取页面中所有的表格。</cn><jp>本サンプルコードでは、ページ内のすべてのリストビューを取得します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get all listviews.</en><cn>获取表格对象</cn><jp>ページ内のすべてのリストビューを取得する。</jp><kr></kr>
     * var listview = page.getListViews();
     * // <en>Get the length of listviews.</en><cn>获取表格实例的长度</cn><jp>リストビューのインスタンス数を取得する。</jp><kr></kr>
     * var len = listview.length;
     * // <en>Popup alert showing listviews' length.</en><cn>弹出警告框，显示表格实例的长度</cn><jp>リストビューのインスタンス数をダイアログボックスに表示する。</jp><kr></kr>
     * alert(len);
     * ```
     */
    getListViews(includeSubPage?: boolean): ListView[];
    /**
     * <en>Recalc all formulas.</en>
     * <cn>强制触发页面所有公式重算。</cn>
     * <jp>ページ内に設定されているすべての数式を再計算させます。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>This sample uses the recalc method to force all formulas on the page to be recalculated.</en><cn>下面的示例代码中，使用recalc的方法，强行触发页面上所有的公式重新进行了计算。</cn><jp>本サンプルコードでは、recalcメソッドを使用して、ページ上のすべての数式を強制的に再計算させます。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Forces all formulas on the page to be recalculated.</en><cn>强行触发页面上所有的公式重新进行计算</cn><jp>ページ上のすべての数式を強制的に再計算する。</jp><kr></kr>
     * page.recalc();
     * ```
     */
    recalc(): void;
    /**
     * <en>Suspend calc formulas.</en>
     * <cn>挂起页面的公式计算逻辑，通常在大量操作单元格值之前使用，以获得更好的性能。</cn>
     * <jp>ページ内に設定されているすべての数式の計算を中止します。このメソッドを実行するとresumeCalcメソッドを実行するまでは、数式の計算は行われません。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>This sample uses the suspendCalc method to suspend the calculation of all formulas on the page.</en><cn>下面的示例代码中，使用suspendCalc的方法，挂起页面上所有的公式，不进行计算。</cn><jp>本サンプルコードでは、suspendCalcメソッドを使用して、ページ上のすべての数式の計算を一時的に停止します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Suspend the calculation of all formulas on the page.</en><cn>暂停页面上公式的计算</cn><jp>ページ上の数式の計算を一時停止する。</jp><kr></kr>
     * page.suspendCalc();
     * ```
     */
    suspendCalc(): void;
    /**
     * <en>Resume calc formulas.</en>
     * <cn>恢复页面的公式计算逻辑，通常在大量操作单元格之后使用。要和`suspendCalc`方法成对使用。</cn>
     * <jp>ページ内に設定されているすべての数式の計算を再開します。suspendCalcメソッドで数式の計算を中止している場合に、このメソッドを実行して数式の計算を再開させます。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>This sample uses the resumeCalc method to resume the calculation of all formulas on the page.</en><cn>下面的示例代码中，使用resumeCalc的方法，恢复页面上所有的公式的计算。</cn><jp>本サンプルコードでは、resumeCalcメソッドを使用して、ページ上のすべての数式の計算を再開します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Resume the calculation of all formulas on the page.</en><cn>恢复页面上公式的计算</cn><jp>ページ上の数式の計算を再開する。</jp><kr></kr>
     * page.resumeCalc();
     * ```
     */
    resumeCalc(): void;
    /**
     * <en>Reload data from table and view used in current page.</en>
     * <cn>从当前页面中使用的表和视图中重新加载数据。</cn>
     * <jp>現在のページで使用されているテーブルとビューからデータを再読み込みします。</jp>
     * <kr></kr>
     * @param tableName <en>The table's name, if ignore this parameter, reload all tables' data.</en>
     * <cn>表名，如果忽略此参数，则重新加载所有表的数据。</cn>
     * <jp>テーブル名。このパラメーターを省略すると、すべてのテーブルのデータが再読み込みされます。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>This sample uses the reloadBindingData method to reload data from database.</en><cn>下面的示例代码中，通过reloadBindingData方法，重新从数据库加载数据。</cn><jp>本サンプルコードでは、reloadBindingDataメソッドを使用してデータベースからデータを再読み込みします。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Reload data from database.</en><cn>重新从数据库加载数据</cn><jp>データベースからデータを再読み込みする。</jp><kr></kr>
     * page.reloadBindingData(<en>"table1"</en><jp>"テーブル1"</jp><cn>"表格1"</cn><kr>"테이블 1"</kr>);
     * ```
     */
    reloadBindingData(tableName?: string): void;
    /**
     * <en>Get current user's name.</en>
     * <cn>获取当前登录用户的用户名，如果用户没有登录则返回空值。</cn>
     * <jp>ログイン中のユーザー名を取得します。ログインしていない場合には空文字が返されます。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>This sample uses the getUserName method to get the user name.</en><cn>下面的示例代码中，通过getUserName方法来获取用户名。</cn><jp>本サンプルコードでは、getUserNameメソッドを使用してユーザー名を取得します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get the username of the currently logged in user/</en><cn>获取当前登录用户的用户名</cn><jp>現在ログインしているユーザーのユーザー名を取得する。</jp><kr></kr>
     * var userName = page.getUserName();
     * // <en>Pops up an alert that shwing the username of the currently logged in user.</en><cn>弹出警告框，显示当前登录用户的用户名</cn><jp>現在ログインしているユーザーのユーザー名をダイアログボックスに表示する。</jp><kr></kr>
     * alert(userName);
     * ```
     */
    getUserName(): string;
    /**
     * <en>Get current user's info.</en>
     * <cn>获取当前登录用户的信息。</cn>
     * <jp>getUserNameでは、ユーザー名のみを取得しますが、getUserInfoではロールなどのユーザーの詳細情報を取得できます。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>This example shows how to get the detailed information of the currently logged-in user through the getUserInfo method.</en><cn>下面的示例代码中，通过getUserInfo方法，获取当前登录用户详细信息。</cn><jp>本サンプルコードでは、getUserInfoメソッドを使用して現在のログインユーザーの詳細を取得します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get the detailed information of the currently logged-in user.</en><cn>获取当前登录用户的详细信息</cn><jp>現在ログインしているユーザーの詳細を取得する。</jp><kr></kr>
     * var userInfo = page.getUserInfo();
     * // <en>Pops up a warning box to show the detailed information of the currently logged in user.</en><cn>弹出警告框，显示当前登录用户的详细信息</cn><jp>現在ログインしているユーザーの詳細をダイアログボックスに表示する。</jp><kr></kr>
     * alert(JSON.stringify(userInfo, null, " "));
     *
     * // <en>Get the user name of the currently logged-in user.</en><cn>获取当前登录用户的用户名</cn><jp>現在ログインしているユーザーのユーザー名を取得する。</jp><kr></kr>
     * var name = userInfo.UserName;
     * // <en>Get the role of the currently logged in user.</en><cn>获取当前登录用户的角色</cn><jp>現在ログインしているユーザーのロールを取得する。</jp><kr></kr>
     * var role = userInfo.Role;
     * // <en>Get the full name of the currently logged in user.</en><cn>获取当前登录用户的全名</cn><jp>現在ログインしているユーザーの氏名を取得する。</jp><kr></kr>
     * var fullName = userInfo.FullName;
     * ```
     */
    getUserInfo(): UserInfo;
    /**
     * <en>Get current page's name.</en>
     * <cn>获取当前页面的名称。</cn>
     * <jp>現在のページ名を取得します。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, the name of the current page is obtained through the getPageName method.</en><cn>下面的示例代码中，通过getPageName方法，获取当前页面的名称。</cn><jp>本サンプルコードでは、getPageNameメソッドを使用して現在のページ名を取得します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get current page name.</en><cn>获取当前页面名称</cn><jp>現在のページ名を取得する。</jp><kr></kr>
     * var pageName = page.getPageName();
     * // <en>Pops up a warning box to show current page name.</en><cn>弹出警告框，显示当前页面的名称</cn><jp>現在のページ名をダイアログボックスに表示する。</jp><kr></kr>
     * alert(pageName);
     * ```
     */
    getPageName(): string;
    /**
     * <en>Get current page's master page name.</en>
     * <cn>获取当前页面的母版页名称。</cn>
     * <jp>ページのマスターページ名を取得します。ページにマスターページが設定されていない場合は「null」が返ります。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, the getMasterPageName method is used to get the name of the master page of the current page.</en><cn>下面的示例代码中，通过getMasterPageName方法，获取当前页面的母版页的名称。如果当前页没有母版页，则返回null。</cn><jp>本サンプルコードでは、getMasterPageNameメソッドを使用して現在のページのマスターページの名前を取得します。 </jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get the master page name of the current page.</en><cn>获取当前页面的母版页名称</cn><jp>現在のページのマスターページ名を取得する。</jp><kr></kr>
     * var masterPageName = page.getMasterPageName();
     * // <en>Pops up a warning box to show the master page name.</en><cn>弹出警告框，显示母版页名称</cn><jp>マスターページ名をダイアログボックスに表示する。</jp><kr></kr>
     * alert(masterPageName);
     * ```
     */
    getMasterPageName(): string;
    /**
     * <en>Set current row of one Table in browser.</en>
     * <cn>设置当前行。</cn>
     * <jp>カレントレコードを設定します。たとえば、テーブル1のカレントレコードを1行目に設定することで、ページ上でテーブル1にデータ連結している個所に1行目のデータが表示されます。</jp>
     * <kr></kr>
     * @param currentRowParam <en>The current row info</en>
     * <cn>当前行信息。</cn>
     * <jp>テーブル名とクエリー条件から成るカレントレコードを指定する情報</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en></en><cn>使用setCurrentRow方法，参数为CurrentRowInfoParam：</cn><jp>本サンプルコードでは、パラメーターCurrentRowInfoParamを指定してカレントレコードを設定します。</jp><kr></kr>
     * // <en></en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en></en><cn>设置当前行</cn><jp>カレントレコードを設定する。</jp><kr></kr>
     * page.setCurrentRow(
     * {
     *         // <en></en><cn>当前行所在的表名</cn><jp>カレントレコードを設定するテーブル名。</jp><kr></kr>
     *         TableName: " <en>Table1</en><cn>员工表</cn><jp>テーブル1</jp><kr></kr>",
     *         // <en></en><cn>当前行的查询条件</cn><jp>カレントレコードを特定するクエリー条件。</jp><kr></kr>
     *         PrimaryKey: {
     *             ID: 1
     *         }
     * });
     *
     * // <en></en><cn>参数为CurrentRowInfoPluginParam，一般在插件开发中使用。比如，下面的代码是插件命令SetCurrentRowCommand的一部分实现：</cn><jp>本サンプルコードは、主にプラグイン開発で使用されるパラメーターCurrentRowInfoPluginParamを指定する方法を示します。たとえば、プラグインコマンドSetCurrentRowCommandの一部として次のコードが実装されます。</jp><kr></kr>
     * SetCurrentRowCommand.prototype.execute = function () {
     *         Forguncy.Page.setCurrentRow({
     *                 QueryCondition: this.CommandParam.CurrentRowInfo,
     *                 FormulaCalcContext: this.getFormulaCalcContext()
     *         });
     * }
     * ```
     */
    setCurrentRow(currentRowParam: CurrentRowInfoParam | CurrentRowInfoPluginParam): void;

    /**
     * <en>Attach a handler to current page's `loaded` event.</en>
     * <cn>绑定当前页面的`loaded`事件。</cn>
     * <jp>ページの準備ができた時点で、指定したコールバック関数を実行します。  </jp>
     * <kr></kr>
     * @param fn <en>The function to execute each time the event is triggered.</en>
     * <cn>事件处理函数。</cn>
     * <jp>ページ読み込み完了時に実行するコールバック関数。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en></en><cn>下面的示例代码中，使用ready的方法，在ready方法的回调函数中加入页面处理逻辑，获得当前登录用户的用户名。</cn><jp>本サンプルコードでは、readyメソッドを使用し、コールバック関数内で現在ログインしているユーザーのユーザー名を取得します。</jp><kr></kr>
     * // <en></en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en></en><cn>在ready方法的回调函数中加入页面处理逻辑</cn><jp>readyメソッドのコールバック関数にページ処理を記述する。</jp><kr></kr>
     * page.ready(function () {
     *         // <en></en><cn>绑定单元格button的事件</cn><jp>ボタン型セルのクリック時のイベントをバインドする。</jp><kr></kr>
     *         page.getCell("button").bind("click", function () {
     *                 // <en></en><cn>弹出警告框，显示当前登录用户的用户名</cn><jp>現在ログインしているユーザーのユーザー名をダイアログボックスに表示する。</jp><kr></kr>
     *                 alert(page.getUserName());
     *         })
     * });
     * ```
     */
    ready(fn: Function): void;
    /**
     * <en>Attach a handler to an event for the page.</en>
     * <cn>为页面绑定事件。可以给当前页面、指定页面或所有页面绑定事件。</cn>
     * <jp>ページが持つイベントに対してイベントハンドラーを関連付けます。
     * <h4>イベントへのデータの受け渡し</h4>
     * イベントハンドラーにデータを受け渡すには、第2パラメーターに指定します。その場合、イベントハンドラーは第3パラメーターに指定します。 受け渡されたデータは、イベントハンドラーにおける第1パラメーターのdataプロパティから参照できます。</jp>
     * <kr></kr>
     * @param eventType <en>Required. A string containing the page event types. Please see `PageEvents` class.</en>
     * <cn>表示页面事件类型的字符串。页面支持的事件请参考 `PageEvents` 类 。</cn>
     * <jp>関連付けするイベントを表す文字列。ページでサポートされているイベントについては、{@link Forguncy.PageEvents PageEventsクラス}を参照してください。</jp>
     * <kr></kr>
     * @param data <en>Optional. An object containing data that will be passed to the event handler.</en>
     * <cn>可选参数，如果不为忽略表示给事件处理函数传递的自定义参数。</cn>
     * <jp>イベントハンドラーに渡すデータ。関数では第1パラメーターのdataプロパティから参照します。本パラメーターは省略可能です。</jp>
     * <kr></kr>
     * @param fn <en>Required. A function to execute each time the event is triggered.</en>
     * <cn>事件处理函数。</cn>
     * <jp>イベント発生時に実行される関数。</jp>
     * <kr></kr>
     * @param targetPage <en>Optional. The page's name. If attach the handler to all pages, use `*`. If ignore, attach the handler for current page.</en>
     * <cn>页面的名称。如果绑定所有页面的事件，请使用`*`。如果忽略，则绑定到当前页面。</cn>
     * <jp>ページ名。すべてのページのイベントをバインドする場合は、「*」を使用します。 省略すると、現在のページにバインドされます。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>If there are two pages named `Page1`,`Page2`</en><cn>如果有两个页面：`Page1`和`Page2`</cn><jp>「ページ1」と「ページ2」の2つのページがある場合の例を示します。</jp><kr></kr>
     * var loadedEvent = Forguncy.PageEvents.Loaded;
     * //　<en>User defined parameters.</en><cn>自定义参数</cn><jp>変数を定義する。</jp><kr></kr>
     * var text = "ready";
     *
     * // <en>When page is loaded, a message box will show that the current page is `Page1`.</en><cn>当前页面是页面1，在页面准备好后，将弹出提示框显示当前的页面名称。</cn><jp>現在のページは「ページ1」です。ページの準備が整うと、ダイアログボックス上に現在のページ名である「ページ1」が表示されます。</jp><kr></kr>
     * Forguncy.Page.bind("loaded", function (arg1, arg2) {
     *     alert(arg2.pageName);
     * });
     *
     * // <en>When the `Page1` is loaded, a message box will show page name of `Page1`.</en><cn>当`Page1`准备好时，弹出提示框显示`Page1`的页面名称。</cn><jp>パラメーターのページ名に明示的に「ページ1」を指定します。ページの準備が整うと、ダイアログボックス上に指定したページの名称「ページ1」が表示されます。</jp><kr></kr>
     * Forguncy.Page.bind("loaded", function (arg1, arg2) {
     *     alert(arg2.pageName);
     * }, "<en>Page1<cn>页面1</cn><jp>ページ1</jp><kr></kr>");
     *
     * // <en>When the `Page1` is loaded, a message box will show customer text.</en><cn>当`Page1`准备好时，弹出自定义内容的提示框。</cn><jp>「ページ1」の準備ができると、ダイアログボックス上にパラメーターのデータとして渡された文字列「ready」が表示されます。</jp><kr></kr>
     * var text = "ready";
     * Forguncy.Page.bind("loaded", text, function (arg1, arg2) {
     *     alert(arg1.data);
     * }, "Page1");
     *
     * // <en>When the `Page1` or `Page2` is loaded, a message box will show its page name.</en><cn>当`Page1`和`Page2`准备好时, 弹出框将显示它们的页面名称。</cn><jp>「ページ1」、もしくは「ページ2」のいずれかのページの準備ができると、ダイアログボックス上にそのページ名が表示されます。</jp><kr></kr>
     * Forguncy.Page.bind("loaded", function (arg1, arg2) {
     *     alert(arg2.pageName);
     * }, "*");
     * ```
     */
    bind(eventType: string, data?: any, fn?: any, targetPage?: string): void;
    /**
     * <en>Remove handlers to an event for the page.</en>
     * <cn>取消特定事件的绑定。该方法能够移除被选的事件处理程序，或者当事件发生时终止指定函数的运行。</cn>
     * <jp>ページから指定したイベントハンドラの関連付けを解除します。第2パラメーターを省略した場合、指定イベントに関連付けされたすべてのイベントハンドラの関連付けが解除されます。</jp>
     * <kr></kr>
     * @param eventType <en>Required. A string containing the page event types. Please see `PageEvents` class.</en>
     * <cn>表示页面事件类型的字符串。页面支持的事件请参考`PageEvents`类 。</cn>
     * <jp>関連付けを削除するイベントを表す文字列。ページでサポートされているイベントについては、{@link Forguncy.PageEvents PageEventsクラス}を参照してください。</jp>
     * <kr></kr>
     * @param fn <en>Optional. A function to remove for the event. If ignore, remove all hanlers to the event for the page.</en>
     * <cn>事件处理函数。如果忽略，则取消绑定页面上该事件类型的所有处理函数。</cn>
     * <jp>関連付けを解除するイベントハンドラーの関数。 本パラメーターを省略した場合、ページ上のすべてのそのイベントの種類のイベントハンドラーの関連付けを解除します。本パラメーターは省略可能です。</jp>
     * <kr></kr>
     * @param targetPage <en>Optional. The page's name. If remove a handler which bind for targetPage `*`, still use `*`. If ignore, remove the handler for current page.</en>
     * <cn>页面的名称。如果取消绑定所有页面的事件，请使用`*`。如果忽略，则取消绑定当前页面的事件。</cn>
     * <jp>対象ページ名。すべてのページのイベントに対する関連付けを解除する場合は、「*」を指定します。省略した場合、現在のページに対してイベントに対する関連付け解除を行います。本パラメーターは省略可能です。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en></en><cn>下面的示例代码中，通过unbind方法，移除页面事件的绑定。</cn><jp>本サンプルコードでは、unbindメソッドを使用してページイベントの関連付けを解除する方法をいくつか示します。</jp><kr></kr>
     * // <en></en><cn>如果有两个页面：页面1和页面2。当前页面是页面1</cn><jp>「ページ1」と「ページ2」の2つのページがある場合の例を示します。現在のページは「ページ1」です。</jp><kr></kr>
     * var eventHandler = function (arg1, arg2) {
     *     alert(arg2.pageName);
     * };
     * // <en></en><cn>绑定事件</cn><jp>イベントハンドラーの関連付けを行う。</jp><kr></kr>
     * Forguncy.Page.bind("Loaded", eventHandler);
     *
     * // <en></en><cn>取消特定页面特定事件处理函数的绑定：</cn><jp>対象ページ名を指定して、そのページにおける特定のイベントハンドラーの関連付けを解除する。</jp><kr></kr>
     * Forguncy.Page.unbind("Loaded", eventHandler, "<en>Page1</en><cn>页面1</cn><jp>ページ1</jp><kr></kr>");
     *
     * // <en></en><cn>取消当前页面特定事件处理函数的绑定：</cn><jp>現在のページにおける特定のイベントハンドラーの関連付けを解除する。</jp><kr></kr>
     * Forguncy.Page.unbind("Loaded", eventHandler);
     *
     * // <en></en><cn>取消当前页面某事件所有处理函数的绑定：</cn><jp>現在のページにおいて指定したイベントに対するすべてのイベントハンドラーの関連付けを解除する。</jp><kr></kr>
     * Forguncy.Page.unbind("Loaded");
     *
     * // <en></en><cn>取消绑定时targetPage传"*"的事件处理函数的绑定：</cn><jp>すべてのページにおいて指定したイベントに対する特定のイベントハンドラーの関連付けを解除する。</jp><kr></kr>
     * Forguncy.Page.unbind("Loaded", eventHandler, "*");
     * ```
     */
    unbind(eventType: any, fn?: Function, targetPage?: string): void;
    /**
     * <en>Remove all handlers for the page.</en>
     * <cn>取消页面上所有事件的绑定。</cn>
     * <jp>ページ上のすべてのイベントハンドラーの関連付けを解除します。</jp>
     * <kr></kr>
     * @param targetPage <en>Optional. The page's name. If remove a handler which bind for targetPage `*`, still use `*`. If ignore, remove the handler for current page.</en>
     * <cn>页面的名称。如果绑定时`targetPage`使用的是`*`的，则仍然使用`*`。如果忽略，则删除当前页面的所有绑定。</cn>
     * <jp>対象ページ名。すべてのページのイベントに対する関連付けを解除する場合は、「*」を指定します。省略した場合、現在のページに対してイベントに対する関連付け解除を行います。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en></en><cn>下面的示例代码中，通过unbind方法，移除页面事件的绑定。</cn><jp>本サンプルコードでは、unbindメソッドを使用してページイベントの関連付けを解除する方法をいくつか示します。</jp><kr></kr>
     * // <en></en><cn>如果有两个页面：页面1和页面2。当前页面是页面1</cn><jp>「ページ1」と「ページ2」の2つのページがある場合の例を示します。現在のページは「ページ1」です。</jp><kr></kr>
     * var eventHandler = function (arg1, arg2) {
     *     alert(arg2.pageName);
     * };
     * // <en></en><cn>绑定事件</cn><jp>イベントハンドラーの関連付けを行う。</jp><kr></kr>
     * Forguncy.Page.bind("Loaded", eventHandler);
     *
     * // <en></en><cn>取消绑定到当前页面的所有事件</cn><jp>現在のページからすべてのイベントハンドラーの関連付けを解除する。</jp><kr></kr>
     * Forguncy.Page.unbindAll();
     *
     * // <en></en><cn>取消绑定页面1的所有事件</cn><jp>指定したページにおけるすべてのイベントハンドラーの関連付けを解除する。</jp><kr></kr>
     * Forguncy.Page.unbindAll("<en>Page1</en><cn>页面1</cn><jp>ページ1</jp><kr></kr>");
     *
     * // <en></en><cn>取消绑定所有全局事件</cn><jp>全ページにおけるすべてのイベントハンドラーの関連付けを解除する。</jp><kr></kr>
     * Forguncy.Page.unbindAll("*");
     * ```
     */
    unbindAll(targetPage?: string): void;
    /**
     * <en>The time auto disconnect to release concurrency licence if user do not operation the page.</en>
     * <cn>用户操作超时时间，将自动断开连接并释放并发用户数。</cn>
     * <jp>本プロパティを使用することで、特定のページだけタイムアウト値を変更できます。タイムアウト値とは、ユーザーが一定期間Forguncyアプリケーションを操作しなかった場合に、Forguncyアプリケーションが自動切断され、同時接続数としてカウントされなくなる場合の時間です。</jp>
     * <kr></kr>
     * <en>The unit is minute, default value is zero mean never disconnect.</en>
     * <cn>单位是分钟，默认值是`0`，同时意味着永不自动断开。</cn>
     * <jp>設定する数値の単位は分で、「0」を設定した場合タイムアウトによる切断は行われません。既定値は「0」です。</jp>
     * <kr></kr>
     * <en>If user change it to `30`, means if user do not operate the page for `30` minutes. the page will be disconnected.</en>
     * <cn>如果修改为`30`，用户未在页面进行任何操作，页面将在`30`分钟后自动断开。</cn>
     * <jp>たとえば「30」を設定した場合、そのページ上でユーザーが30分以上操作を行わなければ、自動切断の対象となります。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>Set the current page timeout value to 30 minutes.</en><cn>将当前页面超时时间设置为30分钟。</cn><jp>現在のページのタイムアウト値を30分に設定する。</jp><kr></kr>
     * Forguncy.Page.AutoDisconnectTimeout = 30;
     * ```
     */
    AutoDisconnectTimeout: number;
  }

  /**
   * <en>Represents command related help method.</en>
   * <cn>提供命令相关的帮助方法</cn>
   * <jp>コマンドに関係するヘルパーメソッドを提供するクラス。</jp>
   * <kr></kr>
   */
  class ForguncyCommandHelper {
    /**
     * <en>Execute the command of indicated cell</en>
     * <cn>执行指定名称单元格的命令</cn>
     * <jp>指定したセルのコマンドを実行します。</jp>
     * <kr></kr>
     * @param cellName <en>The name of cell</en>
     * <cn>单元格名称。</cn>
     * <jp>セル名。</jp>
     * <kr></kr>
     * @param completedCallback <en>The call back function when command executed.</en>
     * <cn>命令执行后的回调函数。</cn>
     * <jp>コマンドが実行された時のコールバック関数を指定します。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * Forguncy.CommandHelper.executeCellCommand("cellName", function(){
     *     console.log("Exectue Completed");
     * });
     * ```
     */
    executeCellCommand(cellName: string, completedCallback?: Function): void;
    /**
     * <en>Get variable value when command executing.</en>
     * <cn>在命令执行过程中，获取命令变量的值</cn>
     * <jp>コマンド実行時の変数の値を取得します。</jp>
     * <kr></kr>
     * @param variableName <en>The variable name</en>
     * <cn>变量名。</cn>
     * <jp>変数名。</jp>
     * <kr></kr>
     * @returns <en>The variable value.</en>
     * <cn>变量的值。</cn>
     * <jp>変数の値。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * Forguncy.CommandHelper.getVariableValue("variableName");
     * ```
     */
    getVariableValue(variableName: string): any;
    /**
     * <en>Set variable value when command executing.</en>
     * <cn>在命令执行过程中，设置命令变量的值</cn>
     * <jp>コマンド実行時に変数に値を設定します。</jp>
     * <kr></kr>
     * @param variableName <en>The variable name</en>
     * <cn>变量名。</cn>
     * <jp>変数名。</jp>
     * <kr></kr>
     * @param value <en>The value</en>
     * <cn>值。</cn>
     * <jp>変数の値。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * Forguncy.CommandHelper.setVariableValue("variableName", 123);
     * ```
     */
    setVariableValue(variableName: string, value: any): void;
    /**
     * <en>Get all variables name and value when command executing.</en>
     * <cn>在命令执行过程中，获取所有变量名称和值</cn>
     * <jp>コマンド実行時にすべての変数名とその値を取得します。</jp>
     * <kr></kr>
     * @returns <en>The list of all variables name and value pair.</en>
     * <cn>所有变量的名称和值的列表。</cn>
     * <jp>変数名を項目名とする配列型の変数。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * var variables = Forguncy.CommandHelper.getAllVariableValues();
     * for(var name in variables){
     *     console.log("variable name: " + name);
     *     console.log(variables[name]);
     * }
     * ```
     */
    getAllVariableValues(): { [variableName: string]: any };
  }

  /**
   * <en>The current row info which includes query condition. It's for plugin.</en>
   * <cn>包含查询条件的当前行信息。用于插件。</cn>
   * <jp>カレントレコードを指定するためのクエリー条件を表します。プラグイン開発において使用されます。</jp>
   * <kr></kr>
   */
  interface CurrentRowInfoPluginParam {
    /**
     * <en>The condition about which row is current row.</en>
     * <cn>当前行的查询条件。</cn>
     * <jp>カレントレコードを特定するためのクエリー条件。IBuilderCommandContext.GetQueryConditionWindowメソッド、またはIBuilderContext.GetQueryConditionWindowメソッドによって取得できます。</jp>
     * <kr></kr>
     */
    QueryCondition: any;
    /**
     * <en>A formula calc context, used when QueryCondition contain formula.</en>
     * <cn>公式计算时的数据上下文。用于包含公式的`QueryCondition`。</cn>
     * <jp>数式が計算されるときのデータコンテキスト。「QueryCondition」が数式を含む場合に使用されます。{@link Forguncy.Plugin.CellTypeBase.getFormulaCalcContext CellTypeBase.getFormulaCalcContextメソッド}、または{@link Forguncy.Plugin.CommandBase.getFormulaCalcContext CommandBase.getFormulaCalcContextメソッド}によって取得できます。</jp>
     * <kr></kr>
     */
    FormulaCalcContext: FormulaCalcContext;
  }

  /**
   * <en>The current row info of specified table.</en>
   * <cn>指定表的当前行信息。</cn>
   * <jp>カレントレコードを指定するための情報を表します。{@link Forguncy.ForguncyPage.setCurrentRow | setCurrentRowメソッド}に使用されます。</jp>
   * <kr></kr>
   */
  interface CurrentRowInfoParam {
    /**
     * <en>The table's name.</en>
     * <cn>表名。</cn>
     * <jp>カレントレコードを指定する対象のテーブル名。</jp>
     * <kr></kr>
     */
    TableName: string;
    /**
     * <en>The primary key of current row.</en>
     * <cn>当前行的主键。</cn>
     * <jp>カレントレコードを指定するクエリー条件。</jp>
     * <kr></kr>
     */
    PrimaryKey: {
      [primaryColumnName: string]: any;
    };
  }

  /**
   * <en>The events of cell.</en>
   * <cn>单元格支持的事件。</cn>
   * <jp>セルがサポートするイベント。</jp>
   * <kr></kr>
   */
  class CellEvents {
    /**
     * <en>Occurs when cell's value changed.</en>
     * <cn>单元格的值变化时发生。</cn>
     * <jp>セルの値が変更されたときに発生します。値を持つことが可能な全てのセル型で使用できます。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en></en><cn>下面的示例代码中，通过bind方法，给组合框添加ValueChanged事件，当单元格的值改变时，就会弹出一个警告框。</cn><jp>本サンプルコードでは、bindメソッドを使用してコンボボックス型セルにValueChangedイベントを追加し、コンボボックスの値が変更された際にダイアログボックスを表示します。</jp><kr></kr>
     * // <en></en><cn>定义事件处理函数</cn><jp>イベントハンドラーの定義。</jp><kr></kr>
     * var value = function(arg) {
     *     alert("<en>Forguncy</en><cn>活字格</cn><jp>Forguncy</jp><kr>Forguncy</kr>");
     * }
     * // <en></en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en></en><cn>获取当前页面上名称为myCell的单元格</cn><jp>現在のページで「myCell」という名前のセルを取得する。</jp><kr></kr>
     * var cell = page.getCell("myCell");
     * // <en></en><cn>绑定单元格的事件</cn><jp>イベントハンドラーをValueChangedイベントに関連付ける。</jp><kr></kr>
     * cell.bind("valueChanged", value);
     * ```
     */
    static ValueChanged: string;
    /**
     * <en>Occurs when click the cell. Support for button, image and hyperlink cell type.</en>
     * <cn>单击单元格时触发，支持按钮、图片和超链接单元格类型。</cn>
     * <jp>セルがクリックされたときに発生します。標準、ボタン、ハイパーリンク、画像のセル型で使用できます。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en></en><cn>下面的示例代码中，通过bind方法，给按钮添加点击事件，当单击按钮时，弹出一个警告框。</cn><jp>本サンプルコードでは、bindメソッドを使用してボタン型セルにClickイベントを追加し、ボタンクリックによってダイアログボックスを表示します。</jp><kr></kr>
     * // <en></en><cn>给按钮绑定点击事件处理函数</cn><jp>イベントハンドラーの定義。</jp><kr></kr>
     * var onClick = function(arg) {
     *     alert("<en>Forguncy</en><cn>活字格</cn><jp>Forguncy</jp><kr>Forguncy</kr>");
     * }
     * // <en></en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en></en><cn>获取当前页面上名称为button的按钮</cn><jp>現在のページで「button」という名前のボタン型セルを取得する。</jp><kr></kr>
     * var cell = page.getCell("button");
     * // <en></en><cn>绑定单元格的事件</cn><jp>イベントハンドラーをClickイベントに関連付ける。</jp><kr></kr>
     * cell.bind("click", onClick);
     * ```
     */
    static Click: string;
    /**
     * <en>Occurs when mouse enter the cell. Support for button, image and hyperlink cell type.</en>
     * <cn>当鼠标进入单元格时触发，支持按钮、图片和超链接单元格类型。</cn>
     * <jp>マウスなどのポインティングデバイスがセルの領域内に入ったときに発生します。標準、ボタン、ハイパーリンク、画像のセル型で使用できます。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en></en><cn>下面的示例代码中，通过bind方法，给图片添加MouseEnter事件，当鼠标进入图片单元格时，就会弹出一个警告框。</cn><jp>本サンプルコードでは、bindメソッドを使用して画像型セルにMouseEnterイベントを追加し、マウスカーソルがセルの領域内に入ることによってダイアログボックスを表示します。</jp><kr></kr>
     * // <en></en><cn>定义事件处理函数</cn><jp>イベントハンドラーの定義。</jp><kr></kr>
     * var enter = function(arg) {
     *     alert("<en>Forguncy</en><cn>活字格</cn><jp>Forguncy</jp><kr>Forguncy</kr>");
     * }
     * // <en></en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en></en><cn>获取当前页面上名称为picture的单元格</cn><jp>現在のページで「picture」という名前のセルを取得する。</jp><kr></kr>
     * var cell = page.getCell("picture");
     * // <en></en><cn>绑定单元格的事件</cn><jp>イベントハンドラーをMouseEnterイベントに関連付ける。</jp><kr></kr>
     * cell.bind("mouseEnter", enter);
     * ```
     */
    static MouseEnter: string;
    /**
     * <en>Occurs when mouse leave the cell. Support for button, image and hyperlink cell type.</en>
     * <cn>当鼠标离开单元格时触发，支持按钮、图片和超链接单元格类型。</cn>
     * <jp>マウスなどのポインティングデバイスがセルの領域内から外に出たときに発生します。標準、ボタン、ハイパーリンク、画像のセル型で使用できます。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en></en><cn>下面的示例代码中，通过bind方法，给图片添加MouseLeave事件，当鼠标离开图片单元格时，就会弹出一个警告框。</cn><jp>本サンプルコードでは、bindメソッドを使用して画像型セルにMouseLeaveイベントを追加し、マウスカーソルがセルの領域外に出ることによってダイアログボックスを表示します。</jp><kr></kr>
     * // <en></en><cn>定义事件处理函数</cn><jp>イベントハンドラーの定義。</jp><kr></kr>
     * var leave = function(arg) {
     *     alert("<en>Forguncy</en><cn>活字格</cn><jp>Forguncy</jp><kr>Forguncy</kr>");
     * }
     * // <en></en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en></en><cn>获取当前页面上名称为picture的单元格</cn><jp>現在のページで「picture」という名前のセルを取得する。</jp><kr></kr>
     * var cell = page.getCell("picture");
     * // <en></en><cn>绑定单元格的事件</cn><jp>イベントハンドラーをMouseLeaveイベントに関連付ける。</jp><kr></kr>
     * cell.bind("mouseLeave", leave);
     * ```
     */
    static MouseLeave: string;
    /**
     * <en>Occurs when cell's selected item changed. Support for combobox and userselector cell type.</en>
     * <cn>当单元格的选定项改变时触发。支持组合框和用户选择框单元格类型。</cn>
     * <jp>選択項目が変更されたときに発生します。コンボボックス、ユーザー選択コンボボックスのセル型で使用できます。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en></en><cn>下面的示例代码中，通过bind方法，给组合框添加SelectionChanged事件，当组合框的选定项改变时，就会弹出一个警告框。</cn><jp>本サンプルコードでは、bindメソッドを使用してコンボボックス型セルにSelectionChangedイベントを追加し、コンボボックスの選択項目が変更された際にダイアログボックスを表示します。</jp><kr></kr>
     * // <en></en><cn>定义事件处理函数</cn><jp>イベントハンドラーの定義。</jp><kr></kr>
     * var select = function(arg) {
     *     alert("<en>Forguncy</en><cn>活字格</cn><jp>Forguncy</jp><kr></kr>");
     * }
     * // <en></en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en></en><cn>获取当前页面上名称为combo的单元格</cn><jp>現在のページで「combo」という名前のセルを取得する。</jp><kr></kr>
     * var cell = page.getCell("combo");
     * // <en></en><cn>绑定单元格的事件</cn><jp>イベントハンドラーをSelectionChangedイベントに関連付ける。</jp><kr></kr>
     * cell.bind("selectionChanged", select);
     * ```
     */
    static SelectionChanged: string;
    /**
     * <en>Occurs when pivot table cell clicked.</en>
     * <cn>数据透视表的单元格点击时发生。</cn>
     * <jp>ピボットテーブルのデータ領域がクリックされたときに発生します。ピボットテーブルのセル型で使用できます。</br>イベント発生時に実行される関数の第2パラメーターについては{@link Forguncy.PivotTableEventParameter PivotTableEventParameterクラス}を参照してください。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en></en><cn></cn><jp>本サンプルコードでは、bindメソッドを使用してコンボボックス型セルにPivottableClickイベントを追加し、ピボットテーブルをクリックした際にクリック位置に応じた情報をダイアログボックスに表示します。</jp><kr></kr>
     * (function () {
     *     // <en></en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     *     var p = Forguncy.Page;
     *     p.ready(function () {
     *         // <en></en><cn></cn><jp>現在のページで「pivottablecell」という名前のセルを取得する。</jp><kr></kr>
     *         var pivottable = p.getCell("pivottablecell");
     *         // <en></en><cn>绑定单元格的事件</cn><jp>イベントハンドラーをPivottableClickイベントに関連付ける。</jp><kr></kr>
     *         pivottable.bind("pivottableClick", function (e, param) {
     *             if (param.dataType === "Data") {
     *                 let message = "<en></en><cn></cn><jp>セルの位置（</jp><kr></kr>" + param.row + "、" + param.col + "<en></en><cn></cn><jp>）がクリックされました。\n</jp><kr></kr>";
     *                 message += "<en></en><cn></cn><jp>列ヘッダー：\n</jp><kr></kr>"
     *                 for (let i = 0; i < param.colHeaders.length; i++) {
     *                     message += param.colHeaders[i].label + " : " + param.colHeaders[i].header + "\n";
     *                 }
     *                 message += "<en></en><cn></cn><jp>行ヘッダー：</jp><kr></kr>";
     *                 message += "\n";
     *                 for (let j = 0; j < param.rowHeaders.length; j++) {
     *                     message += param.rowHeaders[j].label + " : " + param.rowHeaders[j].header + "\n";
     *                 }
     *                 message += "<en></en><cn></cn><jp>値：</jp><kr></kr>" + param.value;
     *                 alert(message)
     *             } else if (param.dataType === "RowTotal") {
     *                 let message = param.row + "<en></en><cn></cn><jp>行目の総計セルがクリックされました。\n</jp><kr></kr>";
     *                 message += "<en></en><cn></cn><jp>行ヘッダー：\n";
     *                 for (let j = 0; j < param.rowHeaders.length; j++) {
     *                     message += param.rowHeaders[j].label + "：" + param.rowHeaders[j].header + "\n";
     *                 }
     *                 message += "<en></en><cn></cn><jp>値：</jp><kr></kr>" + param.value;
     *                 alert(message)
     *             } else if (param.dataType === "ColTotal") {
     *                 let message = param.col + "<en></en><cn></cn><jp>列目の総計セルがクリックされました。\n</jp><kr></kr>";
     *                 message += "<en></en><cn></cn><jp>列ヘッダー：\n</jp><kr></kr>"
     *                 for (let i = 0; i < param.colHeaders.length; i++) {
     *                     message += param.colHeaders[i].label + "：" + param.colHeaders[i].header + "\n";
     *                 }
     *                 message += "<en></en><cn></cn><jp>値：</jp><kr></kr>" + param.value;
     *                 alert(message)
     *             }
     *         });
     *     });
     * })()
     * ```
     */
    static PivottableClick: string;
  }

  /**
   * <en>Represents a cell in page.</en>
   * <cn>表示页面中的单元格对象。</cn>
   * <jp>ページ内のセルを表すオブジェクトです。</jp>
   * <kr></kr>
   */
  class Cell {
    /**
     * <en>Get this cell's value.</en>
     * <cn>获取指定单元格的值。获取单元格的值后，您可以将该值用于其他地方，比如命令中。</cn>
     * <jp>セルの値を取得します。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the getValue method to get a cell's value.</en><cn>下面的示例代码中，通过getValue方法，获取了指定的单元格（myCell）的值。</cn><jp>本サンプルコードでは、getValueメソッドで取得したセルの値をダイアログボックス上に表示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get the cell with cell's name "myCell".</en><cn>获取当前页面上名称为myCell的单元格</cn><jp>現在のページでmyCellという名前のセルを取得する。</jp><kr></kr>
     * var cell = page.getCell("myCell");
     * // <en>Get cell's value.</en><cn>获取此单元格的值</cn><jp>getValueメソッドでセルの値を取得する。</jp><kr></kr>
     * var cellValue = cell.getValue();
     * // <en>Pops up an alert to show the cell's value.</en><cn>弹出警告框以显示此单元格的值</cn><jp>ダイアログボックスを表示して取得したセルの値を表示する。</jp><kr></kr>
     * alert(cellValue);
     * ```
     */
    getValue(): any;
    /**
     * <en>Set value to this cell.</en>
     * <cn>给指定的单元格设置值，值可以是任意值，没有限制。</cn>
     * <jp>セルに値を設定します。本メソッドは、添付ファイル型セル、画像アップロード型セル、ログインユーザー型セルでは使用できません。</jp>
     * <kr></kr>
     * @param value <en>The value.</en>
     * <cn>值。</cn>
     * <jp>設定するセルの値。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>Change the textbox named `textBox1` by clicking the button named `button1`</en><cn>通过单击按钮`button1`来修改文本框`textBox1`的值。</cn><jp>本サンプルコードでは、ボタンをクリックしてテキストボックスに値を設定する例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var p = Forguncy.Page;
     * p.ready(function(){
     *     p.getCell("button1").bind("click", function(){
     *         // <en>Get the cell with cell's name "textBox1".</en><cn>获取当前页面上名称为textBox1的单元格</cn><jp>現在のページでtextBox1という名前のセルを取得する。</jp><kr></kr>
     *         var textCell = p.getCell("textBox1");
     *         // <en>Set cell's value.</en><cn>设置指定单元格的值</cn><jp>セルに指定した値を設定する。</jp><kr></kr>
     *         textCell.setValue("<en>Forguncy</en><cn>活字格</cn><jp>Forguncy</jp><kr></kr>");
     *     })
     * });
     * ```
     */
    setValue(value: any): void;
    /**
     * <en>Hide this cell.</en>
     * <cn>隐藏单元格。将页面中指定的单元格进行隐藏，只能隐藏单元格的值、类型等，而不能隐藏单元格的背景。与show方法相对，可根据实际需求结合使用。</cn>
     * <jp>セルを非表示にします。非表示にできるのはセルの背景ではなく、セルの値、もしくはセル型のみです。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the hide method to hide a specified cell.</en><cn>下面的示例代码中，通过hide方法，将指定的单元格（myCell）隐藏。</cn><jp>本サンプルコードでは、指定したセルをhideメソッドを使用して非表示にする例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get the cell with cell's name "myCell".</en><cn>获取当前页面上名称为myCell的单元格</cn><jp>現在のページでmyCellという名前のセルを取得する。</jp><kr></kr>
     * var cell = page.getCell("myCell");
     * // <en>Hide cell "myCell".</en><cn>隐藏名称为myCell的单元格</cn><jp>myCellという名前のセルを非表示にする。</jp><kr></kr>
     * cell.hide();
     * ```
     */
    hide(): void;
    /**
     * <en>Show this cell.</en>
     * <cn>显示单元格。将页面中隐藏的单元格进行显示，显示单元格的值、类型等。与hide方法相对，可根据实际需求结合使用。</cn>
     * <jp>非表示となっているセルを表示します。セルを非表示状態とするには、{@link Forguncy.Cell.hide hideメソッド}を使用します。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the show method to show a specified cell.</en><cn>下面的示例代码中，通过show方法，显示指定的单元格（button）。</cn><jp>本サンプルコードでは、指定したセルをshowメソッドを使用して表示する例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get cell "button".</en><cn>获取当前页面上名称为button的单元格</cn><jp>現在のページでbuttonという名前のセルを取得する。</jp><kr></kr>
     * var cell = page.getCell("button");
     * // <en>Show cell "button".</en><cn>显示此单元格的值</cn><jp>buttonという名前のセルを表示する。</jp><kr></kr>
     * var cellShow = cell.show();
     * ```
     */
    show(): void;
    /**
     * <en>Set color to this cell's background.</en>
     * <cn>给指定的单元格设置背景色。</cn>
     * <jp>セルの背景色を設定します。</jp>
     * <kr></kr>
     * @param color <en>The color. Such as `red`、`#FF0000`.</en>
     * <cn>设置的颜色，支持以下三种形式：
     * ・颜色名称，如 red；
     * ・十六进制值，如 #ff0000；
     * ・rgb 代码，如 rgb(255,0,0)。</cn>
     * <jp>設定する背景色の色。設定する値は、次の3つの形式をサポートしています。
     * <ul><li>"red"などの色の名前。</li>
     * <li>"#ff0000"などの16進値。</li>
     * <li>"rgb(255,0,0)"などのrgbコード。</li></ul></jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the setBackColor method to set a cell's background color.</en><cn>下面的示例代码中，通过setBackColor方法，给指定单元格设置背景色。</cn><jp>本サンプルコードでは、setBackColorメソッドを使用して指定したセルの背景色を設定する例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get the cell with cell's name "myCell".</en><cn>获取当前页面上名称为myCell的单元格</cn><jp>現在のページでmyCellという名前のセルを取得する。</jp><kr></kr>
     * var cell = page.getCell("myCell");
     * // <en>Set cell's background color.</en><cn>给单元格设置背景色</cn><jp>セルの背景色を設定する。</jp><kr></kr>
     * var setColor = cell.setBackColor("red");
     * ```
     */
    setBackColor(color: any): void;
    /**
     * <en>Set this cell's font color.</en>
     * <cn>给指定的单元格设置其字体颜色。与setBackColor方法类似。</cn>
     * <jp>セルのフォントの色を設定します。</jp>
     * <kr></kr>
     * @param color <en>The font color.</en>
     * <cn>设置的颜色，支持以下三种形式：
     * ・颜色名称，如 red；
     * ・十六进制值，如 #ff0000；
     * ・rgb 代码，如 rgb(255,0,0)。</cn>
     * <jp>設定するフォントの色。設定する値は、次の3つの形式をサポートしています。
     * <ul><li>"red"などの色の名前。</li>
     * <li>"#ff0000"などの16進値。</li>
     * <li>"rgb(255,0,0)"などのrgbコード。</li></ul></jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the setForeColor method to set font color.</en><cn>下面的示例代码中，通过setForeColor方法，给指定单元格的字体设置颜色。</cn><jp>本サンプルコードでは、setForeColorメソッドを使用して指定したセルのフォントの色を設定する例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get the cell with cell's name "myCell".</en><cn>获取当前页面上名称为myCell的单元格</cn><jp>現在のページでmyCellという名前のセルを取得する。</jp><kr></kr>
     * var cell = page.getCell("myCell");
     * // <en>Set cell's font color.</en><cn>给单元格设置字体颜色</cn><jp>セルのフォントの色を設定する。</jp><kr></kr>
     * var setColor = cell.setForeColor("red");
     * ```
     */
    setForeColor(color: any): void;
    /**
     * <en>Disable this cell.</en>
     * <cn>禁用单元格。单元格禁用后，不可以被点击，可使用enable方法重新将其启用。</cn>
     * <jp>セルのユーザーとの対話を無効化します。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the disable method to disable a checkbox.</en><cn>下面的示例代码中，通过disable方法，单击按钮可禁用一个指定的复选框。</cn><jp>本サンプルコードでは、disableメソッドを使用してチェックボックス型セルを無効化する例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get cell by name "checkBox".</en><cn>获取当前页面上名称为checkBox的复选框</cn><jp>現在のページでcheckBoxという名前のチェックボックス型セルを取得する。</jp><kr></kr>
     * var cell = page.getCell("checkBox");
     * // <en>Disable cell("checkBox").</en><cn>禁用复选框</cn><jp>チェックボックス型セルを無効化する。</jp><kr></kr>
     * cell.disable();
     * ```
     */
    disable(): void;
    /**
     * <en>Enable this cell.</en>
     * <cn>启用单元格。单元格禁用后，不可以被点击，可使用disable方法重新将其禁用。</cn>
     * <jp>セルのユーザーとの対話を有効化します。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>Enable or disable the button named `button1` by clicking the checkbox named `checkbox1`.</en><cn>通过单击一个复选框`checkBox1`来禁用和启用一个按钮`button1`。</cn><jp>本サンプルコードでは、「checkBox1」チェックボックスをクリックして、「button1」ボタンの無効と有効を切り替える例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var p = Forguncy.Page;
     * p.ready(function () {
     * // <en>Get button1.</en><cn>获取当前页面上名称为button1的单元格</cn><jp>現在のページでbutton1という名前のボタン型セルを取得する。</jp><kr></kr>
     *     var b = p.getCell("button1");
     * // <en>Get checkbox1.</en><cn>获取当前页面上名称为checkbox1的复选框</cn><jp>現在のページでcheckbox1という名前のチェックボックス型セルを取得する。</jp><kr></kr>
     *     var c = p.getCell("checkbox1");
     *
     *     b.disable();
     *
     *     c.bind("valuechanged", function () {
     *         if (c.getValue() == true)
     *         {
     *             // <en>Enable button1.</en><cn>启用按钮单元格。</cn><jp>ボタン型セルを有効化する。</jp><kr></kr>
     *             b.enable();
     *         }
     *         else
     *         {
     *             // <en>Disable button1.</en><cn>禁用按钮单元格。</cn><jp>ボタン型セルを無効化する。</jp><kr></kr>
     *             b.disable();
     *         }
     *     })
     * });
     * ```
     */
    enable(): void;
    /**
     * <en>Set this cell's readonly status.</en>
     * <cn>设置单元格的只读状态。</cn>
     * <jp>セルの読み取り専用の状態を設定します。</jp>
     * <kr></kr>
     * @param isReadOnly <en>Whether readonly?</en>
     * <cn>如果值为true，设置为只读状态，否则取消只读状态。</cn>
     * <jp>読み取り専用に設定する場合にはtrue、そうでない場合にはfalse。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>Enable or disable the textbox named `textbox1` by clicking the checkbox named `checkbox1`.</en><cn>单击复选框“checkBox1”以切换文本框“textbox1”的只读状态</cn><jp>本サンプルコードでは、「checkBox1」チェックボックスをクリックして、「textbox1」テキストボックスの読み取り専用の状態を切り替える例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var p = Forguncy.Page;
     * p.ready(function () {
     * // <en>Get the checkbox with textbox's name is "textbox1".</en><cn>获取当前页面上名称为textbox1的单元格</cn><jp>現在のページでtextbox1という名前のテキストボックス型セルを取得する。</jp><kr></kr>
     *     var t = p.getCell("textbox1");
     * // <en>Get the checkbox with checkbox's name is "checkbox1".</en><cn>获取当前页面上名称为checkbox1的复选框</cn><jp>現在のページでcheckbox1という名前のチェックボックス型セルを取得する。</jp><kr></kr>
     *     var c = p.getCell("checkbox1");
     *
     *     c.bind("valuechanged", function () {
     *         if (c.getValue() == true)
     *         {
     *             // <en>Set textbox("textbox1") to read-only.</en><cn>将文本框单元格设置为只读。</cn><jp>テキストボックス型セルを読み取り専用に設定する。</jp><kr></kr>
     *             t.setReadOnly(true);
     *         }
     *         else
     *         {
     *             // <en>Cancel the read-only status of the textbox("textbox1").</en><cn>取消文本框类型单元格的只读状态。</cn><jp>テキストボックス型セルの読み取り専用を解除する。</jp><kr></kr>
     *             t.setReadOnly(false);
     *         }
     *     })
     * });
     * ```
     */
    setReadOnly(isReadOnly: boolean);
    /**
     * <en>Get whether this cell has focus.</en>
     * <cn>获取指定单元格是否具有焦点。可用于检测页面中的任一单元格是否获取焦点。返回值为true或false，true：单元格获取焦点；false：单元格未获取焦点。</cn>
     * <jp>セルにフォーカスがあるかどうかを取得します。戻り値がtrueの場合、セルはフォーカスを取得しています。falseの場合、セルはフォーカスを取得していません。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the hasFocus method to get if a cell has focus.</en><cn>下面的示例代码中，通过hasFocus方法，获取指定单元格（myCell）是否具有焦点。</cn><jp>本サンプルコードでは、hasFocusメソッドを使用して「myCell」セルがフォーカスを取得しているかどうかをダイアログボックスに表示する例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var p = Forguncy.Page;
     * // <en>Get the cell with cell's name "myCell".</en><cn>获取当前页面上名称为myCell的单元格</cn><jp>現在のページでmyCellという名前のセルを取得する。</jp><kr></kr>
     * var cell = page.getCell("myCell");
     * // <en>Get if "myCell" has focus.</en><cn>获取当前单元格是否具有焦点</cn><jp>セルにフォーカスがあるかどうかを取得する。</jp><kr></kr>
     * var f = cell.hasFocus();
     * // <en>Pops up an alert to show if the cell has focus.</en><cn>弹出警示框，显示指定单元格是否具有焦点</cn><jp>セルにフォーカスがあるかどうかを示す値をダイアログボックスに表示する。</jp><kr></kr>
     * alert(f);
     * ```
     */
    hasFocus(): boolean;
    /**
     * <en>Set focus to this cell.</en>
     * <cn>设置焦点到指定单元格。一般情况下，当通过鼠标点击选中元素或通过 tab 键定位到单元格时，该单元格就会获得焦点。使用setFocus方法可直接让指定的单元格获得焦点。</cn>
     * <jp>セルがフォーカスを取得できる場合、セルにフォーカスを設定します。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the setFocus method to set the focus on the cell "myCell".</en><cn>下面的示例代码中，通过setFocus方法，将焦点设置到单元格（myCell）。</cn><jp>本サンプルコードでは、setFocusメソッドを使用して「myCell」セルにフォーカスを設定する例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var p = Forguncy.Page;
     * // <en>Get the cell with cell's name "myCell".</en><cn>获取当前页面上名称为myCell的单元格</cn><jp>現在のページでmyCellという名前のセルを取得する。</jp><kr></kr>
     * var cell = page.getCell("myCell");
     * // <en>Set focus on the cell  "myCell".</en><cn>将焦点设置到单元格myCell上</cn><jp>取得したセルにフォーカスを設定する。</jp><kr></kr>
     * cell.setFocus();
     * ```
     */
    setFocus(): void;
    /**
     * <en>Attach a handler to an event for this cell.</en>
     * <cn>为被选单元格添加一个或多个事件处理程序，并规定事件发生时运行的函数。</cn>
     * <jp>セルが持つイベントに対してイベントハンドラを関連付けます。
     * <h4>イベントへのデータの受け渡し</h4>
     * イベントハンドラーにデータを受け渡すには、第2パラメーターに指定します。その場合、イベントハンドラーは第3パラメーターに指定します。 受け渡されたデータは、イベントハンドラーにおける第1パラメーターのdataプロパティから参照できます。</jp>
     * <kr></kr>
     * @param type <en>Required. A string containing the event types, such as `ValueChanged`, `Click`(button, hyperlink, image cell type) or `SelectionChanged`(combobox cell type).</en>
     * <cn>表示事件类型的字符串。单元格支持的事件请参考 `CellEvents` 类 。</cn>
     * <jp>関連付けするイベントを表す文字列。セルでサポートされているイベントについては、{@link Forguncy.CellEvents CellEventsクラス}を参照してください。</jp>
     * <kr></kr>
     * @param data <en>Optional. An object containing data that will be passed to the event handler.</en>
     * <cn>可选参数，如果不忽略表示给事件处理函数传递的自定义参数。</cn>
     * <jp>イベントハンドラーに渡すデータ。関数では第1パラメーターのdataプロパティから参照します。省略可能。</jp>
     * <kr></kr>
     * @param fn <en>Required. A function to execute each time the event is triggered.</en>
     * <cn>事件处理函数。</cn>
     * <jp>イベント発生時に実行される関数。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>Show a message box when click the button.</en><cn>当点击按钮时，弹出一个消息框。</cn><jp>本サンプルコードでは、ボタンをクリックした際にダイアログボックスを表示する例を示します。</jp><kr></kr>
     * // <en>Call bind() without customer `data`:</en><cn>不需要给事件处理函数传递自定义参数：</cn><jp>イベントハンドラーにデータを受け渡さない場合：</jp><kr></kr>
     * Forguncy.Page.getCell("button1").bind("click", function () {
     *     alert("Click!");
     * });
     *
     *
     * // <en>Call bind() with customer `data`:</en><cn>需要给事件处理函数传递自定义参数</cn><jp>イベントハンドラーにデータを受け渡す場合：</jp><kr></kr>
     * var text = "Click!";
     * Forguncy.Page.getCell("button1").bind("click", text, function (arg) {
     *     alert(arg.data);
     * });
     * ```
     */
    bind(type: string, data?: any, fn?: Function): void;
    /**
     * <en>Remove handlers to an event for this cell.</en>
     * <cn>移除被选元素的事件处理程序。该方法能够移除被选的事件处理程序，或者当事件发生时终止指定函数的运行。</cn>
     * <jp>指定したイベントにおけるイベントハンドラーの関連付けを解除します。</jp>
     * <kr></kr>
     * @param type <en>Required. A string containing the event types, such as `ValueChanged`, `Click`(button, hyperlink, image cell type) or `SelectionChanged`(combobox cell type).</en>
     * <cn>表示事件类型的字符串。单元格支持的事件请参考`CellEvents`类 。</cn>
     * <jp>関連付けを解除するイベントの種類を表す文字列。セルでサポートされるイベントについては、{@link Forguncy.CellEvents CellEventsクラス}を参照してください。</jp>
     * <kr></kr>
     * @param fn <en>Optional. A function to remove for the event.</en>
     * <cn>事件处理函数。如果忽略，则取消绑定单元格上该事件类型的所有处理函数。</cn>
     * <jp>関連付けを解除するイベントハンドラー。省略した場合、そのセルにおいて指定したイベントの種類に関連付けられているすべてのイベントハンドラーが解除されます。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>Firstly, bind a click event to the button.</en><cn>先给按钮绑定点击事件处理函数：</cn><jp>ボタンのclickイベントにイベントハンドラーを関連付ける。</jp><kr></kr>
     * var onClick = function(arg) {
     *     alert("Click!");
     * }
     * var clickEvent = Forguncy.CellEvents.Click;
     * var button1 = Forguncy.Page.getCell("button1");
     * button1.bind("click", onClick);
     *
     * // <en>Unbind the click event.</en><cn>取消特定事件处理函数的绑定：</cn><jp>イベントの種類とイベントハンドラーの両方を指定して関連付けを解除する。</jp><kr></kr>
     * button1.unbind("click", onClick);
     *
     * // <en>Unbind all events attached the button.</en><cn>取消所有点击事件处理函数的绑定：</cn><jp>イベントの種類のみを指定してすべてのイベントハンドラーの関連付けを解除する。</jp><kr></kr>
     * button1.unbind("click");
     * ```
     */
    unbind(type: any, fn?: Function): void;
    /**
     * <en>Remove all handlers for this cell.</en>
     * <cn>移除页面上所有事件的绑定。该方法能够移除页面上所有的事件处理程序，或者当事件发生时终止指定函数的运行。</cn>
     * <jp>セルからすべてのイベントハンドラーの関連付けを解除します。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the unbindAll method to release all event handlers associated with a cell.</en><cn>使用unbindAll方法释放与单元格关联的所有事件处理程序的示例。</cn><jp>本サンプルコードでは、unbindAllメソッドを使用してセルに関連付けられているすべてのイベントハンドラーを解除する例を示します。</jp><kr></kr>
     * // <en>Event handle of button click.</en><cn>给按钮绑定点击事件处理函数</cn><jp>イベントハンドラーの定義。</jp><kr></kr>
     * var onClick = function(arg) {
     *     alert("<en>Forguncy</en><cn>活字格</cn><jp>Forguncy</jp><kr>Forguncy</kr>");
     * }
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get cell whose name is "button".</en><cn>获取当前页面上名称为button的按钮</cn><jp>現在のページでbuttonという名前のボタン型セルを取得する。</jp><kr></kr>
     * var cell = page.getCell("button");
     * // <en>Release all event handlers associated with button cells.</en><cn>取消所有点击事件处理函数的绑定</cn><jp>ボタン型セルに関連付けられているすべてのイベントハンドラーを解除する</jp><kr></kr>
     * cell.unbindAll();
     * ```
     */
    unbindAll(): void;
  }

  /**
   * <en>Represents the base class of container cell.</en>
   * <cn>容器单元格的基类。</cn>
   * <jp>コンテナーセルの基本クラス。</jp>
   * <kr></kr>
   */
  class ContainerCellBase extends Cell {}

  /**
   * <en>Represents the page container cell.</en>
   * <cn>页面容器单元格。</cn>
   * <jp>コンテナー型セル。</jp>
   * <kr></kr>
   */
  class ContentContainerCell extends ContainerCellBase {
    /**
     * <en>Get sub page info of content page.</en>
     * <cn>获取页面容器的子页面对象。只有当单元格类型为页面容器时才有该方法。</cn>
     * <jp>ページコンテナーのサブページオブジェクトを取得します。このメソッドは、コンテナー型セルでのみ使用できます。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * Forguncy.Page.ready(function () {
     *     var containerCell = Forguncy.Page.getCell("container");
     *
     *     containerCell.bind("loaded", function () {
     *         alert("containerCell loaded");
     *         var subPage = containerCell.getContentPage();
     *         if (subPage.getPageName() === "SubPage1") {
     *             var subPageCell = subPage.getCell("Cell1");
     *             var subPageListview = subPage.getListView("ListView1");
     *         }
     *     });
     *
     *     containerCell.bind("PageDefaultDataLoaded", function () {
     *         alert("containerCell data loaded");
     *     });
     * });
     * ```
     */
    getContentPage(): SubPage;
  }

  /**
   * <en>Represents the page container cell.</en>
   * <cn>选项卡容器单元格。</cn>
   * <jp>タブコントロール型セル。</jp>
   * <kr></kr>
   */
  class TabControlCell extends ContainerCellBase {
    /**
     * <en>Get sub page info by tab index.</en>
     * <cn>获取选项卡容器中的子页面对象。只有当单元格类型为选项卡时才有该方法。</cn>
     * <jp>指定されたインデックスに対応するタブコントロール型セルのサブページを取得します。このメソッドは、タブコントロール型セルでのみ使用できます。</jp>
     * <kr></kr>
     * @param tabIndex <en>The tab index, start with 0.</en>
     * <cn>页面索引。从`0`开始。</cn>
     * <jp>サブページのインデックス。「0」から始まります。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en></en><cn>下面的示例代码中，通过getTabPage方法，获取了指定的选项卡（container）的子页面（页面1）中的单元格（myCell）的值。</cn><jp>本サンプルコードでは、タブコントロール型セルの1番目タブ（サブページ）に存在する「myCell」セルの値を取得する例を示します。</jp><kr></kr>
     * // <en></en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en></en><cn>获取选项卡</cn><jp>タブコントロール型セルを取得する。</jp><kr></kr>
     * var tabControlCell = page.getCell("tabControl");
     * // <en></en><cn>获取选项卡的子页面。如果需要获取选项卡中的单元格或表格，需要先获取到选项卡中的子页面的信息。选项卡编号从0开始。</cn><jp>タブコントロール型セルからサブページを取得する。タブ内のセル、またはリストビューを取得する必要がある場合、最初にタブコントロール型セルのサブページを取得する必要があります。</jp><kr></kr>
     * var tab1 = tabControlCell.getTabPage(0);
     * // <en></en><cn>获取第一个标签中名为myCell的单元格</cn><jp>取得したサブページからmyCellという名前のセルを取得する。</jp><kr></kr>
     * var subPageCell = tab1.getCell("myCell");
     * // <en></en><cn>获取单元格的值，弹出警告框</cn><jp>セルの値を取得してダイアログボックスに表示する。</jp><kr></kr>
     * alert(subPageCell.getValue());
     * ```
     */
    getTabPage(tabIndex: number): SubPage;
    /**
     * <en>Set active tab by tab index.
     * <cn>设置显示的选项卡。比如默认显示第一个选项卡，可使用此方法来显示第二个选项卡。只有当单元格类型为选项卡时才有该方法。</cn>
     * <jp>表示されるタブを設定します。たとえば、既定では最初のタブが表示されますが、本メソッドを使用して2番目のタブを表示できます。このメソッドは、タブコントロール型セルでのみ使用できます。</jp>
     * <kr></kr>
     * @param tabIndex <en>The tab index, start with `0`.</en>
     * <cn>选项卡的编号。选项卡编号从0开始。</cn>
     * <jp>タブのインデックス。「0」から始まります。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en></en><cn>下面的示例代码中，通过showTab方法，将显示的选项卡由第一个选项卡更改为第二个选项卡。</cn><jp>本サンプルコードでは、showTabメソッドを使用して2番目のタブを表示する例を示します。</jp><kr></kr>
     * // <en></en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en></en><cn>获取选项卡</cn><jp>タブコントロール型セルを取得する。</jp><kr></kr>
     * var tabControlCell = page.getCell("tabControl");
     * // <en></en><cn>更改选项卡容器的当前选项卡为第二个，选项卡编号从0开始。</cn><jp>タブコントロールの表示タブを2番目に変更する。</jp><kr></kr>
     * tabControlCell.showTab(1);
     * ```
     */
    showTab(tabIndex: number): void;
    /**
     * <en>Get active tab index. The tab index is start with 0.</en>
     * <cn>获取当前选项卡的编号，编号从0开始。只有当单元格类型为选项卡时才有该方法。</cn>
     * <jp>タブコントロール内の現在のタブの番号を取得します。このメソッドは、タブコントロール型セルでのみ使用できます。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en></en><cn>下面的示例代码中，通过getActiveTabIndex方法，获取了当前选项卡的编号。</cn><jp>本サンプルコードでは、getActiveTabIndexメソッドを使用して現在表示されているタブ番号を取得する例を示します。</jp><kr></kr>
     * // <en></en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en></en><cn>获取选项卡</cn><jp>タブコントロール型セルを取得する。</jp><kr></kr>
     * var tabControlCell = page.getCell("tabControl");
     * // <en></en><cn>获得当前选项卡的编号。编号从0开始。</cn><jp>現在表示中のタブ番号を取得する。タブ番号は0から始まります。</jp><kr></kr>
     * var activeTabIndex = tabControlCell.getActiveTabIndex();
     * // <en></en><cn>弹出警告框，显示当前选项卡的编号</cn><jp>取得したタブ番号をダイアログボックスに表示する。</jp><kr></kr>
     * alert(activeTabIndex);
     * ```
     */
    getActiveTabIndex(): number;
    /**
     * <en>Get tabs count.</en>
     * <cn>获取选项卡的数量。只有当单元格类型为选项卡时才有该方法。</cn>
     * <jp>タブコントロール内のタブの数を取得します。このメソッドは、タブコントロール型セルでのみ使用できます。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en></en><cn>下面的示例代码中，通过getTabCount方法，获取了选项卡（tabControl）的数量。</cn><jp>本サンプルコードでは、getTabCountメソッドを使用してタブコントロール型セルのタブ数を取得する例を示します。</jp><kr></kr>
     * // <en></en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en></en><cn>获取选项卡</cn><jp>タブコントロール型セルを取得する。</jp><kr></kr>
     * var tabControlCell = page.getCell("tabControl");
     * // <en></en><cn>获得当前选项卡的编号。编号从0开始。</cn><jp>現在表示中のタブ番号を取得する。タブ番号は0から始まります。</jp><kr></kr>
     * var activeTabIndex = tabControlCell.getActiveTabIndex();
     * // <en></en><cn>弹出警告框，显示当前选项卡的编号</cn><jp>取得したタブ番号をダイアログボックスに表示する。</jp><kr></kr>
     * alert(activeTabIndex);
     * ```
     */
    getTabCount(): number;
  }

  /**
   * <en>Represents a sub page.</en>
   * <cn>子页面对象。当页面包含页面容器和选项卡单元格类型时，则可能存在子页面。</cn>
   * <jp>SubPageを表すオブジェクト。ページに「コンテナー」か、あるいは「タブコントロール」のセル型が含まれている場合、サブページが存在する可能性があります。
   * サブページの「ページ設定」タブからJavaScriptファイルを指定した場合、親ページのLoadedイベントが発生する可能性があります。このため、必ずしもサブページのLoadedイベントのコールバック関数は実行されるとは限りません。たとえば、サブページのJavaScriptファイルに次のように記載しても、コードは実行されません。</jp>
   * <kr></kr>
   * ```javascript
   * Forguncy.Page.ready(function () {
   *     alert("Parent page loaded"); // <en></en><cn></cn><jp>このコードは実行されません。</jp><kr></kr>
   * });
   * ```
   * <en></en>
   * <cn></cn>
   * <jp>この場合、サブページでJavaScriptファイルを使用しないでください。もしくは次のようにコードを直接記述してください。</jp>
   * <kr></kr>
   * ```javascript
   * alert("Parent page loaded");
   * ```
   */
  class SubPage {
    /**
     * <en>Get a cell object by the cell's name.</en>
     * <cn>通过单元格名称获取单元格实例。</cn>
     * <jp>名前を指定してサブページ内のセルを取得します。</jp>
     * <kr></kr>
     * @param name <en>The cell's name.</en>
     * <cn>单元格名称。</cn>
     * <jp>取得したいサブページ内のセルの名前。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the getCell method to get a cell by it's name and set the cell's value.</en><cn>下面的示例代码中，通过getCell方法，获取一个单元格实例，并设置单元格的值。</cn><jp>本サンプルコードでは、getCellメソッドを使用してサブページ上のセルを取得し、値を設定する例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get cell "container".</en><cn>获取页面容器</cn><jp>コンテナー型セルを取得する。</jp><kr></kr>
     * var containerCell = page.getCell("container");
     * // <en>Get the cell's subpage.</en><cn>获取页面容器的子页面</cn><jp>コンテナー型セルのサブページを取得する。</jp><kr></kr>
     * var subPage = containerCell.getContentPage();
     * // <en>Get subpage "myCell".</en><cn>获取单元格对象</cn><jp>サブページからセルオブジェクトを取得する。</jp><kr></kr>
     * var cell = subPage.getCell("myCell");
     * // <en>Set cell's("myCell") value.</en><cn>设置单元格的值</cn><jp>セルの値を設定する。</jp><kr></kr>
     * cell.setValue("<en>Forguncy</en><cn>活字格</cn><jp>Forguncy</jp><kr></kr>");
     * ```
     */
    getCell(name: string): Cell;
    /**
     * <en>Get an array of cells with same name.</en>
     * <cn>通过单元格名称获取一组单元格实例。</cn>
     * <jp>名前を指定してサブページ内のセル範囲を取得します。</jp>
     * <kr></kr>
     * @param name <en>The cells' name.</en>
     * <cn>单元格名称。</cn>
     * <jp>サブページ内の取得したいセル範囲の名前。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the getCellArray method to get an array of cells.</en><cn>下面的示例代码中，通过getCellArray方法，获取一组单元格实例，并获取返回单元格实例的长度。</cn><jp>本サンプルコードでは、getCellArrayメソッドを使用して複数のセルを配列として取得し、その数をダイアログボックスに表示する例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get cell "container".</en><cn>获取页面容器</cn><jp>コンテナー型セルを取得する。</jp><kr></kr>
     * var containerCell = page.getCell("container");
     * // <en>Get subpage.</en><cn>获取页面容器的子页面</cn><jp>コンテナー型セルのサブページを取得する。</jp><kr></kr>
     * var subPage = containerCell.getContentPage();
     * // <en>Get an array of cells with the name is myCells.</en><cn>获取单元格对象</cn><jp>サブページからセル範囲のインスタンスを配列として取得する。</jp><kr></kr>
     * var cell = subPage.getCellArray("myCells");
     * // <en>Get the cell's length.</en><cn>获取单元格实例的长度</cn><jp>取得したセルインスタンスの数を取得する。</jp><kr></kr>
     * var len = cell.length;
     * // <en>Pops up an alert to show the length.</en><cn>弹出警告框，显示单元格实例的长度</cn><jp>取得したセルインスタンスの数をダイアログボックスに表示する。</jp><kr></kr>
     * alert(len);
     * ```
     */
    getCellArray(name: string): Cell[];
    /**
     * <en>Get an array of all content container cells and tab control cells in this sub page.</en>
     * <cn>获取子页面的所有页面容器单元格。</cn>
     * <jp>サブページ内のすべての「コンテナー」と「タブコントロール」のセル型（ページコンテナー型）のセル配列を取得します。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the getContainerCells method to get container cells.</en><cn>下面的示例代码中，通过getContainerCells方法，获取子页面中所有的页面容器类型的单元格，并获取返回单元格实例的长度。</cn><jp>本サンプルコードでは、getContainerCellsメソッドを使用して、サブページ内のすべてのページコンテナー型のセルを取得し、そのセル数を取得する例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get current page's container.</en><cn>获取页面容器</cn><jp>コンテナー型セルを取得する。</jp><kr></kr>
     * var cell = page.getCell("Container");
     * // <en>Get subpages in container.</en><cn>获取页面容器的子页面</cn><jp>コンテナー型セルのサブページを取得する。</jp><kr></kr>
     * var subPage = cell.getContentPage();
     * // <en>Get all container cells in subpage.</en><cn>获取子页面中所有的页面容器单元格</cn><jp>サブページからすべてのページコンテナー型のセルを配列として取得する。</jp><kr></kr>
     * var containerCell = subPage.getContainerCells();
     * // <en>Get the container cell's length.</en><cn>获取页面容器单元格实例的长度</cn><jp>取得したセルインスタンスの数を取得する。</jp><kr></kr>
     * var len = containerCell.length;
     * // <en>Pops up an alert to show the length.</en><cn>弹出警告框，显示单元格实例的长度</cn><jp>取得したセルインスタンスの数をダイアログボックスに表示する。</jp><kr></kr>
     * alert(len);
     * ```
     */
    getContainerCells(): ContainerCellBase[];
    /**
     * <en>Get a listview object by its name.</en>
     * <cn>通过表格名称获取表格实例。</cn>
     * <jp>名前を指定してサブページ内のリストビューを取得します。</jp>
     * <kr></kr>
     * @param name <en>The listview's name</en>
     * <cn>表格名称。</cn>
     * <jp>取得したいサブページ内のリストビュー名。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the getListView method to get a list view by name.</en><cn>下面的示例代码中，通过getListView方法，获取子页面中指定的表格。</cn><jp>本サンプルコードでは、getListViewメソッドを使用してサブページ上の指定したリストビューを取得する例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get current page's container.</en><cn>获取页面容器</cn><jp>コンテナー型セルを取得する。</jp><kr></kr>
     * var cell = page.getCell("Container");
     * // <en>Get subpages in container.</en><cn>获取页面容器的子页面</cn><jp>コンテナー型セルのサブページを取得する。</jp><kr></kr>
     * var subPage = cell.getContentPage();
     * // <en>Get list view in subpage by list view's name.</en><cn>获取子页面中的表格</cn><jp>サブページ上の指定したリストビューを取得する。</jp><kr></kr>
     * var listview = subPage.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     * // <en>Get list view's name.</en><cn>获取表格的名称</cn><jp>リストビュー名を取得する。</jp><kr></kr>
     * var name = listview.getName();
     * // <en>Pops up an alert to show the list view's name.</en><cn>弹出警告框，显示表格的名称</cn><jp>取得した名前をダイアログボックスに表示する。</jp><kr></kr>
     * alert(name);
     * ```
     */
    getListView(name: string): ListView;
    /**
     * <en>Get an array of all listviews in this sub page.</en>
     * <cn>获取子页面内所有的表格。</cn>
     * <jp>サブページ内のすべてのリストビューを取得します。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the getListViews method to get all list views in subpage.</en><cn>下面的示例代码中，通过getListViews方法，获取子页面中所有的表格，并获取返回表格实例的长度。</cn><jp>本サンプルコードでは、getListViewsメソッドを使用して、サブページ内のすべてのリストビューを取得し、そのインスタンス数を取得する例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get current page's container.</en><cn>获取页面容器</cn><jp>コンテナー型セルを取得する。</jp><kr></kr>
     * var cell = page.getCell("Container");
     * // <en>Get subpages in container.</en><cn>获取页面容器的子页面</cn><jp>コンテナー型セルのサブページを取得する。</jp><kr></kr>
     * var subPage = cell.getContentPage();
     * // <en>Get all list views in subpage.</en><cn>获取子页面中所有的表格</cn><jp>サブページ内のすべてのリストビューを取得する。</jp><kr></kr>
     * var listview = subPage.getListViews();
     * // <en>Get the list view's length.</en><cn>获取表格实例的长度</cn><jp>配列として取得したリストビューのインスタンス数を取得する。</jp><kr></kr>
     * var len = listview.length;
     * // <en>Pops up an alert to show the list view's length.</en><cn>弹出警告框，显示表格实例的长度</cn><jp>取得したインスタンス数をダイアログボックスに表示する。</jp><kr></kr>
     * alert(len);
     * ```
     */
    getListViews(): ListView[];
    /**
     * <en>Get this sub page's name.</en>
     * <cn>获取子页面的名称。</cn>
     * <jp>サブページのページ名を取得します。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the getPageName method to get a page by name.</en><cn>下面的示例代码中，通过getPageName方法，获取子页面的名称。</cn><jp>本サンプルコードでは、getPageNameメソッドを使用してサブページの名前を取得する例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get page's container.</en><cn>获取页面容器</cn><jp>コンテナー型セルを取得する。</jp><kr></kr>
     * var cell = page.getCell("Container");
     * // <en>Get container's subpage.</en><cn>获取页面容器的子页面</cn><jp>コンテナー型セルのサブページを取得する。</jp><kr></kr>
     * var subPage = cell.getContentPage();
     * // <en>Get subpage's name.</en><cn>获取子页面的名称</cn><jp>サブページの名前を取得する</jp><kr></kr>
     * var pageName = subPage.getPageName();
     * // <en>Pops up an alert to show the name.</en><cn>弹出警告框，显示子页面名称</cn><jp>サブページの名前をダイアログボックスに表示する。</jp><kr></kr>
     * alert(pageName);
     * ```
     */
    getPageName(): string;
    /**
     * <en>Get this sub page's master page name.</en>
     * <cn>获取子页面的母版页名称。</cn>
     * <jp>サブページのマスターページ名を取得します。子ページにマスターページがない場合はnullを返します。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the getMasterPageName method to the master page name of a subpage.</en><cn>下面的示例代码中，通过getMasterPageName方法，获取子页面的母版页名称。如果子页面没有母版页，则返回null。</cn><jp>本サンプルコードでは、getMasterPageNameメソッドを使用してサブページのマスターページ名を取得する例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get page's container.</en><cn>获取页面容器</cn><jp>コンテナー型セルを取得する。</jp><kr></kr>
     * var cell = page.getCell("Container");
     * // <en>Get container's subpage.</en><cn>获取页面容器的子页面</cn><jp>コンテナー型セルのサブページを取得する。</jp><kr></kr>
     * var subPage = cell.getContentPage();
     * // <en>Get the master page's name of current subpage.</en><cn>获取子页面的母版页名称</cn><jp>サブページのマスターページ名を取得する。</jp><kr></kr>
     * var masterPageName = subPage.getMasterPageName();
     * // <en>Pops up an alert to show the master page's name.</en><cn>弹出警告框，显示母版页名称</cn><jp>マスターページ名をダイアログボックスに表示する。</jp><kr></kr>
     * alert(masterPageName);
     * ```
     */
    getMasterPageName(): string;
  }

  /**
   * <en>Represents the events of listview.</en>
   * <cn>表格的事件。</cn>
   * <jp>リストビューのイベントを表します。</jp>
   * <kr></kr>
   */
  class ListViewEvents {
    /**
     * <en>Occurs when listview reload data.</en>
     * <cn>当表格重新加载数据时触发该事件。</cn>
     * <jp>リストビューがデータをサーバーから再読み込みしたときに発生します。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en></en><cn>下面的示例代码中，通过bind方法，给表格绑定Reloaded事件，当表格重新加载数据时，就会弹出一个警告框。</cn><jp>本サンプルコードでは、bindメソッドを使用してリストビューのReloadedイベントにイベントハンドラを関連付け、リストビューがデータを再読み込みするとダイアログボックスを表示する例を示します。</jp><kr></kr>
     * // <en></en><cn>定义事件处理函数</cn><jp>イベントハンドラーを定義する。</jp><kr></kr>
     * var reload = function(arg) {
     *     alert("<en>Forguncy</en><cn>活字格</cn><jp>Forguncy</jp><kr></kr>");
     * }
     * // <en></en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en></en><cn>获取表格对象</cn><jp>リストビューオブジェクトを取得する。</jp><kr></kr>
     * var listview = page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     * // <en></en><cn>绑定表格的事件</cn><jp>リストビューのReloadedイベントにイベントハンドラを関連付ける。</jp><kr></kr>
     * listview.bind("reloaded", reload);
     * ```
     */
    static Reloaded: string;
    /**
     * <en>Occurs when listview's current row changed.</en>
     * <cn>当表格当前行改变时触发。</cn>
     * <jp>リストビューのフォーカスが存在する行（カレントレコード）が変更されたときに発生します。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en></en><cn>下面的示例代码中，通过bind方法，给表格添加SelectionChanged事件，当表格的当前行改变时，就会弹出一个警告框。</cn><jp>本サンプルコードでは、bindメソッドを使用してリストビューのSelectionChangedイベントにイベントハンドラを関連付け、リストビューの現在行が変更されるとダイアログボックスを表示する例を示します。</jp><kr></kr>
     * // <en></en><cn>定义事件处理函数</cn><jp>イベントハンドラーを定義する。</jp><kr></kr>
     * var select = function(arg) {
     *     alert("<en>Forguncy</en><cn>活字格</cn><jp>Forguncy</jp><kr></kr>");
     * }
     * // <en></en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en></en><cn>获取表格对象</cn><jp>リストビューオブジェクトを取得する。</jp><kr></kr>
     * var listview = page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     * // <en></en><cn>绑定表格的事件</cn><jp>リストビューのSelectionChangedイベントにイベントハンドラを関連付ける。</jp><kr></kr>
     * listview.bind("selectionChanged", select);
     * ```
     */
    static SelectionChanged: string;
    /**
     * <en>Occurs when listview's selected rows changed. For example, when user click selected column's checkbox, this event will be triggered.</en>
     * <cn>当表格的选择行改变时触发。</cn>
     * <jp>リストビューの選択行が変更されたときに発生します。selectionchangedイベントとは異なり、ユーザーが選択列をクリックしたときなど、リストビューの現在行ではなく選択行が変更されたときに発生します。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en></en><cn>下面的示例代码中，通过bind方法，给表格绑定SelectedRowsChanged事件，当表格的选择行改变时，就会弹出一个警告框。</cn><jp>本サンプルコードでは、bindメソッドを使用してリストビューのSelectedRowsChangedイベントにイベントハンドラを関連付け、リストビューの選択行が変更されるとダイアログボックスを表示する例を示します。</jp><kr></kr>
     * // <en></en><cn>定义事件处理函数</cn><jp>イベントハンドラーを定義する。</jp><kr></kr>
     * var select = function(arg) {
     *     alert("<en>Forguncy</en><cn>活字格</cn><jp>Forguncy</jp><kr></kr>");
     * }
     * // <en></en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en></en><cn>获取表格对象</cn><jp>リストビューオブジェクトを取得する。</jp><kr></kr>
     * var listview = page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     * // <en></en><cn>绑定表格的事件</cn><jp>リストビューのSelectedRowsChangedイベントにイベントハンドラを関連付ける。</jp><kr></kr>
     * listview.bind("selectedRowsChanged", select);
     * ```
     */
    static SelectedRowsChanged: string;
    /**
     * <en>Occurs when listview's value changed.</en>
     * <cn>当表格的值变化时触发。</cn>
     * <jp>リストビューの値が変更されたときに発生します。イベント発生時に実行される関数の第2パラメーターについては{@link Forguncy.ListViewValueChangedEventArg ListViewValueChangedEventArgインターフェイス}を参照してください。</br>リストビューに数式（例："=H2$2")が含まれている場合、データ件数が多いとパフォーマンスに影響があります。例えばリストビューに表示しているデータが３レコードあった場合、数式が参照するセルに対してユーザーが入力を行うと、本イベントが３回発生します。数式が含まれていてかつデータ件数が多い場合、一つの回避方法として以下の方法があります。</jp>
     * <kr></kr>
     * ```javascript
     * Forguncy.Page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>").bind("ValueChanged", function (e, param) {
     *     if (window.myTimeout) {
     *         clearTimeout(window.myTimeout);
     *     }
     *     window.myTimeout = setTimeout(function () {
     *         // <en></en><cn></cn><jp>値を変更した後に行いたい処理を記載します。</jp><kr></kr>
     *     }, 10);
     * });
     * ```
     * @example
     * ```javascript
     * // <en></en><cn>下面的示例代码中，通过bind方法，给表格绑定ValueChanged事件，当表格的值改变时，就会弹出一个警告框。</cn><jp>本サンプルコードでは、bindメソッドを使用してリストビューのValueChangedイベントにイベントハンドラを関連付け、リストビューの値が変更されるとダイアログボックスを表示する例を示します。</jp><kr></kr>
     * // <en></en><cn>定义事件处理函数</cn><jp>イベントハンドラーを定義する。</jp><kr></kr>
     * var change = function(arg) {
     *     alert("<en>Forguncy</en><cn>活字格</cn><jp>Forguncy</jp><kr></kr>");
     * }
     * // <en></en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en></en><cn>获取表格对象</cn><jp>リストビューオブジェクトを取得する。</jp><kr></kr>
     * var listview = page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     * // <en></en><cn>绑定表格的事件</cn><jp>リストビューのValueChangedイベントにイベントハンドラを関連付ける。</jp><kr></kr>
     * listview.bind("valueChanged", change);
     * ```
     */
    static ValueChanged: string;

    /**
     * <en>Occurs when listview's pagination info changed.</en>
     * <cn>当表格的分页信息变化时触发。</cn>
     * <jp>リストビューのページナビゲーション情報が変更されたときに発生します。</jp>
     * <kr></kr>
     */
    static PageingInfoChanged: string;
  }

  /**
   * <en>Provides the data for listview's `ValueChanged` event.</en>
   * <cn>为表格值发生变化事件提供数据。</cn>
   * <jp>ValueChangedイベント発生時に実行される関数の第2パラメーターとして提供されます。</jp>
   * <kr></kr>
   * @example
   * ```javascript
   * var listview = Forguncy.Page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
   * listview.bind("ValueChanged", function (e, param) {
   * //
   * // <en></en><cn></cn><jp>リストビューがリロードされた時、paramは次のようになります。:</jp><kr></kr>
   * // {
   * // CellRanges:[{Row:-1,Column:-1,RowCount:-1,ColumnCount:-1}],
   * // OldRowCount:0,
   * // NewRowCount:3,
   * // }
   * //
   * // <en></en><cn></cn><jp>リストビューで行1と列2のセルを編集すると、paramは次のようになります。:</jp><kr></kr>
   * // {
   * // CellRanges:[{Row:1,Column:2,RowCount:1,ColumnCount:1}],
   * // OldRowCount:3,
   * // NewRowCount:3,
   * // }
   * //
   * // <en></en><cn></cn><jp>リストビューでセル（1,2）をセル（3,4）にドラッグすると、paramは次のようになります。:</jp><kr></kr>
   * // {
   * // CellRanges:[{Row:1,Column:2,RowCount:1,ColumnCount:1},{Row:3,Column:4,RowCount:1,ColumnCount:1}],
   * // OldRowCount:3,
   * // NewRowCount:3,
   * // }
   * //
   * // <en></en><cn></cn><jp>リストビューで１行削除すると、paramは次のようになります。:</jp><kr></kr>
   * // {
   * // CellRanges:[{Row:-1,Column:-1,RowCount:-1,ColumnCount:-1}],
   * // OldRowCount:3,
   * // NewRowCount:2,
   * // }
   * //
   * // <en></en><cn></cn><jp>リストビューで１行追加すると、paramは次のようになります。:</jp><kr></kr>
   * // {
   * // CellRanges:[{Row:3,Column:-1,RowCount:1,ColumnCount:-1}],
   * // OldRowCount:3,
   * // NewRowCount:4,
   * // }
   * });
   * ```
   */
  interface ListViewValueChangedEventArg {
    /**
     * <en>An array of changed cells's region.</en>
     * <cn>值变化的单元格区域。</cn>
     * <jp>変更されたセルの範囲。</jp>
     * <kr></kr>
     */
    CellRanges: CellRange[];
    /**
     * <en>The row count of listview before value changed.</en>
     * <cn>表格值变化前的行数。</cn>
     * <jp>値が変更される前のリストビューの行カウント。</jp>
     * <kr></kr>
     */
    OldRowCount: number;
    /**
     * <en>The row count of listview after value changed.</en>
     * <cn>表格值变化后的行数。</cn>
     * <jp>値が変更された後のリストビューの行カウント。</jp>
     * <kr></kr>
     */
    NewRowCount: number;
  }

  interface PageingInfoChangedEventArg {
    /**
     * The max row count of one page.
     */
    MaxRowCountOfOnePage: number;
    /**
     * The page count.
     */
    TotalRowCount: number;
    /**
     * Current page's index, start with 0.
     */
    CurrentPageIndex: number;
  }

  /**
   * <en>Represents a listview.</en>
   * <cn>表格。</cn>
   * <jp>リストビューオブジェクトを表します。</jp>
   * <kr></kr>
   */
  class ListView {
    /**
     * <en>Get this listview's name.</en>
     * <cn>获取表格的名称。</cn>
     * <jp>リストビューの名前を取得します。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the getName method to get a ListView.</en><cn>下面的示例代码中，通过getName方法，获取表格的名称。</cn><jp>本サンプルコードでは、getNameメソッドを使用してリストビューの名前を取得する例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get ListView.</en><cn>获取表格对象</cn><jp>リストビューオブジェクトを取得する。</jp><kr></kr>
     * var listview = page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     * // <en>Get the name of ListView.</en><cn>获取表格的名称</cn><jp>リストビューの名前を取得する</jp><kr></kr>
     * var name = listview.getName();
     * // <en>Pops up a dialoig with ListView's name.</en><cn>弹出警告框，显示表格的名称</cn><jp>リストビューの名前をダイアログボックスに表示する。</jp><kr></kr>
     * alert(name);
     * ```
     */
    getName(): string;

    /**
     * <en>Get this listview's runTimePageName.</en>
     * <cn>获取表格所在的运行时页面标识字符串。</cn>
     * <jp>このリストビューが実行されているページ名を取得します。</jp>
     * <kr></kr>
     */
    getRunTimePageName(): string;
    /**
     * <en>Get the table or view name of this listview.</en>
     * <cn>获取表格所绑定的数据表或视图的名称。</cn>
     * <jp>リストビューに連結されているテーブル、またはビューの名前を取得します。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the getDataTableName method to get the name of the table or view that is bound to the list view.</en><cn>下面的示例代码中，通过getDataTableName方法，获取表格所绑定的数据表或视图的名称。</cn><jp>本サンプルコードでは、getDataTableNameメソッドを使用して、リストビューに連結しているテーブル、またはビューの名前を取得する例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get list view.</en><cn>获取表格对象</cn><jp>リストビューオブジェクトを取得する。</jp><kr></kr>
     * var listview = page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     * // <en>Get the name of the table or view that is bound to the list view.</en><cn>获取表格所绑定的数据表或视图的名称</cn><jp>リストビューに連結しているテーブル、またはビューの名前を取得する。</jp><kr></kr>
     * var name = listview.getDataTableName();
     * // <en>Pops up a dialog to show the name.</en><cn>弹出警告框，显示数据表或视图的名称</cn><jp>取得したテーブル、またはビューの名前をダイアログボックスに表示する</jp><kr></kr>
     * alert(name);
     * ```
     */
    getDataTableName(): string;
    /**
     * <en>Get the listview's row count.</en>
     * <cn>获取表格的行数。</cn>
     * <jp>リストビューに表示されているデータの行数を取得します。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the getRowCount method to get the number of rows in the table.</en><cn>下面的示例代码中，通过getRowCount方法，获取表格的行数。</cn><jp>本サンプルコードでは、getRowCountメソッドを使用してリストビューの行数を取得する例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get list view.</en><cn>获取表格对象</cn><jp>リストビューオブジェクトを取得する。</jp><kr></kr>
     * var listview = page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     * // <en>Get row number.</en><cn>获取表格的行数</cn><jp>リストビューの行数を取得する。</jp><kr></kr>
     * var count= listview.getRowCount();
     * // <en>Pops up a dialog to show the row number.</en><cn>弹出警告框，显示表格的行数</cn><jp>取得したリストビューの行数をダイアログボックスに表示する。</jp><kr></kr>
     * alert(count);
     * ```
     */
    getRowCount(): number;
    /**
     * <en>Get current row index. Current row contain active cell.</en>
     * <cn>获取当前行的行索引。行索引从0开始。</cn>
     * <jp>リストビューの現在行（カレントレコード）の行番号（インデックス）を取得します。行番号は0から始まります。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the getSelectedRowIndex method to get the index of current seleceted row.</en><cn>下面的示例代码中，通过getSelectedRowIndex方法，获取当前行的行索引。</cn><jp>本サンプルコードでは、getSelectedRowIndexメソッドを使用してリストビューの現在行の行番号を取得する例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get list view.</en><cn>获取页面上的表格</cn><jp>リストビューオブジェクトを取得する。</jp><kr></kr>
     * var listview = page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     * // <en>Get the index of current seleceted row.</en><cn>获取当前行的行索引</cn><jp>リストビューの現在行の行番号を取得する。</jp><kr></kr>
     * var index = listview.getSelectedRowIndex();
     * // <en>Pops up a dialog to show the index.</en><cn>弹出警告框，显示当前行的行索引</cn><jp>取得したリストビューの現在行の行番号をダイアログボックスに表示する。</jp><kr></kr>
     * alert(index);
     * ```
     */
    getSelectedRowIndex(): number;
    /**
     * <en>Get an array of selected rows. If listview has no selected column and selected rows is empty, the array will contain current row.</en>
     * <cn>获取选择行的行索引。如果选择多个行，则返回一个数组，包含所有选择行的行索引。行索引从0开始。</cn>
     * <jp>リストビューの選択行の行番号を取得します。もし行が選択されていない場合、配列には現在行が含まれます。行番号は0から始まります。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the getSelectedRowIndexs method to get the index array of selected rows.</en><cn>下面的示例代码中，通过getSelectedRowIndexs方法，获取选定行的行索引。</cn><jp>本サンプルコードでは、getSelectedRowIndexsメソッドを使用して選択されている行の行番号を取得する例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get list view.</en><cn>获取表格对象</cn><jp>リストビューオブジェクトを取得する。</jp><kr></kr>
     * var listview = page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     * // <en>Get the index array of selected rows.</en><cn>获取选定行的行索引</cn><jp>選択されている行の行番号を取得する。</jp><kr></kr>
     * var index = listview.getSelectedRowIndexs();
     * // <en>Pops up a dialog to show the index array.</en><cn>弹出警告框，显示选择行的行索引</cn><jp>取得した行の行番号をダイアログボックスに表示する。</jp><kr></kr>
     * alert(JSON.stringify(index, null, " "));
     * ```
     */
    getSelectedRowIndexs(): number[];
    /**
     * <en>Get an array of selected rows data.</en>
     * <cn>获取表格选择行的数据。包括选择行的行索引、查询条件和数据。</cn>
     * <jp>選択された行データの配列を取得します。 選択した行の行インデックス、クエリ条件、およびデータが含まれます。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the getSelectedRowsData method to get the data of selected rows.</en><cn>下面的示例代码中，通过getSelectedRowsData方法，获取表格选择行的数据。</cn><jp>本サンプルコードでは、getSelectedRowsDataメソッドを使用してリストビューの選択行のデータを取得する例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get list view.</en><cn>获取表格对象</cn><jp>リストビューオブジェクトを取得する。</jp><kr></kr>
     * var listview = page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     * // <en>Get the data of selected rows.</en><cn>获取表格选择行数据</cn><jp>リストビューの選択行のデータを取得する。</jp><kr></kr>
     * var rows = listview.getSelectedRowsData();
     * // <en>Pops up an alert to show the selected data.</en><cn>弹出警告框，显示表格中选择行的信息</cn><jp>取得した選択行のデータをダイアログボックスに表示する。</jp><kr></kr>
     * alert(JSON.stringify(rows, null, " "));
     * ```
     */
    getSelectedRowsData(): RowData[];
    /**
     * <en>Remove a selected row by specified query.</en>
     * <cn>根据查询条件清除表格的选择行。</cn>
     * <jp>クエリー条件に基づいてリストビューの選択した行を削除します。</jp>
     * <kr></kr>
     * @param query <en>Query condition</en>
     * <cn>所选行的查询条件，以主键名作为主键，以对应数据作为值。</cn>
     * <jp>削除対象特定するためのクエリー条件。keyに主キーのフィールド名をvalueに対応するデータを指定したJSONオブジェクト。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the clearSelectedRowByQuery method to clear the selected rows.</en><cn>下面的示例代码中，通过clearSelectedRowByQuery方法，根据查询条件清除表格的选择行。</cn><jp>本サンプルコードでは、clearSelectedRowByQueryメソッドを使用して、指定する行を削除する例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get list view.</en><cn>获取表格对象</cn><jp>リストビューオブジェクトを取得する。</jp><kr></kr>
     * var listview = page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     * // <en>Clear the selected row based on the query condition.</en><cn>根据查询条件清除表格的选择行</cn><jp>クエリ条件に基づいて、リストビューの行を削除する。</jp><kr></kr>
     * listview.clearSelectedRowByQuery({ID:1});
     * ```
     */
    clearSelectedRowByQuery(query: { [name: string]: any }): void;
    /**
     * <en>Get a specified row's query info(primary key).</en>
     * <cn>获取指定行的查询信息（主键）。</cn>
     * <jp>指定したリストビュー行のクエリー条件（主キーフィールドとその値）を取得します。</jp>
     * <kr></kr>
     * @param rowIndex <en>The specifed row's row index.</en>
     * <cn>指定行的行索引。</cn>
     * <jp>取得したい行の番号。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the getQuery method to get the primay key of specified row.</en><cn>下面的示例代码中，通过getQuery方法，获取表格指定行的主键。</cn><jp>本サンプルコードでは、getQueryメソッドを使用してリストビューの指定した行の主キー情報を取得する例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get list view.</en><cn>获取表格对象</cn><jp>リストビューオブジェクトを取得する。</jp><kr></kr>
     * var listview = page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     * // <en>Get the primary key.</en><cn>获取指定行的主键</cn><jp>指定した行の主キーを取得する。</jp><kr></kr>
     * var query = listview.getQuery(0);
     * // <en>Pops up an alert to show the value of primary key.</en><cn>弹出警告框，显示主键信息</cn><jp>取得した主キー情報をダイアログボックスに表示する。</jp><kr></kr>
     * alert(JSON.stringify(query, null, " "));
     * ```
     */
    getQuery(rowIndex: number): {
      [key: string]: any;
    };
    /**
     * <en>Get an array of columns' info. The columns include row header.</en>
     * <cn>获取表格中所有列的信息。包括行头列，选择列，隐藏列等等。</cn>
     * <jp>リストビューのすべての列に関する情報（行ヘッダー、列の選択、列の非表示などを含む）を取得します。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the getMergedColumnInfos method to get information about all columns in a list view.</en><cn>下面的示例代码中，通过getMergedColumnInfos方法，获取表格中所有列的信息。包括行头列、选择列、隐藏列等。</cn><jp>本サンプルコードでは、getMergedColumnInfosメソッドを使用してリストビュー内のすべての列に関する情報を取得する例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get list view.</en><cn>获取页面上的表格</cn><jp>リストビューオブジェクトを取得する。</jp><kr></kr>
     * var listview = page.getListViews()[0];
     * // <en>Get information about all columns in a list view.</en><cn>获取表格中所有列的信息</cn><jp>リストビュー内のすべての列に関する情報を取得する。</jp><kr></kr>
     * var infos=listview.getMergedColumnInfos();
     * // <en>Pops up an alert to show the information.</en><cn>弹出警告框，显示表格中所有列的信息</cn><jp>取得したすべての列に関する情報をダイアログボックスに表示する。</jp><kr></kr>
     * alert(JSON.stringify(infos, null, " "));
     * ```
     */
    getMergedColumnInfos(): IMergedColumnInfo[];
    /**
     * <en>Get this listview's range info in designer.</en>
     * <cn>获取表格在设计器中位置信息，包括起始行索引、起始列索引、表格行数和列数。</cn>
     * <jp>Forguncy Builder上におけるリストビューの範囲情報を取得します。範囲情報は、開始行インデックス、開始列インデックス、行数、列数が含まれ、インデックスは0から始まります。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the getDesignerRangeInfo method to get the list view range information on the Forguncy Builder.</en><cn>下面的示例代码中，通过getDesignerRangeInfo方法，获取表格在设计器中位置信息，包括起始行索引、起始列索引、表格行数和列数。行、列索引从0开始。</cn><jp>本サンプルコードでは、getDesignerRangeInfoメソッドを使用してForguncy Builder上のリストビュー範囲情報を取得する例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get list view.</en><cn>获取表格对象</cn><jp>リストビューオブジェクトを取得する。</jp><kr></kr>
     * var listview = page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     * // <en>Get list view's location on Forguncy Builder.</en><cn>获取表格在设计器中位置信息</cn><jp>Forguncy Builder上のリストビュー位置情報を取得する。</jp><kr></kr>
     * var range = listview.getDesignerRangeInfo();
     * // <en>Pops up an alert to show the location.</en><cn>弹出提示框，显示表格的位置信息</cn><jp>取得したリストビューの範囲情報をダイアログボックスに表示する。</jp><kr></kr>
     * alert( "<en>Start row index.</en><cn>起始行索引：</cn><jp>開始行インデックス：</jp><kr></kr>"+range.Row+"\n"+"<en>Start column index.</en><cn>起始列索引：</cn><jp>開始列インデックス：</jp><kr></kr>"+range.Column+"\n"+"<en>Rows number.</en><cn>表格的行数：</cn><jp>リストビュー領域の行数：</jp><kr></kr>"+range.RowCount+"\n"+"<en>Columns number.</en><cn>表格的列数：</cn><jp>リストビュー領域の列数：</jp><kr></kr>"+range.ColumnCount);
     * ```
     */
    getDesignerRangeInfo(): CellRange;
    /**
     * <en>Get a specified cell's text of this listview.</en>
     * <cn>获取表格的指定单元格文本。</cn>
     * <jp>リストビューの指定されたセルの表示テキストを取得します。表示テキストは実際の値ではなく、書式設定が適用された画面に表示されている文字列です。</jp>
     * <kr></kr>
     * @param rowIndex <en>The cell's row index.</en>
     * <cn>表格的行索引，从0开始。</cn>
     * <jp>取得したいセルの行番号。行番号は0から始まります。</jp>
     * <kr></kr>
     * @param column <en>A string containing the cell's column's name. Or a number containing the cell's column's index.</en>
     * <cn>表格的列名，或该列索引的数字，列索引从0开始。</cn>
     * <jp>取得したいセルのリストビュー上の列名、もしくは列番号。列名はヘッダー名ではなく、右ペインから各列に対して設定する値であることに注意してください。列番号は0から始まります。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>If listview have two columns, the first column named `Name`, the second column named `Age`.</en><cn>如果表格有两列，分别是`Name`和`Age`。</cn><jp>本サンプルコードでは、最初の列は「Name」、2番目の列は「Age」という名前の列があるリストビューを例として使用します。</jp><kr></kr>
     * // <en>If you want to get text of the first row's "Age" cell.</en><cn>如果想要获取`Age`列的第一行的文本数据：</cn><jp>「Age」列の最初の行の表示テキストを取得する場合、次の2つの方法が存在します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get list view.</en><cn>获取表格对象</cn><jp>リストビューオブジェクトを取得する。</jp><kr></kr>
     * var listview = page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     * // <en>Usage1:</en><cn>用法1：</cn><jp>方法1：</jp><kr></kr>
     * var text = listview.getText(0,"Age");
     * // <en>Usage2:</en><cn>用法2：</cn><jp>方法2：</jp><kr></kr>
     * var text = listview.getText(0,1);
     * ```
     */
    getText(rowIndex: number, column: string | number): any;
    /**
     * <en>Get a specified cell's value of this listview.</en>
     * <cn>获取表格中指定位置上单元格的值。</cn>
     * <jp>リストビュー内の指定したセルの値を取得します。この値は実際に画面に表示されている文字列とは異なる場合があります。たとえば、日付/時刻型フィールドの実際の値は数値であるため、このメソッドを使用した場合には数値が取得されます。</jp>
     * <kr></kr>
     * @param rowIndex <en>The cell's row index.</en>
     * <cn>表格的行索引。</cn>
     * <jp>値を取得したいセルの行番号。行番号は0から始まります。</jp>
     * <kr></kr>
     * @param column <en>A string containing the cell's column's name. Or a number containing the cell's column's index.</en>
     * <cn>表格的列名或列索引。</cn>
     * <jp>値を取得したいセルのリストビュー上の列名、もしくは列番号。列名はヘッダー名ではなく、右ペインから各列に対して設定する値であることに注意してください。列番号は0から始まります。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>If listview have two columns, the first column named `Name`, the second column named `Age`.</en><cn>如果表格有两列，分别是`Name`和`Age`。</cn><jp>本サンプルコードでは、最初の列は「Name」、2番目の列は「Age」という名前となっているリストビューを例として使用します。</jp><kr></kr>
     * // <en>If you want to get value of the first row's "Age" cell.</en><cn>如果想要获取`Age`列的第一行的数据：</cn><jp>「Age」列の最初の行の値を取得する場合、次の2つの方法が存在します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get list view.</en><cn>获取表格对象</cn><jp>リストビューオブジェクトを取得する。</jp><kr></kr>
     * var listview = page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     * // <en>Usage1:</en><cn>用法1：</cn><jp>方法1：</jp><kr></kr>
     * var text = listview.getValue(0,"Age");
     * // <en>Usage2:</en><cn>用法2：</cn><jp>方法2：</jp><kr></kr>
     * var text = listview.getValue(0,1);
     * ```
     */
    getValue(rowIndex: number, column: string | number): any;
    /**
     * <en>Set value to a specified cell of this listview.</en>
     * <cn>给表格中指定位置的单元格设置值，值可以是任意值，没有限制。</cn>
     * <jp>リストビュー内の指定したセルに値を設定します。</jp>
     * <kr></kr>
     * @param rowIndex <en>The cell's row index.</en>
     * <cn>表格的行索引，从0开始。</cn>
     * <jp>値を設定したいセルの行番号。行番号は0から始まります。</jp>
     * <kr></kr>
     * @param column <en>A string containing the cell's column's name. Or a number containing the cell's column's index.</en>
     * <cn>表格的列名，或该列索引的数字，列索引从0开始。</cn>
     * <jp>値を設定したいセルのリストビュー上の列名、もしくは列番号。列名はヘッダー名ではなく、右ペインから各列に対して設定する値であることに注意してください。列番号は0から始まります。</jp>
     * <kr></kr>
     * @param value <en>The value.</en>
     * <cn>设定的值。</cn>
     * <jp>設定する値。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>If listview have two columns, the first column named `Name`, the second column named `Age`.</en><cn>如果表格有两列，分别是`Name`和`Age`。</cn><jp>本サンプルコードでは、最初の列は「Name」、2番目の列は「Age」という名前となっているリストビューを例として使用します。</jp><kr></kr>
     * // <en>If you want to set value to the first row's "Age" cell.</en><cn>如果想要设置`Age`列的第一行的数据：</cn><jp>「Age」列の最初の行に値を設定する場合、次の2つの方法が存在します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get list view.</en><cn>获取表格对象</cn><jp>リストビューオブジェクトを取得する。</jp><kr></kr>
     * var listview = page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     * // <en>Usage1:</en><cn>用法1：</cn><jp>方法1：</jp><kr></kr>
     * listview.setValue(0,"Age",12);
     * // <en>Usage2:</en><cn>用法2：</cn><jp>方法2：</jp><kr></kr>
     * listview.setValue(0,1,12);
     * ```
     */
    setValue(rowIndex: number, column: string | number, value: any): void;
    /**
     * <en>Set text to a specified cell of this listview.</en>
     * <cn>设置表格中指定位置上单元格的文本。</cn>
     * <jp>リストビュー内の指定したセルに表示テキストを設定します。</jp>
     * <kr></kr>
     * @param rowIndex <en>The cell's row index.</en>
     * <cn>表格的行索引。</cn>
     * <jp>表示テキストを設定したいセルの行番号。行番号は0から始まります。</jp>
     * <kr></kr>
     * @param column <en>A string containing the cell's column's name. Or a number containing the cell's column's index.</en>
     * <cn>表格的列名或列索引</cn>
     * <jp>表示テキストを設定したいセルのリストビュー上の列名、もしくは列番号。列名はヘッダー名ではなく、右ペインから各列に対して設定する値であることに注意してください。列番号は0から始まります。</jp>
     * <kr></kr>
     * @param text <en>The text.</en>
     * <cn>文本。</cn>
     * <jp>設定する表示テキスト。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>If listview have one column named `Name`, and the template cell  is ComboBoxCellType.</en><cn>如果表格有一列是`Name`，并且模板单元格设置为下拉选择框。</cn><jp>本サンプルコードでは、最初の列が「Name」という名前となっており、かつその列のテンプレート行のセルがコンボボックス型に設定されているリストビューを例として使用します。</jp><kr></kr>
     * // <en>If you want to set first row's `Name` cell as [Value=12, Text="Bob"].</en><cn>如果想要设置`Name`列的第一行的数据为[Value=12, Text="Bob"]：</cn><jp>「Name」列の最初の行の表示テキストを設定したい場合、次の2つの方法が存在します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get list view.</en><cn>获取表格对象</cn><jp>リストビューオブジェクトを取得する。</jp><kr></kr>
     * var listview = page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     * // <en>Usage1:</en><cn>用法1：</cn><jp>方法1：</jp><kr></kr>
     * listview.setText(0,"Name","Bob");
     * // <en>Usage2:</en><cn>用法2：</cn><jp>方法2：</jp><kr></kr>
     * listview.setText(0,0,"Bob");
     * ```
     */
    setText(rowIndex: number, column: string | number, text: any): void;
    /**
     * <en>Add a new row to this listivew.</en>
     * <cn>给表格中添加一个新行，包括新行的数据。</cn>
     * <jp>リストビューに新しい行を追加します。</jp>
     * <kr></kr>
     * @param rowValues <en>The new row data.</en>
     * <cn>新行的数据。</cn>
     * <jp>追加する新しい行のデータ。</jp>
     * <kr></kr>
     * @param isText <en>Specified whether the added data is value or text.If `isText` is true, the text in `rowValues` will be parsed before add in listview.</en>
     * <cn>可选参数。指定`rowValues`里的数据是否要当作文本进行解析。默认值为`false`。</cn>
     * <jp>rowValues内のデータに表示テキストが含まれている場合には、本パラメーターをtrueにします。trueの場合、新しい行のデータが追加される前に表示テキストのデータが値に変換されます。既定値はfalseです。本パラメーターは省略可能です。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>If listivew has 3 columns:</en><cn>如果表格有 3 列</cn><jp>本サンプルコードでは、リストビューに列が3つ存在する場合の例を示します。</jp><kr></kr>
     * // <en>The first column named "Name"</en><cn>第一列是`Name`</cn><jp>最初の列の列名は「Name」です。</jp><kr></kr>
     * // <en>The second column named "Birthday"</en><cn>第二列是`Birthday`</cn><jp>2列目の列名は「Birthday」です</jp><kr></kr>
     * // <en>The third column named "Department", and its cell type is `ComboBoxCellType`, value is [1,2,3] and display value is ["DD1","DD2","DD3"]</en><cn>第三列是`Department`,模板单元格类型是`ComboBoxCellType`，值是 [1,2,3]，显示文本值是["DD1","DD2","DD3"]</cn><jp>3列目の列名は「Department」で、テンプレート行のセル型はコンボボックスです。値は[1, 2, 3]、表示テキスト値は["DD1", "DD2", "DD3"]です。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get list view.</en><cn>获取表格对象</cn><jp>リストビューオブジェクトを取得する。</jp><kr></kr>
     * var listview = page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     * // <en>The following three usages will get same new row:</en><cn>以下三种用法将添加一样的新行：</cn><jp>次の3つは、すべて同じ内容の行を追加するコードです。</jp><kr></kr>
     * listview.addNewRow({"Name":"Lily","Birthday":new Date(1990,1,3),"Department":1});
     * listview.addNewRow(["Lily",new Date(1990,1,3),1]);
     * listview.addNewRow({"Name":"Lily","Birthday":"1990/02/03","Department":"DD1"}, true);
     * ```
     */
    addNewRow(
      rowValues:
        | {
            [columnName: string]: any;
          }
        | any[],
      isText?: boolean,
    ): void;
    /**
     * <en>Delete a row of this listview.</en>
     * <cn>删除表格中的一行。</cn>
     * <jp>リストビューの行を削除します。</jp>
     * <kr></kr>
     * @param rowIndex <en>The row index.</en>
     * <cn>行索引，从0开始。</cn>
     * <jp>削除したい行の行番号。行番号は0から始まります。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the deleteRow method to delete the specified row.</en><cn>下面的示例代码中，通过deleteRow方法，将表格中指定的行删除。</cn><jp>本サンプルコードでは、deleteRowメソッドを使用して指定した行を削除する例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get list view.</en><cn>获取表格对象</cn><jp>リストビューオブジェクトを取得する。</jp><kr></kr>
     * var listview = page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     * // <en>Delete the specified row in the list view.</en><cn>删除表格中的指定行</cn><jp>リストビューの指定した行を削除する。</jp><kr></kr>
     * listview.deleteRow(1);
     * ```
     */
    deleteRow(rowIndex: number): void;
    /**
     * <en>Set current row of this listview.</en>
     * <cn>将表格中指定的行设置为当前行。</cn>
     * <jp>リストビューの現在行（カレントレコード）を設定します。</jp>
     * <kr>設定したい行の行番号。行番号は0から始まります。</kr>
     * @param rowIndex <en>The row index.</en>
     * <cn>行索引，从0开始。</cn>
     * <jp>行番号</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the selectRow method to set the specified row as the current row.</en><cn>下面的示例代码中，通过selectRow方法，将表格中指定的行设置为当前行。</cn><jp>本サンプルコードでは、selectRowメソッドを使用して指定した行を現在行に設定する例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get list view.</en><cn>获取表格对象</cn><jp>リストビューオブジェクトを取得する。</jp><kr></kr>
     * var listview = page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     * // <en>Set the specified row as the current row.</en><cn>将表格中指定的行设置为当前行</cn><jp>指定した行を現在行に設定する。</jp><kr></kr>
     * listview.selectRow(2);
     * ```
     */
    selectRow(rowIndex: number): void;
    /**
     * <en>Add a selected row.</en>
     * <cn>在表格中选中一个指定的行。如果表格可以多选，则选中一个行后，可使用此方法再选中一个指定的行；如果表格仅允许单选，则选中一行后，再使用此方法会选中指定的行，之前的行会取消选中。</cn>
     * <jp>指定したリストビューの行を選択状態にします。リストビューが複数選択を許可している場合、このメソッドを複数回実行することで、複数の行を選択状態にすることができます。リストビューが複数選択を許可していない場合、このメソッドを使用して指定した行を選択すると、それ以前に選択されていた行の選択状態が解除されます。</jp>
     * <kr></kr>
     * @param rowIndex <en>The row index.</en>
     * <cn>行索引，从0开始。</cn>
     * <jp>選択状態にしたい行の行番号。行番号は0から始まります。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the addSelectedRow method to select a row in list view.</en><cn>下面的示例代码中，通过addSelectedRow方法，在表格中选定一个指定的行。</cn><jp>本サンプルコードでは、addSelectedRowメソッドを使用してリストビューの指定した行を選択状態にする例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get list view.</en><cn>获取表格对象</cn><jp>リストビューオブジェクトを取得する。</jp><kr></kr>
     * var listview = page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     * // <en>Select the specified row.</en><cn>添加新行</cn><jp>指定した行を選択状態にする</jp><kr></kr>
     * listview.addSelectedRow(2);
     * ```
     */
    addSelectedRow(rowIndex: number): void;
    /**
     * <en>Remove a row's selected status.</en>
     * <cn>将表格中指定的选择行的选中状态取消掉。</cn>
     * <jp>リストビューで指定して行の選択状態を解除します。</jp>
     * <kr></kr>
     * @param rowIndex <en>The row index.</en>
     * <cn>行索引。</cn>
     * <jp>選択状態を解除したい行の行番号。行番号は0から始まります。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the clearSelectedRow method to deselect the specified row in the list view.</en><cn>下面的示例代码中，通过clearSelectedRow方法，将表格中指定的选择行的选中状态取消掉。</cn><jp>本サンプルコードでは、clearSelectedRowメソッドを使用してリストビューの指定した行の選択状態を解除する例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get list view.</en><cn>获取表格对象</cn><jp>リストビューオブジェクトを取得する。</jp><kr></kr>
     * var listview = page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     * // <en>Deselect the specified row.</en><cn>取消所有选择行的选中状态</cn><jp>指定した行の選択状態を解除する。</jp><kr></kr>
     * listview.clearSelectedRow(1);
     * ```
     */
    clearSelectedRow(rowIndex: number): void;
    /**
     * <en>Select all rows.</en>
     * <cn>选择表格中所有的行。</cn>
     * <jp>リストビュー内のすべての行を選択状態にします。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the selectAllRows method to select all rows in list view.</en><cn>下面的示例代码中，通过selectAllRows方法，选择表格中所有的行。</cn><jp>本サンプルコードでは、selectAllRowsメソッドを使用してリストビュー内のすべての行を選択状態にする例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get list view.</en><cn>获取表格对象</cn><jp>リストビューオブジェクトを取得する。</jp><kr></kr>
     * var listview = page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     * // <en>Select all rows in list view.</en><cn>选择表格中的所有行</cn><jp>リストビュー内のすべての行を選択状態にする。</jp><kr></kr>
     * listview.selectAllRows();
     * ```
     */
    selectAllRows(): void;
    /**
     * <en>Remove all rows's selected status.</en>
     * <cn>将表格中所有选择行的选中状态取消掉。</cn>
     * <jp>リストビュー内のすべての行の選択状態を解除します。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the clearAllSelectedRows method to deselect all rows in list view.</en><cn>下面的示例代码中，通过clearAllSelectedRows方法，将表格中所有选择行的选中状态取消掉。</cn><jp>本サンプルコードでは、clearAllSelectedRowsメソッドを使用してリストビュー内のすべての選択行を解除する例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get list view.</en><cn>获取表格对象</cn><jp>リストビューオブジェクトを取得する。</jp><kr></kr>
     * var listview = page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     * // <en>Deselect all rows in list view.</en><cn>取消所有选择行的选中状态</cn><jp>リストビュー内のすべての選択行を解除する。</jp><kr></kr>
     * listview.clearAllSelectedRows();
     * ```
     */
    clearAllSelectedRows(): void;
    /**
     * <en>Get whether a specified row is selected.</en>
     * <cn>获取指定的行是否被选中。</cn>
     * <jp>指定した行が選択されているかどうかを取得します。戻り値は、選択されている場合がtrue、選択されていない倍がfalseです。</jp>
     * <kr></kr>
     * @param rowIndex <en>The row index.</en>
     * <cn>行索引。</cn>
     * <jp>選択されているかどうかを取得したい行の行番号。行番号は0から始まります。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the isSelectedRow method to get if the specified row is selected.</en><cn>下面的示例代码中，通过isSelectedRow方法，获取指定的行是否被选中。</cn><jp>本サンプルコードでは、isSelectedRowメソッドを使用して使用して、指定した行の選択状態を表示する例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get list view.</en><cn>获取表格对象</cn><jp>リストビューオブジェクトを取得する。</jp><kr></kr>
     * var listview = page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     * // <en>Get the selected status of the specified row.</en><cn>获取指定的行是否被选中</cn><jp>指定する行が選択されているかどうかを取得する。</jp><kr></kr>
     * var row = listview.isSelectedRow(2);
     * // <en>Pops up an alert to show the status.</en><cn>弹出警告框，显示指定的行是否被选中</cn><jp>行の選択状態をダイアログボックスに表示する。</jp><kr></kr>
     * alert(row);
     * ```
     */
    isSelectedRow(rowIndex: number): boolean;
    /**
     * <en>Reload this listview's data.</en>
     * <cn>重新从数据库加载数据。
     * 在表格设置中可以设置“定时刷新数据”，如果不勾选此项，可使用reload方法，重新从数据库加载数据。</cn>
     * <jp>リストビューのデータをサーバーから再読み込みします。
     * リストビューの設定において「一定間隔で最新データに更新」の機能が使用可能です。その使用が適さない場合、本メソッドを使用してリストビューのデータをサーバーから再読み込みする方法を検討してください。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the reload method to reload data from database.</en><cn>下面的示例代码中，通过reload方法，重新从数据库加载数据。</cn><jp>本サンプルコードでは、reloadメソッドを使用して、リストビューのデータをサーバーから再読み込みする例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get list view.</en><cn>获取表格对象</cn><jp>リストビューオブジェクトを取得する。</jp><kr></kr>
     * var listview = page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     * // <en>Reload data from database.</en><cn>重新从数据库加载数据</cn><jp>リストビューのデータをサーバーから再読み込みする。</jp><kr></kr>
     * listview.reload();
     * ```
     */
    reload(): void;
    /**
     * <en>Clear all column filter settings of listview</en>
     * <cn>清除ListView中的所有列筛选项。主要用于ReloadListViewCommand中，作为一个可选参数提供</cn>
     * <jp>リスビューのフィルター設定をすべてクリアします。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the clearAllColumnFilters method to clear all column filters.</en><cn>下面的代码中，通过clearAllColumnFilters清空ListView中的所有列筛选项。</cn><jp>本サンプルコードではclearAllColumnFiltersメソッドを利用してすべてのフィルターの設定をクリアする例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get list view.</en><cn>获取表格对象</cn><jp>リストビューオブジェクトを取得する。</jp><kr></kr>
     * var listview = page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     * // <en>Clear all column filters.</en><cn>清除表格对象的列筛选项</cn><jp>リスビューのフィルター設定をクリア。</jp><kr></kr>
     * listview.clearAllColumnFilters();
     * ```
     */
    clearAllColumnFilters(): void;
    /**
     * <en>Attach a handler to an event for this listivew.</en>
     * <cn>为被选的表格添加一个或多个事件处理程序，并规定事件发生时运行的函数。</cn>
     * <jp>リストビューが持つイベントに対してイベントハンドラを関連付けます。
     *
     * ・イベントへのデータの受け渡し
     * イベントハンドラーにデータを受け渡すには、第2パラメーターに指定します。その場合、イベントハンドラーは第3パラメーターに指定します。 受け渡されたデータは、イベントハンドラーにおける第1パラメーターのdataプロパティから参照できます。</jp>
     * <kr></kr>
     * @param type <en>Required. A string containing the event types, such as `Reloaded`, `SelectionChanged`.</en>
     * <cn>表示事件类型的字符串。表格支持的事件请参考`ListViewEvents`类 。</cn>
     * <jp>関連付けするイベントを表す文字列。セルでサポートされているイベントについては、{@link Forguncy.ListViewEvents ListViewEventsクラス}を参照してください。</jp>
     * <kr></kr>
     * @param data <en>Optional. An object containing data that will be passed to the event handler.</en>
     * <cn>可选参数，如果不忽略表示给事件处理函数传递的自定义参数。</cn>
     * <jp>イベントハンドラーに渡すデータ。関数では第1パラメーターのdataプロパティから参照します。省略可能。</jp>
     * <kr></kr>
     * @param fn <en>Required. A function to execute each time the event is triggered.</en>
     * <cn>事件处理函数。</cn>
     * <jp>イベント発生時に実行される関数。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the bind method to bind a method to trigger when the SelectionChanged event occurs.</en><cn>下面的示例代码中，通过bind方法，给表格添加当前行变化事件处理函数，当表格的当前行发生改变时，弹出一个警告框。</cn><jp>本サンプルコードでは、bindメソッドを使用してSelectionChangedイベントにイベントハンドラーを関連付ける例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページからリストビューを取得する。</jp><kr></kr>
     * var listivew = Forguncy.Page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     *
     * // <en>No need to pass user defined parameters to the event handler.</en><cn>不需要给事件处理函数传递自定义参数</cn><jp>イベントハンドラーにパラメーターを渡さない場合：</jp><kr></kr>
     * listivew.bind("SelectionChanged", function () {
     *     alert("<en>Forguncy</en><cn>活字格</cn><jp>Forguncy</jp><kr>Forguncy</kr>");
     * });
     *
     * // <en>Need to pass user defined parameters to the event handler.</en><cn>需要给事件处理函数传递自定义参数</cn><jp>イベントハンドラーにパラメーターを渡す場合：</jp><kr></kr>
     * var text = "<en>Forguncy</en><cn>活字格</cn><jp>Forguncy</jp><kr>Forguncy</kr>";
     * listivew.bind("SelectionChanged", text, function (arg) {
     *     alert(arg.data);
     * });
     * ```
     */
    bind(type: string, data?: any, fn?: any): void;
    /**
     * <en>Remove handlers to an event for this listview.</en>
     * <cn>移除被选表格的事件处理程序。该方法能够移除被选的事件处理程序，或者当事件发生时终止指定函数的运行。</cn>
     * <jp>リストビューから指定したイベントハンドラの関連付けを解除します。第2パラメーターを省略した場合、指定イベントに関連付けされたすべてのイベントハンドラの関連付けが解除されます。</jp>
     * <kr></kr>
     * @param type <en>Required. A string containing the event types, such as `Reloaded` or `SelectionChanged`.</en>
     * <cn>表示事件类型的字符串。表格支持的事件请参考`ListViewEvents`类 。</cn>
     * <jp>関連付けを削除するイベントを表す文字列。ページでサポートされているイベントについては、{@link Forguncy.ListViewEvents ListViewEventsクラス}を参照してください。</jp>
     * <kr></kr>
     * @param fn <en>Optional. A function to remove for the event. If ignore, remove all hanlers to the event for this listview.</en>
     * <cn>事件处理函数。如果忽略，则取消绑定表格上该事件类型的所有处理函数。</cn>
     * <jp>対象ページ名。すべてのページのイベントに対する関連付けを解除する場合は、「*」を指定します。省略した場合、現在のページに対してイベントに対する関連付け解除を行います。本パラメーターは省略可能です。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the unbind method to remove the binded method.</en><cn>下面的示例代码中，通过unbind方法，移除表格的事件绑定。</cn><jp>本サンプルコードでは、unbindメソッドを使用してリストビューイベントの関連付けを解除する方法をいくつか示します。</jp><kr></kr>
     * // <en>Define an event handle.</en><cn>定义事件处理函数</cn><jp>イベントハンドラーの定義。</jp><kr></kr>
     * var onSelectionChanged = function () {
     *     alert("<en>Forguncy</en><cn>活字格</cn><jp>Forguncy</jp><kr>Forguncy</kr>");
     * }
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get list view.</en><cn>获取表格对象</cn><jp>リストビューオブジェクトを取得する。</jp><kr></kr>
     * var listview = page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     * // <en>Bind the event handle to list view.</en><cn>绑定表格的事件</cn><jp>イベントハンドラーの関連付けを行う。</jp><kr></kr>
     * listivew.bind("SelectionChanged", onSelectionChanged);
     * // <en>Remove the binded event handle.</en><cn>取消特定事件处理函数的绑定</cn><jp>イベントハンドラーの関連付けを行う。</jp><kr></kr>
     * listivew.unbind("SelectionChanged", onSelectionChanged);
     * // <en>Unbind all functions attached to the `SelectionChanged` event.</en><cn>取消绑定所有关联到`SelectionChanged`事件的执行函数。</cn><jp>SelectionChangedイベントに関連付けられているすべてのイベントハンドラーの関連付けを解除する。</jp><kr></kr>
     * listivew.unbind("SelectionChanged");
     * ```
     */
    unbind(type: any, fn?: any): void;
    /**
     * <en>Get this listview's pagination info. If this listview don't paging, the return value will be null.</en>
     * <cn>获取表格页码信息。如果表格没有分页，返回值将为null。</cn>
     * <jp>リストビューがページングされている時、ページング情報（1ページの最大行数、ページ数、インデックス番号(1～)）を取得します。ページングされていない時の戻り値はnullです。
     * <h4>戻り値の例</h4>
     * ```javascript
     * {
     *     // ページ数
     *     "PageCount":3,
     *     // ページのインデックス番号
     *     "PageIndex":1,
     *     // 1ページの最大行数
     *     "MaxRowCountOfOnePage":10
     * }
     * ```</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>The best practice is that calling the function in `PageDefaultDataLoaded` event, because until then, the listview data has not been loaded to complete.</en><cn>最好在页面的`PageDefaultDataLoaded`事件处理函数中调用该方法，因为在此之前，表格的数据还没有加载完成。</cn><jp>PageDefaultDataLoadedイベントで本メソッドを使用することを推奨します。それ以外のイベントの場合、リストビューデータの読み込みが完了していない可能性があります。</jp><kr></kr>
     * Forguncy.Page.bind(Forguncy.PageEvents.PageDefaultDataLoaded, function () {
     *     var listview = Forguncy.Page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     *     // <en>Get list view page number information.</en><cn>获取表格页码信息</cn><jp>リストビューのページング情報を取得する。</jp><kr></kr>
     *     var pagingInfo = listview.getPaginationInfo();
     *     listview.bind(Forguncy.ListViewEvents.Reloaded, function() {
     *         // <en>When you click previous or next in the paging navigation cell, the listview reloads the data and the page number is updated.</en><cn>在分页导航单元格中单击“上一页”或“下一页”后，表格将重新加载数据，页码信息也会更新。</cn><jp>ページナビゲーション型セルで［前へ］、または［次へ］をクリックすると、リストビューのデータが再読み込みされ、ページング情報が更新されます。</jp><kr></kr>
     *         var pagingInfo = listview.getPaginationInfo();
     *         // <en>Pops up an alert to show the page number of list view.</en><cn>弹出警告框，显示表格页码信息</cn><jp>ページング情報をダイアログボックスに表示する。</jp><kr></kr>
     *         alert(JSON.stringify(pagingInfo, null, " "));
     *     });
     * });
     * ```
     */
    getPaginationInfo(): ListviewPaginationInfo;

    /**
     * <en>Display listview's data by pages, and go to a specified page.</en>
     * <cn>使用此方法分页显示表格的数据，您可以设置每页显示的行数，并进入指定的页码。</cn>
     * <jp>ページナビゲーション型セルを使用してリストビューのページングを行っている場合に、ページごとに表示される行数を再設定し、指定したページ番号を表示します。</jp>
     * <kr></kr>
     * @param pageRowCount <en>The max row count of one page.</en>
     * <cn>一页的最多行数。</cn>
     * <jp>ページごとに表示される行数。</jp>
     * <kr></kr>
     * @param pageIndex <en>The displayed page's index.</en>
     * <cn>显示的页面的索引。如果忽略则进入第一页。</cn>
     * <jp>表示さるページ番号。省略された場合、最初のページを表示します。ページ番号は1から始まります。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the usePaginationDisplay method to set each pages row number and the entry page number of list view.</en><cn>下面的示例代码中，通过usePaginationDisplay方法，设置每页显示的行数，并进入指定的页码。</cn><jp>本サンプルコードでは、usePaginationDisplayメソッドを使用して、ページごとに表示される行数を再設定し、指定された番号のページを表示する例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get list view.</en><cn>获取表格对象</cn><jp>リストビューオブジェクトを取得する。</jp><kr></kr>
     * var listview = page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     * // <en>Set each pages row number and the entry page number of list view.</en><cn>设置每页显示行数，并进入指定页码</cn><jp>ページごとに表示される行数を再設定し、指定された番号のページを表示する。</jp><kr></kr>
     * listview.usePaginationDisplay(6, 2)
     * ```
     */
    usePaginationDisplay(pageRowCount: number, pageIndex?: number): void;
    /**
     * <en>If listview display data by pages, go to first page.</en>
     * <cn>如果表格使用分页导航按钮将表格数据分页显示，使用此方法可使表格跳转到第一页，显示第一页的数据。</cn>
     * <jp>ページナビゲーション型セルを使用してリストビューのページングを行っている場合に、最初のページを表示します。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the goToFirstPage method to jump to the first page of list view.</en><cn>下面的示例代码中，通过goToFirstPage方法，将显示的表格数据跳转到第一页。</cn><jp>本サンプルコードでは、goToFirstPageメソッドを使用してページングの最初のページを表示する例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get list view.</en><cn>获取表格对象</cn><jp>リストビューオブジェクトを取得する。</jp><kr></kr>
     * var listview = page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     * // <en>Go to the first page of list view.</en><cn>跳转到表格的第一页</cn><jp>ページングの最初のページを表示する。</jp><kr></kr>
     * listview.goToFirstPage()
     * ```
     */
    goToFirstPage(): void;
    /**
     * <en>If listview display data by pages, go to previous page.</en>
     * <cn>如果表格使用分页导航按钮将表格数据分页显示，使用此方法可使表格跳转到当前页的前一页，显示前一页的数据。</cn>
     * <jp>ページナビゲーション型セルを使用してリストビューのページングを行っている場合に、現在のページの前のページを表示します。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the goToPreviousPage method to go to the previous page of current page.</en><cn>下面的示例代码中，通过goToPreviousPage方法，将显示的表格数据跳转到当前页的前一页。</cn><jp>本サンプルコードでは、goToPreviousPageメソッドを使用してページングで表示している現在のページの前のページを表示する例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get list view.</en><cn>获取表格对象</cn><jp>リストビューオブジェクトを取得する。</jp><kr></kr>
     * var listview = page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     * // <en>Go to the previous page of current page.</en><cn>跳转到表格当前页的前一页</cn><jp>ページングで表示している現在のページの前のページを表示する。</jp><kr></kr>
     * listview.goToPreviousPage()
     * ```
     */
    goToPreviousPage(): void;
    /**
     * <en>If listview display data by pages, go to next page.</en>
     * <cn>如果表格使用分页导航按钮将表格数据分页显示，使用此方法可使表格跳转到当前页的下一页，显示下一页的数据。</cn>
     * <jp>ページナビゲーション型セルを使用してリストビューのページングを行っている場合に、現在のページの次のページを表示します。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the goToNextPage method to go to the next page of current page.</en><cn>下面的示例代码中，通过goToNextPage方法，将显示的表格数据跳转到当前页的下一页。</cn><jp>本サンプルコードでは、goToNextPageメソッドを使用してページングで表示している現在のページの次のページを表示する例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get list view.</en><cn>获取表格对象</cn><jp>リストビューオブジェクトを取得する。</jp><kr></kr>
     * var listview = page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     * // <en>to the next page of current page.</en><cn>跳转到表格当前页的下一页</cn><jp>ページングで表示している現在のページの次のページを表示する。</jp><kr></kr>
     * listview.goToNextPage()
     * ```
     */
    goToNextPage(): void;
    /**
     * <en>If listview display data by pages, go to last page.</en>
     * <cn>如果表格使用分页导航按钮将表格数据分页显示，使用此方法可使表格跳转到最后一页，显示最后一页的数据</cn>
     * <jp>ページナビゲーション型セルを使用してリストビューのページングを行っている場合に、最後のページを表示します。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the goToLastPage method to go to the last page of list view.</en><cn>下面的示例代码中，通过goToLastPage方法，将显示的表格数据跳转到最后一页。</cn><jp>本サンプルコードでは、goToNextPageメソッドを使用してページングで表示している現在のページの次のページを表示する例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get list view.</en><cn>获取表格对象</cn><jp>リストビューオブジェクトを取得する。</jp><kr></kr>
     * var listview = page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     * // <en>Go to the last page of list view.</en><cn>跳转到表格的最后一页</cn><jp>ページングの最後のページを表示する。</jp><kr></kr>
     * listview.goToLastPage()
     * ```
     */
    goToLastPage(): void;
    /**
     * <en>If listview display data by pages, go to a specified page.</en>
     * <cn>如果表格使用分页导航按钮将表格数据分页显示，使用此方法可使表格跳转到指定的页，显示指定页的数据。</cn>
     * <jp>ページナビゲーション型セルを使用してリストビューのページングを行っている場合に、指定したページを表示します。</jp>
     * <kr></kr>
     * @param pageIndex <en>The specified page's index.</en>
     * <cn>指定的页面索引。</cn>
     * <jp>ページングにおける表示するページ番号。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the goToSpecifiedPage method to go to the specified page.</en><cn>下面的示例代码中，通过goToSpecifiedPage方法，使表格跳转到指定的页。</cn><jp>本サンプルコードでは、goToSpecifiedPageメソッドを使用してページングで表示しているリストビューのページを指定した番号のページへと変更します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get list view.</en><cn>获取表格对象</cn><jp>リストビューオブジェクトを取得する。</jp><kr></kr>
     * var listview = page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     * // <en>Go to the specified page.</en><cn>跳转到指定的页</cn><jp>ページングで表示しているリストビューのページを指定した番号のページへと変更します。</jp><kr></kr>
     * listview.goToSpecifiedPage(3)
     * ```
     */
    goToSpecifiedPage(pageIndex: number): void;
    /**
     * <en>Showing the indicator in listview to avoid unexpected operation.</en>
     * <cn>显示表格的加载图标，并禁用表格，直到调用hiddenLoadingIndicator，表格才能重新启用。通常用于进行大量操作表格之前，以避免意外操作。</cn>
     * <jp>本メソッドを呼び出すと、リストビューの表示が完了していないにも関わらずユーザーがリストビューに対して操作を行わないようにするために、読み込みインジケーター（プログレスリング）が表示されている間リストビューを無効にできます。hiddenLoadingIndicatorメソッドが呼び出されると、リストビューは有効になります。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the showLoadingIndicator method to show the lodaing indicator and the hiddenLoadingIndicator method to hide the lodaing indicator.</en><cn>使用showLoadingIndicator方法和hiddenLoadingIndicator方法在列表视图中显示加载指示器并暂时禁用列表视图的示例。</cn><jp>本サンプルコードでは、showLoadingIndicatorメソッドとhiddenLoadingIndicatorメソッドを使用してリストビューに読み込みインジケーターを表示して一時的にリストビューを無効化する例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get list view.</en><cn>获取表格对象</cn><jp>リストビューオブジェクトを取得する。</jp><kr></kr>
     * var listview = page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     *
     * listview.showLoadingIndicator();
     *
     * // <en>Do something...</en><cn>操作表格...</cn><jp>何らかの処理を行う。</jp><kr></kr>
     *
     * listview.hiddenLoadingIndicator();
     * ```
     */
    showLoadingIndicator(): void;
    /**
     * <en>Hidden the indicator in listview.</en>
     * <cn>隐藏表格的加载图标，并恢复表格的正常的使用。通常与`showLoadingIndicator`方法配套使用。</cn>
     * <jp>showLoadingIndicatorメソッドを呼び出すと、リストビューの表示が完了していないにも関わらずユーザーがリストビューに対して操作を行わないようにするために、読み込みインジケーター（プログレスリング）が表示されている間リストビューを無効にできます。本メソッドが呼び出されると、リストビューは有効になります。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the showLoadingIndicator method to show the lodaing indicator and the hiddenLoadingIndicator method to hide the lodaing indicator.</en><cn>使用showLoadingIndicator方法和hiddenLoadingIndicator方法在列表视图中显示加载指示器并暂时禁用列表视图的示例。</cn><jp>本サンプルコードでは、showLoadingIndicatorメソッドとhiddenLoadingIndicatorメソッドを使用してリストビューに読み込みインジケーターを表示して一時的にリストビューを無効化する例を示します。</jp><kr></kr>
     * // <en>Get current page.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get list view.</en><cn>获取表格对象</cn><jp>リストビューオブジェクトを取得する。</jp><kr></kr>
     * var listview = page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     *
     * listview.showLoadingIndicator();
     *
     * // <en>Do something...</en><cn>操作表格...</cn><jp>何らかの処理を行う。</jp><kr></kr>
     *
     * listview.hiddenLoadingIndicator();
     * ```
     */
    hiddenLoadingIndicator(): void;

    /**
     * <en>Hide columns in listview.</en>
     * <cn>隐藏表格的列。</cn>
     * <jp>リストビューの列を非表示にします。</jp>
     * <kr></kr>
     * @param columns <en>The column name's array or merged column index's array.</en>
     * <cn>列表视图中的列名数组或列索引数组。</cn>
     * <jp>リストビューの列名の配列、もしくは列インデックスの配列。列インデックスは設計時の列インデックスであり、0から始まります。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the hideColumns method to hide columns by column name.</en><cn>下面的示例代码中，展示了如何隐藏表格的列。</cn><jp>本サンプルコードでは、リストビューの列を非表示にする方法を示します。</jp><kr></kr>
     * // <en>Get current page object.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get listview object.</en><cn>获取表格对象</cn><jp>リストビューオブジェクトを取得する。</jp><kr></kr>
     * var listview = page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     *
     * // <en>Hide the  columns named "Text" and "Text1".</en><cn>隐藏列名为 "Text" 和 "Text1" 的列。</cn><jp>列名が「Text」および「Text1」の列を非表示にします。</jp><kr></kr>
     * listview.hideColumns(["Text", "Text1"]);
     *
     * // <en>Hide the second and third columns in the listview.</en><cn>隐藏表格中的第二列和第三列。</cn><jp>リストビューの2番目と3番目の列を非表示にします。セルを結合に関係なく列を数える必要があります。</jp><kr></kr>
     * listview.hideColumns([1,2]);
     * ```
     */
    hideColumns(columns: (string | number)[]): void;

    /**
     * <en>Show columns in listview.</en>
     * <cn>显现表格中通过API和列选项命令隐藏的列。</cn>
     * <jp>hideColumnsメソッド、もしくは［リストビューの列カスタマイズ］コマンドによって非表示となっているリストビューの列を表示させます。</jp>
     * <kr></kr>
     * @param columns <en>The column name's array or merged column index's array.</en>
     * <cn>列表视图中的列名数组或列索引数组。</cn>
     * <jp>リストビューの列名の配列、もしくは列インデックスの配列。列インデックスは設計時の列インデックスであり、0から始まります。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, shows how to use the showColumns method to show columns by column name.</en><cn>下面的示例代码中，展示了如何显现表格中通过API和列选项命令隐藏的列。</cn><jp>本サンプルコードでは、hideColumnsメソッド、もしくは［リストビューの列カスタマイズ］コマンドによって非表示となっているリストビューの列を表示させる例を示します。</jp><kr></kr>
     * // <en>Get current page object.</en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en>Get listview object.</en><cn>获取表格对象</cn><jp>リストビューオブジェクトを取得する。</jp><kr></kr>
     * var listview = page.getListView("<en>ListView1</en><cn>表格1</cn><jp>リストビュー1</jp><kr></kr>");
     *
     * // <en>Show the  columns named "Text" and "Text1".</en><cn>显现列名为 "Text" 和 "Text1" 的列。</cn><jp>列名が「Text」および「Text1」の列を表示させます。</jp><kr></kr>
     * listview.showColumns(["Text", "Text1"]);
     *
     * // <en>Show the second and third columns in the listview.</en><cn>显现表格中的第二列和第三列。</cn><jp>リストビューの2番目と3番目の列を表示させます。セルを結合に関係なく列を数える必要があります。</jp><kr></kr>
     * listview.showColumns([1,2]);
     * ```
     */
    showColumns(columns: (string | number)[]): void;
  }

  /**
   * <en>Represents data of a row in listview.</en>
   * <cn>表示表格中行数据的信息。用于getSelectedRowsData方法。</cn>
   * <jp>リストビュー内の行データに関する情報を表します。{@link Forguncy.ListView.getSelectedRowsData getSelectedRowsDataメソッド}に使用されます。</jp>
   * <kr></kr>
   */
  interface RowData {
    /**
     * <en>The row's index, start with 0. This property has valid value only when Query is empty.</en>
     * <cn>表格中所选行的行索引。如果该行有`Query`信息，则`RowIndex`为`-1`。只有当该行没有`Query`信息时（比如新加行），`RowIndex`才是有效值。</cn>
     * <jp>リストビューの選択された行の行番号。「Query]」情報が存在する場合「RowIndex」は「-1」です。例えば追加された新規行のように「Query」情報が空の場合のみ、RowIndexは有効な値を持ちます。</jp>
     * <kr></kr>
     */
    RowIndex: number;
    /**
     * <en>The row's primary keys info.</en>
     * <cn>所选行的查询条件。所选行的查询条件，以主键名作为键，以对应数据作为值。比如：`{ID:1}`</cn>
     * <jp>選択した行のクエリー条件。keyに主キーのフィールド名をvalueに対応するデータを指定したJSONオブジェクト。例：`{ID：1}`</jp>
     * <kr></kr>
     */
    Query: {
      [name: string]: any;
    };
    /**
     * <en>The row's data.</en>
     * <cn>所选行的数据。</cn>
     * <jp>選択した行のデータ。</jp>
     * <kr></kr>
     */
    Values: any[];
  }

  /**
   * <en>Represents the pagination info of a listview.</en>
   * <cn>表示表格的分页信息。用于getPaginationInfo方法。</cn>
   * <jp>リストビューのページング情報を示します。{@link Forguncy.ListView.getPaginationInfo getPaginationInfoメソッド}に使用されます。</jp>
   * <kr></kr>
   */
  interface ListviewPaginationInfo {
    /**
     * <en>The max row count of one page.</en>
     * <cn>单页显示的最大行数。</cn>
     * <jp>1ページの最大行数。</jp>
     * <kr></kr>
     */
    MaxRowCountOfOnePage: number;
    /**
     * <en>The page count.</en>
     * <cn>页面数量。</cn>
     * <jp>ページ数。</jp>
     * <kr></kr>
     */
    PageCount: number;
    /**
     * <en>Current page's index, start with `0`.</en>
     * <cn>当前页的索引。</cn>
     * <jp>ページのインデックス番号。</jp>
     * <kr></kr>
     */
    PageIndex: number;
    /**
     * <en>TotalRowCount</en>
     * <cn>总行数。</cn>
     * <jp>行数の合計</jp>
     * <kr></kr>
     */
    TotalRowCount: number;
  }

  /**
   * <en>Represents a merged column info.</en>
   * <cn>表格列的属性。用于 getMergedColumnInfos方法 。</cn>
   * <jp>リストビューの結合された列情報を表します。{@link Forguncy.ListView.getMergedColumnInfos getMergedColumnInfosメソッド}に使用されます。</jp>
   * <kr></kr>
   */
  interface IMergedColumnInfo {
    /**
     * <en>The listview column's first column index in designer.</en>
     * <cn>该列在设计器中的第一个列索引。</cn>
     * <jp>Forguncy Builder上におけるリストビューの最初の列の位置番号。たとえばA列の場合は0、B列の場合には1になります。</jp>
     * <kr></kr>
     */
    DesignerColumnIndex: number;
    /**
     * <en>The listview column's count in designer.</en>
     * <cn>该列在设计器中的合并列数量。</cn>
     * <jp>Forguncy Builder上におけるリストビューの列の数。</jp>
     * <kr></kr>
     */
    DesignerColumnCount: number;
    /**
     * <en>The listview column's name.</en>
     * <cn>表格中列的名称。</cn>
     * <jp>列の名前。</jp>
     * <kr></kr>
     */
    ColumnName: string;
    /**
     * <en>The column's type.</en>
     * <cn>表格中列的信息。</cn>
     * <jp>リストビューに記載されている情報を表すListviewColumnType列挙型。</jp>
     * <kr></kr>
     */
    ColumnType: ListviewColumnType;
  }

  /**
   * <en>Represents listview's column type.</en>
   * <cn>表示表格的列类型。</cn>
   * <jp>リストビューの列の型を表します。</jp>
   * <kr></kr>
   */
  enum ListviewColumnType {
    /**
     * <en>Row header column.</en>
     * <cn>行头列。</cn>
     * <jp>列ヘッダー。0で表されます。</jp>
     * <kr></kr>
     */
    RowHeader,
    /**
     * <en>Selected column.</en>
     * <cn>选择列。</cn>
     * <jp>選択列。1で表されます。</jp>
     * <kr></kr>
     * */
    SelectedColumn,
    /**
     * <en>Normal column in data area.</en>
     * <cn>数据列。</cn>
     * <jp>データ領域の通常列。2で表されます。</jp>
     * <kr></kr>
     * */
    DataColumn,
  }

  /**
   * <en>Provoides a series of urls.</en>
   * <cn>提供一系列特殊的`URL`路径。</cn>
   * <jp>特別な「URL」パスを提供します。</jp>
   * <kr></kr>
   */
  class SpecialPath {
    /**
     * <en>The application's base url.</en>
     * <cn>获取应用程序网站的根URL。如果应用没有发布，则获取的根URL为“/”。</cn>
     * <jp>アプリケーションのルートURLを取得します。アプリケーションが発行されていない場合、取得されるルートURLは「/」です。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In the following sample code, the root URL of the application website is obtained through the getBaseUrl method.</en><cn>下面的示例代码中，通过getBaseUrl方法，获取应用程序网站的根URL。</cn><jp>本サンプルコードでは、アプリケーションのルートURLを取得する例を示します。</jp><kr></kr>
     * // <en>Get the Helper object.</en><cn>获取帮助方法</cn><jp>Helperオブジェクトを取得する。</jp><kr></kr>
     * var helper = Forguncy.Helper;
     * // <en>Fetch the root URL of the application website.</en><cn>取应用程序网站的根URL</cn><jp>アプリケーションのルートURLを取得する。</jp><kr></kr>
     * var url = helper.SpecialPath.getBaseUrl();
     * // <en>A warning box pops up showing the root URL.</en><cn>弹出警告框，显示根URL</cn><jp>ダイアログボックスに取得したURLを表示します。</jp><kr></kr>
     * alert(path);
     * ```
     */
    getBaseUrl(): string;
    /**
     * <en>The builtin image folder path in ImageSelectorEditor.</en>
     * <cn>获取使用图片单元格类型选择图片时，内建图片所在文件夹的路径。</cn>
     * <jp>画像型セルを使用して画像を選択したときに、組み込み画像が配置されるフォルダーのパスを取得します。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In the following sample code, the path to the folder where the built-in images are located is obtained by the getBuiltInImageFolderPath method.</en><cn>下面的示例代码中，通过getBuiltInImageFolderPath方法，获取内建图片所在文件夹的路径。</cn><jp>本サンプルコードでは、画像型セルを使用して画像を選択したときに、組み込み画像が配置されるフォルダーのパスを取得する例を示します。</jp><kr></kr>
     * // <en>Get the Helper object.</en><cn>获取帮助方法</cn><jp>Helperオブジェクトを取得する。</jp><kr></kr>
     * var helper = Forguncy.Helper;
     * // <en>Get the path to the folder where the built-in images are located.</en><cn>获取获取内建图片所在文件夹的路径</cn><jp>組み込み画像が配置されるフォルダーのパスを取得する。</jp><kr></kr>
     * var path = helper.SpecialPath.getBuiltInImageFolderPath();
     * // <en>A warning box pops up, showing the path to the folder where the built-in images are located.</en><cn>弹出警告框，显示内建图片所在文件夹路径</cn><jp>ダイアログボックスに取得したパスを表示します。</jp><kr></kr>
     * alert(path);
     * ```
     */
    getBuiltInImageFolderPath(): string;
    /**
     * <en>The upload image folder path in ImageSelectorEditor.</en>
     * <cn>获取使用图片单元格类型选择图片时，上传的图片所在文件夹的路径。</cn>
     * <jp>画像型セルを使用してローカルファイルをインポートした場合に、ローカルファイルをインポートした場合に、画像ファイルが配置されるフォルダーのパスを取得取得します。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In the following sample code, the getImageEditorUploadImageFolderPath method is used to get the path of the folder where the uploaded image is located.</en><cn>下面的示例代码中，通过getImageEditorUploadImageFolderPath方法，获取上传图片所在文件夹的路径。</cn><jp>本サンプルコードでは、画像型セルを使用してローカルファイルをインポートした場合に、画像ファイルが配置されるフォルダーのパスを取得する例を示します。</jp><kr></kr>
     * // <en>Get the Helper object.</en><cn>获取帮助方法</cn><jp>Helperオブジェクトを取得する。</jp><kr></kr>
     * var helper = Forguncy.Helper;
     * // <en>Get the path of the folder where the image file is placed.</en><cn>获取上传图片所在文件夹的路径</cn><jp>画像ファイルが配置されるフォルダーのパスを取得する。</jp><kr></kr>
     * var path = helper.SpecialPath.getImageEditorUploadImageFolderPath();
     * // <en>The obtained path is displayed in the dialog box.</en><cn>弹出警告框，显示上传图片所在文件夹路径</cn><jp>ダイアログボックスに取得したパスを表示します。</jp><kr></kr>
     * alert(path);
     * ```
     */
    getImageEditorUploadImageFolderPath(): string;
    /**
     * <en>The upload file folder path in designer.</en>
     * <cn>获取在设计器中上传的文件的文件夹路径。</cn>
     * <jp>Forguncy Builderにアップロードされたファイルのフォルダーパスを取得します。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In the following sample code, the getUploadFileFolderPathInDesigner method is used to get the folder path of the file uploaded in the designer.</en><cn>下面的示例代码中，通过getUploadFileFolderPathInDesigner方法，获取在设计器中上传的文件的文件夹路径。</cn><jp>本サンプルコードでは、デザイナーにアップロードされたファイルのフォルダーパスを取得する例を示します。</jp><kr></kr>
     * // <en>Get the Helper object.</en><cn>获取帮助方法</cn><jp>Helperオブジェクトを取得する。</jp><kr></kr>
     * var helper = Forguncy.Helper;
     * // <en>Get the folder path of the uploaded file.</en><cn>获取上传图片所在文件夹的路径</cn><jp>アップロードされたファイルのフォルダーパスを取得する。</jp><kr></kr>
     * var path = helper.SpecialPath.getUploadFileFolderPathInDesigner();
     * // <en>A warning box pops up, showing the path to the folder where the uploaded files are located.</en><cn>弹出警告框，显示上传的文件所在文件夹路径</cn><jp>ダイアログボックスに取得したパスを表示します。</jp><kr></kr>
     * alert(path);
     * ```
     */
    getUploadFileFolderPathInDesigner(): string;
    /**
     * <en>The upload image path using UploadImageCellType in runtime.</en>
     * <cn>获取使用图片上传单元格类型上传的图片所在文件夹的路径。</cn>
     * <jp>画像アップロード型セルを使用してアップロードされた画像があるフォルダーのパスを取得します。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In the following sample code, the getUploadImageFolderPathInServer method is used to get the path to the folder where the images uploaded using the UploadImageCellType are located.</en><cn>下面的示例代码中，通过getUploadImageFolderPathInServer方法，获取使用图片上传单元格类型上传的图片所在文件夹的路径。</cn><jp>本サンプルコードでは、画像アップロード型セルを使用してアップロードされた画像が配置されているフォルダーのパスを取得する例を示します。</jp><kr></kr>
     * // <en>Get the Helper object.</en><cn>获取帮助方法</cn><jp>Helperオブジェクトを取得する。</jp><kr></kr>
     * var helper = Forguncy.Helper;
     * // <en>Get the path to the folder where the images uploaded using the UploadImageCellType are located.</en><cn>获取使用图片上传单元格类型上传的图片所在文件夹的路径</cn><jp>画像アップロード型セルを使用してアップロードされた画像が配置されているフォルダーのパスを取得する。</jp><kr></kr>
     * var path = helper.SpecialPath.getUploadImageFolderPathInServer();
     * // <en>A warning box pops up, showing the folder path.</en><cn>弹出警告框，显示文件夹路径</cn><jp>ダイアログボックスに取得したパスを表示します。</jp><kr></kr>
     * alert(path);
     * ```
     */
    getUploadImageFolderPathInServer(): string;
    /**
     * <en>The user file foler path.</en>
     * <cn>获取用户文件的存储路径。</cn>
     * <jp>CSSで使用する画像ファイルなどを配置するリソースフォルダーのパスを取得します。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In the following sample code, the getUserFileFolderPath method is used to get the storage path of the user's files.</en><cn>下面的示例代码中，通过getUserFileFolderPath方法，获取用户文件的存储路径。</cn><jp>本サンプルコードでは、画像アップロード型セルを使用してアップロードされた画像が配置されているフォルダーのパスを取得する例を示します。</jp><kr></kr>
     * // <en>Get the Helper object.</en><cn>获取帮助方法</cn><jp>Helperオブジェクトを取得する。</jp><kr></kr>
     * var helper = Forguncy.Helper;
     * // <en>Get the storage path of user files.</en><cn>获取用户文件的存储路径</cn><jp>リソースフォルダーへのパスを取得する。</jp><kr></kr>
     * var path = helper.SpecialPath.getUserFileFolderPath();
     * // <en>A warning box pops up, showing the folder path.</en><cn>弹出警告框，显示文件夹路径</cn><jp>ダイアログボックスに取得したパスを表示します。</jp><kr></kr>
     * alert(path);
     * ```
     */
    getUserFileFolderPath(): string;
    /**
     * <en>Gets the plugin's network root url.</en>
     * <cn>获取指定插件的网络根路径。</cn>
     * <jp>指定したプラグインのネットワークルートパスを取得します。</jp>
     * <kr></kr>
     * @param pluginGuid <en>The unique ID for the plugin, usually specified in PluginConfig.json's guid property.</en>
     * <cn>插件的唯一标识符，通常由 PluginConfig.json 中的 guid 属性指定。</cn>
     * <jp>プラグイン固有のIDです。通常はPluginConfig.jsonのguidプロパティを指定します。</jp>
     * <kr></kr>
     */
    getPluginRootPath(pluginGuid: string): string;
  }

  /**
   * <en>The helper class.</en>
   * <cn>帮助类，提供一些帮助方法和属性。</cn>
   * <jp>いくつかのヘルパーメソッド、およびヘルパープロパティを提供するヘルパークラス。</jp>
   * <kr></kr>
   */
  class ForguncyHelper {
    /**
     * <en>Submits data to Server.</en>
     * <cn>提交数据到服务器。</cn>
     * <jp>サーバーにPOSTメソッドを使用してデータを送信します。</jp>
     * <kr></kr>
     * @param url <en>A string containing the URL to which the request is sent.</en>
     * <cn>包含请求发送的URL的字符串。</cn>
     * <jp>リクエストの送信先URL文字列。</jp>
     * <kr></kr>
     * @param param <en>The data to send along with the request.</en>
     * <cn>发送请求的数据。</cn>
     * <jp>送信するデータ。</jp>
     * <kr></kr>
     * @param callback <en>A function to be executed if the request succeeds.</en>
     * <cn>成功回调函数。</cn>
     * <jp>リクエストが成功した際に実行されるコールバック関数。</jp>
     * <kr></kr>
     * @param async <en>Specified whether the request is async. The default value is true.</en>
     * <cn>指定请求是否是异步的。默认值为 true。</cn>
     * <jp>リクエストを非同期にするかどうかを設定します。デフォルトはtrue（非同期）です。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>If you defined a server side API class named 'MyForguncyApi' and contain a post method 'QueryData', you can using it like following:</en><cn>如果您自定义了一个服务端`Web API`类`MyForguncyApi` ，该类包含一个`post`方法 `QueryData`，您可以在前端使用以下代码调用该方法：</cn><jp>本サンプルコードでは、Forguncy Server側に「MyForguncyApi」という名称のカスタムWeb APIのクラスを作成し、そこで定義されている「QueryData」メソッドをpostメソッドを使用して呼び出す例を示します。</jp><kr></kr>
     * // <en></en><cn>获取当前页面</cn><jp>現在のページを取得する。</jp><kr></kr>
     * var page = Forguncy.Page;
     * // <en></en><cn>获取页面上的单元格</cn><jp>ページ上のセルを取得する。</jp><kr></kr>
     * var cell1 = page.getCell("name");
     * var cell2 = page.getCell("department");
     * // <en></en><cn>获取单元格的值</cn><jp>セルの値を取得する。</jp><kr></kr>
     * var data = {
     *     name: cell1.getValue(),
     *     department: cell2.getValue()
     * };
     * // <en></en><cn>发送请求到服务器</cn><jp>サーバーにPOSTメソッドを使用してデータを送信する。</jp><kr></kr>
     * Forguncy.Helper.post("customApi/MyForguncyApi/QueryData", data, function (message) {
     *      if (message)
     *      {
     *          alert(message);
     *      }
     * });
     * ```
     */
    post(
      url: string,
      param: any,
      callback: {
        (...p: any[]): any;
      },
      async?: boolean,
    ): void;

    /**
     * <en>Please refer {@link Forguncy.SpecialPath SpecialPath Class}.</en>
     * <cn>请参考{@link Forguncy.SpecialPath}。</cn>
     * <jp>{@link Forguncy.SpecialPath SpecialPathクラス}を参照してください。</jp>
     * <kr></kr>
     */
    SpecialPath: SpecialPath;
    /**
     * <en>Translate a formula to cell location info.</en>
     * <cn>把一个公式翻译成单元格位置信息。</cn>
     * <jp>数式をセルの位置情報に変換します。</jp>
     * <kr></kr>
     * @param formula <en>The formula, like "=A1".</en>
     * <cn>公式，如："=A1"</cn>
     * <jp>「=A1」などの数式。</jp>
     * <kr></kr>
     * @param formulaCalcContext <en>A formula calc context.</en>
     * <cn>用于计算公式的上下文</cn>
     * <jp>数式の計算に使用されるコンテキスト。</jp>
     * <kr></kr>
     * @returns <en>The cell's location info. If the formula is not represent a cell, like "=SUM(1,2)", the method will return null.</en>
     * <cn>单元格的位置信息，如果公式没有引用单元格，如"=SUM(1,2)"，该方法讲返回null。</cn>
     * <jp>セルの位置情報。数式が「= SUM（1,2）」のようなセルの位置情報返さない場合、本メソッドはnullを返します。</jp>
     * <kr></kr>
     */
    getCellLocation(formula: string, formulaCalcContext: FormulaCalcContext): CellLocationInfo;
  }

  /**
   * <en>Send mail.</en>
   * <cn>发送邮件。</cn>
   * <jp>送信元と送信先、メールのタイトル、本文を指定してメールを送信します。本メソッドの使用にはメールサーバーの設定が必要です。</jp>
   * <kr></kr>
   * @param from <en>The sender's e-mail address.</en>
   * <cn>发件人邮箱。</cn>
   * <jp>送信元（差出人）のメールアドレスを指定。</jp>
   * <kr></kr>
   * @param to <en>The recipient's e-mail address.</en>
   * <cn>指定收件人电子邮箱地址。如果是多名收件人，请使用逗号分隔。</cn>
   * <jp>送信先（宛先）のメールアドレスを指定。カンマ区切りで複数の送信先を指定することができます。</jp>
   * <kr></kr>
   * @param title <en>The mail's title.</en>
   * <cn>电子邮件标题。</cn>
   * <jp>メールのタイトルを指定。</jp>
   * <kr></kr>
   * @param content <en>The mail's content.</en>
   * <cn>指定电子邮件的正文内容。除了使用纯文本的电子邮件正文，还可以使用HTML标记的字符串。</cn>
   * <jp>メールの本文を指定。プレーンなテキストのほか、HTMLタグを含む文字列を指定することもできます。 </jp>
   * <kr></kr>
   * @param successCallBack <en>A function to be executed if the send mail succeeds.</en>
   * <cn>指定一个回调函数，此回调函数会在电子邮件成功发送后被调用。该参数为可选参数。</cn>
   * <jp>メールの送信が成功したときに実行するコールバック関数を指定します。引数にはリクエスト結果が渡されます。このパラメーターは省略可能です。</jp>
   * <kr></kr>
   * @param failCallBack <en>A callback function that is executed if send mail fail.</en>
   * <cn>指定一个回调函数，此回调函数会在电子邮件发送失败后被调用，并且通过errorMessage参数通知错误信息。该参数为可选参数。</cn>
   * <jp>メールの送信が失敗したときに実行するコールバック関数を指定します。 引数にエラーメッセージが渡されます。このパラメーターは省略可能です。</jp>
   * <kr></kr>
   * @example
   * ```javascript
   * // <en>Send a plain text formatted message.</en><cn>发送纯文本格式邮件。</cn><jp>プレーンテキストのメールを送信</jp><kr></kr>
   * Forguncy.SendMail("example3@example.com", "example1@example.com", "<en>title</en><cn>订货警告邮件</cn><jp>発注警告メール</jp><kr></kr>", "<en>message</en><cn>最近订单数量明显增加，库存量即将不足请及时处理。</cn><jp>在庫数が少なくなっています。在庫数が残りわずかとなりました。発注処理をこなってください。</jp><kr></kr>");
   *
   * // <en>Send a message to multiple recipients.</en><cn>将邮件发送给多名收件人。</cn><jp>複数の宛先にメールを送信</jp><kr></kr>
   * Forguncy.SendMail("example3@example.com", "example1@example.com,example2@example.com", "<en>title</en><cn>订货警告邮件</cn><jp>発注警告メール</jp><kr></kr>", "<en>message</en><cn>最近订单数量明显增加，库存量即将不足请及时处理。</cn><jp>在庫数が少なくなっています。在庫数が残りわずかとなりました。発注処理をこなってください。</jp><kr></kr>");
   *
   * // <en>Send an e-mail message in 'HTML' format.</en><cn>发送`HTML`格式的电子邮件。</cn><jp>本文にHTMLタグを含むメールの送信</jp><kr></kr>
   * Forguncy.SendMail("example3@example.com", "example1@example.com", "<en>title</en><cn>订货警告邮件</cn><jp>発注警告メール</jp><kr></kr>", "<en>&lt;h1&gt;header&lt;/h1&gt;&lt;p&gt;paragraph&lt;/p&gt;</en><cn>&lt;h1&gt;库存不足预警&lt;/h1&gt;&lt;p&gt;最近订单数量明显增加，库存量即将不足请及时处理。&lt;/p&gt;</cn><jp>&lt;h1&gt;在庫数が少なくなっています&lt;/h1&gt;&lt;p&gt;在庫数が残りわずかとなりました。発注処理をこなってください。&lt;/p&gt;</jp><kr></kr>");
   *
   * // <en>Prompt the message to send successfully through the callback function.</en><cn>通过回调函数提示邮件是否发送成功。</cn><jp>メール送信の成功の可否をコールバック関数で受け取る</jp><kr></kr>
   * Forguncy.SendMail("example3@example.com", "example1@example.com", "title", "message",
   *     // <en>Pops up a dialog to show that the email was sent successfully if the send is successful.</en><cn>发送成功时弹出警告框，显示邮件发送成功</cn><jp>送信が成功すると、ダイアログボックスが表示され、メールが正常に送信されたことを示します。</jp><kr></kr>
   *     function(){
   *        alert("<en>success.</en><cn>邮件发送成功。</cn><jp>メールは正常に送信されました。</jp><kr></kr>");
   *     },
   *     // <en>Pops up a dialog with an error message when sending fails.</en><cn>发送失败时弹出警告框，显示错误信息</cn><jp>送信が失敗すると、ダイアログボックスにエラーメッセージが表示されます。</jp><kr></kr>
   *     function(errorMessage){
   *        alert(errorMessage);
   *     }
   * );
   * ```
   */
  function SendMail(
    from: string,
    to: string,
    title: string,
    content: string,
    successCallBack: Function,
    failCallBack: Function,
  ): any;

  /**
   * <en>Send mail.</en>
   * <cn>给指定电子邮箱发送指定标题和内容的电子邮件，发件人是当前登录网站的用户。使用该API发送电子邮件需要正确配置SMTP服务。</cn>
   * <jp>送信先とメールのタイトル、本文を指定してメールを送信します。送信元は、その時アプリケーションにログインしているユーザーのメールアドレスが自動的に使用されます。そのため、ログインしていない状態やメールアドレスを持たないユーザーの場合には、このメソッドを使用できません。また、メールサーバーの設定が必要です。</jp>
   * <kr></kr>
   * @param to <en>The recipient's e-mail address.</en>
   * <cn>指定收件人电子邮箱地址。如果是多名收件人，请使用逗号分隔。</cn>
   * <jp>送信先（宛先）のメールアドレスを指定。カンマ区切りで複数の送信先を指定することができます。</jp>
   * <kr></kr>
   * @param title <en>The mail's title.</en>
   * <cn>电子邮件标题。</cn>
   * <jp>メールのタイトルを指定。</jp>
   * <kr></kr>
   * @param content <en>The mail's content.</en>
   * <cn>指定电子邮件的正文内容。除了使用纯文本的电子邮件正文，还可以使用HTML标记的字符串。</cn>
   * <jp>メールの本文を指定。プレーンなテキストのほか、HTMLタグを含む文字列を指定することもできます。 </jp>
   * <kr></kr>
   * @param successCallBack <en>A function to be executed if the send mail succeeds.</en>
   * <cn>指定一个回调函数，此回调函数会在电子邮件成功发送后被调用。该参数为可选参数。</cn>
   * <jp>メールの送信が成功したときに実行するコールバック関数を指定します。引数にはリクエスト結果が渡されます。このパラメーターは省略可能です。</jp>
   * <kr></kr>
   * @param failCallBack <en>A callback function that is executed if send mail fail.</en>
   * <cn>指定一个回调函数，此回调函数会在电子邮件发送失败后被调用，并且通过errorMessage参数通知错误信息。该参数为可选参数。</cn>
   * <jp>メールの送信が失敗したときに実行するコールバック関数を指定します。引数にエラーメッセージが渡されます。このパラメーターは省略可能です。</jp>
   * <kr></kr>
   * @example
   * ```javascript
   * // <en>Send a plain text formatted message.</en><cn>发送纯文本格式邮件。</cn><jp>プレーンテキストのメールを送信</jp><kr></kr>
   * Forguncy.SendMail("example1@example.com", "<en>title</en><cn>订货警告邮件</cn><jp>発注警告メール</jp><kr></kr>", "<en>message</en><cn>最近订单数量明显增加，库存量即将不足请及时处理。</cn><jp>在庫数が少なくなっています。在庫数が残りわずかとなりました。発注処理をこなってください。</jp><kr></kr>");
   *
   * // <en>Send a message to multiple recipients.</en><cn>将邮件发送给多名收件人。</cn><jp>複数の宛先にメールを送信</jp><kr></kr>
   * Forguncy.SendMail("example1@example.com,example2@example.com", "<en>title</en><cn>订货警告邮件</cn><jp>発注警告メール</jp><kr></kr>", "<en>message</en><cn>最近订单数量明显增加，库存量即将不足请及时处理。</cn><jp>在庫数が少なくなっています。在庫数が残りわずかとなりました。発注処理をこなってください。</jp><kr></kr>");
   *
   * // <en>Send an e-mail message in 'HTML' format.</en><cn>发送`HTML`格式的电子邮件。</cn><jp>本文にHTMLタグを含むメールの送信</jp><kr></kr>
   * Forguncy.SendMail("example1@example.com", "<en>title</en><cn>订货警告邮件</cn><jp>発注警告メール</jp><kr></kr>", "<en><h1>header</h1><p>paragraph</p></en><cn><h1>库存不足预警</h1><p>最近订单数量明显增加，库存量即将不足请及时处理。</p></cn><jp><h1>在庫数が少なくなっています</h1><p>在庫数が残りわずかとなりました。発注処理をこなってください。</p></jp><kr></kr>");
   *
   * // <en>Prompt the message to send successfully through the callback function.</en><cn>通过回调函数提示邮件是否发送成功。</cn><jp>メール送信の成功の可否をコールバック関数で受け取る</jp><kr></kr>
   * Forguncy.SendMail("example1@example.com", "title", "message",
   *     // <en>Pops up a dialog with "success" when the mail send successfully.</en><cn>发送成功时弹出警告框，显示邮件发送成功</cn><jp>送信が成功すると、ダイアログボックスが表示され、メールが正常に送信されたことを示します。</jp><kr></kr>
   *     function(){
   *        alert("<en>success.</en><cn>邮件发送成功。</cn><jp>メールは正常に送信されました。</jp><kr></kr>");
   *     },
   *     // <en>Pops up a dialog with an error message when sending fails.</en><cn>发送失败时弹出警告框，显示错误信息</cn><jp>送信が失敗すると、ダイアログボックスにエラーメッセージが表示されます。</jp><kr></kr>
   *     function(errorMessage){
   *        alert(errorMessage);
   *     }
   * );
   * ```
   */
  function SendMail(to: string, title: string, content: string, successCallBack: Function, failCallBack: Function): any;

  /**
   * <en>Send mail.</en>
   * <cn>发送电子邮件。使用该API发送电子邮件需要正确配置SMTP服务。</cn>
   * <jp>FgcMailMessageオブジェクトを指定してメールを送信します。CCやBCC、添付ファイルなどより詳細な設定が必要なメールを送信したい場合に本メソッドを使用します。本メソッドを使用するためには、メールサーバーの設定が必要です。</jp>
   * <kr></kr>
   * @param message <en>The detail message settings.</en>
   * <cn>电子邮件内容。</cn>
   * <jp>FgcMailMessageオブジェクト。送信するメールの内容を設定します。</jp>
   * <kr></kr>
   * @param successCallBack <en>A function to be executed if the send mail succeeds.</en>
   * <cn>指定一个回调函数，此回调函数会在电子邮件成功发送后被调用。该参数为可选参数。</cn>
   * <jp>メールの送信が成功したときに実行するコールバック関数を指定します。引数にはリクエスト結果が渡されます。このパラメーターは省略可能です。</jp>
   * <kr></kr>
   * @param failCallBack <en>A callback function that is executed if send mail fail.</en>
   * <cn>指定一个回调函数，此回调函数会在电子邮件发送失败后被调用，并且通过errorMessage参数通知错误信息。该参数为可选参数。</cn>
   * <jp>メールの送信が失敗したときに実行するコールバック関数を指定します。引数にエラーメッセージが渡されます。このパラメーターは省略可能です。</jp>
   * <kr></kr>
   * @example
   * ```javascript
   * // <en>Send a plain text formatted message.</en><cn>发送纯文本格式邮件。</cn><jp>プレーンテキストのメールを送信</jp><kr></kr>
   * var message = {
   *     From: "example3@example.com",
   *     To:"example1@example.com",
   *     CC: "cc1@example.com, cc2@example.com",
   *     BCC: "bcc1@example.com, bcc2@example.com",
   *     Attachments: Forguncy.Page.getCell("attachment").getValue(),
   *     Title:"<en>title</en><cn>订货警告邮件</cn><jp>発注警告メール</jp><kr></kr>",
   *     Content:"<en>message</en><cn>最近订单数量明显增加，库存量即将不足请及时处理。</cn><jp>在庫数が少なくなっています。在庫数が残りわずかとなりました。発注処理をこなってください。</jp><kr></kr>",
   *     Priority: "High",
   *     SendAsPlainText: true
   * }
   * Forguncy.SendMail(message);
   *
   * // <en>Send a message to multiple recipients.</en><cn>将邮件发送给多名收件人。</cn><jp>複数の宛先にメールを送信</jp><kr></kr>
   * var message = {
   *     To:"example1@example.com,example2@example.com",
   *     Title:"<en>title</en><cn>订货警告邮件</cn><jp>発注警告メール</jp><kr></kr>",
   *     Content:"<en>message</en><cn>最近订单数量明显增加，库存量即将不足请及时处理。</cn><jp>在庫数が少なくなっています。在庫数が残りわずかとなりました。発注処理をこなってください。</jp><kr></kr>"
   * }
   * Forguncy.SendMail(message);
   *
   * // <en>Send an e-mail message in 'HTML' format.</en><cn>发送`HTML`格式的电子邮件。</cn><jp>本文にHTMLタグを含むメールの送信</jp><kr></kr>
   * var message = {
   *     To:"example1@example.com",
   *     Title:"<en>title</en><cn>订货警告邮件</cn><jp>発注警告メール</jp><kr></kr>",
   *     Content:"<en><h1>header</h1><p>paragraph</p></en><cn><h1>库存不足预警</h1><p>最近订单数量明显增加，库存量即将不足请及时处理。</p></cn><jp><h1>在庫数が少なくなっています</h1><p>在庫数が残りわずかとなりました。発注処理をこなってください。</p></jp><kr></kr>"
   * }
   * Forguncy.SendMail(message);
   *
   * // <en>Prompt the message to send successfully through the callback function.</en><cn>通过回调函数提示邮件是否发送成功。</cn><jp>メール送信の成功の可否をコールバック関数で受け取る</jp><kr></kr>
   * var message = {
   *     To:"example1@example.com",
   *     Title:"title",
   *     Content:, "message"
   * }
   * Forguncy.SendMail(message,
   *     // <en>Pops up a dialog with an error message when this sending fails.</en><cn>发送成功时弹出警告框，显示邮件发送成功</cn><jp>送信が成功すると、ダイアログボックスが表示され、メールが正常に送信されたことを示します。</jp><kr></kr>
   *     function(){
   *        alert("<en>success.</en><cn>邮件发送成功。</cn><jp>メールは正常に送信されました。</jp><kr></kr>");
   *     },
   *     // <en>Pops up a dialog with an error message when sending fails.</en><cn>发送失败时弹出警告框，显示错误信息</cn><jp>送信が失敗すると、ダイアログボックスにエラーメッセージが表示されます。</jp><kr></kr>
   *     function(errorMessage){
   *        alert(errorMessage);
   *     }
   * );
   * ```
   */
  function SendMail(message: FgcMailMessage, successCallBack: Function, failCallBack: Function): any;

  /**
   * <en>Convert a `OADate` to date.</en>
   * <cn>使用此方法从OADATE转换成DateTime。</cn>
   * <jp>日付のシリアル値（OADate）からDateTimeオブジェクトに変換します。</jp>
   * <kr></kr>
   * @param oadate <en>The number of OADate.</en>
   * <cn>`OADate`数值。</cn>
   * <jp>変換したい日付のシリアル値（OADate）</jp>
   * <kr></kr>
   * @example
   * ```javascript
   * // <en>In this example, shows how to use the ConvertOADateToDate method to convert OADate to DateTime.</en><cn>下面的示例代码中，通过ConvertOADateToDate方法，将OADate转换成DateTime。</cn><jp>本サンプルコードでは、ConvertOADateToDateメソッドをOADateの値をDateTimeオブジェクトへと変換する例を示します。</jp><kr></kr>
   * // <en>Get OADate.</en><cn>获取OADate</cn><jp>OADate値を取得する。</jp><kr></kr>
   * var oaDate = 40000;
   * // <en>Convert OADate to DateTime.</en><cn>将OADate转换成DateTime</cn><jp>OADateをDateTimeに変換する。</jp><kr></kr>
   * var date = Forguncy.ConvertOADateToDate(oaDate);
   * // <en>Pops up a dialog with coverted date.</en><cn>弹出警告框，显示转换后的日期</cn><jp>変換後の日付をダイアログボックスに表示する。</jp><kr></kr>
   * alert(date);
   * ```
   */
  function ConvertOADateToDate(oadate: number): Date;

  /**
   * <en>Convert a date to OADate.</en>
   * <cn>使用此方法将DateTime转换成OADate。</cn>
   * <jp>DateTimeオブジェクトを日付のシリアル値（OADate）に変換します。</jp>
   * <kr></kr>
   * @param date <en>The date.</en>
   * <cn>日期值。</cn>
   * <jp>変換したい日付のDateTimeオブジェクト</jp>
   * <kr></kr>
   * @example
   * ```javascript
   * // <en>Get current date.</en><cn>获取中国标准时间</cn><jp>現在の日時を取得する。</jp><kr></kr>
   * var date = new Date();
   * // <en>Convert DateTime to OADate.</en><cn>将DateTime转换成OADate</cn><jp>DateTimeをOADateに変換する。</jp><kr></kr>
   * var oaDate = Forguncy.ConvertDateToOADate(date);
   * // <en>Pops up a dialog with OADate.</en><cn>弹出警告框，显示OADate</cn><jp>変換後のOADateをダイアログボックスに表示する。</jp><kr></kr>
   * alert(oaDate);
   * ```
   */
  function ConvertDateToOADate(date: Date): number;

  /**
   * <en>Represents the email message.</en>
   * <cn>发送邮件信息。用于sendMail方法。</cn>
   * <jp>sendMailメソッドで使用する送信メールの詳細情報を表します。</jp>
   * <kr></kr>
   */
  interface FgcMailMessage {
    /**
     * <en>The sender's e-mail address.</en>
     * <cn>发件人邮箱。</cn>
     * <jp>送信元（差出人）のメールアドレスを指定します。このプロパティは省略可能です。値を空にした場合、現在のログインユーザーのメールアドレスを送信元（差出人）として使用します。</jp>
     * <kr></kr>
     */
    From?: string;
    /**
     * <en>The recipient's e-mail address.</en>
     * <cn>指定收件人电子邮箱地址。如果是多名收件人，请使用逗号分隔。</cn>
     * <jp>送信先（宛先）のメールアドレスを指定します。カンマ区切りで複数の送信先を指定することができます。</jp>
     * <kr></kr>
     */
    To: string;
    /**
     * <en>The cc's e-mail address.</en>
     * <cn>指定抄送收件人电子邮箱地址。如果是多名收件人，请使用逗号分隔。</cn>
     * <jp>CCのメールアドレスを指定します。このプロパティは省略可能です。カンマ区切りで複数の送信先を指定することができます。</jp>
     * <kr></kr>
     */
    CC?: string;
    /**
     * <en>The bcc's e-mail address.</en>
     * <cn>指定密送收件人电子邮箱地址。如果是多名收件人，请使用逗号分隔。</cn>
     * <jp>BCCのメールアドレスを指定します。このプロパティは省略可能です。カンマ区切りで複数の送信先を指定することができます。</jp>
     * <kr></kr>
     */
    BCC?: string;
    /**
     * <en>The attachments of email.</en>
     * <cn>指定邮件附件，值必须来自附件或图片上传单元格的值。多值用“|”分隔</cn>
     * <jp>メールの添付ファイルを指定します。このプロパティは省略可能です。この値は、テーブルの画像型、または添付ファイル型の値である必要があります。ファイルパスを直接指定することはできないことに注意してください。複数の添付ファイルがある場合は、「|」で区切ります。</jp>
     * <kr></kr>
     */
    Attachments?: string;
    /**
     * <en>The mail's title.</en>
     * <cn>电子邮件标题。</cn>
     * <jp>メールのタイトルを指定します。</jp>
     * <kr></kr>
     */
    Title: string;
    /**
     * <en>The mail's content.</en>
     * <cn>指定电子邮件的正文内容。除了使用纯文本的电子邮件正文，还可以使用HTML标记的字符串。</cn>
     * <jp>メールの本文を指定します。プレーンなテキストのほか、HTMLタグを含む文字列を指定することもできます。</jp>
     * <kr></kr>
     */
    Content: string;
    /**
     * <en>The mail's priority.</en>
     * <cn>电子邮件重要度。</cn>
     * <jp>メールの重要度を指定します。指定可能な値は「Low」、「Normal」、「High」の3つです。このプロパティは省略可能です。値を空にした場合、「Normal」を指定した状態と同じ動作になります。</jp>
     * <kr></kr>
     */
    Priority?: string;
    /**
     * <en>send mail as plain text.</en>
     * <cn>是否以纯文本格式发送邮件。</cn>
     * <jp>プレーンテストとして送信するかどうかを指定します。このプロパティは省略可能です。値を空にした場合、HTML形式のデータとテキスト形式のデータの両方を持つマルチパートメールとして送信されます。</jp>
     * <kr></kr>
     */
    SendAsPlainText?: boolean;
  }

  /**
   * <en>Represents the location of a cell.</en>
   * <cn>单元格的位置信息。用于getCellByLocation方法。</cn>
   * <jp>セルの位置情報。 {@link Forguncy.ForguncyPage.getCellByLocation getCellByLocationメソッド}に使用されます。</jp>
   * <kr></kr>
   */
  interface CellLocationInfo {
    /**
     * <en>The cell's row index in designer. Start with 0.</en>
     * <cn>设计器中的单元格行索引。从0开始。</cn>
     * <jp>Forguncy Builderにおけるセルの行番号。行番号は0から始まります。</jp>
     * <kr></kr>
     */
    Row: number;
    /**
     * <en>The cell's column index in designer. Start with 0.</en>
     * <cn>设计器中的单元格列索引。从0开始。</cn>
     * <jp>Forguncy Builderにおけるセルの列番号。列番号は0から始まります。</jp>
     * <kr></kr>
     */
    Column: number;
    /**
     * <en>The cell's page name in designer.</en>
     * <cn>设计器中单元格所在的页面名称。</cn>
     * <jp>Forguncy Builderにおいてセルが存在するページ名。</jp>
     * <kr></kr>
     */
    PageName: string;
    /**
     * <en>The page's unique ID. In browser, a normal page, master page and sub pages of content container cell type and tab control cell type both have its unique ID.</en>
     * <cn>页面唯一标识符。</cn>
     * <jp>ページの一意のID。アプリケーション実行時には、コンテナ―型セルとタブコントロール型セル内のサブページ、通常ページ、およびマスターページのすべてに一意なIDが存在します。</jp>
     * <kr></kr>
     * */
    PageID: string;
  }

  /**
   * <en>Represents user info.</en>
   * <cn>用户的相关信息。用于getUserInfo方法。</cn>
   * <jp>ユーザー関連情報。{@link Forguncy.ForguncyPage.getUserInfo getUserInfoメソッド}に使用されます。</jp>
   * <kr></kr>
   */
  interface UserInfo {
    /**
     * <en>The user's name.</en>
     * <cn>用户名。</cn>
     * <jp>ユーザー名。</jp>
     * <kr></kr>
     */
    UserName?: string;
    /**
     * <en>The user's full name.</en>
     * <cn>用户全名。</cn>
     * <jp>氏名。</jp>
     * <kr></kr>
     */
    FullName?: string;
    /**
     * <en>The user has picture or not.</en>
     * <cn>是否有头像。</cn>
     * <jp>プロファイル画像の設定の有無。</jp>
     * <kr></kr>
     */
    HasPicture?: boolean;
    /**
     * <en>The user's email.</en>
     * <cn>用户邮箱。</cn>
     * <jp>メールアドレス。</jp>
     * <kr></kr>
     */
    Email?: string;
    /**
     * <en>The user's role name. If the user has more than one role, these role names will join with `,`, like `Administrator,Manager`.</en>
     * <cn>用户角色名。如果用户有多个角色，则角色之间使用`,`分隔，如`Administrator,经理`。</cn>
     * <jp>ロール。ユーザーが複数のロールに属している場合、ロールは`,`（カンマ）で区切られます（例：「Administrator,マネージャー」）。</jp>
     * <kr></kr>
     */
    Role?: string;
    /**
     * <en>The user's superior in organization. Names are join with `|`, like `|Manager1|Manager2|`.</en>
     * <cn>用户的组织上级。如果用户有多个组织上级，则组织上级之间使用`|`分隔，如`Administrator|经理`。</cn>
     * <jp>ログインしているユーザーが所属する組織のリーダー、およびログインしているユーザーが所属する組織の上位に位置する組織に所属するすべてのユーザー。複数のユーザーが値として返される場合は、`山田太郎|鈴木花子`などのように`|`で区切られた文字列となります。</jp>
     * <kr></kr>
     */
    OrganizationSuperior?: string;
    /**
     * <en>The user's custom properties.</en>
     * <cn>用户的自定义属性。</cn>
     * <jp>ユーザーの拡張属性。</jp>
     * <kr></kr>
     */
    Properties?: UserExtendProperties[];
    /**
     * <en>The user's organization level info.</en>
     * <cn>用户的组织级别信息。</cn>
     * <jp>ユーザーの組織レベルの情報。</jp>
     * <kr></kr>
     */
    OrganizationLevelValues?: OrganizationLevelValueInfo[];
  }

  /**
   * <en>Represents the organization level info.</en>
   * <cn>用户的组织级别信息。用于getUserInfo方法。</cn>
   * <jp>ユーザーの組織レベルの情報。{@link Forguncy.ForguncyPage.getUserInfo getUserInfoメソッド}に使用されます。</jp>
   * <kr></kr>
   */
  interface OrganizationLevelValueInfo {
    /**
     * <en>The organization level name.</en>
     * <cn>组织级别名称。</cn>
     * <jp>組織レベル名。</jp>
     * <kr></kr>
     */
    OrganizationLevelName: string;
    /**
     * <en>The organization node name used the organization level.</en>
     * <cn>组织级别中组织节点的名称。</cn>
     * <jp>組織レベルの組織ノードの名前。</jp>
     * <kr></kr>
     */
    Value: string;
  }

  /**
   * <en>Represents the custom user property.</en>
   * <cn>用户的自定义属性。用于getUserInfo方法。</cn>
   * <jp>ユーザーの拡張属性。{@link Forguncy.ForguncyPage.getUserInfo getUserInfoメソッド}に使用されます。</jp>
   * <kr></kr>
   */
  interface UserExtendProperties {
    /**
     * <en>The custom property Name.</en>
     * <cn>自定义属性名。</cn>
     * <jp>拡張属性名。</jp>
     * <kr></kr>
     */
    PropertyName: string;
    /**
     * <en>The value of this property.</en>
     * <cn>属性的值。</cn>
     * <jp>拡張属性の値。</jp>
     * <kr></kr>
     */
    Value: string;
  }

  /**
   * <en>Represents a range of cells.</en>
   * <cn>单元格范围的位置信息。用于getDesignerRangeInfo方法。</cn>
   * <jp>セル範囲の位置情報。{@link Forguncy.ListView.getDesignerRangeInfo getDesignerRangeInfoメソッド}に使用されます。</jp>
   * <kr></kr>
   */
  interface CellRange {
    /**
     * <en>Start row index of this cell range.</en>
     * <cn>在这个单元格范围中的起始行索引。</cn>
     * <jp>セル範囲の開始行インデックス。</jp>
     * <kr></kr>
     */
    Row: number;
    /**
     * <en>Start column index of this cell range.</en>
     * <cn>在这个单元格范围中的起始列索引。</cn>
     * <jp>セル範囲の開始列インデックス。</jp>
     * <kr></kr>
     */
    Column: number;
    /**
     * <en>Row count of this cell range.</en>
     * <cn>在这个单元格范围中的行数。</cn>
     * <jp>セル範囲内の行数。</jp>
     * <kr></kr>
     */
    RowCount: number;
    /**
     * <en>Column count of this cell range.</en>
     * <cn>在这个单元格范围中的列数。</cn>
     * <jp>セル範囲内の列の数。</jp>
     * <kr></kr>
     */
    ColumnCount: number;
  }

  /**
   * <en>Log in with specefied username and password.</en>
   * <cn>登录到指定用户名和密码关联的账户。</cn>
   * <jp>指定したユーザー名とそのパスワードでログインします。本メソッドは、認証モードが「フォーム認証」の場合にのみ使用可能です。</jp>
   * <kr></kr>
   * @param username <en>The user's name.</en>
   * <cn>用户名</cn>
   * <jp>ユーザー名</jp>
   * <kr></kr>
   * @param password <en>The user's password. </en>
   * <cn>密码</cn>
   * <jp>パスワード</jp>
   * <kr></kr>
   * @param rememberMe <en>Detemines whether the browser remember the user account. The default value is false.</en>
   * <cn>是否让浏览器记住当前用户。默认值为 false。</cn>
   * <jp>［ログインしたままにする］チェックオプションを有効にするかどうかを指定します。既定値は「false」です。</jp>
   * <kr></kr>
   * @param successCallback <en>A callback will be executed if the request succeeded. If the value is empty, the browser will refresh immediately by default.</en>
   * <cn>成功回调函数。如果值为空，默认会立即刷新浏览器。</cn>
   * <jp>ログイン要求が成功した場合に実行されるコールバック関数。コールバック関数を指定しない場合、Webブラウザー上のページはすぐに更新されます。</jp>
   * <kr></kr>
   * @param errorCallback <en>A callback that be executed if the request failed.</en>
   * <cn>失败回调函数。</cn>
   * <jp>ログイン要求が失敗した場合に実行されるコールバック関数。</jp>
   * <kr></kr>
   */
  function logIn(
    username: string,
    password: string,
    rememberMe?: boolean,
    successCallback?: Function,
    errorCallback?: Function,
  );

  /**
   * <en>Log out current user's account. </en>
   * <cn>登出当前用户。</cn>
   * <jp>現在のユーザーをログアウトします。本メソッドは、認証モードが「フォーム認証」の場合、または「SAML 2.0用認証プロバイダー」を使用している場合にのみ使用可能です。</jp>
   * <kr></kr>
   * @param navigateToHomePage <en>Detemines whether the browser will navigate to home page if log out successfully. If the value is empty or false, the browser will refresh immediately.</en>
   * <cn>登出后，是否回到首页。值为空或 false 时，会立即刷新浏览器。</cn>
   * <jp>ログアウト後、スタートページに戻るかどうかを指定します。値を指定しない、もしくは「false」を指定した場合、Webブラウザー上のページはすぐに更新されます。</jp>
   * <kr></kr>
   */
  function logOut(navigateToHomePage?: boolean);

  /**
   * <en>Add a user.</en>
   * <cn>使用此方法添加用户，包括普通认证模式下添加用户和域认证模式下添加用户。</cn>
   * <jp>このメソッドを使用して、フォーム認証、およびWindows認証におけるユーザーを追加します。</jp>
   * <kr></kr>
   * @param userName <en>The user's name.</en>
   * <cn>用户名。</cn>
   * <jp>追加したいユーザーのユーザー名。</jp>
   * <kr></kr>
   * @param password <en>The user's password. If authentication mode is Windows, ignore this param.</en>
   * <cn>密码。</cn>
   * <jp>追加したいユーザーのパスワード。Windows認証のユーザーを追加する場合、このパラメーターは指定しません。</jp>
   * <kr></kr>
   * @param displayName <en>The user's display name. If authentication mode is Windows, ignore this param.</en>
   * <cn>全名。</cn>
   * <jp>追加したいユーザーの氏名。Windows認証のユーザーを追加する場合、このパラメーターは指定しません。</jp>
   * <kr></kr>
   * @param email <en>The user's email. If authentication mode is Windows, ignore this param.</en>
   * <cn>邮箱。</cn>
   * <jp>追加したいユーザーのメールアドレス。Windows認証のユーザーを追加する場合、このパラメーターは指定しません。</jp>
   * <kr></kr>
   * @param successCallback <en>A callback function that is executed if the request succeeds.</en>
   * <cn>成功回调函数。</cn>
   * <jp>ユーザーの追加が成功したときに実行するコールバック関数を指定します。</jp>
   * <kr></kr>
   * @param errorCallback <en>A callback function that is executed if the request fail.</en>
   * <cn>失败回调函数，参数中包含错误信息。</cn>
   * <jp>ユーザーの追加が失敗したときに実行するコールバック関数を指定します。 引数にエラーメッセージが渡されます。</jp>
   * <kr></kr>
   * @example
   * ```javascript
   * // <en>The following example shows how to add a user through the addUser method.</en><cn>下面的示例代码中，通过addUser方法添加用户。</cn><jp>本サンプルコードでは、addUserメソッドを使用してユーザーを追加します。</jp><kr></kr>
   * // <en>Add users in normal authentication mode.</en><cn>普通认证模式下添加用户：</cn><jp>フォーム認証のユーザーを追加する。</jp><kr></kr>
   * Forguncy.addUser("<en>robert</en><cn>小李</cn><jp>taro</jp><kr></kr>", "123456", "<en>Hu Yu</en><cn>李四</cn><jp>山田太郎</jp><kr></kr>", "<en>hy@xxx.com</en><cn>lisi@grapecity.com</cn><jp>taro@example.com</jp><kr></kr>",
   *     function () {
   *         alert("<en>success</en><cn>添加成功</cn><jp>ユーザーが追加されました。</jp><kr></kr>")
   *     },
   *     function (error) {
   *         alert(error)
   *     });
   * // <en>Add users in domain authentication mode.</en><cn>域认证模式下添加用户：</cn><jp>Windows認証のユーザーを追加する。</jp><kr></kr>
   * Forguncy.addUser("<en>robert</en><cn>小李</cn><jp>taro</jp><kr></kr>",
   *     function () {
   *         alert("<en>success</en><cn>添加成功</cn><jp>ユーザーが追加されました。</jp><kr></kr>")
   *     },
   *     function (error) {
   *         alert(error)
   *     });
   * ```
   */
  function addUser(
    userName: string,
    password: string | Function,
    displayName: string | Function,
    email: string | Function,
    successCallback: Function,
    errorCallback: Function,
  ): void;

  /**
   * <en>Delete a user.</en>
   * <cn>使用此方法将指定的用户删除。</cn>
   * <jp>ユーザー名を指定して、ユーザーを削除します。フォーム認証のユーザーとWindows認証のユーザーのどちらのユーザーも削除できます。</jp>
   * <kr></kr>
   * @param userName <en>The user's name.</en>
   * <cn>用户名。</cn>
   * <jp>削除したいユーザーのユーザー名。</jp>
   * <kr></kr>
   * @param successCallback <en>A callback function that is executed if the request succeeds.</en>
   * <cn>成功回调函数。</cn>
   * <jp>ユーザーの削除が成功したときに実行するコールバック関数を指定します。</jp>
   * <kr></kr>
   * @param errorCallback <en>A callback function that is executed if the request fail.</en>
   * <cn>失败回调函数，参数中包含错误信息。</cn>
   * <jp>ユーザーの削除が失敗したときに実行するコールバック関数を指定します。 引数にエラーメッセージが渡されます。</jp>
   * <kr></kr>
   * @example
   * ```javascript
   * // <en>In this example, shows how to use the deleteUser method to delete a user.</en><cn>下面的示例代码中，通过deleteUser方法，将指定的用户删除。</cn><jp>本サンプルコードでは、deleteUserメソッドを使用して指定したユーザーを削除します。</jp><kr></kr>
   * Forguncy.deleteUser("<en>robert</en><cn>张三</cn><jp>user1</jp><kr></kr>",
   *     function () {
   *         alert("<en>success</en><cn>删除成功。</cn><jp>ユーザーが削除されました。</jp><kr></kr>");
   *     },
   *     function (errorMessage) {
   *         alert(errorMessage);
   *     }
   * );
   * ```
   */
  function deleteUser(userName: string, successCallback: Function, errorCallback: Function): void;

  /**
   * <en>Add a user to a role.</en>
   * <cn>使用此方法将指定的用户添加到指定的组，即给用户指定角色。</cn>
   * <jp>ロールを指定してユーザーを追加します。ユーザーはすでに存在しているユーザーである必要があります。フォーム認証のユーザーとWindows認証のユーザーのどちらのユーザーでも指定可能です。</jp>
   * <kr></kr>
   * @param userName <en>The user's name.</en>
   * <cn>用户名。</cn>
   * <jp>ロールへ追加したいユーザーのユーザー名。</jp>
   * <kr></kr>
   * @param roleName <en>The role's name.</en>
   * <cn>角色名。</cn>
   * <jp>追加したいロールの名称。</jp>
   * <kr></kr>
   * @param successCallback <en>A callback function that is executed if the request succeeds.</en>
   * <cn>成功回调函数。</cn>
   * <jp>ロールへのユーザーの追加が成功したときに実行するコールバック関数を指定します。</jp>
   * <kr></kr>
   * @param errorCallback <en>A callback function that is executed if the request fail.</en>
   * <cn>失败回调函数，参数中包含错误信息。</cn>
   * <jp>ロールへのユーザーの追加が失敗したときに実行するコールバック関数を指定します。 引数にエラーメッセージが渡されます。</jp>
   * <kr></kr>
   * @example
   * ```javascript
   * // <en>In this example, shows how to use the addUserToRole method to add a user to a specified group.</en><cn>使用此方法将指定的用户添加到指定的组，即给用户指定角色。</cn><jp>本サンプルコードでは、addUserToRoleメソッドを使用して指定されたユーザーを指定されたロールに追加します。</jp><kr></kr>
   * Forguncy.addUserToRole("<en>robert</en><cn>张三</cn><jp>user1</jp><kr></kr>", "<en>Administrator</en><cn>经理</cn><jp>マネージャー</jp><kr></kr>",
   *     function () {
   *         alert("<en>success</en><cn>添加成功。</cn><jp>ロールにユーザーが追加されました。</jp><kr></kr>");
   *     },
   *     function (errorMessage) {
   *         alert(errorMessage);
   *     }
   * );
   * ```
   */
  function addUserToRole(userName: string, roleName: string, successCallback: Function, errorCallback: Function): void;

  /**
   * <en>Delete a user from a role.</en>
   * <cn>使用此方法将指定的用户从指定的组中删除。</cn>
   * <jp>ロールを指定してユーザーを削除します。ユーザーはすでに指定したロールのメンバーである必要があります。フォーム認証のユーザーとWindows認証のユーザーのどちらのユーザーでも指定可能です。</jp>
   * <kr></kr>
   * @param userName <en>The user's name.</en>
   * <cn>用户名。</cn>
   * <jp>ロールから削除したいユーザーのユーザー名。</jp>
   * <kr></kr>
   * @param roleName <en>The role's name.</en>
   * <cn>角色名。</cn>
   * <jp>ユーザーをロールから削除したい場合のそのロールの名称。</jp>
   * <kr></kr>
   * @param successCallback <en>A callback function that is executed if the request succeeds.</en>
   * <cn>成功回调函数。</cn>
   * <jp>ロールからユーザーの削除が成功したときに実行するコールバック関数を指定します。</jp>
   * <kr></kr>
   * @param errorCallback <en>A callback function that is executed if the request fail.</en>
   * <cn>失败回调函数，参数中包含错误信息。</cn>
   * <jp>ロールからユーザーの削除が失敗したときに実行するコールバック関数を指定します。 引数にエラーメッセージが渡されます。</jp>
   * <kr></kr>
   * @example
   * ```javascript
   * // <en>In this example, shows how to use the deleteUserFromRole method to remove a user from a specified group.</en><cn>下面的示例代码中，通过deleteUserFromRole方法，将指定的用户从指定的组中删除。</cn><jp>本サンプルコードでは、deleteUserFromRoleメソッドを使用して指定したユーザーを指定したロールから削除します。</jp><kr></kr>
   * Forguncy.deleteUserFromRole("<en>robert</en><cn>张三</cn><jp>user1</jp><kr></kr>", "<en>Administrator</en><cn>经理</cn><jp>マネージャー</jp><kr></kr>",
   *     function () {
   *         alert("<en>success</en><cn>删除成功。</cn><jp>ユーザーがロールから削除されました。</jp><kr></kr>");
   *     },
   *     function (errorMessage) {
   *         alert(errorMessage);
   *     }
   * );
   * ```
   */
  function deleteUserFromRole(
    userName: string,
    roleName: string,
    successCallback: Function,
    errorCallback: Function,
  ): void;

  /**
   * <en>Represents the parameters to request the data of a table or view.</en>
   * <cn>获取数据表或视图数据时的参数。用于 getTableDataByCondition方法 。</cn>
   * <jp>テーブル、またはビューのデータを取得する際のパラメーター。{@link Forguncy.getTableDataByCondition getTableDataByConditionメソッド}に使用されます。</jp>
   * <kr></kr>
   */
  interface GetTableDataByConditionParams {
    /**
     * <en>The table or view's name.</en>
     * <cn>表或者视图的名称。</cn>
     * <jp>テーブル、またはビューの名前。</jp>
     * <kr></kr>
     */
    TableName: string;
    /**
     * <en>The column names.</en>
     * <cn>获取的列的名称集合。</cn>
     * <jp>列名の配列。</jp>
     * <kr></kr>
     */
    Columns: string[];
    /**
     * <en>Query info.</en>
     * <cn>查询信息。</cn>
     * <jp>クエリー条件。</jp>
     * <kr></kr>
     */
    QueryCondition: object;
    /**
     * <en>The policy when query.</en>
     * <cn>查询时的策略。</cn>
     * <jp>データ取得時のポリシー。</jp>
     * <kr></kr>
     */
    QueryPolicy: TableDataQueryPolicy;
    /**
     * <en>Sort info.</en>
     * <cn>排序信息。</cn>
     * <jp>並べ替えの情報。</jp>
     * <kr></kr>
     */
    SortCondition: object;
  }

  /**
   * <en>Represents the policy how a table or view resolves query data.</en>
   * <cn>获取数据表或视图数据时的策略。用于getTableDataByCondition方法。</cn>
   * <jp>テーブル、またはビューのデータを取得する際のポリシー。{@link Forguncy.getTableDataByCondition getTableDataByConditionメソッド}に使用されます。</jp>
   * <kr></kr>
   */
  interface TableDataQueryPolicy {
    /**
     * <en>Specified whether to distinct the result.</en>
     * <cn>是否有不同的结果。</cn>
     * <jp>結果を区別するかどうかの指定。</jp>
     * <kr></kr>
     */
    Distinct: boolean;
    /**
     * <en>The query policy when the query value is null.</en>
     * <cn>查询值为`null`时的策略。</cn>
     * <jp>クエリー値がnullの場合のポリシー。</jp>
     * <kr></kr>
     */
    QueryNullPolicy: QueryNullPolicy;
    /**
     * <en>Specified whether ignore the cache, in default the site will cache the result based on the post param.</en>
     * <cn>是否忽略缓存，默认情况下，站点将根据post参数缓存结果。</cn>
     * <jp>キャッシュを無視するかどうかの指定。既定では、アプリケーションはpostパラメーターに基づいて結果をキャッシュします。</jp>
     * <kr></kr>
     */
    IgnoreCache: boolean;
  }

  /**
   * <en>Represents the policy how a table or view resolves the `null` query.</en>
   * <cn>表示数据表或视图数据时遇到`null`值的策略枚举。</cn>
   * <jp>テーブル、またはビューで'null'値をどのように扱うかを決める列挙体を表します。</jp>
   * <kr></kr>
   */
  enum QueryNullPolicy {
    /**
     * <en>Returns all Items when value Is `null`.</en>
     * <cn>查询`null`时返回所有值。</cn>
     * <jp>値が`null`の場合、すべてのデータが返されます。</jp>
     * <kr></kr>
     */
    QueryAllItemsWhenValueIsNull = 0,
    /**
     * <en>Returns no item when value Is `null`.</en>
     * <cn>查询`null`时返回空的值。</cn>
     * <jp>値が`null`の場合、データは返されません。</jp>
     * <kr></kr>
     */
    QueryZeroItemsWhenValueIsNull = 1,
  }

  /**
   * <en>Represents the modified rows data of a listview.</en>
   * <cn>公式计算的上下文信息。用于getTableDataByCondition方法。</cn>
   * <jp>数式によって計算されたコンテキスト情報。{@link Forguncy.getTableDataByCondition getTableDataByConditionメソッド}に使用されます。</jp>
   * <kr></kr>
   */
  interface FormulaCalcContext {
    /**
     * <en>Is in master page.</en>
     * <cn>是否在母版页中。</cn>
     * <jp>マスターページ内にあるかどうかを表します。</jp>
     * <kr></kr>
     */
    IsInMasterPage: boolean;
    /**
     * <en>The page's unique ID. In browser, a normal page, master page and sub pages of content container cell type and tab control cell type both have its unique ID.</en>
     * <cn>所位于页面的唯一编号。运行时，页面可能因为页面容器单元格类型而包含多个子页面，且子页面可能相同，所以不能用页面名称唯一标识页面。</cn>
     * <jp>配置されているページの一意となるID。実行時に、コンテナー型セルやタブコントロール型セルによりページに複数のサブページが含まれることがあります。その場合、ページ名ではページを一意に識別できない場合があります。</jp>
     * <kr></kr>
     */
    PageID: string;
  }
  /**
   * <en>Represents the modified rows data of a listview.</en>
   * <cn>表示表格中发生变动的行数据。用于modifyTablesData方法。</cn>
   * <jp>リストビュー内で更新する行データを表します。{@link Forguncy.modifyTablesData modifyTablesDataメソッド}に使用されます。</jp>
   * <kr></kr>
   */
  interface ModifyData {
    /**
     * <en>Added rows info.</en>
     * <cn>添加的行。</cn>
     * <jp>追加したいフィールド名と値を指定します。プロパティ名にフィールド名、値にそのフィールドの値を持つオブジェクトを指定します。</jp>
     * <kr></kr>
     */
    addRows: {
      [columnName: string]: Object;
    }[];
    /**
     * <en>Edited rows info.</en>
     * <cn>编辑的行。</cn>
     * <jp>更新対象のレコードにおいて一意となるフィールド名と値、および更新対象のフィールド名と値を指定します。プロパティ名にフィールド名、値にそのフィールドの値を持つオブジェクトを指定します。指定するフィールドが必ずしもデータベース上で一意制約を持つフィールドである必要はありません。</jp>
     * <kr></kr>
     */
    editRows: {
      primaryKey: { [primaryColumnName: string]: Object };
      values: { [columnName: string]: Object };
    }[];
    /**
     * <en>Deleted rows info.</en>
     * <cn>删除的行。</cn>
     * <jp>削除対象のレコードにおいて一意となるフィールド名と値を指定します。プロパティ名にフィールド名、値にそのフィールドの値を持つオブジェクトを指定します。指定するフィールドが必ずしもデータベース上で一意制約を持つフィールドである必要はありません。</jp>
     * <kr></kr>
     */
    deleteRows: {
      primaryKey: { [primaryColumnName: string]: Object };
    }[];
  }

  /**
   * <en>Get one row's data of a specified table or view.</en>
   * <cn>通过数据库的主键获取一条记录。</cn>
   * <jp>指定したテーブルに対してレコードが一意になるフィールド名と値を指定し、1件のレコード内容を取得します。</jp>
   * <kr></kr>
   * @param tableName <en>The table or view's name.</en>
   * <cn>数据表的名字。</cn>
   * <jp>取得したいデータが格納されているテーブルの名前。</jp>
   * <kr></kr>
   * @param primaryKey <en>The specified row's query info.</en>
   * <cn>指定字段名称和值，指定的值必须只能找到一行。</cn>
   * <jp>取得対象のレコードにおいて一意となるフィールド名と値を指定。プロパティ名にフィールド名、値にそのフィールドの値を持つオブジェクトを指定します。指定するフィールドが必ずしもデータベース上で一意制約を持つフィールドである必要はありません。</jp>
   * <kr></kr>
   * @param callback <en>A callback function that is executed if the request succeeds.</en>
   * <cn>成功回调函数。</cn>
   * <jp>レコードの取得が成功したときに実行するコールバック関数を指定します。引数にはリクエスト結果が渡されます。</jp>
   * <kr></kr>
   * @param errorCallback <en>A callback function that is executed if the request fail.</en>
   * <cn>失败回调函数，回调函数中包含了错误信息。</cn>
   * <jp>レコードの取得が失敗したときに実行するコールバック関数を指定します。 引数にエラーメッセージが渡されます。なお、テーブル名の指定に誤りがあるなどのデータベースアクセスにおける構文エラーについては、本コールバック関数を使用してエラーをハンドルすることはできません。そのような場合のエラー内容については、HTTP応答ヘッダーの内容を確認する必要があります。</jp>
   * <kr></kr>
   * @example
   * ```javascript
   * // <en>In this example, shows how to use the getTableData method to get data from table.</en><cn>下面的示例代码中，通过getTableData方法，获取数据表中的数据。</cn><jp>本サンプルコードでは、getTableDataメソッドを使用してテーブルのデータを取得する例を示します。</jp><kr></kr>
   * Forguncy.getTableData("<en>Table1</en><cn>员工表</cn><jp>テーブル1</jp><kr></kr>", {"ID":2},
   *     function(data){
   *         Forguncy.Page.getCell("textBoxCell1").setValue(data.<en>Column1</en><cn>字段1</cn><jp>フィールド1</jp><kr></kr>);
   *     },
   *     function(errorMessage){
   *         alert(errorMessage);
   *     }
   * );
   * // <en>If the primary key is multiple, the example code is following:</en><cn>如果数据表需要用多列来标识一唯一行，示例代码如下：</cn><jp>テーブルが複数の列を使用して一意の行を識別する必要がある場合、サンプルコードは次のとおりです。</jp><kr></kr>
   * Forguncy.getTableData("<en>Table1</en><cn>员工表</cn><jp>テーブル1</jp><kr></kr>", { "ID1": 2, "<en>Name</en><cn>姓名</cn><jp>名前</jp><kr></kr>" : "<en>Robert</en><cn>韩梅梅</cn><jp>山田太郎</jp><kr></kr>"  },
   *     function(data){
   *         Forguncy.Page.getCell("textBoxCell1").setValue(data.<en>Column1</en><cn>字段1</cn><jp>フィールド1</jp><kr></kr>);
   *     },
   *     function(errorMessage){
   *         alert(errorMessage);
   *     }
   * );
   * ```
   */
  function getTableData(
    tableName: string,
    primaryKey: { [primaryColumnName: string]: Object },
    callback: Function,
    errorCallback: Function,
  ): void;

  /**
   * <en>Get table or view's data by `OData`.</en>
   * <cn>通过`OData`查询字符串获取数据。</cn>
   * <jp>指定したODataのリソースパスを使用して、レコード内容を取得します。</jp>
   * <kr></kr>
   * @param odataParam <en>The odata string, like "Table1?$select=Field1&$filter=ID eq 1".</en>
   * <cn>`OData`查询字符串。</cn>
   * <jp>ODataのリソースパスを指定します。ルートURIは含めず、リソースパス以降を指定してください。</jp>
   * <kr></kr>
   * @param callback <en>A callback function that is executed if the request succeeds.</en>
   * <cn>成功回调函数。</cn>
   * <jp>レコードの取得が成功したときに実行するコールバック関数を指定します。引数にはリクエスト結果が渡されます。</jp>
   * <kr></kr>
   * @param errorCallback <en>A callback function that is executed if the request fail.</en>
   * <cn>失败回调函数，回调函数中包含了错误信息。</cn>
   * <jp>レコードの取得が失敗したときに実行するコールバック関数を指定します。 引数にエラーメッセージが渡されます。なお、テーブル名の指定に誤りがあるなどのデータベースアクセスにおける構文エラーについては、本コールバック関数を使用してエラーをハンドルすることはできません。そのような場合のエラー内容については、HTTP応答ヘッダーの内容を確認する必要があります。</jp>
   * <kr></kr>
   * @param async <en>Specified whether the request is async. The default value is true.</en>
   * <cn>指定请求是否异步。默认值为 true。</cn>
   * <jp>リクエストを非同期にするかどうか指定します。デフォルトはtrue（非同期）です。</jp>
   * <kr></kr>
   * @example
   * ```javascript
   * // <en>Use the getTableDataByOData method to get the number of records in the "Cateories" table and set it to the cell named "countLabel".</en><cn>使用getTableDataByOData方法获取“Cateories”表中的记录数，并将其设置到名为“countLabel”的单元格中。</cn><jp>本サンプルコードでは、getTableDataByODataメソッドを使用して「Caterories」テーブルのレコード数を取得し、「countLabel」という名前が付いたセルに値として設定する例を示します。</jp><kr></kr>
   * Forguncy.getTableDataByOData("Categories/$count",
   *     // <en>Callback processing in case of success.</en><cn>成功回调处理</cn><jp>成功した場合のコールバック処理</jp><kr></kr>
   *     function (data) {//<en>Data type. Type:object</en><cn>数据类型 Type:object</cn><jp>データ型 Type:object</jp><kr></kr>
   *         Forguncy.Page.getCell("countLabel").setValue(data);
   *     },
   *     // <en>Callback processing in case of error.</en><cn>出错时的回调处理</cn><jp>エラー時のコールバック処理</jp><kr></kr>
   *     function (e) {
   *         alert(e);
   *     });
   * // <en>Use the getTableDataByOData method to get all the records in the "Cateories" table, format them and set them to the cell named "resultLabel".</en><cn>使用getTableDataByOData方法用于获取“Cateories”表中的所有记录，将它们格式化并设置到名为“resultLabel”的单元格中。</cn><jp>本サンプルコードでは、getTableDataByODataメソッドを使用して「Caterories」テーブルの全レコードを取得し、表示に適切な内容に整形したうえで「resultLabel」という名前が付いたセルに値として設定する例を示します。</jp><kr></kr>
   * Forguncy.getTableDataByOData("Categories",
   *     // <en>Callback processing in case of success.</en><cn>成功回调处理</cn><jp>成功した場合のコールバック処理</jp><kr></kr>
   *     function (data) {//<en>Data type. Type:List<Dictionary<string, object>></en><cn>数据类型 Type:List<Dictionary<string, object>></cn><jp>データ型 Type:List&lt;Dictionary&lt;string, object&gt;&gt;</jp><kr></kr>
   *         var str = "";
   *         for (var index = 0; index < data.length; index++) {
   *         var rowData = data[index];
   *         str += "ID：" + rowData["Category ID"] + "\r\n" +
   *             "<en>Category name.</en><cn>分类名称：</cn><jp>カテゴリ名：</jp><kr></kr>" + rowData["Category Name"] + "\r\n" +
   *             "<en>Description.</en><cn>说明：</cn><jp>説明：</jp><kr></kr>" + rowData["Description"] + "\r\n\r\n"
   *         }
   *         Forguncy.Page.getCell("resultLabel").setValue(str);
   *     },
   *     // <en>Callback processing in case of error.</en><cn>出错时的回调处理</cn><jp>エラー時のコールバック処理</jp><kr></kr>
   *     function (e) {
   *         alert(e);
   *     });
   * // <en>In this example, shows how to use the method getTableDataByOData to get data.</en><cn>下面的示例代码中，通过getTableDataByOData方法，获取数据表中的数据。</cn><jp>本サンプルコードでは、getTableDataByODataメソッドを使用して「テーブル1」テーブルの指定したレコードを取得する例を示します。</jp><kr></kr>
   * Forguncy.getTableDataByOData("<en>Table1</en><cn>员工表</cn><jp>テーブル1</jp><kr></kr>?$select=*&$filter=ID gt 5",
   *     // <en>The function will be executed when getting OData successfully.</en><cn>获取成功的情况</cn><jp>取得に成功した場合の処理</jp><kr></kr>
   *     function(data){
   *         for(var i = 0; i < data.length; i++)
   *         {
   *             var id = data[i]["ID"];
   *             var name = data[i]["<en>Name</en><cn>姓名</cn><jp>名前</jp><kr></kr>"];
   *             console.log("ID=" + id + "; Name=" + name);
   *         }
   *     },
   *     // <en>The function will be executed when getting OData failed.</en><cn>获取失败的情况</cn><jp>取得に失敗した場合の処理</jp><kr></kr>
   *     function(errorMessage){
   *         alert(errorMessage);
   *     }
   * );
   * ```
   */
  function getTableDataByOData(odataParam: string, callback: Function, errorCallback: Function, async?: boolean): void;

  /**
   * <en>Get table or view's data by param.</en>
   * <cn>通过条件获取数据表或视图的数据。</cn>
   * <jp>テーブルまたはビューのデータを条件を基に取得します。本メソッドはプラグイン開発のために用意されており、通常のカスタムJavaScriptコード内で使用することはできません。</jp>
   * <kr></kr>
   * @param condition <en>The param about how to get data.</en>
   * <cn>关于如何获取数据的参数。</cn>
   * <jp>データの取得方法に関するパラメータ。</jp>
   * <kr></kr>
   * @param formulaCalcContext <en>A formula calc context, used when @param's QueryCondition contain formula.</en>
   * <cn>公式计算的上下文信息，当获取参数的查询条件包含公式时，使用公式计算的结果。</cn>
   * <jp>数式によって計算されたコンテキスト情報。取得されたパラメーターのクエリー条件に数式が含まれている場合、数式によって計算された結果が使用されます。</jp>
   * <kr></kr>
   * @param callBack <en>A callback function that is executed if the request succeeds.</en>
   * <cn>成功回调函数。</cn>
   * <jp>レコードの取得が成功したときに実行するコールバック関数を指定します。引数にはリクエスト結果が渡されます。</jp>
   * <kr></kr>
   * @param async <en>Specified whether the request is async. The default value is true.</en>
   * <cn>请求是否异步。默认值为 true。</cn>
   * <jp>リクエストを非同期にするかどうか設定します。デフォルトはtrue（非同期）です。</jp>
   * <kr></kr>
   * @example
   * ```javascript
   * // <en>In this example, shows how to use the method getTableDataByCondition to get data.</en><cn>下面的示例代码中，通过getTableDataByCondition方法，获取数据表中的数据。</cn><jp>本サンプルコードでは、getTableDataByConditionメソッドを使用してテーブルのデータを取得する例を示します。</jp><kr></kr>
   * // <en>Parameters for obtaining data.</en><cn>获取数据的参数</cn><jp>データのパラメーターを取得する。</jp><kr></kr>
   * var param = {
   *     TableName: "<en>myTable1</en><cn>员工表</cn><jp>テーブル1</jp><kr></kr>",   // <en>Table name.</en><cn>数据表名</cn><jp>テーブル名</jp><kr></kr>
   *     Columns: ["ID", "<en>Name</en><cn>姓名</cn><jp>名前</jp><kr></kr>"],    // <en>The name array of columns which you want to get.</en><cn>要获取的字段名称</cn><jp>取得したいフィールド名の配列</jp><kr></kr>
   *     QueryCondition: ISqlCondition,    // <en>The query condition designed in designer</en><cn>用户在设计器中设置的查询条件</cn><jp>Forguncy Builderで設定したクエリ条件</jp><kr></kr>
   *     QueryPolicy: {
   *         Distinct: true,
   *         QueryNullPolicy: Forguncy.QueryNullPolicy.QueryAllItemsWhenValueIsNull,
   *         IgnoreCache: false
   *     },
   *     SortCondition: ISqlCondition    // <en>The sort condition designed in designer</en><cn>用户在设计器中设置的排序条件</cn><jp>Forguncy Builderで設定された並べ替え条件</jp><kr></kr>
   * };
   *
   * var formulaCalcContext = {
   *     IsInMasterPage: false    // <en>Whether the cell or cell range referenced in the formula is on the master page.</en><cn>公式中引用的单元格或单元格范围是否在母版页中</cn><jp>数式で参照されているセルまたはセル範囲がマスターページにあるかどうか</jp><kr></kr>
   * };
   *
   * // <en>Get data from table.</en><cn>获取数据表中的数据</cn><jp>テーブルのデータを取得する。</jp><kr></kr>
   * Forguncy.getTableDataByCondition(param, formulaCalcContext, function(dataStr){
   *     var tableData = JSON.parse(dataStr);
   * }, true);
   * ```
   */
  function getTableDataByCondition(
    condition: GetTableDataByConditionParams,
    formulaCalcContext: FormulaCalcContext,
    callBack: Function,
    async?: boolean,
  ): void;

  /**
   * <en>Delete one row of a specified table.</en>
   * <cn>通过`primaryKey`参数指定唯一一行记录进行删除。</cn>
   * <jp>指定したテーブルに対してレコードが一意になるフィールド名と値を指定し、1件のレコード内容を削除します。</jp>
   * <kr></kr>
   * @param tableName <en>The table's name.</en>
   * <cn>要删除记录的表的表名。</cn>
   * <jp>削除したいデータが格納されているテーブルの名前。</jp>
   * <kr></kr>
   * @param primaryKey <en>The specified row's query info.</en>
   * <cn>指定字段名称和值，指定的值必须只能找到一行。</cn>
   * <jp>削除対象のレコードにおいて一意となるフィールド名と値を指定。プロパティ名にフィールド名、値にそのフィールドの値を持つオブジェクトを指定します。指定するフィールドが必ずしもデータベース上で一意制約を持つフィールドである必要はありません。</jp>
   * <kr></kr>
   * @param callback <en>A callback function that is executed if the request succeeds.</en>
   * <cn>成功回调函数。</cn>
   * <jp>レコードの削除が成功したときに実行するコールバック関数を指定します。</jp>
   * <kr></kr>
   * @param errorCallback <en>A callback function that is executed if the request fail.</en>
   * <cn>失败回调函数，参数中包含错误信息。</cn>
   * <jp>レコードの削除が失敗したときに実行するコールバック関数を指定します。 引数にエラーメッセージが渡されます。なお、テーブル名の指定に誤りがあるなどのデータベースアクセスにおける構文エラーについては、本コールバック関数を使用してエラーをハンドルすることはできません。そのような場合のエラー内容については、HTTP応答ヘッダーの内容を確認する必要があります。</jp>
   * <kr></kr>
   * @example
   * ```javascript
   * // <en>In this example, shows how to use the method deleteTableData to delete data for the specified data table through primary key.</en><cn>下面的示例代码中，通过deleteTableData方法，删除指定的唯一的记录。</cn><jp>本サンプルコードでは、deleteTableDataメソッドを使用して指定した一意のレコードを削除する例を示します。</jp><kr></kr>
   * Forguncy.deleteTableData("<en>Table1</en><cn>员工表</cn><jp>テーブル1</jp><kr></kr>", { "ID": 2 },
   *     function () {
   *         // <en>Pops up a dialog with "success" when the data delete successfully.</en><cn>删除成功时弹出警告框，显示添加成功</cn><jp>レコードの削除に成功した場合</jp><kr></kr>
   *         alert("<en>success.</en><cn>删除成功。</cn><jp>レコードが1件削除されました。</jp>");
   *     },
   *     function (errorMessage) {
   *         // <en>Pops up a warning dialog with the failure message when the data delete failed.</en><cn>删除失败时弹出警告框，显示失败信息</cn><jp>レコードの削除に失敗した場合</jp><kr></kr>
   *         alert(errorMessage);
   *     }
   * );
   * // <en>If the primary key is multiple, the example code is following:</en><cn>如果数据表主键是多列，示例代码如下：</cn><jp>複数のフィールドを組み合わせて一意なレコードを特定する場合、以下のようなコードを使用します。</jp><kr></kr>
   * Forguncy.deleteTableData("<en>Table1</en><cn>员工表</cn><jp>テーブル1</jp><kr></kr>", { "ID": 2, "<en>Name</en><cn>姓名</cn><jp>名前</jp><kr></kr>" : "<en>Robert</en><cn>韩梅梅</cn><jp>山田太郎</jp><kr></kr>"  },
   *     function () {
   *         // <en>Pops up a dialog with "success" when the data update successfully.</en><cn>删除成功时弹出警告框，显示添加成功</cn><jp>レコードの削除に成功した場合</jp><kr></kr>
   *         alert("<en>success.</en><cn>删除成功。</cn><jp>レコードが1件削除されました。</jp>");
   *     },
   *     function (errorMessage) {
   *         // <en>Pops up a warning dialog with the failure message when the data update failed.</en><cn>删除失败时弹出警告框，显示失败信息</cn><jp>レコードの削除に失敗した場合</jp><kr></kr>
   *         alert(errorMessage);
   *     }
   * );
   * ```
   */
  function deleteTableData(
    tableName: string,
    primaryKey: { [primaryColumnName: string]: Object },
    callback: Function,
    errorCallback: Function,
  ): void;

  /**
   * <en>Add one row to a specified table.</en>
   * <cn>指定要添加记录表的表名，以及要添加的数据。</cn>
   * <jp>指定したテーブルに対して追加したいレコードのフィールド名と値を指定し、1件のレコードを追加します。</jp>
   * <kr></kr>
   * @param tableName <en>The table's name.</en>
   * <cn>要添加记录的表的表名。</cn>
   * <jp>追加したいデータが格納されているテーブルの名前。</jp>
   * <kr></kr>
   * @param newValue <en>The new row's data.</en>
   * <cn>添加行的列名和值，不必包含表的所有列。</cn>
   * <jp>追加したいレコードのフィールド名と値を指定。プロパティ名にフィールド名、値にそのフィールドの値を持つオブジェクトを指定します。すべてのフィールドを含めることは必要はなく、追加したいフィールドのみを含めることができます。</jp>
   * <kr></kr>
   * @param callback <en>A callback function that is executed if the request succeeds.</en>
   * <cn>成功回调函数，参数中包含已插入行的值。</cn>
   * <jp>レコードの追加が成功したときに実行するコールバック関数を指定します。引数には追加するオブジェクト（newValueパラメーターに指定した値）が渡されます。</jp>
   * <kr></kr>
   * @param errorCallback <en>A callback function that is executed if the request fail.</en>
   * <cn>失败回调函数，参数中包含错误信息。</cn>
   * <jp>レコードの追加が失敗したときに実行するコールバック関数を指定します。 引数にエラーメッセージが渡されます。なお、テーブル名の指定に誤りがあるなどのデータベースアクセスにおける構文エラーについては、本コールバック関数を使用してエラーをハンドルすることはできません。そのような場合のエラー内容については、HTTP応答ヘッダーの内容を確認する必要があります。</jp>
   * <kr></kr>
   * @example
   * ```javascript
   * // <en>In this example, shows how to use the method addTableData to add data for the specified data table.</en><cn>下面的示例代码中，通过addTableData方法，为指定的数据表添加数据。</cn><jp>本サンプルコードでは、addTableDataメソッドを使用して指定したテーブルにデータを追加する例を示します。</jp><kr></kr>
   * Forguncy.addTableData("<en>Table1</en><cn>员工表</cn><jp>テーブル1</jp><kr></kr>",
   *     {
   *         // <en>Specified column name and data.</en><cn>指定列名与数据</cn><jp>フィールド名と値を指定する。</jp><kr></kr>
   *         <en>Name</en><cn>姓名</cn><jp>名前</jp><kr></kr>: "<en>Robert</en><cn>李四</cn><jp>山田太郎</jp><kr></kr>",
   *         <en>Birthday</en><cn>出生日期</cn><jp>生年月日</jp><kr></kr>:"1993/3/1",
   *         <en>Department</en><cn>部门</cn><jp>部門</jp><kr></kr>: "<en>Development</en><cn>开发部</cn><jp>開発部</jp><kr></kr>"
   *     },
   *     function (data) {
   *         // <en>Pops up a dialog with "success" when the data add successfully.</en><cn>添加成功时弹出警告框，显示添加成功</cn><jp>レコードの追加に成功した場合</jp><kr></kr>
   *         alert("<en>success.</en><cn>添加成功。</cn><jp>レコードが1件追加されました。</jp>");
   *     },
   *     function (errorMessage) {
   *         // <en>Pops up a warning dialog with the failure message when the data add failed.</en><cn>添加失败时弹出警告框，显示失败信息</cn><jp>レコードの追加に失敗した場合</jp><kr></kr>
   *     }
   * );
   * ```
   */
  function addTableData(
    tableName: string,
    newValue: { [columnName: string]: Object },
    callback: Function,
    errorCallback: Function,
  ): void;

  /**
   * <en>Update one row to a specified table.</en>
   * <cn>通过`primaryKey`参数指定唯一一行记录进行更新。</cn>
   * <jp>指定したテーブルに対してレコードが一意になるフィールド名と値、追加したいレコードのフィールド名と値を指定し、1件のレコードを更新します。</jp>
   * <kr></kr>
   * @param tableName <en>The table's name.</en>
   * <cn>要修改记录的表的表名。</cn>
   * <jp>更新したいデータが格納されているテーブルの名前。</jp>
   * <kr></kr>
   * @param primaryKey <en>The specified row's query info.</en>
   * <cn>指定要修改记录的字段名称和值，指定的值必须只能找到一行。</cn>
   * <jp>更新対象のレコードにおいて一意となるフィールド名と値を指定。プロパティ名にフィールド名、値にそのフィールドの値を持つオブジェクトを指定します。指定するフィールドが必ずしもデータベース上で一意制約を持つフィールドである必要はありません。</jp>
   * <kr></kr>
   * @param updateValue <en>The row's new data.</en>
   * <cn>表示更新值的对象，对象的属性表示列名，属性值表示要更新的值。并不需要包含数据表中的所有列。</cn>
   * <jp>対象レコードの更新後のフィールド名と値を指定。プロパティ名にフィールド名、値にそのフィールドの値を持つオブジェクトを指定します。すべてのフィールドを含めることは必要はなく、更新したいフィールドのみを含めることができます。</jp>
   * <kr></kr>
   * @param callback <en>A callback function that is executed if the request succeeds.</en>
   * <cn>成功回调函数，参数中包含已修改行的值。</cn>
   * <jp>レコードの更新が成功したときに実行するコールバック関数を指定します。引数には追加するオブジェクト（newValueパラメーターに指定した値）が渡されます。</jp>
   * <kr></kr>
   * @param errorCallback <en>A callback function that is executed if the request fail.</en>
   * <cn>失败回调函数，参数中包含错误信息。</cn>
   * <jp>レコードの更新が失敗したときに実行するコールバック関数を指定します。 引数にエラーメッセージが渡されます。なお、テーブル名の指定に誤りがあるなどのデータベースアクセスにおける構文エラーについては、本コールバック関数を使用してエラーをハンドルすることはできません。そのような場合のエラー内容については、HTTP応答ヘッダーの内容を確認する必要があります。</jp>
   * <kr></kr>
   * @example
   * ```javascript
   * // <en>In this example, shows how to use the updateTableData method to update data in the table.</en><cn>下面的示例代码中，通过updateTableData方法，更新数据表中的数据。</cn><jp>本サンプルコードでは、updateTableDataメソッドを使用してテーブルのデータを更新する例を示します。</jp><kr></kr>
   * Forguncy.updateTableData("<en>Table1</en><cn>员工表</cn><jp>テーブル1</jp><kr></kr>", { "ID": 2 }, { <en>Name</en><cn>姓名</cn><jp>名前</jp><kr></kr>: "<en>Robert</en><cn>小李</cn><jp>山田太郎</jp><kr></kr>", <en>Dept</en><cn>部门</cn><jp>部門</jp><kr></kr>: "<en>Development</en><cn>开发部</cn><jp>開発部</jp><kr></kr>" },
   *     function (data) {
   *         // <en>Pops up a dialog with "success" when the data update successfully.</en><cn>更新数据成功时弹出警告框，显示更新成功</cn><jp>レコードの更新に成功した場合</jp><kr></kr>
   *         alert("<en>success.</en><cn>更新成功！</cn><jp>レコードが1件更新されました。</jp>");
   *     },
   *     function (errorMessage) {
   *         // <en>Pops up a warning dialog with the failure message when the data update failed.</en><cn>更新数据失败时弹出警告框，显示失败信息</cn><jp>レコードの更新に失敗した場合</jp><kr></kr>
   *         alert(errorMessage);
   *     }
   * );
   * // <en>If the primary key is multiple, the example code is following:</en><cn>如果数据表主键是多列，示例代码如下：</cn><jp>複数のフィールドを組み合わせて一意なレコードを特定する場合、以下のようなコードを使用します。</jp><kr></kr>
   * Forguncy.updateTableData("ListView1", { "ID": 2, <en>Name</en><cn>姓名</cn><jp>名前</jp><kr></kr>: "<en>Robert</en><cn>小李</cn><jp>山田太郎</jp><kr></kr>" }, { <en>Dept</en><cn>部门</cn><jp>部門</jp><kr></kr>: "<en>Development</en><cn>开发部</cn><jp>開発部</jp><kr></kr>" },
   *     function (data) {
   *         // <en>Pops up a dialog with "success" when the data update successfully.</en><cn>更新数据成功时弹出警告框，显示更新成功</cn><jp>レコードの更新に成功した場合</jp><kr></kr>
   *         alert("<en>success.</en><cn>更新成功！</cn><jp>レコードが1件更新されました。</jp>");
   *     },
   *     function (errorMessage) {
   *         // <en>Pops up a warning dialog with the failure message when the data update failed.</en><cn>更新数据失败时弹出警告框，显示失败信息</cn><jp>レコードの更新に失敗した場合</jp><kr></kr>
   *         alert(errorMessage);
   *     }
   * );
   * ```
   */
  function updateTableData(
    tableName: string,
    primaryKey: { [primaryColumnName: string]: Object },
    updateValue: { [columnName: string]: Object },
    callback: Function,
    errorCallback: Function,
  ): void;

  /**
   * <en>Add, update or delete data of tables.</en>
   * <cn>批量添加、修改、删除数据表的数据。</cn>
   * <jp>指定した更新レコード情報に基づき、複数レコードを一括更新します。更新は新規追加、編集、削除の3つの処理すべてを含むことが可能です。<br />
   * たとえば、addTableDataメソッドを使用してデータを1,000行追加する場合、サーバーに対して1,000件のリクエストが送信されます。この方法の場合、大量のリクエストが発生するだけでなく、そのうちの1回が失敗した場合であってもすべてをキャンセルできないという問題があります。本メソッドを使用することで、そのような問題を回避できます。</jp>
   * <kr></kr>
   * @param modifyData <en>The tables' data change info.</en>
   * <cn>指定一个对象，其中包含对哪些表，添加/修改/删除哪些行的哪些列的数据。</cn>
   * <jp>どのテーブルに対して、どの行のどの列を追加/変更/削除するかを含む{@link Forguncy.ModifyData ModifyDataオブジェクト}を指定します。</jp>
   * <kr></kr>
   * @param callback <en>A callback function that is executed if the request succeeds.</en>
   * <cn>成功回调函数，此回调函数会在电子邮件成功发送后被调用。该参数为可选参数。</cn>
   * <jp>レコードの一括更新が成功したときに実行するコールバック関数を指定します。</jp>
   * <kr></kr>
   * @param errorCallback <en>A callback function that is executed if the request fail.</en>
   * <cn>失败回调函数，此回调函数会在电子邮件发送失败后被调用，并且通过参数通知错误信息。该参数为可选参数。</cn>
   * <jp>レコードの一括更新が失敗したときに実行するコールバック関数を指定します。 引数にエラーメッセージが渡されます。なお、テーブル名の指定に誤りがあるなどのデータベースアクセスにおける構文エラーについては、本コールバック関数を使用してエラーをハンドルすることはできません。そのような場合のエラー内容については、HTTP応答ヘッダーの内容を確認する必要があります。</jp>
   * <kr></kr>
   * @example
   * ```javascript
   * // <en>Insert data to `table1` and `table2`.</en><cn>插入数据到表`table1`和表`table2`</cn><jp>テーブル1とテーブル2にレコードを追加します。</jp><kr></kr>
   * Forguncy.modifyTablesData({
   *     <en>table1</en><cn>表1</cn><jp>テーブル1</jp><kr></kr>: {
   *         addRows: [
   *             {
   *                 <en>Name</en><cn>姓名</cn><jp>名前</jp><kr></kr>: "<en>Robert</en><cn>李雷</cn><jp>山田太郎</jp><kr></kr>",
   *                 <en>Department</en><cn>部门</cn><jp>部門</jp><kr></kr>: "<en>Development</en><cn>开发部</cn><jp>開発部</jp><kr></kr>"
   *             },
   *             {
   *                 <en>Name</en><cn>姓名</cn><jp>名前</jp><kr></kr>: "<en>Sccot</en><cn>韩梅梅</cn><jp>鈴木花子</jp><kr></kr>",
   *                 <en>Department</en><cn>部门</cn><jp>部門</jp><kr></kr>: "<en>Administration</en><cn>管理部</cn><jp>総務部</jp><kr></kr>"
   *             },
   *         ]
   *     },
   *     <en>table2</en><cn>表2</cn><jp>テーブル2</jp><kr></kr>: {
   *         addRows: [
   *             {
   *                 <en>Name</en><cn>姓名</cn><jp>名前</jp><kr></kr>: "<en>John</en><cn>张三</cn><jp>佐々木一郎</jp><kr></kr>",
   *                 <en>Department</en><cn>部门</cn><jp>部門</jp><kr></kr>: "<en>Marketing</en><cn>市场部</cn><jp>マーケティング部</jp><kr></kr>"
   *             },
   *             {
   *                 <en>Name</en><cn>姓名</cn><jp>名前</jp><kr></kr>: "<en>Emily</en><cn>李四</cn><jp>斎藤次郎</jp><kr></kr>",
   *                 <en>Department</en><cn>部门</cn><jp>部門</jp><kr></kr>: "<en>Marketing</en><cn>市场部</cn><jp>マーケティング部</jp><kr></kr>"
   *             },
   *         ]
   *     }
   * });
   * // <en>Delete multiple rows.</en><cn>删除多行数据</cn><jp>テーブル1とテーブル2からそれぞれ2レコードずつ削除します。</jp><kr></kr>
   * Forguncy.modifyTablesData({
   *     <en>table1</en><cn>表1</cn><jp>テーブル1</jp><kr></kr>: {
   *         deleteRows: [
   *             {
   *                 ID: 2
   *             },
   *             {
   *                 ID: 3
   *             },
   *         ]
   *     },
   *     <en>table2</en><cn>表2</cn><jp>テーブル2</jp><kr></kr>: {
   *         deleteRows:  [
   *             {
   *                 ID: 3
   *             },
   *             {
   *                 ID: 4
   *             },
   *         ]
   *     }
   * });
   * // <en>Update multiple rows.</en><cn>更新多行数据</cn><jp>テーブル1とテーブル2の複数件のレコードを一括更新します。</jp><kr></kr>
   * Forguncy.modifyTablesData({
   *     <en>table1</en><cn>表1</cn><jp>テーブル1</jp><kr></kr>: {
   *         editRows: [
   *             {
   *                 primaryKey:
   *                 {
   *                     ID: 2
   *                 },
   *                 values: {
   *                     <en>Name</en><cn>姓名</cn><jp>名前</jp><kr></kr>: "<en>Robert</en><cn>李雷</cn><jp>山田太郎</jp><kr></kr>",
   *                     <en>Department</en><cn>部门</cn><jp>部門</jp><kr></kr>: "<en>Development</en><cn>开发部</cn><jp>開発部</jp><kr></kr>"
   *                 }
   *             },
   *             {
   *                 primaryKey:
   *                 {
   *                     ID: 3
   *                 },
   *                 values: {
   *                     <en>Name</en><cn>姓名</cn><jp>名前</jp><kr></kr>: "<en>Sccot</en><cn>韩梅梅</cn><jp>鈴木花子</jp><kr></kr>",
   *                     <en>Department</en><cn>部门</cn><jp>部門</jp><kr></kr>: "<en>Administration</en><cn>管理部</cn><jp>総務部</jp><kr></kr>"
   *                 }
   *             },
   *         ]
   *     },
   *     <en>table2</en><cn>表2</cn><jp>テーブル2</jp><kr></kr>: {
   *         editRows: [
   *             {
   *                 primaryKey:
   *                 {
   *                     ID: 3
   *                 },
   *                 values: {
   *                     <en>Name</en><cn>姓名</cn><jp>名前</jp><kr></kr>: "<en>John</en><cn>小李</cn><jp>佐々木一郎</jp><kr></kr>",
   *                     <en>Department</en><cn>部门</cn><jp>部門</jp><kr></kr>: "<en>Marketing</en><cn>开发部</cn><jp>マーケティング部</jp><kr></kr>"
   *                 }
   *             },
   *             {
   *                 primaryKey:
   *                 {
   *                     ID: 4
   *                 },
   *                 values: {
   *                     <en>Name</en><cn>姓名</cn><jp>名前</jp><kr></kr>: "<en>Emily</en><cn>小王</cn><jp>斎藤次郎</jp><kr></kr>",
   *                     <en>Department</en><cn>部门</cn><jp>部門</jp><kr></kr>: "<en>Marketing</en><cn>管理部</cn><jp>マーケティング部</jp><kr></kr>"
   *                 }
   *             },
   *         ]
   *     }
   * });
   * // <en>Add, delete, and update multiple rows of data at the same time.</en><cn>同时添加、删除、修改多行数据</cn><jp>テーブル1に対して複数レコードの追加、複数レコードの削除、複数レコードの更新を一括で行います。</jp><kr></kr>
   * Forguncy.modifyTablesData({
   *     <en>table1</en><cn>表1</cn><jp>テーブル1</jp><kr></kr>: {
   *         addRows: [
   *             {
   *                 <en>Name</en><cn>姓名</cn><jp>名前</jp><kr></kr>: "<en>John</en><cn>王明</cn><jp>佐々木一郎</jp><kr></kr>",
   *                 <en>Department</en><cn>部门</cn><jp>部門</jp><kr></kr>: "<en>Marketing</en><cn>开发部</cn><jp>マーケティング部</jp><kr></kr>"
   *             },
   *             {
   *                 <en>Name</en><cn>姓名</cn><jp>名前</jp><kr></kr>: "<en>Emily</en><cn>赵蕾</cn><jp>斎藤次郎</jp><kr></kr>",
   *                 <en>Department</en><cn>部门</cn><jp>部門</jp><kr></kr>: "<en>Marketing</en><cn>管理部</cn><jp>マーケティング部</jp><kr></kr>"
   *             },
   *         ],
   *         deleteRows: [
   *             {
   *                 ID: 2
   *             },
   *             {
   *                 ID: 3
   *             },
   *         ],
   *         editRows: [
   *             {
   *                 primaryKey:
   *                 {
   *                     ID: 2
   *                 },
   *                 values: {
   *                     <en>Name</en><cn>姓名</cn><jp>名前</jp><kr></kr>: "<en>Robert</en><cn>小李</cn><jp>山田太郎</jp><kr></kr>",
   *                     <en>Department</en><cn>部门</cn><jp>部門</jp><kr></kr>: "<en>Development</en><cn>开发部</cn><jp>開発部</jp><kr></kr>"
   *                 }
   *             },
   *             {
   *                 primaryKey:
   *                 {
   *                     ID: 3
   *                 },
   *                 values: {
   *                     <en>Name</en><cn>姓名</cn><jp>名前</jp><kr></kr>: "<en>Sccot</en><cn>小王</cn><jp>鈴木花子</jp><kr></kr>",
   *                     <en>Department</en><cn>部门</cn><jp>部門</jp><kr></kr>: "<en>Administration</en><cn>管理部</cn><jp>総務部</jp><kr></kr>"
   *                 }
   *             },
   *         ]
   *     }
   * });
   * ```
   */
  function modifyTablesData(
    modifyData: { [tableName: string]: ModifyData },
    callback: Function,
    errorCallback: Function,
  ): void;

  /**
   * <en>Force synchronize external table data to copy table.</en>
   * <cn>强制同步外连表的数据到副本表中。</cn>
   * <jp>コピーテーブルの同期処理を行いデータを最新状態にします。</jp>
   * <kr></kr>
   * @param tableName <en>The copy table name.</en>
   * <cn>副本表。</cn>
   * <jp>対象のコピーテーブルの名前</jp>
   * <kr></kr>
   * @param callback <en>A callback function that is executed when the request back.</en>
   * <cn>同步数据后的回调函数。</cn>
   * <jp>同期処理が行われた後のコールバック関数。</jp>
   * <kr></kr>
   * @example
   * ```javascript
   * Forguncy.forceSyncTableData("<en>table1</en><cn>table1</cn><jp>コピーテーブル1</jp><kr>table1</kr>", function(data){
   *     if(data){
   *          if(data.Success){
   *              alert("<en>Success</en><cn>Success</cn><jp>同期処理が正常に完了しました。</jp><kr>Success</kr>");
   *          } else{
   *              alert("<en>Failed. ErrorMessage:</en><cn>Failed. ErrorMessage:</cn><jp>同期処理が失敗しました。エラーメッセージ：</jp><kr>Failed. ErrorMessage:</kr>" + data.ErrorMessage);
   *          }
   *      }
   *   });
   * ```
   */
  function forceSyncTableData(tableName: string, callback: Function): void;

  /**
     * <en>Converts a specified color string to CSS color string.</en>
     * <cn>转换指定的颜色文本为 CSS 颜色文本，也就是颜色的十六进制值。</cn>
     * <jp>指定された色のテキストを、CSSで使用可能な16進値に変換します。</jp>
     * <kr></kr>
     * @param color <en>The color string.</en>
     * <cn>颜色文本。</cn>
     * <jp>Forguncy Builderのパレット上に色情報を指定する文字列。文字列は次の4つの情報を空白文字で区切って表します。「色の名前（要下記の対比表参照）」、「色の番号」、「明るさ（白）／暗さ（黒）のパーセンテージ（暗い場合にはマイナス値）」、「透明度（0～255）」。「透明度」は省略可能で、省略した場合には255となります。</br>
         <table>
             <tr>
                 <th>パラメーターに指定する文字列</th>
                 <th>Forguncy Builderのパレット上の色の名前</th>
             </tr>
             <tr>
                 <td>Background</td>
                 <td>背景</td>
             </tr>
             <tr>
                 <td>Text</td>
                 <td>テキスト</td>
             </tr>
             <tr>
                 <td>Accent</td>
                 <td>アクセント</td>
             </tr>
         </table></br>
         <p>たとえば、「アクセント 1、白 + 基本色 40％」の色を指定したい場合、「Accent 1 40」をパラメーターとして指定します。</p>
       </jp>
     * <kr></kr>
     * @example
     * ```javascript
     * // <en>In this example, the ConvertToCssColor method is used to convert the specified color code to the CSS color code.</en><cn>下面的示例代码中，通过ConvertToCssColor方法，转换指定的颜色文本为 CSS 颜色文本。</cn><jp>本サンプルコードでは、ConvertToCssColorメソッドを使用して、Forguncy Builderのパレット上にある指定した色情報をCSSで使用可能な16進数のカラーコードに変換します。</jp><kr></kr>
     * // <en>Converts the specified color.</en><cn>转换指定的颜色</cn><jp>指定した色を変換する。</jp><kr></kr>
     * var color = Forguncy.ConvertToCssColor("Accent 2 60 255");
     * // <en>Display the CSS color code in a dialog box.</en><cn>弹出警告框，显示转换后的CSS颜色</cn><jp>変換されたCSSカラーコードをダイアログボックスに表示する。</jp><kr></kr>
     * alert(color);
     * ```
     */
  export function ConvertToCssColor(color: string): string;

  /**
   * <en>Represents PivotTableCellType.</en>
   * <cn>数据透视表单元格类型。</cn>
   * <jp>ピボットテーブル型セルを表します。</jp>
   * <kr></kr>
   */
  class PivotTableCellType {
    /**
     * <en>Set custom aggregator function for pivot table.</en>
     * <cn>自定义数据透视表单元格类型的值汇总方式。</cn>
     * <jp>ピボットテーブル型セルの値の集計方法をカスタマイズします。</jp>
     * <kr></kr>
     * @param cellName <en>The cell name of pivot table cell.</en>
     * <cn>数据透视表单元格的名称。</cn>
     * <jp>対象とするピボットテーブル型セルのセル名。</jp>
     * <kr></kr>
     * @param customFunction <en>The custom aggregator function. This function receive two arguments: "records" is an array of include all rows which will aggregate into one cell, "filedName" is the field's name. The return value is the aggregated result.</en>
     * <cn>汇总所选字段数据的处理函数。该函数接受两个参数："records"是一组待汇总数据，"filedName"是汇总数据字段名称。返回值是汇总结果。</cn>
     * <jp>選択したフィールドのデータの集計処理を行う関数。この関数は2つの引数を受け取ります。「records」は集計されるデータセットであり、「filedName」は集計データフィールド名です。戻り値は集計結果です。</jp>
     * <kr></kr>
     * @example
     * ```javascript
     * Forguncy.PivotTableCellType.setCustomFunction("pivottablecell", function (records, filedName) {
     *   var count = records.length;
     *   return "<en>custom</en><cn>custom</cn><jp>カスタム</jp><kr>custom</kr> : " + count;
     *});
     * ```
     */
    static setCustomFunction(cellName: string, customFunction: (records: any[], filedName: string) => any): void;
  }

  /**
   * <en>Provide the data for pivot table click event.</en>
   * <cn>为数据透视表点击事件提供数据。</cn>
   * <jp>ピボットテーブルのクリックイベントのデータを提供します。</jp>
   * <kr></kr>
   */
  class PivotTableEventParameter {
    constructor(
      dataType: string,
      row: number,
      col: number,
      value: any,
      colHeaders: Array<PivotTableHeaderInfo>,
      rowHeaders: Array<PivotTableHeaderInfo>,
    );
    /**
     * <en>If the click area is general data area, then the value is "Data"; "ColTotal" for the grand column area and "RowTotal" for the grand row area.</en>
     * <cn>如果单击的位置是常规数据区域，则为"Data"，对于列总计单元格，为"ColTotal"，对于行总计区域，则为"RowTotal"。</cn>
     * <jp>クリックした場所が通常のデータ領域の場合は「Data」、列の総計セルの場合は「ColTotal」、行の総計セルの場合は「RowTotal」となります。</jp>
     * <kr></kr>
     */
    public dataType: string;
    /**
     * <en>Row index of clicked area.</en>
     * <cn>点击位置的行索引。</cn>
     * <jp>クリックしたセルの行インデックスです。値はゼロオリジンとなります。</jp>
     * <kr></kr>
     */
    public row: number;
    /**
     * <en>Column index of clicked area.</en>
     * <cn>点击位置的列索引。</cn>
     * <jp>クリックしたセルの列インデックスです。値はゼロオリジンとなります。</jp>
     * <kr></kr>
     */
    public col: number;
    /**
     * <en>The value of clicked area.</en>
     * <cn>点击位置的值。</cn>
     * <jp>クリックしたセルの値です。</jp>
     * <kr></kr>
     */
    public value: any;
    /**
     * <en>The column header info of clicked area.</en>
     * <cn>点击位置所在的列头信息。</cn>
     * <jp>クリックしたセルの列ヘッダー情報（PivotTableHeaderInfo配列）です。</jp>
     * <kr></kr>
     */
    public colHeaders: Array<PivotTableHeaderInfo>;
    /**
     * <en>The row header info of clicked area.</en>
     * <cn>点击位置所在的行头信息。</cn>
     * <jp>クリックしたセルの行ヘッダー情報（PivotTableHeaderInfo配列）です。</jp>
     * <kr></kr>
     */
    public rowHeaders: Array<PivotTableHeaderInfo>;
  }

  /**
   * <en>The pivot table header information.</en>
   * <cn>数据透视表的头部信息。</cn>
   * <jp>ピボットテーブルのヘッダー情報。</jp>
   * <kr></kr>
   */
  class PivotTableHeaderInfo {
    /**
     * <en>The label in pivot table.</en>
     * <cn>标签名称。</cn>
     * <jp>ヘッダーのフィールド名。</jp>
     * <kr></kr>
     */
    public label: string;
    /**
     * <en>The header name.</en>
     * <cn>头部标题。</cn>
     * <jp>ヘッダーの値。</jp>
     * <kr></kr>
     */
    public header: string;
  }
}
