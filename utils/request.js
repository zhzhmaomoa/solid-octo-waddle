import { resourceAppid, resourceEnv } from "../env.js"
const baseUrl = 'http://192.168.1.26:80/api';
const dev = 0;

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
        console.log(error);
        console.log('重启'+number);
        if (error.indexOf("Cloud API isn't enabled") != -1 && number < 3) {
            setTimeout(function () {
              that.netQuery(method, path, data, number +1)
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
             assetsQuery(fileList,number+1);
          }, 300)
      } else {
        throw new Error(`微信云托管调用失败${error}`)
      }
    }
}

export async function assetsUpload(localFilePath,fileName,cloudFolderName="memories") {
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
    const res = await this.cloud.uploadFile({
      cloudPath: cloudFolderName+'/'+fileName, // 对象存储路径，根路径直接填文件名，文件夹例子 test/文件名，不要 / 开头
      filePath:localFilePath, // 微信本地文件，通过选择图片，聊天文件等接口获取
    })
    return res.fileID;
  }
  catch (e) {
    console.log(error);
    wx.showToast({
      title:e,
      icon:'error'
    })
  }
}
export async function assetsDelete(cloudFilePath) {
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
    await this.cloud.deleteFile({
      fileList: [cloudFilePath], // 对象存储文件ID列表，最多50个，从上传文件接口或者控制台获取
    })
  }
  catch (e) {
    console.log(error);
    wx.showToast({
      title:e,
      icon:'error'
    })
  }
}
