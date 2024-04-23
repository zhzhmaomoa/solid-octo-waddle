import {baseUrl} from "../../env.js"
let width = 0;
let height = 0;
let canvas = undefined;
let ctx = undefined;
let img = undefined;
let playGround = undefined;
let canvasFrameId = undefined;
Component({
  lifetimes:{
    attached:function(){
      this.createSelectorQuery()
        .select('#canvas')
        .fields({
          node: true,
          size: true,
        })
        .exec(this.init.bind(this))
    }
  },
  properties:{
    diamondFuture:''
  },
  methods: {
    init(res) {
      width = res[0].width;
      height = res[0].height;
      canvas = res[0].node
      ctx = canvas.getContext('2d')
      const dpr = wx.getSystemInfoSync().pixelRatio
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr,dpr)
      const imgTemp = canvas.createImage();
      imgTemp.onload = ()=>{
        img  = imgTemp
      }
      imgTemp.src = baseUrl+'/redemptionImg/diamond.png'
    },
    render(){
      if(playGround){
        playGround.destory();
      }
      playGround = new PlayGround(parseInt( this.data.diamondFuture/1000 + ''));
    }
  }
})
class PlayGround{
  constructor(wave){
    this.wave = wave;
    this.startTime;
    this.circleList = [];
    this.createCircleList();
    canvasFrameId = canvas.requestAnimationFrame(this.render.bind(this));
  }
  destory(){
    canvas.cancelAnimationFrame(canvasFrameId)
    ctx.clearRect(0,0,width,height)
  }
  createCircleList(){
    let num = 0;
    let timer = setInterval(()=>{
      if(num >= this.wave || num >=20){
        clearInterval(timer);
        timer = null;
      }
      this.circleList.push(
        new Circle(0,30,10,300,0,	100,0.3),
        new Circle(width,30,10,-300,0,	100,0.3),
        new Circle(0,0,10,200,100,	100,0.3),
        new Circle(width,0,10,-200,100,	100,0.3),
        new Circle(30,0,10,50,0,	100,0.3),
        new Circle(width-30,0,10,-50,0,	100,0.3),
        new Circle(60,0,10,50,0,	100,0.3),
        new Circle(width-60,0,10,-50,0,	100,0.3),
        new Circle(90,0,10,50,0,	100,0.3),
        new Circle(width-90,0,10,-50,0,	100,0.3)
      );
        num++;
    },1000)
  }
  checkCircleCollision(){
    this.circleList.forEach( ( circle )=>{ circle.colliding=false })
    for( let i=0; i<this.circleList.length; i++ ){
      for( let j=i+1; j<this.circleList.length; j++ ){
        this.circleList[i].checkCollideWith( this.circleList[j] );
      }
    }
  }
  computeInternal(now){
    if(!this.startTime){
      this.startTime = now;
    }
    const internal = (now-this.startTime)/1000;
    this.startTime = now;
    return internal;
  }
  render(now){
    const internal = this.computeInternal(now);
    ctx.clearRect(0,0,width,height);
    for(let i = 0; i < this.circleList.length;i++){
      this.circleList[i].move(internal);
      this.circleList[i].checkEdgeCollision();
      this.circleList[i].draw();
    }
    this.checkCircleCollision();
    canvasFrameId = canvas.requestAnimationFrame(this.render.bind(this))
  }
}
class Circle{
  constructor(x,y,r,vx,vy,m,cor){
    this.x = x;
    this.y = y;
    this.r = r;
    this.vx = vx;
    this.vy = vy;
    this.colliding = false;
    this.m = m;
    this.cor = cor;
  } 
  move(internal){
    this.x += this.vx * internal;
    if(!this.colliding){
      this.vy += internal* 980;
    }
    this.y += this.vy * internal;
  }
  draw(){
    if(!img)return;
    ctx.drawImage(img,this.x,this.y,this.r * 2 ,this.r * 3)
  }
  checkCollideWith(that){
    const squareDistance = Math.pow( ( this.x-that.x ), 2 ) 
      + Math.pow( ( this.y-that.y ), 2 );
    const squareRadius = Math.pow( this.r+that.r, 2 );
    if( squareRadius>=squareDistance ){
      this.colliding=true;
      that.colliding=true;
      this.changeSpeed(that);
    }
  }
  changeSpeed(that){
    const thisHorizontalSpeed = new Vector( this.vx, 0 ),
      thisVerticalSpeed = new Vector( 0, this.vy );
    const thisSpeed = thisHorizontalSpeed.add( thisVerticalSpeed );
    const thatHorizontalSpeed = new Vector( that.vx, 0 ),
      thatVerticalSpeed = new Vector( 0, that.vy);
    const thatSpeed = thatHorizontalSpeed.add( thatVerticalSpeed );
    
    const interCenterLine = new Vector( this.x-that.x, this.y-that.y )
    const iclNorm = interCenterLine.normlize();
    const tangentNorm = new Vector( -iclNorm.y, iclNorm.x );
    const thisSpeedValueIclDirection = thisSpeed.dotProduct( iclNorm ),
      thisSpeedValueTangentDirection  = thisSpeed.dotProduct( tangentNorm );
    const thatSpeedValueIclDirection = thatSpeed.dotProduct( iclNorm ),
      thatSpeedValueTangentDirection  = thatSpeed.dotProduct( tangentNorm );

    const cor = Math.min(this.cor, that.cor);
    const newThisSpeedValIclDir = cor * ( thisSpeedValueIclDirection*( this.m-that.m )+2*that.m*thatSpeedValueIclDirection )/( this.m+that.m ),
      newThatSpeedValIclDir = cor *  ( thatSpeedValueIclDirection*( that.m-this.m )+2*this.m*thisSpeedValueIclDirection )/( this.m+that.m );
    if(newThisSpeedValIclDir<newThatSpeedValIclDir){
      return;
    }
    const newThisSpeedIclDirection = iclNorm.multiply( newThisSpeedValIclDir ),
      newThisSpeedTangentDirection = tangentNorm.multiply( thisSpeedValueTangentDirection ),
      newThatSpeedIclDirection  = iclNorm.multiply( newThatSpeedValIclDir ),
      newThatSpeedTangentDirection = tangentNorm.multiply( thatSpeedValueTangentDirection );
    const newThisSpeed = newThisSpeedIclDirection.add( newThisSpeedTangentDirection ),
      newThatSpeed = newThatSpeedIclDirection.add( newThatSpeedTangentDirection );
    this.vx = newThisSpeed.x;
    this.vy = newThisSpeed.y;
    that.vx = newThatSpeed.x;
    that.vy = newThatSpeed.y;
  }
  checkEdgeCollision(){
    const cor = 0.8;    
    const {x,y,r,vx,vy} = this;
    if(x >= width - r * 2 ){
      this.vx = -vx * cor;
      this.x = width - r * 2;
    }else if(x <= r){	
      this.vx = -vx * cor;
      this.x = r;
    }
    if(y >= height - r * 3 ){ 
      this.vy = -vy * cor ;
      this.y = height - r * 3;
    }else if( y <= r){
      this.vy = -vy * cor;
      this.y = r;
    }
  }
}
class Vector{
  constructor(x,y){
    this.x = x;
    this.y = y;
  }
  add(that){
    return new Vector( this.x+that.x, this.y+that.y );
  }
  normlize(){
    const distance = Math.sqrt( this.x*this.x + this.y*this.y );
    return new Vector( this.x/distance, this.y/distance );
  }			
  dotProduct( that ){
    return ( this.x*that.x + this.y*that.y );
  }
  multiply( value ){
    return new Vector( this.x*value, this.
    y*value );
  }
}
