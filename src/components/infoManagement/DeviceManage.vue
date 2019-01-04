<template>
  <div class="content">
    <bread-crumb :bread="bread"></bread-crumb> 
    <div class="layout-op" v-loading="importStatus">
      <el-row>
        <el-col :span="6" class="horizontal-layout">
          <label>设备序号: </label>
          <el-input size="small" v-model="searchKeys.deviceNo" clearable></el-input>
        </el-col>
        <el-col :span="6" :offset="1" class="horizontal-layout">
          <label>设备类型: </label>
          <el-select size="small" v-model="searchKeys.deviceType" clearable>
            <el-option v-for="(item, index) in constants.euipmentType" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6" :offset="1" class="horizontal-layout">
          <label>设备状态: </label>
          <el-select size="small" v-model="searchKeys.deviceStatus" clearable>
            <el-option v-for="(item,index) in deviceStatus" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span="2" :offset="2">
          <el-button size="small" type="primary" class="btn-search" @click="search">
            <i class="el-icon-search"></i>
            <span>搜索</span>
          </el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-button size="small" @click="addDevice">
            <i class="el-icon-plus"></i>
            <span>添加设备</span>
          </el-button>
          <el-button size="small" type="danger" @click="stopUseDevice">
            <i class="el-icon-warning"></i>
            <span>停止使用</span>
          </el-button>
        </el-col>
        <el-col :span="12" style="text-align:right">
          <el-button size="small" type="primary" plain :disabled="disabled">
            <i class="iconfont small-icon">&#xe8fc;</i>
            <span>导出</span>
          </el-button>
          <el-button size="small" type="primary" plain @click="download">
            <i class="el-icon-download"></i>
            <span>下载导入模板</span>
          </el-button>
          <el-upload 
            class="pull-right ml10" 
            :action="exportPath+'/communicationEquipment/batchImportDevice'"
            :show-file-list="false" :on-success="onSuccessImport" 
            :on-progress="onProgressImport">
            <el-button size="small" type="primary" plain>
              <i class="iconfont small-icon">&#xe8fd;</i>
              <span>导入</span>
            </el-button>
          </el-upload>
        </el-col>
      </el-row>
    </div>
    <div class="main" v-loading="loading">
      <el-alert
        title="注意:只有未使用状态的设备才可以停用！"
        type="warning"
        show-icon class="mb15">
      </el-alert>
      <el-table 
        border 
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%" 
        header-row-class-name="warning-row" 
        highlight-current-row 
        @select="select">
        <el-table-column
          type="selection"
          width="50">
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" :inline="true" class="table-expand" label-width="120px">
              <el-form-item label="设备厂商:">
                <span>{{ props.row.manufacturer }}</span>
              </el-form-item>
              <el-form-item label="协议类型:">
                <span>{{ props.row.isWriteoff | isWriteTypeFormt }}</span>
              </el-form-item>
              <el-form-item label="指令下发地址:" v-if="!!props.row['instructionAddress']">
                <span>{{ props.row.instructionAddress }}</span>
              </el-form-item>
              <el-form-item label="终端通讯地址:" v-if="!!props.row['postalAddress']">
                <span>{{ props.row.postalAddress }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="设备序号" 
          show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.deviceNo }}</template>
        </el-table-column>
        <el-table-column
          label="设备类型" align="center">
          <template slot-scope="scope">
            {{ scope.row.deviceType | equipmentTypeFormat }}
          </template>
        </el-table-column>
        <el-table-column
          label="设备状态"
          show-overflow-tooltip align="center"> 
          <template slot-scope="scope">
            <span 
              :class="scope.row.deviceStatus==1?'text-primary':scope.row.deviceStatus===2?'text-success':'text-danger'">{{ scope.row.deviceStatus | statusFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          show-overflow-tooltip 
          align="center" 
          sortable>
          <template slot-scope="scope">
            {{ scope.row.createTime | timeDayFormat }}  {{ scope.row.createTime | timeMinuteFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="deviceDetail(scope.row)" plain>查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination 
        :total="pageParams.total" 
        :pageCount="pageParams.pageCount" 
        :currentPage="searchKeys.pageNo" 
        @currentChange="currentChange">
      </pagination>
      <dialog-device-manage 
        :openDialog="openDialog" 
        :url="url" 
        :stopUseId="stopUse.stopUseId" 
        @closeDialog="closeDialog" 
        @refresh="getData">
      </dialog-device-manage>
    </div>
  </div>  
</template>
<script>
  import {instance} from '../../../static/js/bus.js'
  import BreadCrumb from '../nav/BreadCrumb'
  import mixins from '../../../static/js/mixins.js'
  import pagination from '../nav/Pagination'
  import DialogDeviceManage from '../dialog/DialogDeviceManage'
  export default {
    mixins:[mixins],
    data(){
      return {
        bread:[
          {
            name:'信息管理'
          },{
            name:'设备管理'
          }
        ],
        loading:false,
        searchKeys:{
          deviceNo:'',
          deviceStatus:'',
          deviceType:'',
          pageNo:1
        },
        deviceStatus:[
          {
            label:'未使用',
            value:1
          },{
            label:'已使用',
            value:2
          },{
            label:'已停用',
            value:3
          }
        ],
        disabled:true,
        tableData:[],
        stopUse:{
          stopUseId:[],
          stopUseType:[]
        },
        openDialog:false,
        url:'/communicationEquipment/saveReason',
        importStatus:false
      }
    },
    filters:{
      statusFormat(val){
        let status = (val===1) ? '未使用' : (val === 2) ? '已使用' : (val===3) ? '已停用' : '';
        return status;
      }
    },
    components:{
      BreadCrumb,
      pagination,
      DialogDeviceManage
    },
    methods:{
      
      // 搜索框
      search(){
        this.$set(this.searchKeys,'pageNo',1);
        this.getData();
      },
      // 获取表格数据
      getData(){
        this.loading=true;
        instance.post('/communicationEquipment/list',this.searchKeys)
                .then(res=>res.data)
                .then(res=>{
                  this.loading=false;
                  if(res.code==0){
                    this.tableData=res.data.list;
                    this.setPageParams(res.data);
                  }else{
                    this.notifyError(res.errorMsg)
                  }
                })
      },
      /**
       * 表格操作选择设备
       * @param slection(选择的数据数组)
       */
      select(selection,row){
        this.stopUse.stopUseId =[];
        this.stopUse.stopUseType = [];
        selection.forEach(element => {
          this.stopUse.stopUseId.push(element.id);
          this.stopUse.stopUseType.push(element.deviceStatus);
        });
      },
      // 根据表格选择的数据停用设备
      stopUseDevice(){
        let bool1=this.stopUse.stopUseType.indexOf(2);
        let bool2=this.stopUse.stopUseType.indexOf(3);
        if(this.stopUse.stopUseId.length>0 && (bool1===-1) && (bool2===-1)){
          this.openDialog=true;
        }else{
          this.notifyError('请选择需要停用的未使用状态的设备');
        }
      },
      /**
       * closeDialog 关闭/开启停用弹框
       * @param val(弹框的显示状态)
       */
      closeDialog(){
        this.openDialog=false;
      },
      // 添加设备
      addDevice(){
        this.$router.push({
          name:'devicemanageadd'
        })
      },
      // 查看设备详情
      deviceDetail(val){
        this.$router.push({
          name:'devicedetail',
          params:val
        })
      },
      // 改变页码 @page 页码数
      currentChange(page){
        this.$set(this.searchKeys,'pageNo',page);
        this.getData();
      },
      // 导入 / 下载导入模板 导出
      importInfo(){

      },
      download(){
        window.location.href=this.templatePath+'/devices.xls';
      },
      exportInfo(){

      },
      // 文件导入中..
      onProgressImport(){
        this.importStatus=true;
        debugger;
      },
      // 文件导入成功
      onSuccessImport(){
        setTimeout(() => {
          this.importStatus=false;
          this.search();
        }, 1000);
      }
    },
    created(){
      this.getData();
    }
  }
</script>