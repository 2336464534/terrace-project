<template>
  <el-breadcrumb separator-class="el-icon-arrow-right" class="breadCrumb">
    <!-- <el-breadcrumb-item class="location">
    </el-breadcrumb-item> -->
    <span class="location">
      <i class="el-icon-location"></i>
      <b>当前位置：</b>
    </span>
    <el-breadcrumb-item><b>{{start}}</b></el-breadcrumb-item>
    <el-breadcrumb-item v-for="(key,index) in breadCrumb" :key="index" :to="key.path">{{key.name}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script>
  export default {
    data() {
      return {
        start:'',
        breadCrumb:[]
      }
    },
    props:{
      bread:{
        required:true
      }
    },
    methods: {

    },
    computed:{

    },
    created() {
      this.breadCrumb=this.bread;
      let start=this.breadCrumb.splice(0,1)[0];
      this.start=start['name'];
      // console.log(this.start)
    }
  }
</script>
<style lang="scss" scoped>
  .breadCrumb{
    padding: 20px;
    background: #f5f9fa;
    border-bottom: 1px solid #f2f2f2;
    line-height: 22px; 
    .location{
      float: left;
      display: table;
      i{
        font-size: 22px;
      }
      i,b{
        display: table-cell;
        vertical-align: middle;
        color: #409eff;
      }
    }
    b{
      font-weight: 600
    }
  }
</style>