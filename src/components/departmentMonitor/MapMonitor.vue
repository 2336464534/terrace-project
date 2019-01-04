<template>
  <div class="content">
    <bread-crumb :bread="breadCrumb"></bread-crumb>
    <div class="main">
      <el-container>
        <el-aside class="aside-tree">
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText" 
            clearable 
            class="mb10">
          </el-input>
          <div class="tree-badge fz15">
            <label>车辆状态: </label>
            <span><i class="icon-vehicle1 icon-status"></i>行驶中</span>
            <span><i class="icon-vehicle2 icon-status"></i>停止</span>
            <span><i class="icon-vehicle3 icon-status"></i>离线</span>
          </div>
          <div class="tree-badge mt5 mb10 fz15">
            <label>运营状态: </label>
            <span><i class="icon-operate2 icon-status"></i>维修中</span>
            <span><i class="icon-operate1 icon-status"></i>正常</span>
            <span><i class="icon-operate3 icon-status"></i>停运</span>
          </div>
          <!-- show-checkbox 选择框 
              lazy 懒加载 :load 加载子树的方法 
              props 配置选项: {label:节点标签 ／ children:子树 ／ isLeaf:是否为叶子节点 ／ disabled:禁用}
              default-expanded-keys 默认展开的节点的key的数组 default-checked-keys 默认选中 
              node-key 节点数据在树中的唯一值
              @check 复选框被点击时事件触发
                 -->
          <el-tree 
            accordion
            highlight-current
            :data="tree" 
            ref="tree"
            show-checkbox 
            lazy 
            :load="loadChild" 
            :props="defaultProps" 
            node-key="cId"
            :default-expanded-keys="defaultExpanded" 
            :expand-on-click-node="false"
            @check="getChecked" 
            class="tree-content" 
            :filter-node-method="filterNode">
            <div class="tree-node" slot-scope="{node,data}">
              <div v-if="data.type===4">
                <i class="iconfont small-node-icon">&#xe8bf;</i>
                <span>{{data.name}}</span>
              </div>
              <div v-else>
                <i v-if="data.status" :class="'icon-status icon-vehicle'+data.status"></i>
                <i v-if="data.operatingState" :class="'icon-status icon-operate'+data.operatingState"></i>
                {{data.name}}
              </div>
            </div>
          </el-tree>
        </el-aside>
        <el-container>
          <!-- 地图 -->
          <baidu-map 
            :center="center" 
            :zoom="zoom" 
            class="map" 
            style="padding-left:15px;" 
            @click="clearMapLayer">
            <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
            
            <bml-marker-clusterer :averageCenter="true">
              <bm-marker 
                v-for="(marker,index) in markers" 
                :key="index" 
                :position="{lng:marker.geo.lng,lat:marker.geo.lat}" 
                @click="handleClick(marker)">
                <map-overlay 
                  v-show="marker.show" 
                  :vehiclePosition="vehiclePosition" 
                  :position="{lng:marker.geo.lng,lat:marker.geo.lat}">
                </map-overlay>
              </bm-marker>
            </bml-marker-clusterer>

          </baidu-map>
        </el-container>

      </el-container>
    </div>
  </div>
  
