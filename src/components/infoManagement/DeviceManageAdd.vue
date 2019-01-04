<template>
  <div class="content">
    <bread-crumb :bread="bread"></bread-crumb>
    <div class="main">
      <el-container>
        <el-row style="width:100%">
          <el-col :span="12" :offset="6">
            <el-form :model="equipment" ref="equipment" :rules="rules" label-width="150px" v-loading="loading">
              <el-form-item label="设备序号:" prop="deviceNo">
                <el-input v-model="equipment.deviceNo" placeholder="请填写设备序号"></el-input>
              </el-form-item>


              <el-form-item label="设备类型:" prop="deviceType">
                <el-select v-model="equipment.deviceType" @change="selectEquipmentType" style="width:100%;" placeholder="请选择设备类型">
                  <el-option v-for="(item,index) in constants.euipmentType" :key="index" :label="item.name" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="协议类型:" prop="isWriteoff">
                <el-select v-model="equipment.isWriteoff" style="width:100%" placeholder="请选择协议类型">
                  <el-option v-for="(item, index) in equipmentProtocolType" :key="index" :label="item.name" :value="item.value"></el-option>
                </el-select>
              </el-form-item>


              
              <el-form-item label="设备厂商:" prop="manufacturer">
                <el-input v-model="equipment.manufacturer" placeholder="请填写设备厂商"></el-input>
              </el-form-item>
              <el-form-item label="设备型号:">
                <el-input v-model="equipment.deviceModel" placeholder="请填写设备型号"></el-input>
              </el-form-item>
              <el-form-item label="指令下发地址:">
                <el-input v-model="equipment.instructionAddress" placeholder="请填写指令下发地址"></el-input>
              </el-form-item>
              <el-form-item label="终端通讯地址:">
                <el-input v-model="equipment.postalAdress" placeholder="请填写终端设备地址"></el-input>
              </el-form-item>
              <el-form-item label-width="150px">
                <el-button type="primary" @click="submitForm('equipment')">保存</el-button>
                <el-button @click="$router.back()">取消</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-container>
    </div>
  </div>
</template>
<script>
  import BreadCrumb from '../nav/BreadCrumb'
  import mixins from '../../../static/js/mixins'
import { instance } from '../../../static/js/bus';
  export default {
    mixins:[mixins],
    data() {
      let deviceNoFormat=(rule, value, callback)=>{
        if(value.trim()===''){
          callback(new Error('请填写设备序号'))
        }else{
          callback()
        }
      }
      // value.trim()方法是对字符串 不是对数字
      let deviceTypeFormat=(rule,value,callback)=>{
        if(value===''){
          callback(new Error('请选择设备类型'))
        }else{
          callback()
        }
      }
      let isWriteoffFormat=(rule, value, callback)=>{
        if(value===''){
          callback(new Error('请选择协议类型'))
        }else{
          callback()
        }
      }
      let manufacturerFormat=(rule, value, callback)=>{
        if(value.trim()===''){
          callback(new Error('请填写设备厂商'))
        }else{
          callback();
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
            name:'添加设备'
          }
        ],
        loading:false,
        equipmentProtocolType:[],
        equipment:{
          deviceNo:'',
          deviceType:'',
          isWriteoff:'',
          manufacturer:'',
          deviceModel:'',
          instructionAddress:'',
          postalAddress:''
        },
        rules:{
          deviceNo:[{
            required:true,
            validator:deviceNoFormat,
            trigger:['blur','change']
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
    methods:{
      // 添加设备提交 formName/ref DOM实例
      /**
       * submitForm 表单验证
       * @param formName(表单数据model)
       * @function submitEquipment(提交数据)
       */
      submitForm(formName){
        this.$refs[formName].validate(valid=>{
          if(valid){
            this.submitEquipment();
          }else{
            return false;
          }
        })
      },
      submitEquipment(){
        this.loading=true;
        instance.post('/communicationEquipment/save',this.equipment).then(res=>res.data).then(res=>{
          this.loading=false;
          if(res.code==0){
            this.notifySuccess('设备添加成功');
            this.$router.back();
          }else{
            this.notifyError(res.errorMsg)
          }
        })
      },
      /**
       * selectEquipmentType 根据设备类型选择协议类型
       * @param val(设备类型: 10/11)
       */
      selectEquipmentType(val){
        if(val===10){
          this.equipmentProtocolType=this.constants.equipmentProtocolType;
        }else if(val===11){
          this.equipmentProtocolType=this.constants.obdEquipmentProtocolType;
        }
        this.$set(this.equipment,'isWriteoff',this.equipmentProtocolType[0].value)
      }
      
    },
  }
</script>
<style lang="scss" scoped>
  
</style>