import {baseUrl} from "../env"
export function query(data){
  return new Promise((resolve,reject)=>{
    wx.request({
      url:baseUrl+"/members",
      data,
      method:'GET',
      // header:{
      //   'Content-Type':'application/x-www-form-urlencoded'
      // },
      success(res){
        if(res.data.isSuccess){
          resolve(res.data.data);
        }else{
          reject(res.data.data)
        }
      },  
      fail(e){
        reject(e);
      }
    })
  })
}