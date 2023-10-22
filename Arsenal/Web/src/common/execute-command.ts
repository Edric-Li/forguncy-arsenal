const executeCommand = (
  obj: Forguncy.Plugin.ICustomCommandObject,
  initParams: {
    [name: string]: string | number;
  },
  runTimePageName: string,
): Promise<boolean> => {
  return new Promise((resolve) => {
    // @ts-ignore
    Forguncy.ForguncyData.commandExecutor.executeCommand(obj.Commands, {
      runTimePageName: runTimePageName,
      commandTrigger: null,
      commandID: new Date().getTime(),
      eventType: 'click',
      initParams: initParams,
      callbackOnCommandCompleted: (normalComplete: boolean) => {
        resolve(normalComplete);
      },
    });
  });
};

export default executeCommand;
