interface ICommandParam {
  cancellationToken: string;
}

const cancelCommand = (ctx: Forguncy.Plugin.CommandBase) => {
  const commandParam = ctx.CommandParam as ICommandParam;
  const cancellationToken = ctx.evaluateFormula(commandParam.cancellationToken);
  window.Arsenal.canceledTokenSet.add(cancellationToken);
};

export default cancelCommand;
