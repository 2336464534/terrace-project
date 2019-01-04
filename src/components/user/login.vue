<template>
<div class="login-wrapper">
  <div class="login-content">
    <el-form 
      class="form-login" 
      :model="ruleForm" 
      ref="ruleForm" 
      :rules="rules" 
      status-icon
      label-width="100px" >
        <el-form-item label="用户名 : " prop="name">
          <el-input 
            v-model="ruleForm.name" v-focus="true"></el-input>
        </el-form-item>
        <el-form-item label="密码 : " prop="password">
          <el-input 
            type="password" 
            v-model="ruleForm.password">
          </el-input>
        </el-form-item>
        <el-form-item label="验证码 : " class="login-code" prop="code">
          <el-input 
            v-model="ruleForm.code" 
            class="code-input" >
          </el-input>
          <span 
            class="code-wrap el-icon-refresh" @click="changeCode">
            <img 
              :src="this.demain+'/bcm-mrg/getCaptchaCode'" alt="验证码" 
              ref="code">
          </span>
        </el-form-item>
        <el-form-item class="login-footer">
          <el-button 
            class="btn-login" 
            type="primary" 
            @click="login('ruleForm')">登 录</el-button>
          <el-button 
            class="btn-login pull-right" 
            @click="reset">重 置</el-button>
        </el-form-item>
    </el-form>
  </div>
</div>
</template>
<script>
  import mixins from '../../../static/js/mixins'
  import {instance, axios } from '../../../static/js/bus'
  export default {
    mixins:[mixins],
    data(){
      // 验证规则
      var validateName=(rule, value, callback)=>{
        if(value.trim()===''){
          callback(new Error('请输入用户名'))
        }else{
          callback()
        }
      };
      var validatePass=(rule, value, callback)=>{
        if(value.trim()===''){
          callback(new Error('请输入密码'))
        }else{
          callback()
        }
      };
      var validateCode=(rule, value, callback)=>{
        if(value.trim()===''){
          callback(new Error('请输入验证码'));
        }else{
          callback()
        }
      };

      return {
        ruleForm:{
          name:'',
          password:'',
          code:''
        },
        rules:{
          name:[
            {
              validator:validateName,
              trigger:['blur','change']
            }
          ],
          password:[
            {
              validator:validatePass,
              trigger:['blur','change']
            }
          ],
          code:[
            {
              validator:validateCode,
              trigger:['blur','change']
            }
          ]
        }
      }
    },
    methods:{
      /**
       * formName 表单验证提交数据
       * 返回成功登录／错误提示信息
       *  返回用户信息 enterpriseType+id+username+realname+userAvatar
       */
      login(formName){
        // 验证登录信息
        this.$refs[formName].validate(valid=>{
          if(valid){
            // 验证开发／生产环境
            let url=process.env.NODE_ENV==="development" ? '/api/doLogin' : '/bcm-mrg/doLogin';
            axios.post(url,this.ruleForm)
                .then(res=>res.data)
                .then(res=>{
                  if(res.code==0){
                    let info={
                      enterpriseType:res.data.enterpriseType,
                      id:res.id,
                      username:res.username,
                      realname:realname,
                      userAvatar:userAvator,
                    }
                    sessionStorage.setItem('userInfo',JSON.stringify(info));
                    sessionStorage.setItem('loginStatus',true);
                    this.$emit('login',true)
                  }else{
                    this.notifyError(res.errorMsg)
                  }
            })

            // 开发环境登录
            if(process.env.NODE_ENV==="development"){
              let info={
                enterpriseType: 3,
                id: "12bgse-=wexczzxc",
                username: "admin",
                realname: "马兵",
                userAvatar: "portrait"
              }
              sessionStorage.setItem("loginStatus",true);
              sessionStorage.setItem('userInfo',JSON.stringify(info));
              this.$emit('login',true)
            }
          }else{
            return false;
          }
        })
      },
      changeCode(){
        if(this.$refs.code){
          this.$refs.code.src=this.demain+'/bcm-mrg/getCaptchaCode?t='+Date.now();
        }
      },
      reset(){

      }
    }
  }
</script>
<style lang="scss">
  .login-wrapper{
    background: url(../../../static/img/bg.png) no-repeat;
    height: 100%;
    .login-content{
      max-width: 1000px;
      height: 100%;
      margin: 0 auto;
      display:flex;
      justify-content: flex-end;
      align-items: center;
      .form-login{
        width: 400px;
        padding: 25px;
        background: #fff;
        border-radius: 5px;
        .login-code{
          .el-form-item__content{
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .code-input{
              width: 60%;
            }

            .code-wrap{
              width: 100px;
              height: 39px;
              line-height: 39px;
              box-sizing: border-box;
              cursor: pointer;
              position: absolute;
              right: 0;
              background: #fff;
              border:1px solid #ccc;
              border-radius: 3px;
              text-align: center;
              font-size: 18px;
              overflow: hidden;
              img{
                position: absolute;
                left: 0;
                width: 100%;
                height: 44px;
                margin-top: -2px;
                object-fit: cover;
                object-position: center center;
              }
            }

            .el-icon-refresh::before{
              font-size: 20px;
            }
          }
        }
        .login-footer{

          .el-form-item__content{
            display: flex;
            justify-content: space-between;
            align-items: center;
            .btn-login{
              width: 50%;
            }
          }
        }
      }
    }
  }
</style>