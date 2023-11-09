import { resourceAppid, resourceEnv } from "../env.js"
const baseUrl = 'http://10.154.1.49:8080/api';
const dev = 1;

export function netQuery(method = 'GET', path, data = {},number=0) {
  return new Promise(async (resolve,reject)=>{
    const fail = (err) => {
      wx.showToast({
        title:err,
        icon:'error'
      })
      reject(err);
    }
    const success = (res) => {
        const { data } = res;
        if (data.code) {
          wx.showToast({
            title:data.message,
            icon:'error'
          })
          reject(data);
        } else {
          wx.showToast({
            title:data.message,
            icon:'success'
          })
          resolve(data.data);
        }
      };
    //服务器在本地环境
    if (dev) {
      wx.request({
        url: baseUrl + path,
        method,
        success,
        fail,
        data
      })
    }
    //服务器在微信托管环境
    else {
      const that = this
      if (that.cloud == null) {
        console.log("初始化云托管环境");
        that.cloud = new wx.cloud.Cloud({
          resourceAppid, // 微信云托管环境所属账号，服务商appid、公众号或小程序appid
          resourceEnv, // 微信云托管的环境ID
        })
        await that.cloud.init() // init过程是异步的，需要等待init完成才可以发起调用
      }
      try {
        that.cloud.callContainer({
          path: '/api' + path,// 填入业务自定义路径和参数，根目录，就是 / 
          method, // 按照自己的业务开发，选择对应的方法
          header: {
            'X-WX-SERVICE': 'express-lbcw', // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
          },
          success,
          fail,
          data
        })
      }
      catch (e) {
        const error = e.toString()
        // 如果错误信息为未初始化，则等待300ms再次尝试，因为init过程是异步的
        if (error.indexOf("Cloud API isn't enabled") != -1 && number < 3) {
            setTimeout(function () {
              resolve(that.netQuery(method, path, data, number +1))
            }, 300)
        } else {
          throw new Error(`微信云托管调用失败${error}`)
        }
      }
    }
  })
}

export async function assetsQuery(fileList,number=0) {
    const that = this
    if (that.cloud == null) {
      console.log("初始化云托管环境");
      that.cloud = new wx.cloud.Cloud({
        resourceAppid, // 微信云托管环境所属账号，服务商appid、公众号或小程序appid
        resourceEnv, // 微信云托管的环境ID
      })
      await that.cloud.init() // init过程是异步的，需要等待init完成才可以发起调用
    }
    try {
      const result =  await that.cloud.getTempFileURL({fileList});
      return result;
    }
    catch (e) {
      const error = e.toString()
      // 如果错误信息为未初始化，则等待300ms再次尝试，因为init过程是异步的
      if (error.indexOf("Cloud API isn't enabled") != -1 && number < 3) {
          setTimeout(function () {
            return assetsQuery(fileList,number+1);
          }, 300)
      } else {
        throw new Error(`微信云托管调用失败${error}`)
      }
    }
}

