// 获取当前的用户名称即手机号
import { makeAutoObservable, runInAction } from "mobx";
import { http } from "../utils";

class UserStore {
  userInfo = {}
  constructor(){
    makeAutoObservable(this)
  } 
  async getUserInfo(){
    // 调用接口数据
    const res = await http.get('/admin/info')
    runInAction(()=>{
      this.userInfo = res.data
    })
  }
}
export default UserStore