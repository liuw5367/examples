import type { GetRootModelType, GetRootState, Models } from '../dva';

import GlobalModel from './global';
import ListModel from './list';

/**
 * 注册所有的 Model
 * key 无意义，不重复就行
 */
export const models = {
  1: GlobalModel,
  2: ListModel,
};

/**
 * 在这里注册所有的 ModelType
 */
// type Models = [GlobalModelType, TodoModelType];

/**
 * 所有的 ModelType
 * {
 *   [namespace]: ModelType;
 * }
 */
export type RootModelType = GetRootModelType<Models>;

/**
 * RootState，在组件中使用 useSelector, connect 函数时使用
 */
export type ConnectState = GetRootState<RootModelType>;
