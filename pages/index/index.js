const app = getApp()
Page({
  data: {
    hasAirplaneTakenOff:false,
    images:[{
        src:undefined,
        class:undefined,
        title:undefined,
        date:undefined
      }],
    date:'',
    title:''
  },
  onReady(){
    this.handleQuery();
  },
  toggleAirplaneStatus(){
    this.setData({
      hasAirplaneTakenOff:!this.data.hasAirplaneTakenOff
    })
  },
  toChart(){
    wx.navigateTo({
      url: '/pages/chart/chart',
    })
  },
  toMap(){
    wx.navigateTo({
      url: '/pages/map/map',
    })
  },
  async handleQuery(){
    try {
      const res = await app.netQuery("GET","/memory/latest");
      const processedRes = res.reverse().map((item,index)=>{
        if(res.length-2===index){
          this.setData({
            date:item.date,
            title:item.title,
          })
          return {
            ...item,
            class:'centerImage'
          }
        }else if(res.length-3 ===index){
          return {
            ...item,
            class:'leftImage'
          }
        } else if(res.length-1===index){
          return {
            ...item,
            class:'rightImage'
          }
        }else{
          return {
            ...item,
            class:'leftOtherImage'
          }
        }
      })
      this.setData({
        images:processedRes
      })
    } catch (error) {
      console.log(error)
    }
  },
  toggleImage(e){
    const {pattern,patternIndex} = e.currentTarget.dataset;
    if(pattern==="leftImage"){
      const images = this.data.images;
      images[patternIndex-1]&&(images[patternIndex-1].class = "leftImage")
      images[patternIndex].class = "centerImage"
      images[patternIndex+1]&&(images[patternIndex+1].class = "rightImage")
      images[patternIndex+2]&&(images[patternIndex+2].class = "rightOtherImage")
      this.setData({
        images,
        date:images[patternIndex].date,
        title:images[patternIndex].title,
      })
    }else if(pattern === "rightImage"){
      const images = this.data.images;
      images[patternIndex+1]&&(images[patternIndex+1].class = "rightImage");
      images[patternIndex].class = "centerImage"
      images[patternIndex-1]&&(images[patternIndex-1].class = "leftImage")
      images[patternIndex-2]&&(images[patternIndex-2].class = "leftOtherImage")
      this.setData({
        images,
        date:images[patternIndex].date,
        title:images[patternIndex].title,
      })
    }
  }
})