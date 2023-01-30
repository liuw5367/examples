export * from './action';
export * from './redux';


/**
 * 获取 Promise 方法返回类型
 * 例：
 * const a: PromiseReturnType<type fn> = yield call(fn, args);
 */
export type PromiseReturnType<S extends Function> = S extends (...args: any[]) => Promise<infer R> ? R : never;

export type PromiseType<T> = T extends Promise<infer R> ? R : T;

export type FuncReturnType<S extends Function> = S extends (...args: any[]) => Promise<infer R>
  ? R
  : S extends (...args: any[]) => infer R
  ? R
  : never;

export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export type DeepPartial<T> = T extends Record<string, any>
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type ValueOf<T> = T[keyof T];
