<template>
  <div id="app">
    <router-view name="login" v-if="!loginStatus" @login="login"></router-view>
    <el-container v-else>
      <el-header class="header-wrapper">
        <top-header></top-header>
      </el-header>
      <el-main style="padding:0">
        <nav-menu></nav-menu>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import NavMenu from './components/nav/NavMenu'
import TopHeader from './components/nav/TopHeader'
export default {
  data(){
    return {
      loginStatus:false
    }
  },
  components:{
    NavMenu,
    TopHeader
  },
  methods:{
    // 设置登录状态
    setLoginStatus(status){
      this.loginStatus=status;
      sessionStorage.setItem('loginStatus',status);
    },
    // 登录
    login(val){
      this.setLoginStatus(val)
      this.$router.push({
        name:'home'
      })
    },
    // 退出登录
    loginOut(){
      this.loginStatus=false;
      sessionStorage.setItem('loginStatus',false)
    }
  },
  created() {
    let Status=JSON.parse(sessionStorage.getItem('loginStatus'));
    this.loginStatus=Status;
  },
  // 监控路由变化 home跳转会存在不显示
  watch:{
    '$route':function (){
      if(this.$route.name == 'login' || this.$route.name == 'modifypassword'){
        this.setLoginStatus(false);
      }
    }
  }
}
</script>

<style scoped>
.header-wrapper{
  background: #333;
}
</style>
