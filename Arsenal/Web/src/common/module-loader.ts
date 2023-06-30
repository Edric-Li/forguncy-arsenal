const loadImportExcelModule = (): Promise<void> => {
  return new Promise((resolve) =>
    Forguncy.ModuleLoader.LoadModels(['importExcel'], Forguncy.ForguncyData.ForguncyRoot).then(resolve),
  );
};

const loadSpreadCss = () => {
  Forguncy.ModuleLoader.LoadCss(['Bundle/spread.css'], Forguncy.ForguncyData.ForguncyRoot + 'Resources/');
};

const moduleLoader = {
  loadImportExcelModule,
  loadSpreadCss,
};

export default moduleLoader;
