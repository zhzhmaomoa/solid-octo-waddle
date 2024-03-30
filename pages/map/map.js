import {query} from "../../api/member.js"
import {citys} from "../../assets/citys.js"
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
    this.handleQuery();
  },
  async handleQuery(){
    try {
      const arr = await query({'pageNum':1,'pageSize':50})
      const markers = arr.map((item,index)=>{
        const citysIndex = citys.findIndex((city)=>{return item.province===city.name});
        const {subordinate,index:subordinateIndex} = citys[citysIndex];
        const city = subordinate[subordinateIndex];
        citys[citysIndex].index = (subordinate.length>subordinateIndex+1) ?(subordinateIndex+1):0;
        return {
          id: index,
          latitude:city.latitude,
          longitude:city.longitude,
          title:item.name,
          iconPath:item.iconPath,
          width:'50px',
          height:'50px'
        }
      })
      this.setData({
        markers
      })
      console.log(markers)
    } catch (error) {
      console.error(error)
    }
  }
})