import React, {useEffect} from 'react';
import loadStyle from '../../../../common/load-style';

/**
 * ppt预览组件
 * @param props
 * @constructor
 */
const PowerPointPreview = (props:IProps) => {
    useEffect(() => {
        loadStyle('');
    }, []);
    return null;
};

export default PowerPointPreview;

