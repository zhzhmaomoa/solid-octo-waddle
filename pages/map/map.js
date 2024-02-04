const app = getApp()
Page({
  data: {
    latitude: 34.29078418888973,
    longitude: 108.9314268416977,
    markers: [{
      id: 1,
      latitude: 23.099994,
      longitude: 113.324520,
      title: 'T.I.T 创意园',
      iconPath:'',
      width:'50px',
      height:'50px'
    }]
},
  onReady: function () {
    this.initMarkers();
  },
  initMarkers:async function(){
    try {
      const result = await app.netQuery("GET","/members");
      const iconPaths  = result.map((item)=>{
        return item.iconPath
      })
      const {fileList} =await app.assetsQuery(iconPaths);
      const fileUrls = fileList.map((item)=>{
        return item.tempFileURL;
      })
      let markers = [];
      result.forEach((item,index)=>{
        markers.push({
          ...item,
          title:item.name,
          iconPath:fileUrls[index],
          width:'30px',
          height:'40px',
        })
      })
      console.log(markers);
      this.setData({
        markers
      })
    } catch (error) {
      console.log(error);
    }
  }
})


    // includePoints:[
    //   {//漠河
    //     longitude: '122.0758977',
    //     latitude: '53.9060533'
    //   },
    //   {//曾母暗沙
    //     longitude: '112.3099202',
    //     latitude: '1.5739308'
    //   },
    //   {//帕米尔高原
    //     longitude: '73.1505362',
    //     latitude: '38.8598299'
    //   },
    //   {//黑龙江乌苏里江交汇
    //     longitude: '135.8016182',
    //     latitude: '48.4646511'
    //   }
    // ],