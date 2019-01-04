<template>
  <el-dialog :visible.sync="openDialog" title="设备停用" :before-close="closeDialog">
    <el-form label-position="right" ref="stopKeys" :rules="rules" :model="stopKeys">
      <el-form-item label="停用原因:" prop="discontinuationReason">
        <el-input v-model="stopKeys.discontinuationReason"></el-input>
      </el-form-item>
      <el-form-item label="备注:">
        <el-input v-model="stopKeys.remark"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="submitForm('stopKeys')">确认</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {instance } from '../../../static/js/bus.js'
  import mixins from '../../../static/js/mixins.js'
  export default {
    mixins:[mixins],
    data(){
      return {
        stopKeys:{
          ids:[],
          discontinuationReason:'',
          remark:''
        },
        rules:{
          discontinuationReason:[{
            required:true,
            message:'请输入停用原因',
            trigger:'blur'
          }]
        },
        loading:false
      }
    },
    props:{
      openDialog:Boolean,
      url:String,
      stopUseId:Array
    },
    methods:{
      closeDialog(){
        this.$emit('closeDialog',false);
      },
      submitForm(formName){
        this.$refs[formName].validate(valid=>{
          if(valid){
            this.loading=true;
            instance.post(this.url, this.stopKeys).then(res=>res.data).then(res=>{
              this.loading=false;
              if(res.code===0){
                this.closeDialog();
                this.$message({
                  message:'停用成功',
                  type:'success'
                });
                this.$emit('refresh');
              }else{
                this.$message({
                  message:res.errorMsg,
                  type:'error'
                })
              }
            });
          }else{
            return false;
          }
        })
      }
    },
    // 初始已经加载 props属性不会变化 
    watch:{
      stopUseId(){
        this.$set(this.stopKeys,'discontinuationReason','');
        this.$set(this.stopKeys,'reamark','');
        this.stopKeys.ids=this.stopUseId;
      }
    }
  }
</script>
<style>

</style>