<template>
  <div class="content">
    <bread-crumb :bread="bread"></bread-crumb>
    <div class="main">
      <el-card shadow="nerver" class="mb20">
        <div slot="header">
          <p class="m0">基础信息</p>
        </div>
        <div class="dl-half clearfix">
          <dl class="dl-horizontal pull-left">
            <dt>设备序号:</dt>
            <dd>{{deviceDetail.deviceNo}}</dd>
          </dl>
          <dl class="dl-horizontal pull-left">
            <dt>设备类型:</dt>
            <dd>{{deviceDetail.deviceType | equipmentTypeFormat}}</dd>
          </dl>
          <dl class="dl-horizontal pull-left">
            <dt>协议类型:</dt>
            <dd>{{deviceDetail.isWriteoff | isWriteTypeFormt}}</dd>
          </dl>
          <dl class="dl-horizontal pull-left">
            <dt>设备厂商:</dt>
            <dd>{{deviceDetail.manufacturer}}</dd>
          </dl>
          <dl class="dl-horizontal pull-left">
            <dt>设备型号:</dt>
            <dd>{{deviceDetail.deviceModel}}</dd>
          </dl>
          <dl class="dl-horizontal pull-left">
            <dt>指令下发地址:</dt>
            <dd>{{deviceDetail.instructionAddress}}</dd>
          </dl>
          <dl class="dl-horizontal pull-left">
            <dt>终端通讯地址:</dt>
            <dd>{{deviceDetail.postalAdress}}</dd>
          </dl>
        </div>
      </el-card>
      <el-card shadow="nerver" class="mb20">
        <div slot="header">
          <p class="m0">操作信息</p>
        </div>
        <div class="dl-half clearfix">
          <dl class="dl-horizontal pull-left">
            <dt>创建人:</dt>
            <dd>{{deviceDetail.realName}}</dd>
          </dl>
          <dl class="dl-horizontal pull-left">
            <dt>创建时间:</dt>
            <dd>{{deviceDetail.createTime | timeFormat}}</dd>
          </dl>
        </div>
      </el-card>
      <el-row>
        <el-col :span="6" :offset="18" class="text-right">
          <el-button size="small" icon="el-icon-edit" type="primary" @click="edit">编辑</el-button>
          <el-button size="small" icon="el-icon-back" @click="$router.back()">返回</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import BreadCrumb from '../nav/BreadCrumb'
import { instance } from '../../../static/js/bus';
import mixins from '../../../static/js/mixins'
  export default {
    mixins:[mixins],
    data(){
      return {
        deviceDetail:{

        },
        searchKeys:{
          id:'',
        },
        bread:[{
          name:'信息管理'
        },{
          name:'设备管理',
          path:'/devicemanage'
        },{
          name:'设备详情'
        }]
      }
    },
    components:{
      BreadCrumb,
    },
    methods:{
      // 获取设备详情
      getData(){
        instance.post('/communicationEquipment/detail',this.searchKeys).then(res=>res.data).then(res=>{
          if(res.code==0){
            this.deviceDetail=res.data;
          }else{
            this.notifyError(res.errorMsg)
          }
        })
      },
      // 编辑设备页面
      edit(){
        this.$router.push({
          name:'deviceeditor',
          params:{
            id:this.$route.params.id
          }
        })
      }
    },
    created(){
      this.$set(this.searchKeys,'id',this.$route.params.id);
      if(this.$route.params.deviceNo){
        this.deviceDetail=this.$route.params;
      }else{
        this.getData();
      }
    }
  }
</script>