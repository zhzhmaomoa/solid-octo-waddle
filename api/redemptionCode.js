import {baseUrl} from "../env"
export function getLatest(data){
  wx.request({
    url:baseUrl+"/",
    data,
    method:'GET',
    success(res){
      console.log(res)
    },  
    fail(e){
      console.error(e);
    }
  })
}