interface ICommandParam {
  oldFileKeys: string;
  newFileKeys: string;
  result: string;
}

const getDifferenceFileKeys = (ctx: Forguncy.Plugin.CommandBase) => {
  const param = ctx.CommandParam as ICommandParam;

  const parseKeys = (keys: string) => ctx.evaluateFormula(keys)?.toString()?.split('|') ?? [];

  const oldValues: string[] = parseKeys(param.oldFileKeys);
  const newValues = new Set(parseKeys(param.newFileKeys));

  const result = oldValues.filter((value) => !newValues.has(value)).join('|');

  Forguncy.CommandHelper.setVariableValue(param.result, result);
};

export default getDifferenceFileKeys;
