// app.js
import {assetsUrl} from "./env.js"
App({
  audioManager:null,
  onLaunch() {
    this.audioManager = wx.getBackgroundAudioManager();
    this.loadTabBarFont();
  },
  loadTabBarFont() {
    wx.loadFontFace({
      family: "Rouge Script",
      source: 'url("https://cdn.jsdelivr.net/fontsource/fonts/rouge-script@latest/latin-400-normal.ttf")',
      global: true,
      success: () => {
        console.info("Rouge Script font loaded");
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
