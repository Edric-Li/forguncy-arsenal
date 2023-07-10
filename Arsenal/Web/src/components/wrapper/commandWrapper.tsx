import uploadCommand from '../../commands/upload';
import _ from 'lodash';

interface Props {
  commandName: string;
  commandBase: Forguncy.Plugin.CommandBase;
}

const commandWrapper = (props: Props): Function | null => {
  let fn: Function | null = null;

  if (props.commandName === 'Upload') {
    fn = uploadCommand;
  }

  return (fn || _.noop).bind(null, props.commandBase);
};
export default commandWrapper;
