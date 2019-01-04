<template>
<div class="block">
  <el-pagination
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-size="pageCount" 
    :total="total"
    :layout="layout" >
  </el-pagination>
</div>
</template>
<script>
  import mixins from '../../../static/js/mixins.js'
  export default {
    mixins:[mixins],
    props:{
      pageCount:{
        default:0,
        type:[Number]
      },
      total:{
        default:0,
        type:[Number]
      },
      currentPage:{
        default:0,
        type:[Number]
      }
    },
    data() {
      return {
        layout:'prev, pager, next'
      };
    },
    methods: {
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.$emit('currentChange',val);
      },
      setPageSize(){
        if(this.total/this.pageCount>18){
          this.layout='prev, pager, next, jumper'
        }else{
          this.layout='prev, pager, next'
        }
      }
    },
    watch:{
      // 数据数量变化
      total(){
        this.setPageSize()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .block{
    text-align: center;
    padding: 1em;
  }
</style>
