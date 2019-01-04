<template>
  <div class="content">
    <bread-crumb :bread="bread"></bread-crumb>
    <div class="main">
      <el-container>
        <el-row style="width:100%">
          <el-col :span="12" :offset="6">
            <el-form :model="equipment" ref="equipment" :rules="rules" label-width='150px' v-loading="loading">
              <el-form-item label="设备序号：" prop="deviceNo">
                <el-input v-model="equipment.deviceNo"></el-input>
              </el-form-item>

              <el-form-item label="设备类型：" prop="deviceType">
                <el-select v-model="equipment.deviceType" @change="selectEquipmentType" style="width:100%;" placeholder="请选择设备类型">
                  <el-option v-for="(item,index) in constants.euipmentType" :key="index" :label="item.name" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="协议类型：" prop="isWriteoff">
                <el-select v-model="equipment.isWriteoff" style="width:100%" placeholder="请选择协议类型">
                  <el-option v-for="items in equipmentProtocolTypes" :key="items.value" :label="items.name" :value="items.value"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="设备厂商：" prop="manufacturer">
                <el-input v-model="equipment.manufacturer"></el-input>
              </el-form-item>
              <el-form-item label="设备型号：">
                <el-input v-model="equipment.deviceModel"></el-input>
              </el-form-item>
              <el-form-item label="指令下发地址：">
                <el-input v-model="equipment.instructionAddress"></el-input>
              </el-form-item>
              <el-form-item label="终端通讯地址：">
                <el-input v-model="equipment.postalAddress"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button size="small" type="primary" @click="submitDeviceEditForm('equipment')">保存</el-button>
                <el-button size="small">取消</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-container>
    </div>
  </div>
</template>
<script>
import mixins from '../../../static/js/mixins';
import { instance } from '../../../static/js/bus';
import BreadCrumb from '../nav/BreadCrumb';
export default {
  mixins:[mixins],
  data(){
    let deviceNoFormat=(rule,value,callback)=>{
      if(value===''){
        callback(new Error('设备序号不得为空'))
      }else{
        callback();
      }
    }
    let deviceTypeFormat=(rule,value,callback)=>{
      if(value===''){
        callback(new Error('设备类型不得为空'))
      }else{
        callback()
      }
    }
    let isWriteoffFormat=(rule, value, callback)=>{
      if(value===''){
        callback(new Error('协议类型不得为空'))
      }else{
        callback()
      }
    }
    let manufacturerFormat=(rule, value, callback)=>{
      if(value===''){
        callback(new Error('设备厂商不得为空'))
      }else{
        callback()
      }
    }
    return {
      bread:[
        {
          name:'信息管理'
        },{
          name:'设备管理',
          path:'/devicemanage'
        },{
          name:'设备信息编辑'
        }
      ],
      searchKeys:{
        id:''
      },
      equipment:{
        deviceNo:'',
        deviceType:'',
        isWriteoff:'',
        manufacturer:'',
        deviceModel:'',
        instructionAddress:'',
        postalAddress:''
      },
      equipmentProtocolTypes:[],
      loading:false,
      rules:{
        deviceNo:[{
          required:true, 
          validator:deviceNoFormat, 
          trigger:'blur'
        }],
        deviceType:[{
          required:true,
          validator:deviceTypeFormat,
          trigger:['blur','change']
        }],
        isWriteoff:[{
          required:true,
          validator:isWriteoffFormat,
          trigger:['blur','change']
        }],
        manufacturer:[{
          required:true,
          validator:manufacturerFormat,
          trigger:['blur']
        }]
      }
    }
  },
  components:{
    BreadCrumb
  },
  watch:{
    'constants':{
      handler(){
        this.changeEquipmentType(this.equipment.deviceType)
      },
      deep:true
    }
  },
  methods:{
    /**
     * getData 获取设备信息
     * 
     *  */
    getDeviceEditData(){
      this.loading=true;
      instance.post('/communicationEquipment/detail',this.searchKeys).then(res=>res.data).then(res=>{
        this.loading=false;
        if(res.code==0){
            let item=res.data;
            delete item.createTime;
            delete item.operateStatus;
            delete item.deviceStatus;
            this.equipment=item;
        }else{
          this.notifyError(res.errorMsg)
        }
      })
    },
    selectEquipmentType(val){
      this.changeEquipmentType(val);
      this.$set(this.searchKeys,'isWriteoff',"");
      if(this.equipmentProtocolTypes.length==1){
        this.$set(this.equipment,'isWriteoff',this.equipmentProtocolTypes[0].value)
      }
    },
    // 根据设备类型改变协议类型
    changeEquipmentType(val){
      if(val==10){
        this.equipmentProtocolTypes=this.constants.equipmentProtocolType;
      }else{
        this.equipmentProtocolTypes=this.constants.obdEquipmentProtocolType;
      }
    },
    // 表单提交
    submitDeviceEditForm(formName){
      this.$refs[formName].validate(valid=>{
        if(valid){
          this.setDeviceEditData();
        }else{
          this.notifyError('请按要求填写相关信息')
          return false;
        }
      })
    },
    // 接口
    setDeviceEditData(){
      this.loading=true;
      instance.post('/communicationEquipment/modify',this.equipment).then(res=>res.data).then(res=>{
        this.loading=false;
        if(res.code==0){
          this.notifySuccess('修改设备信息成功!');
          this.$router.push({
            name:'devicemanage'
          })
        }else{
          this.notifyError(res.errorMsg)
        }
      })
    }
  },
  created(){
    this.$set(this.searchKeys,'id',this.$route.params.id);
    this.getDeviceEditData()
  },
}
</script>