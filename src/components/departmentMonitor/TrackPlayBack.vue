<template>
  <div class="content">
    <bread-crumb :bread="bread"></bread-crumb>
    <div class="main">
      <div class="clearfix mb15">
        <el-date-picker
          v-model="dateTime"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          range-separator="至"
          :default-time="['12:00:00']" 
          size="small" 
          style="width:500px" 
          class="mr10" :disabled="loading" 
          @change="getTime">
        </el-date-picker>
        <el-button size="small" :loading="loading" type="primary" class="ml10">查询</el-button>
        <el-button v-show="show" circle size="small" class="pull-right" @click="handlerPlay"><i :class="['iconfont',isPlay?'icon-shanguangdeng':'icon-shanguangdeng-guanbi']"></i></el-button>
      </div>
      <el-alert type="warning" show-icon title="请注意: 数据量过大可能会导致回放不准确，请谨慎选择时间跨度！" class="mb10"></el-alert>
      <baidu-map :center="center" :zoom="zoom" @ready="handler" class="mapTracking">
        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
        <!-- <bm-driving start="天安门" end="百度大厦" @searchcomplete="handleSearchComplete" :panel="false" :autoViewport="true"></bm-driving> -->
        <bm-marker :position="startPosition" :icon="startIcon"></bm-marker>
        <bm-marker :position="endPosition" :icon="endIcon"></bm-marker>
        <template v-for="(item,index) in polyline" v-if="polyline.length">
          <bm-polyline 
            :path="item.geos" 
            :stroke-color="item.color" 
            :stroke-opacity="1" 
            :stroke-weight="5" 
            :editing="false"
            :key="index">
          </bm-polyline>
        </template>

        <bml-lushu
          @stop="reset"
          :path="path"
          :icon="icon"
          :play="play"
          :rotation="true" 
          :speed="5000">
        </bml-lushu>
      </baidu-map>
    </div>
  </div>
</template>
<script>

  import mixins from '../../../static/js/mixins';
  import BreadCrumb from "../nav/BreadCrumb";
  import { instance } from '../../../static/js/bus';
  import {BmlLushu} from 'vue-baidu-map'
  export default {
    mixins:[mixins],
    data(){
      return {
        center:{
          lng:116.404, 
          lat:39.915
        },
        zoom:10,
        dateTime:[new Date(new Date(new Date().toLocaleDateString()).getTime()), Date.now()],
        bread:[
          {
            name:'部标监控',
          },{
            name:'地图监控',
            path:'/mapmonitor'
          },{
            name:'轨迹回放'
          }
        ],
        searchKeys:{
          startTime:null,
          endTime:null,
          termId:''
        },
        loading:false,
        play:false,
        path:[],
        polyline:[],
        icon: {
          // url: '../../../static/img/icon-truck.png',
          url:'http://api.map.baidu.com/library/LuShu/1.2/examples/car.png',
          size: {width: 52, height: 26},
          opts: {anchor: {width: 27, height:13}}
        },
        startIcon:{
          url:'../../../static/img/start.png',
          size:{width:32, height:32},
          opts: {anchor: {width:13,height:13}}
        },
        endIcon:{
          url:'../../../static/img/end.png',
          size:{width:32, height:32},
          opts: {anchor: {width:13,height:13}}
        },
        startPosition:{},
        endPosition:{},
        isPlay:false,
        show:false,

      }
    },
    components:{
      BreadCrumb,
      BmlLushu
    },
    methods:{
      /**
       * 地图加载完成设置初始请求数据
       * @function getVehiclePlatBack 请求数据
       *  */
      handler(){
        this.$set(this.searchKeys,'termId',sessionStorage.getItem('playBackTermId'));
        this.getVehiclePlayBack();
      },
      // 路径数据
      /***
       * 
       * 
       */
      getVehiclePlayBack(){
        this.loading=true;
        instance.post('/jt808Monitor/vehicleHistoryPosition',this.searchKeys).then(res=>res.data).then(res=>{
          this.loading=false;
          if(res.code==0){
            if(res.data.positionList.length==0){
              this.notifyWarning('当前时间段内暂无数据');
            }else{
              if(res.data.positionList.length>0){
                this.polyline=res.data.positionList;
                res.data.positionList.forEach(element => {
                  element.geos.forEach(child=>{
                    this.path.push({lng:child.lng,lat:child.lat});
                  })
                });
              }
              this.startPosition={
                lng:res.data.startGeo.lng,
                lat:res.data.startGeo.lat
              }
              this.endPosition={
                lng:res.data.endGeo.lng,
                lat:res.data.endGeo.lat
              }
              this.$set(this.center,'lng',(res.data.startGeo.lng+res.data.endGeo.lng)/2);
              this.$set(this.center,'lat',(res.data.startGeo.lat+res.data.endGeo.lat)/2);
              this.show=true;
            }
          }
        })
      },
      // 绘制路径
      handleSearchComplete (res) {
        // this.path = res.getPlan(0).getRoute(0).getPath();
        // console.log(res)
      },
      reset(){
        this.play=this.isPlay=false;
      },
      // 路书开关样式
      handlerPlay(){
        this.isPlay=!this.isPlay;
        this.play=!this.play;
      },
      // 修改查询时间
      getTime(val){

        this.searchKeys.startTime=val[0];
        this.searchKeys.endTime=val[1];
        this.onSubmit();
      },
      onSubmit(){
        this.getVehiclePlayBack();
      }
    },
    created(){
      this.$set(this.searchKeys,'startTime',this.dateTime[0]);
      this.$set(this.searchKeys,'endTime',new Date(this.dateTime[1]));
      if(this.$route.query.id){
        sessionStorage.setItem('playBackTermId',this.$route.query.id);
        sessionStorage.setItem('playBackVehicleNo',this.$route.query.no);
      }
    }
  }
</script>
<style lang="scss" scoped>
  .mapTracking{
    width: 100%;
    height: 600px;
    display: block;
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