</template>
<script>
  import MapOverlay from '../dialog/MapOverlay'
  import {BmlMarkerClusterer} from 'vue-baidu-map'
  import {instance } from '../../../static/js/bus.js'
  import BreadCrumb from '../nav/BreadCrumb'
  import mixins from '../../../static/js/mixins.js'
  export default {
    mixins:[mixins],
    data() {
      return {
        breadCrumb:[
          {
            name:'部标监控'
          },
          {
            name:'地图监控',
            path:'/mapmonitor'
          }
        ],
        center:{
          lng:116.46,
          lat:39.92
        },
        zoom:5,
        filterText:'',
        tree:[],
        defaultProps:{
          label:'name',
          children:'nodes',
          isLeaf:'leaf'
        },
        defaultExpanded:[],
        loading:false,
        markers:[],
        mapOverlay:{
          show:false,
        },
        vehiclePosition:{}
      }
    },
    components:{
      BreadCrumb,
      BmlMarkerClusterer,
      MapOverlay
    },
    watch:{
      filterText(val){
        this.$refs.tree.filter(val);
      }
    },
    methods:{
      // 树节点筛选方法
      filterNode(value,data){
        if(!value) return true;
        return data.name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
      },
      // 加载车辆树
      getMapData(){
        this.loading=true;
        instance.post('/jt808Monitor/treeNodeInit',{})
                .then(res=>res.data)
                .then(res=>{
                  this.loading=false;
                  // 根据nodes.length 判断展开第几层数据
                  if(res.code==0){
                    this.tree=res.data;
                    let setDefaultKeys=[];
                    res.data.forEach(item=>{
                      if(item.nodes.length>0){
                        setDefaultKeys.push(item.cId)
                      }
                      item.nodes.forEach(child=>{
                        if(child.nodes.length>0){
                          setDefaultKeys.push(child.cId)
                        }
                      })
                    })
                    this.defaultExpanded=setDefaultKeys;
                  }else{
                    this.notifyError(res.errorMsg)
                  }
        })
      },
      // 加载子树数据
      loadChild(node,resolve){
        if(node.level===0){
          return resolve(node.data)
        }
        if(node.level===1){
          return resolve(node.data.nodes)
        }
        if(node.level>4) return resolve([])
        let searchKeys={
          type:node.data.type,
          cId:node.data.cId,
          level:1
        }
        instance.post('/treeNode/childList',searchKeys).then(res=>res.data).then(res=>{
          if(res.code==0){
            let result=res.data;
            result.forEach(item=>{
              if(item.type===5){
                this.$set(item,"leaf",true)
              }
            })
            resolve(result)
          }else{
            this.notifyError(res.errorMsg)
          }
        })
      },
      // 复选框判断企业还是车辆
      getChecked(data,checked){
        this.clearMapLayer();
        // 筛选出选择的所有车辆
        let cars=checked.checkedNodes.filter(item=>{
          return item.type===5;
        });
        this.markers=[];
        this.markers=cars;
        // 设置地图中心
        if(cars.length==1){
          this.setMapCenter(cars[0]);
        }
        if(data.type==5){
          this.setMapCenter(data);
        }
      },
      /**
       * @function handleClick 点击marker查看车辆位置
       * @param marker 选择的车辆信息
       * 清空其他覆盖物
       * @param getVehicleInfo
       * */
      handleClick(marker){
        event.stopPropagation();
        this.clearMapLayer();
        this.$set(marker,'show',true);
        this.getVehicleInfo(marker.cId);
      },
      // 获取车辆位置信息
      getVehicleInfo(cId){
        instance.post('/jt808Monitor/vehiclePosition',{vehicleId:cId}).then(res=>res.data).then(res=>{
          if(res.code==0){
            this.vehiclePosition=res.data;
          }else{
            this.notifyError(res.errorMsg)
          }
        })
      },
      // 设置地图中心
      setMapCenter(item){
        this.$set(this.center,'lng',item.geo.lng);
        this.$set(this.center,'lat',item.geo.lat);
      },
      // 清空地图车辆标记
      clearMapCarInfo(){
        this.markers=[];
      },
      // 清空车辆覆盖物信息
      clearMapLayer(){
        this.markers.forEach(el=>{
          this.$set(el,'show',false)
        })
      },
      // 点击车辆坐标显示车辆信息
      handleInfoWindow(data){
        this.$set(this.mapOverlay,'show',true);
      },
    },
    created(){
      this.getMapData();
    },
    mounted() {
      // this.$nextTick(()=>{

      // })
    },
  }  
</script>
<style lang="scss" scoped>
</style>
