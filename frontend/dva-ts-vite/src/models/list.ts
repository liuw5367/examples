import { queryUserList, UserListRequest } from "..//services/user";
import {
  BaseModel,
  callWrapper,
  EffectParam,
  ModelType,
  PromiseReturnType,
} from "../dva";

export interface ListState {
  name: string;
}

const initState: ListState = {
  name: "",
};

interface Effects {
  /**
   * UserListRequest 为 dispatch 触发 queryList 的参数
   * PromiseReturnType<typeof queryList> 为 dispatch 函数的返回值
   */
  queryList: EffectParam<UserListRequest, PromiseReturnType<typeof queryUserList>>;
}

export type ListModelType = ModelType<"list", ListState, Effects>;

const ListModel: BaseModel<ListModelType> = {
  namespace: "list",
  state: initState,
  effects: {
    *queryList({ payload }) {
      return yield* callWrapper(() => queryUserList(payload));
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};

export default ListModel;
