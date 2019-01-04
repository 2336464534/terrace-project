<template>
  <div class="top-header">
    <h1 class="header-title line-height-head">星通北斗定位导航系统</h1>
    <div class="pull-right header-right-list-content">
      <el-dropdown class="line-height-head" trigger="click">
        <span class="header-user">
          {{ userInfo.realname }} <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item>
            <i class="iconfont">&#xe893;</i>
            <span>修改密码</span>
            </el-dropdown-item>
          <el-dropdown-item>
            <i class="iconfont" style="font-size:21px;margin:0 1px 0 -1px;">&#xe6ba;</i>
            <span>退出登录</span>
            </el-dropdown-item>
          <el-dropdown-item disabled>
            <i class="iconfont">&#xe93e;</i>
            <span>个人信息</span>
            </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        userName:'测试号',
        userInfo:{}
      }
    },
    methods:{
    },
    created() {
      let user=JSON.parse(sessionStorage.getItem('userInfo'));
      this.userInfo=Object.assign({},this.userInfo,user)
    },
  }
</script>
<style lang="scss" scoped>
  .header-title{
    margin: 0;
    display: inline-block;
    color: #fff;
    font-weight: 400;
  }
  .header-user{
    color: #efefef;
    cursor: pointer;
  }
  .user-dropdown{
    color: #fff;
    li{
      display: flex;
      align-items: center;
      justify-content: center;
      i{
        margin-right: 2px;
      }
    }
  }
</style>