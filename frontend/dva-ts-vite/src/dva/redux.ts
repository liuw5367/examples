import { ConnectState, RootModelType } from "../models";

import {
  Action,
  AllModelActionTypes,
  AllNamespaces,
  FuncReturnType,
  ModelEffectKeys,
  ModelKeys,
  ModelReducerKeys,
  PutAction,
} from ".";

export type EffectParam<T = any, R = any> = { param: T; return: R };

/** 获取指定K的值，如果不存在就取 R */
type GetEffectParamValue<
  T,
  K extends keyof EffectParam,
  R = T
> = T extends EffectParam ? T[K] : R;

/**
 * actionType 只允许 AllModelActionTypes
 */
export type Dispatch = <
  R = any,
  T extends AllModelActionTypes = AllModelActionTypes
>(
  action: Action<GetEffectParamValue<DispatchPayload<T>, "param">, T>
) => GetEffectParamValue<DispatchPayload<T>, "return", R>;

/**
 * 根据 namespace 和 key，取 ModelType 中 effect 和 reducer 定义的类型
 */
export type DispatchPayload<T extends AllModelActionTypes> =
  T extends `${infer N}/${infer K}`
    ? N extends AllNamespaces
      ? K extends ModelEffectKeys<RootModelType[N]>
        ? RootModelType[N]["effects"][K]
        : K extends ModelReducerKeys<RootModelType[N]>
        ? RootModelType[N]["reducers"][K]
        : // 默认 ModelState
          RootModelType[N]["state"]
      : // namespace 不存在
        never
    : // 不符合 `{namespace}/{key}`
      never;

/**
 * actionType 允许 AllModelActionTypes 和 ModelKeys<ModelType>
 */
export type PutDispatch<M extends ModelType> = <
  R = any,
  T extends AllModelActionTypes | ModelKeys<M> =
    | AllModelActionTypes
    | ModelKeys<M>
>(
  action: PutAction<
    GetEffectParamValue<PutDispatchPayload<M, T>, "param">,
    M,
    T
  >
) => GetEffectParamValue<PutDispatchPayload<M, T>, "return", R>;

/**
 * 根据 ModelType、namespace 和 key，取 ModelType 中 effect 和 reducer 定义的类型
 */
export type PutDispatchPayload<
  M,
  T extends AllModelActionTypes | ModelKeys<M>
> = T extends AllModelActionTypes
  ? DispatchPayload<T>
  : M extends ModelType
  ? T extends ModelKeys<M>
    ? T extends ModelEffectKeys<M>
      ? M["effects"][T]
      : T extends ModelReducerKeys<M>
      ? M["reducers"][T]
      : M["state"]
    : never
  : never;

/**
 * !! 待完善
 * 重新定义 connect 方法，添加 mapStateToProps，mapDispatchToProps 方法中参数的类型
 * 建议使用 @/hooks/useSelector 函数代替 connect
 */
// export function connect(mapStateToProps?: (s: ConnectState) => any, mapDispatchToProps?: (d: Dispatch) => any) {
//   return umiConnect(mapStateToProps, mapDispatchToProps);
// }
export type EffectType = "takeEvery" | "takeLatest" | "watcher" | "throttle";
export interface ReducerEnhancer {
  (reducer: Reducer<any>): void;
}
export type SubscriptionsMapObject<M extends ModelType = any> = Record<
  string,
  Subscription<M>
>;
export type Subscription<M extends ModelType = any> = (
  api: SubscriptionAPI<M>,
  done: Function
) => void;

export interface SubscriptionAPI<M extends ModelType = any> {
  history: History & { listen: (fn: (v: Location) => any) => void };
  dispatch: PutDispatch<M>;
}

