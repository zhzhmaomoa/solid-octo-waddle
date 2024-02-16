// app.js
import {netQuery,assetsQuery,assetsUpload,assetsDelete} from "./utils/request.js"
App({
  netQuery,
  assetsQuery,
  assetsUpload,
  assetsDelete,
  onLaunch() {
  },
  globalData: {
    userInfo: null
  },
   
})