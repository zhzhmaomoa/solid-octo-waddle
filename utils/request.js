const baseUrl = 'http://localhost:80/api';
const dev = 1;
export async function netQuery(method = 'GET', path, callback, data) {
  const fail = (err)=>{
    console.log(err);
  }
  const success = (res)=>{
    console.log(res,"res");
    const {data} = res;
    if(data.code){
      console.log(data.err);
    }else{
      callback(data.data);
    }
  }
  //服务器在本地环境
  if (dev) {
    switch (method) {
      case 'GET':
        wx.request({
          url: baseUrl + path,
          method: 'GET',
          success,
          fail,
        });
        break;
      default:
        wx.request({
          url: baseUrl + path,
          method,
          success,
          fail,
          data
        })
    }
//服务器在微信托管环境
  } else {
    const that = this
    if (that.cloud == null) {
      console.log("初始化");
      that.cloud = new wx.cloud.Cloud({
        resourceAppid: 'wx685c2fa8ecc8bf24', // 微信云托管环境所属账号，服务商appid、公众号或小程序appid
        resourceEnv: 'prod-3gjyztj8d29852c2', // 微信云托管的环境ID
      })
      await that.cloud.init() // init过程是异步的，需要等待init完成才可以发起调用
    }
    try {
      switch (method) {
        case 'GET':
          that.cloud.callContainer({
            path:'/api'+path,// 填入业务自定义路径和参数，根目录，就是 / 
            method, // 按照自己的业务开发，选择对应的方法
            header: {
              'X-WX-SERVICE': 'express-lbcw', // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
            },
            success,
            fail
          })
          break;
        default:
          that.cloud.callContainer({
            path:'/api'+path,// 填入业务自定义路径和参数，根目录，就是 / 
            method, // 按照自己的业务开发，选择对应的方法
            header: {
              'X-WX-SERVICE': 'express-lbcw', // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
            },
            success,
            fail,
            data
          })
      }

    } catch (e) {
      const error = e.toString()
      // 如果错误信息为未初始化，则等待300ms再次尝试，因为init过程是异步的
      if (error.indexOf("Cloud API isn't enabled") != -1 && number < 3) {
        return new Promise((resolve) => {
          setTimeout(function () {
            resolve(that.call(obj, number + 1))
          }, 300)
        })
      } else {
        throw new Error(`微信云托管调用失败${error}`)
      }
    }
  }
}
