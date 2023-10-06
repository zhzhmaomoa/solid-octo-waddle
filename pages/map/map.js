Page({
  data: {
    latitude: 34.29078418888973,
    longitude: 108.9314268416977,
    includePoints:[
      {//漠河
        longitude: '122.0758977',
        latitude: '53.9060533'
      },
      {//曾母暗沙
        longitude: '112.3099202',
        latitude: '1.5739308'
      },
      {//帕米尔高原
        longitude: '73.1505362',
        latitude: '38.8598299'
      },
      {//黑龙江乌苏里江交汇
        longitude: '135.8016182',
        latitude: '48.4646511'
      }
    ],
    markers: [{
      id: 1,
      latitude: 23.099994,
      longitude: 113.324520,
      title: 'T.I.T 创意园'
    }]
},
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap')
  },
  getCenterLocation: function () {
    this.mapCtx.getCenterLocation({
      success: function (res) {
        console.log(res.longitude)
        console.log(res.latitude)
      }
    })
  },
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
  translateMarker: function () {
    this.mapCtx.translateMarker({
      markerId: 1,
      autoRotate: true,
      duration: 1000,
      destination: {
        latitude: 23.10229,
        longitude: 113.3345211,
      },
      animationEnd() {
        console.log('animation end')
      }
    })
  },
  includePoints: function () {
    this.mapCtx.includePoints({
      padding: [10],
      points: [{
        latitude: 23.10229,
        longitude: 113.3345211,
      }, {
        latitude: 23.00229,
        longitude: 113.3345211,
      }]
    })
  }
})