export type Reducer<S = any, A extends Action = any> = (
  state: S,
  action: A
) => S | void;
export type Effect<P = any, M extends ModelType = any, R = any> = (
  action: Action<P>,
  effects: EffectsCommandMap<M>
) => Generator<any, R, any> | void;
export type EffectWithType<P = any, M extends ModelType = any, R = any> = [
  Effect<P, M, R>,
  { type: EffectType }
];
export type EffectsMapObject = Record<string, Effect | EffectWithType>;
export type ReducersMapObject<State = any, A extends Action = any> = {
  [K in keyof State]: Reducer<State[K], A>;
};

export type SelectFunction = (state: ConnectState) => any;

export interface EffectsCommandMap<M extends ModelType = any> {
  put: PutDispatch<M>;
  select: (fn: SelectFunction) => any;

  call: Function;
  take: Function;
  cancel: Function;

  [key: string]: any;
}

/**
 * 重新定义 Model 添加范型
 * 但是 yield 执行的方法 无法获取返回值的类型，可以使用 ReturnType<typeof function>获取
 */
export interface Model<State = any> {
  namespace: string;
  state?: State;
  effects?: EffectsMapObject;
  reducers?: ReducersMapObject | [ReducersMapObject, ReducerEnhancer];
  subscriptions?: SubscriptionsMapObject;
}

/**
 * 所有的 Model 都应继承自 ModelType
 */
export interface ModelType<
  N extends string = any, //
  S = any,
  E extends object = {},
  // 如果没有传入 reducers，默认添加了一个 save，用于保存 state
  R extends object = { save: Partial<S> }
> {
  namespace: N;
  state: S;
  /** 值为 payload 传参 */
  effects: E;
  /** 值为 payload 传参 */
  reducers: R;
}

/**
 * 用于将 ModelType 中的 effect 和 reducer 参数转换成，Effect 和 Reducer 的泛型
 */
export interface BaseModel<T extends ModelType> extends Model<T["state"]> {
  namespace: T["namespace"];
  state: T["state"];
  effects: {
    /* 将泛型参数赋给 Effect */
    [K in keyof T["effects"]]:
      | Effect<
          GetEffectParamValue<T["effects"][K], "param">,
          T,
          GetEffectParamValue<T["effects"][K], "return", any>
        >
      | EffectWithType<
          GetEffectParamValue<T["effects"][K], "param">,
          T,
          GetEffectParamValue<T["effects"][K], "return", any>
        >;
  };
  reducers: {
    /* 将泛型参数赋给 Reducer */
    [K in keyof T["reducers"]]: Reducer<T["state"], Action<T["reducers"][K]>>;
  };
  subscriptions?: SubscriptionsMapObject<T>;
  /** 该变量只是为了获取 T 的类型，非必需，所以使用了问号 */
  modelType?: T;
}

/**
 * generator 返回参数中函数的返回值类型
 */
interface GeneratorCall {
  <T extends Function>(fn: T): Generator<any, FuncReturnType<T>, any>;
}

interface GeneratorSelect {
  <T extends (s: ConnectState) => any>(select: Function, fn: T): T extends (
    s: ConnectState
  ) => infer R
    ? Generator<any, R, any>
    : Generator<any, any, any>;
}

/** 包裹一层 generator 函数，使其可以获取返回值的类型 */
// @ts-ignore 以 GeneratorCall 为准。函数类型推断不太一致，所以这里忽略一下
export const callWrapper: GeneratorCall = function* (fn: () => any) {
  return yield fn();
};

/*
// 这种方法也可以获取 call 的返回值，但是没有办法限制方法传参
export const callWrapper: GeneratorCall = function*(call: Function, fn: Function, ...args: any[]) {
  return yield call(fn, ...args);
};
*/

/** 包裹一层 generator 函数，使其可以获取返回值的类型 */
// @ts-ignore 以 GeneratorSelect 为准。函数类型推断不太一致，所以这里忽略一下
export const selectWrapper: GeneratorSelect = function* (
  select: Function,
  fn: SelectFunction
) {
  return yield select(fn);
};
