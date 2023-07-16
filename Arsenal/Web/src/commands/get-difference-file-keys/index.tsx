import difference from '../../common/difference';

interface ICommandParam {
  oldFileKeys: string;
  newFileKeys: string;
  result: string;
}

const getDifferenceFileKeys = (ctx: Forguncy.Plugin.CommandBase) => {
  const param = ctx.CommandParam as ICommandParam;

  const oldValues = ctx.evaluateFormula(param.oldFileKeys)?.toString()?.split('|') ?? [];
  const newValues = ctx.evaluateFormula(param.newFileKeys)?.toString()?.split('|') ?? [];

  const result = difference(oldValues, newValues).join('|');

  Forguncy.CommandHelper.setVariableValue(param.result, result);
};

export default getDifferenceFileKeys;
