import {baseUrl} from "../env"
export function query(data){
  return new Promise((resolve,reject)=>{
    wx.request({
      url:baseUrl+"/api/redemptionCode",
      data,
      method:'GET',
      header:{
        'Content-Type':'application/x-www-form-urlencoded'
      },
      success(res){
        if(res.data.code===200){
          resolve(res.data.data);
        }else{
          reject(res.data.message)
        }
      },  
      fail(e){
        reject(e);
      }
    })
  })
}