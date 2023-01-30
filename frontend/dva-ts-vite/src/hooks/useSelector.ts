import { useSelector as useSelectorFn } from 'react-redux';

import { ConnectState } from '../models';

type SelectorType = <T>(fn: (state: ConnectState) => T) => T;

/**
 * 重新定义 useSelector hooks 添加范型
 */
export const useSelector: SelectorType = useSelectorFn;
