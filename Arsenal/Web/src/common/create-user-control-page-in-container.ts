/**
 * 在指定区域内创建 UserControlPage
 * @param div
 * @param userControlPageName
 */
function createUserControlPageInContainer(div: HTMLDivElement, userControlPageName: string) {
  const options = {
    CellType: {
      $type: 'Forguncy.UserControlPageCellType, ServerDesignerCommon',
      OverflowMode: 0,
      ShouldCheckDirtyWhenLeavePage: true,
      UserControlPageName: userControlPageName,
    },
    StyleInfo: {
      HorizontalAlignment: 0,
      VerticalAlignment: 1,
      FontSize: 14.67,
      TextIndent: 0,
    },
  };

  // @ts-ignore forguncy undisclosed methods .
  Forguncy.Presentation.CellContentElementPresenter.createCell($(div), options, Forguncy.Page.getPageName());
}

export default createUserControlPageInContainer;
