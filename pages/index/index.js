Page({
  data: {
    hasAirplaneTakenOff:false,
    images:[
      {
        src:"/assets/1.jpg",
        class:"leftOtherImage",
        title:'aa',
        date:'1999-12-31'
      },
      {
        src:"/assets/2.jpg",
        class:"leftImage",
      },
      {
        src:"/assets/3.jpg",
        class:"centerImage"
      },
      {
        src:"/assets/4.jpg",
        class:"rightImage"
      },
      {
        src:"/assets/5.jpg",
        class:"rightOtherImage"
      },
    ],
    date:'',
    title:''
  },
  onReady(){
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