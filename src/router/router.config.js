// 首页 
import home from '../components/home'
// 登录 注册
import login from '../components/user/login'
// import register from '../components/user/register'

// 地图监控 => 车辆跟踪 => 轨迹回放
import mapMonitor from '../components/departmentMonitor/MapMonitor'
import tracking from '../components/departmentMonitor/Tracking'
import trackPlayBack from '../components/departmentMonitor/TrackPlayBack'
// 报警信息处理
import alarmInfoManage from '../components/departmentMonitor/AlarmInfoManage'

// 信息管理
// 设备管理 =>设备详情 => 添加设备 => 设备信息编辑
import deviceManage from '../components/infoManagement/DeviceManage'
import deviceDetail from '../components/infoManagement/DeviceManageDetail'
import deviceManageAdd from '../components/infoManagement/DeviceManageAdd'
import deviceEditor from '../components/infoManagement/DeviceManageEdit'

export default [
  {
    path:'/login',
    name:'login',
    components: {
      login:login
    }
  },
  {
    path: '/home',
    name: 'home',
    component: home,
    meta:{
      requiresAuth: true
    }
  },
  {
    path:'/mapmonitor',
    name:'mapmonitor',
    component: mapMonitor,
    meta:{
      requiresAuth: true
    }
  },
  {
    path:'/devicemanage',
    name:'devicemanage',
    component:deviceManage,
    meta:{
      requiresAuth:true
    }
  },
  {
    path:'/devicedetail/:id',
    name:'devicedetail',
    component:deviceDetail,
    meta:{
      requiresAuth:true
    }
  },
  {
    path:'/devicemanageadd',
    name:'devicemanageadd',
    component:deviceManageAdd,
    meta:{
      requiresAuth:true
    }
  },
  {
    path:'/tracking',
    name:'tracking',
    component:tracking,
    meta:{
      requiresAuth:true
    }
  },
  {
    path:'/trackplayback',
    name:'trackplayback',
    component:trackPlayBack,
    meta:{
      requiresAuth:true
    }
  },
  {
    path:'/deviceeditor/:id',
    name:'deviceeditor',
    component:deviceEditor,
    meta:{
      requiresAuth:true
    }
  },
  {
    path:'/alarminfomanage',
    name:'alarminfomanage',
    component:alarmInfoManage,
    meta:{
      requiresAuth:true
    }
  },

  {
    path:'/*',
    redirect: '/home',
    meta:{
      requiresAuth: true
    }
  }
  
]