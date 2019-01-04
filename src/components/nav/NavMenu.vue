<template>
  <el-menu
    class="nav-menu"
    mode="horizontal"
    background-color="#eFeFeF"
    text-color="#333" 
    active-text-color="#409eff" 
    :default-active="$route.path" 
    :router="true" 
    :unique-opened="true"
    @select="handleSelect" 
    @open="handleOpen" 
    @close="handleClose">
    <el-menu-item index="/home">
      <i class="iconfont">&#xe8e2;</i>
      <span slot="title" to="home">首页</span>
    </el-menu-item>
    <el-submenu index="2">
      <template slot="title">
        <i class="iconfont">&#xe973;</i>
        <span>部标监控</span>
      </template>
      <el-menu-item index="/mapmonitor">
        <span slot="title">地图监控</span>
      </el-menu-item>
      <el-menu-item index="/alarminfomanage">报警信息处理</el-menu-item>
      <el-menu-item index="2-3">离线车辆处理</el-menu-item>
    </el-submenu>
    <el-submenu index="3">
      <template slot="title">
        <i class="iconfont">&#xe8b8;</i>
        <span>信息管理</span></template>
      <el-menu-item index="/devicemanage">设备管理</el-menu-item>
      <el-menu-item index="3-2">SIM卡管理</el-menu-item>
      <el-menu-item index="3-3">司机管理</el-menu-item>
      <el-menu-item index="3-4">车辆管理</el-menu-item>
      <el-menu-item index="3-5">附加设备管理</el-menu-item>
    </el-submenu>
    <el-submenu index="4">
      <template slot="title">
        <i class="iconfont">&#xe8cc;</i>
        <span>运营中心</span></template>
      <el-menu-item index="4-1">企业管理</el-menu-item>
      <el-menu-item index="4-2">分组管理</el-menu-item>
      <el-menu-item index="4-3">用户管理</el-menu-item>
    </el-submenu>
    <el-submenu index="5">
      <template slot="title">
        <i class="iconfont">&#xe8df;</i>
        <span>设备设置</span>
      </template>
      <el-menu-item index="5-1">部标参数设置</el-menu-item>
      <el-menu-item index="5-2">温控设备设置</el-menu-item>
    </el-submenu>
    <el-submenu index="6">
      <template slot="title">
        <i class="iconfont">&#xe976;</i>
        <span>统计报表</span>
      </template>
      <el-menu-item index="6-1">温控车辆统计</el-menu-item>
      <el-submenu index="6-2">
        <template slot="title">
          证件报表
        </template>
        <el-menu-item index="6-2-1">车辆证件到期统计</el-menu-item>
        <el-menu-item index="6-2-2">司机证件到期统计</el-menu-item>
      </el-submenu>
      <el-submenu index="6-3">
        <template slot="title">
          部标设备报表
        </template>
        <el-menu-item index="6-3-1">每日报警统计</el-menu-item>
        <el-menu-item index="6-3-2">报警明细统计</el-menu-item>
        <el-menu-item index="6-3-3">离线车辆统计</el-menu-item>
        <el-menu-item index="6-3-4">驾驶行为分析</el-menu-item>
        <el-menu-item index="6-3-5">服务到期统计</el-menu-item>
        <el-menu-item index="6-3-6">持续超速统计</el-menu-item>
        <el-menu-item index="6-3-7">车辆在线率统计</el-menu-item>
        <el-menu-item index="6-3-8">车辆里程统计</el-menu-item>
        <el-menu-item index="6-3-9">疲劳驾驶持续时间统计</el-menu-item>
      </el-submenu>
    </el-submenu>
    <el-submenu index="7">
      <template slot="title">
        <i class="iconfont">&#xe8b6;</i>
        <span>业务设置</span>
      </template>
      <el-menu-item index="7-1">道路分段监控设置</el-menu-item>
      <el-menu-item index="7-2">数据上报</el-menu-item>
    </el-submenu>
  </el-menu>
</template>
<script>
  export default {
    data() {
      return {

      }
    },
    computed:{
    },
    methods:{
      handleSelect(index){
        
      },
      handleOpen(key, value){
        
      },
      handleClose(key, value){
        
      }
      
    },
    created(){
      
    },
  }
</script>
<style lang="scss" scoped>
.nav-menu{
  font-weight: 400;
}
</style>