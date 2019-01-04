<template>
  <div class="content">
    <bread-crumb :bread="bread"></bread-crumb>
    <div class="layout-op">
      <el-row>
        <el-col :span="6" class="horizontal-layout">
          <label>车牌号码：</label>
          <el-input size="small" v-model="searchKeys.vehicleNo" placeholder="请填写车牌号码"></el-input>
        </el-col>
        <el-col :span="6" :offset="3" class="horizontal-layout">
          <label>报警截止时间：</label>
          <el-date-picker
            v-model="searchKeys.endTime"
            type="datetime"
            placeholder="请选择截止时间" 
            size="small" style="width:100%" 
            :clearable="false" 
            :editable="false">
          </el-date-picker>
        </el-col>
        <el-col :span="6" :offset="3" class="horizontal-layout">
          <label>所属企业：</label>
          <el-select v-model="searchKeys.enterpriseId" size="small" placeholder="请选择所属企业">
            <el-option v-for="item in enterprises" :key="item.name" :label="item.label" :value="item.name"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6" class="horizontal-layout">
          <label>报警类型：</label>
          <el-select size="small" v-model="searchKeys.alarmType" style="width:100%" placeholder="请选择报警类型">
            <el-option v-for="item in constants.alarmType" :key="item.name" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6" :offset="12" class="text-right">
          <el-button size="small" type="primary" icon="el-icon-search" @click="searchAlarmInfo" :loading="loading">搜索</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="main" v-loading="loading">
      <el-table 
      border 
      :data="alarmData" 
      highlight-current-row 
      header-row-class-name="warning-row"
      tooltip-effect="dark" >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form :inline="true" label-position="left" label-width="90px" class="table-expand">
              <el-form-item label="行驶速度">
                {{scope.row.speed}}
              </el-form-item>
              <el-form-item label="司机">
                {{scope.row.driverName}}
              </el-form-item>
              <el-form-item label="司机电话">
                {{scope.row.driverPhone}}
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="车牌号" align="center" width="120">
          <template slot-scope="scope">
            {{scope.row.vehicleNo}}
          </template>
        </el-table-column>
        <el-table-column label="所属企业" align="center">
          <template slot-scope="scope">
            {{scope.row.enterpriseName}}
          </template>
        </el-table-column>
        <el-table-column label="报警类型" :formatter="formatAlarmType" prop="alarmType" align="center"></el-table-column>
        <el-table-column label="报警位置" align="center" 
          :show-overflow-tooltip="true" min-width="120">
          <template slot-scope="scope">
            {{scope.row.baiduAddress}}
          </template>
        </el-table-column>
        <el-table-column label="报警时间"
          :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">
            {{scope.row.gpsTime | timeFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button type="danger" plain size="small">处理</el-button>
            <el-button type="primary" plain size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="pageParams.total" :pageCount="pageParams.pageCount" :currentPage="searchKeys.pageNo" @currentChange="currentChange"></pagination>
    </div>
  </div>
</template>
<script>
import mixins from '../../../static/js/mixins';
import BreadCrumb from '../nav/BreadCrumb';
import Pagination from '../nav/Pagination';
import { instance } from '../../../static/js/bus';
export default {
  mixins:[mixins],
  data(){
    return {
      bread:[
        {
          name:'部标监控'
        },{
          name:'报警信息处理'
        }
      ],
      searchKeys:{
        alarmType:'',
        endTime:'',
        enterpriseId:'',
        vehicleNo:'',
        pageNo:1
      },
      loading:false,
      alarmData:[],
    }
  },
  components:{
    BreadCrumb,
    Pagination
  },
  methods:{
    // 搜素报警信息
    searchAlarmInfo(){
      this.$set(this.searchKeys,'pageNo',1);
      this.getAlarmInfo();
    },
    getAlarmInfo(){
      this.loading=true;
      instance.post('/jt808alarmDeal/alarmDealInfo',this.searchKeys).then(res=>res.data).then(res=>{
        this.loading=false;
        if(res.code==0){
          this.alarmData=res.data.list;
          this.setPageParams(res.data);
        }else{
          this.notifyError(res.errorMsg)
        }
      })
    },
    // 表格报警类型筛选
    formatAlarmType(row){
      let result='未知类型';
      result=this.constants.alarmType.find(item=>{
        return row.alarmType===item.value;
      })
      return result.name;
    },
    // 分页点击获取
    currentChange(val){
      this.$set(this.searchKeys,'pageNo',val);
      this.getAlarmInfo();
    },
  },
  created(){
    let now=new Date();
    this.$set(this.searchKeys,'endTime',now);
    this.getAlarmInfo();
  }
}
</script>
<style lang="scss" scoped>

</style>
