// app.js
import {assetsUrl} from "./env.js"
App({
  globalData: {
    navSafeTop: 88,
    statusBarHeight: 20,
    navBarHeight: 44
  },
  audioManager:null,
  onLaunch() {
    this.audioManager = wx.getBackgroundAudioManager();
    this.computeNavMetrics();
    this.loadTabBarFont();
  },
  computeNavMetrics() {
    try {
      const info = wx.getWindowInfo();
      // 状态栏高度（如刘海/打孔区域上方安全高度）
      const statusBarHeight = info.statusBarHeight || 20;
      // 右上角胶囊按钮尺寸与位置（不同机型差异较大）
      const menu = wx.getMenuButtonBoundingClientRect();
      // 胶囊与状态栏之间的间距，顶部和底部通常近似对称
      const gap = menu.top - statusBarHeight;
      // 自定义导航栏高度 = 上间距 + 胶囊高度 + 下间距
      const navBarHeight = gap + menu.height + gap;
      // 页面内容起始安全高度（状态栏 + 导航栏 + 额外视觉间距）
      const navSafeTop = statusBarHeight + navBarHeight + 16;
      this.globalData = {
        ...this.globalData,
        statusBarHeight,
        navBarHeight,
        navSafeTop
      };
    } catch (e) {
      // 极端情况下取值失败时使用兜底，避免页面顶到状态栏
      this.globalData = {
        ...this.globalData,
        navSafeTop: 88
      };
    }
  },
  loadTabBarFont() {
    wx.loadFontFace({
      family: "Rouge Script",
      source: 'url("https://cdn.jsdelivr.net/fontsource/fonts/rouge-script@latest/latin-400-normal.ttf")',
      global: true,
      success: () => {
        // console.info("Rouge Script font loaded");
      },
      fail: (err) => {
        console.warn("Rouge Script font load failed, fallback applied", err);
      }
    });
  },
  playBgMusic(){
    this.audioManager.title="芭蕾之梦"
    let curMusicSrc = (Math.random()>=0.5?"/bg-music1.mp3":"/bg-music2.mp3")
    this.audioManager.src = assetsUrl + curMusicSrc;
    this.audioManager.coverImgUrl = "https://p2.music.126.net/FeOhv22HrhXE_WlLpSVhlA==/109951169045281180.jpg"
    this.audioManager.singer = "Echo Lab"
    this.audioManager.epname = "奥比岛手游原声带 雾月交响"
    this.audioManager.playbackRate = 0.8;
    this.audioManager.onEnded(()=>{
      curMusicSrc = curMusicSrc==='/bg-music1.mp3' ? "/bg-music2.mp3" :"/bg-music1.mp3"
      this.audioManager.src = assetsUrl + curMusicSrc;
    })
  },
  onShow(){
    this.playBgMusic()
  }
})
