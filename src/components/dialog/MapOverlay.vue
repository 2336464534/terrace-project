<template>
<bm-overlay
  pane="markerPane"
  @draw="draw"
  ref="customOverlay" class="map-overlay" v-if="vehiclePosition">
    <div class="overlay-container">
      <div class="overlay-header">
        <img src="../../../static/img/vehicle.png">
        <ul>
          <li>{{vehiclePosition.vehicleNo}}</li>
          <li>{{vehiclePosition.driverName}}  {{vehiclePosition.driverMobile}}</li>
        </ul>
      </div>
      <div class="overlay-main">
        <dl class="dl-horizontal dl-overlay">
          <dt>所属企业:</dt>
          <dd>{{vehiclePosition.enterpriseName}}</dd>
        </dl>
        <dl class="dl-horizontal dl-overlay mt8">
          <dt>速度:</dt>
          <dd>{{vehiclePosition.speed}}</dd>
        </dl>
        <dl class="dl-horizontal dl-overlay mt8">
          <dt>所在位置:</dt>
          <dd class="text-overflow">
            <el-tooltip placement="top" effect="dark" :content="vehiclePosition.geo.address" v-if="vehiclePosition.geo">
              <span>{{vehiclePosition.geo.address}}</span>
            </el-tooltip>
          </dd>
        </dl>
        <dl class="dl-horizontal dl-overlay mt8">
          <dt>定位时间:</dt>
          <dd>{{vehiclePosition.gpsTime | timeDayFormat }}  {{vehiclePosition.gpsTime | timeMinuteFormat}}</dd>
        </dl>
      </div>
      <el-button-group class="overlay-footer">
        <el-button type="primary" size="small" icon="el-icon-location-outline" class="overlay-footer-btn" @click="followVehicle">跟踪</el-button>
        <el-button type="primary" size="small" icon="el-icon-view" class="overlay-footer-btn" @click="trackPlayback">轨迹回放</el-button>
      </el-button-group>
    </div>
</bm-overlay>
</template>
<script>
  import mixins from '../../../static/js/mixins'
  export default {
    mixins:[mixins],
    data(){
      return{

      }
    },
    props:['vehiclePosition','position'],
    watch:{
      position:{
        handler(){
          this.$refs.customOverlay.reload();
        },
        deep:true
      },
      vehiclePosition:{
        handler(){
          this.$refs.customOverlay.reload()
        },
        deep:true
      }
    },
    methods:{
      draw ({el, BMap, map}) {
        const {lng, lat} = this.position;
        const pixel = map.pointToOverlayPixel(new BMap.Point(lng, lat));
        el.style.left = pixel.x + 'px';
        el.style.top = pixel.y + 'px';
      },
      // 车辆跟踪
      followVehicle (){
        const {href}=this.$router.resolve({
          name:'tracking',
          query:{id:this.vehiclePosition.vehicleId}
        });
        window.open(href,'_blank')
      },
      // 轨迹回放
      trackPlayback (){
        const {href}=this.$router.resolve({
          name:'trackplayback',
          query:{
            id:this.vehiclePosition.termId,
            no:this.vehiclePosition.vehicleNo
          }
        });
        window.open(href,'_blank')
      }
    },
  }
</script>
<style lang="scss" scoped>
  .map-overlay{
    width: 280px;
    height: auto;
    background: #fff;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 0 5px #000;
    color: #333;
    text-align: center;
    padding: 10px;
    position: absolute;
    box-sizing: border-box;
    z-index: 1001;
    .overlay-header{
      display: flex;
      justify-content: center;
      text-align: left;
      border-bottom:1px solid #ddd;
      padding:4px 0;
      img{
        width: 40px;
        height:40px;
        margin-right:6px;
      }
    }
    .overlay-main{
      margin:10px 0;
      .dl-overlay{
        padding: 0;
        dt{
          color:#606366
        }
      }
    }
  }
  .overlay-footer{
    width: 100%;
    .overlay-footer-btn{
      width: 50%;
    }
  }
</style>
