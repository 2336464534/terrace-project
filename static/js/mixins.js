// mixins
import {instance} from './bus'

export default {
  data() {
    return {
      demain: 'http://192.168.1.116:9090',
      ownerName: 'MaBing',
      ownerAge: 24,
      ownerDo: [
        {
          work: 'Web前端',
          private: '全栈'
        },
        {
          work: 'NodeJS',
          private: '架构'
        }
      ],
      ownerId:342201199511044717,
      pageParams:{
        pageCount:15,
        total:100
      },
      constants:{},
      enterprises:[]
    }
  },
  computed: {
    exportPath(){
      return this.demain+'/bcm-mrg/management';
    },
    templatePath(){
      return this.demain+'/bcm-mrg/static/resource';
    }
  },
  // 自定义指令
  directives:{
    focus:{
      inserted:function(el,binding,vNode,oldNode){
        el.firstElementChild.focus();
      }
    }
  },
  filters:{
    // 设备类型过滤
    equipmentTypeFormat(val){
      let type = (val===11) ? 'OBD设备' : (val===10) ? '部标设备' : '未定义设备类型';
      return type;
    },
    // 协议类型过滤
    isWriteTypeFormt(val){
      let type = (val === 1) ? 'JT808' : (val === 2) ? '科隆808' : '未知类型';
      return type;
    },
    // 时间戳转具体时间
    timeFormat(val){
      let now=new Date(val);
      let year=now.getFullYear(),
          month=now.getMonth()<9 ? '0'+(now.getMonth()+1) : (now.getMonth()+1),
          day=now.getDate()<10 ? '0'+now.getDate() : now.getDate(),
          hour=now.getHours()<10 ? '0'+now.getHours() : now.getHours(),
          minute=now.getMinutes()<10 ? '0'+now.getMinutes() : now.getMinutes(),
          second=now.getSeconds()<10 ? '0'+now.getSeconds() : now.getSeconds();
      return ''+year+'-'+month+'-'+day+'  '+hour+':'+minute+':'+second;
    },
    // 时间戳转天数
    timeDayFormat(val){
      let now=new Date(val);
      let year=now.getFullYear(),
          month=now.getMonth()<9 ? '0'+(now.getMonth()+1) : (now.getMonth()+1),
          day=now.getDate()<10 ? '0'+now.getDate() : now.getDate();
      return ''+year+'-'+month+'-'+day;
    },
    // 只转时分
    timeMinuteFormat(val){
      let now=new Date(val);
      let hour=now.getHours()<10 ? '0'+now.getHours() : now.getHours(),
          minute=now.getMinutes()<10 ? '0'+now.getMinutes() : now.getMinutes();
      return ''+hour+':'+minute;
    }

  },
  methods:{
    // 成功错误提示信息
    notifySuccess(msg){
      this.$message({
        showClose:true,
        type:'success',
        message:msg
      })
    },
    notifyError(msg){
      this.$message({
        showClose:true,
        type:'error',
        message:msg
      })
    },
    notifyWarning(msg){
      this.$message({
        showClose:true,
        type:'warning',
        message:msg
      })
    },
    // 设置分页信息
    setPageParams(items){
      this.$set(this.pageParams,'pageCount',items.pageCount);
      this.$set(this.pageParams,'total',items.totalCount)
    },
    // 公共接口
    init:function(){
      instance.post('/init',{}).then(res=>res.data).then(res=>{
        if(res.code==0){
          this.$set(this.constants,'addEquipmentType',res.data.add_equipment_type);
          this.$set(this.constants,'alarmType',res.data.alarm_type);
          this.$set(this.constants,'autoDealAlarmStatus',res.data.auto_deal_alarm_status);
          this.$set(this.constants,'autoDealAlarmType',res.data.auto_deal_alarm_type);
          this.$set(this.constants,'autoDealCallContent',res.data.auto_deal_call_content);
          this.$set(this.constants,'channelTemperatureType',res.data.channel_temperature_type);
          this.$set(this.constants,'enterpriseList',res.data.enterprise_list);
          this.$set(this.constants,'enterpriseType',res.data.enterprise_type);
          this.$set(this.constants,'equipmentProtocolType',res.data.equipment_protocol_type);
          this.$set(this.constants,'equipmentStatus',res.data.equipment_status);
          this.$set(this.constants,'euipmentType',res.data.euipment_type);
          this.$set(this.constants,'handleModel',res.data.handle_model);
          this.$set(this.constants,'informModel',res.data.inform_model);
          this.$set(this.constants,'mainEquipmentType',res.data.main_equipment_type);
          this.$set(this.constants,'monitorEnterpriseList',res.data.monitor_enterprise_list);
          this.$set(this.constants,'obdEquipmentProtocolType',res.data.obd_equipment_protocol_type);
          this.$set(this.constants,'quasiModel',res.data.quasi_model);
          this.$set(this.constants,'simcardOperator',res.data.simcard_operator);
          this.$set(this.constants,'simcardReservoirType',res.data.simcard_reservoirType);
          this.$set(this.constants,'switchFlag',res.data.switch_flag);
          this.$set(this.constants,'treenodeType',res.data.treenode_type);
          this.$set(this.constants,'userSex',res.data.user_sex);
          this.$set(this.constants,'vehicleColor',res.data.vehicle_color);
          this.$set(this.constants,'vehicleType',res.data.vehicle_type);
        }
      })
    },
    // 获取当前用户所能查看到的企业
    getEnterprises(){
      instance.post('/enterprise/queryEnterpriseByType',{}).then(res=>res.data).then(res=>{
        if(res.code==0){
          this.enterprises=res.data.list;
        }else{
          this.notifyError(res.errorMsg);
        }
      })
    }
  },
  created() {
    this.init();
    console.log('是？？？')
  },
}
