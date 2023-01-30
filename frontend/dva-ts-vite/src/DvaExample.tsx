import { useDispatch, useSelector } from "./hooks";

export default function DvaExample() {
  const dispatch = useDispatch();
  // state 类型已设置为 ConnectState
  const userInfo = useSelector((state) => state.global.userInfo);
  const loading = useSelector(
    // effects 支持提示
    (s) => s.loading.effects["global/updateUserInfo"]
  );

  async function handleDispatchClick() {
    // type 会有提示和校验
    // payload 有参数提示和校验，点击具体参数也能跳转过去
    dispatch({
      type: "global/save",
      payload: { userInfo: { id: "111", username: "1234234" } },
    });

    dispatch({
      type: "global/updateUserInfo",
      payload: { id: "111", username: "adslkfjalksdf" },
    });

    // result 有类型
    const result = await dispatch({
      type: "global/effectReturn",
      payload: { params: "ss" },
    });
  }

  return (
    <div>
      <div>loading: {loading ? "加载中..." : "false"}</div>
      <div>username: {userInfo.username}</div>
      <button onClick={handleDispatchClick}>dispatch</button>
    </div>
  );
}
