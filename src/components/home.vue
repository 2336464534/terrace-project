<template>
  <img src="../../static/img/bg.png" alt="" ref='homebg'>
</template>

<script>
import {instance } from '../../static/js/bus'
export default {
  name: 'home',
  data () {
    return {
      searchKeys:{
        certificateType: 1,
        enterpriseId: "",
        pageNo: 1,
        serverDate: -1,
      }
    }
  },
  methods:{
    toLink(){
      this.$router.push({
        name:'mapmonitor'
      })
    }
  },
  created() {
  },
  mounted(){
    // 挂载更新循环结束后获取更新后的DOM 设置图片
    this.$nextTick(function(){
      let height=document.documentElement.clientHeight;
      this.$refs.homebg.style.height=height-127+'px';
    })
  }
  
}
</script>
<style scoped>
/* img属性 */
img{
  width: 100%;
  object-fit: cover;
}
</style>
