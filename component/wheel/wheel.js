import {baseUrl} from "../../env.js"
Component({
  properties: {
    codes:'',
    codesVisitedList:'',
    timeList:''
  },
  data: {
    rotateFriction:0,
    isDragging:false,
    lastYPosition:0,
    baseUrl,
    containerStyle:''
  },
  methods: {
    handleStageTouchStart(e){
      this.setData({
        isDragging:true,
        lastYPosition:e.touches[0].clientY
      })
    },
    handleStageTouchMove(e){
      if(!this.data.isDragging)return;
      const screenY = e.touches[0].clientY;
      const lastYPosition = this.data.lastYPosition;
      if(screenY-lastYPosition>100){
        this.rollDown()
        this.setData({
          lastYPosition:screenY
        })
      }else if(screenY-lastYPosition< -100){
        this.rollUp()
        this.setData({
          lastYPosition:screenY
        })
      }
    },
    handleStageTouchEnd(){
      this.setData({
        isDragging:false,
        lastYPosition:0
      })
    },
    handleItemClicked(e){
      const {index} = e.currentTarget.dataset;
      if(this.data.codes[index].status === 'current'){
        const item = this.data.codes[index];
        item.clicked = !item.clicked;
        this.setData({
          codes:this.data.codes
        })
      }
    },
    rollDown(){
      const currentEleIndex = this.findCurrent();
      this.setData({
        rotateFriction:--this.data.rotateFriction,
        containerStyle: `transform:rotateX(${this.data.rotateFriction * 60}deg)`
      })
      this.setCurrent(currentEleIndex+1>=this.data.codes.length?0:currentEleIndex+1);
    },
    rollUp(){
      const currentEleIndex = this.findCurrent();
      this.setData({
        rotateFriction:++this.data.rotateFriction,
        containerStyle: `transform:rotateX(${this.data.rotateFriction * 60}deg)`
      })
      this.setCurrent(currentEleIndex-1>=0?currentEleIndex-1:this.data.codes.length-1);
    },
    findCurrent(){
      const index = this.data.codes.findIndex((item)=>{return item.status==='current'})
      return index
    },
    setCurrent(currentEleIndex){
      const prevIndex = currentEleIndex-1>=0?currentEleIndex-1:this.data.codes.length-1;
      const nextIndex = currentEleIndex+1>=this.data.codes.length?0:currentEleIndex+1;
      this.data.codes[prevIndex].status = "prev"
      this.data.codes[nextIndex].status = "next"
      this.data.codes[currentEleIndex].status = "current"
      this.setData({
        codes:this.data.codes
      })
    },
    handleCopy(e){
      const {redemptionCode,index} =  e.currentTarget.dataset
      this.triggerEvent("parentHandleCopy",{redemptionCode,index})
    },
  }
})