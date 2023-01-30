import { useDispatch as useDispatchFn } from 'react-redux';

import { Dispatch } from '../dva';

/**
 * 添加对 action 的限制
 * 支持返回值类型
 */
export function useDispatch(): Dispatch {
  return useDispatchFn() as unknown as Dispatch;
}
