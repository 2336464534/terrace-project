<template>
  <div class="content">
    <bread-crumb :bread="bread"></bread-crumb>
    <div class="main">
      <el-container>
        <baidu-map class="mapTracking" @ready="handler" :center="center" :zoom="16">
          <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
          <bm-control>
            <div class="vehicleText">{{vehicleInfo.vehicleNo}}</div>
          </bm-control>
          <bm-overlay
            pane="labelPane"
            @draw="draw" 
            :position="{lng:center.lng,lat:center.lat}" 
            ref="customOverlay" 
            class="trackOverlay">
            <img src="../../../static/img/icon-truck.png">
            <!-- <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione incidunt sit accusantium nobis, id impedit soluta quo in. Asperiores consectetur nobis fugiat debitis dignissimos cumque voluptatum praesentium sequi, placeat a!</div> -->
          </bm-overlay>
        </baidu-map>
      </el-container>
    </div>
  </div>
</template>
<script>
  import mixins from '../../../static/js/mixins.js'
import { instance } from '../../../static/js/bus.js'
import BreadCrumb from '../nav/BreadCrumb'
  export default {
    mixins:[mixins],
    data(){
      return {
        bread:[
          {
            name:'部标监控'
          },
          {
            name:'地图监控',
            path:'/mapmonitor'
          },
          {
            name:'跟踪'
          }
        ],
        center:{
          lng:112,
          lat:98
        },
        vehicleInfo:{}
      }
    },
    components:{
      BreadCrumb
    },
    watch:{
      position:{
        handler(){
          this.$refs.customOverlay.reload();
        },
        deep:true
      }
    },
    methods:{
      // 页面加载
      handler(){
        let id=JSON.parse(sessionStorage.getItem('positionVehicleId'));
        this.getPositionInfo(id);
      },
      getPositionInfo(id){
        instance.post('/jt808Monitor/vehiclePosition',id).then(res=>res.data).then(res=>{
          if(res.code==0){
            this.center=res.data.geo;
            this.vehicleInfo=res.data;
          }else{
            this.notifyError(res.errorMsg)
          }
        })
      },
      draw({el, BMap, map}){
        const pixel=map.pointToOverlayPixel(new BMap.Point(this.center.lng,this.center.lat));
        el.style.left=pixel.x+'px';
        el.style.top=pixel.y+'px';
      }
    },
    created(){
      // 缓存当前车辆ID
      if(this.$route.query.id){
        sessionStorage.setItem('positionVehicleId',JSON.stringify({
          vehicleId:this.$route.query.id
        }));
      }
    }
  }
</script>
<style lang="scss" scoped>
  .mapTracking{
    width: 100%;
    height: 600px;
    .vehicleText{
      position: absolute;
      left:15px;
      top:15px;
      padding:9px 15px;
      color: rgb(36, 140, 243);
      background: #ebf4fcf8;
      border:1px solid rgb(116, 180, 243);
      border-radius: 3px;
      font-size: 14px;
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      cursor: text;
    }
    .trackOverlay{
      position: absolute;
    }
  }
</style>