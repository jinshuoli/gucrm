<template>
  <div>
    <nav class="header">
      <el-row>
        <el-col :span="2">
          <el-tooltip class="item" effect="dark" content="点击图片切换菜单" placement="right-start">
            <img @click="toggle" src="../assets/oiologo.png" alt="crm" width="70" height="65" class="logo" />
          </el-tooltip>
        </el-col>
        <el-col :span="6">
          <router-link :to="{path: '/gucrm/login'}">
            <h2 class="title">号外号虚拟号系统</h2>
          </router-link>
        </el-col>
        <el-col :offset="14" :span="1">
          <el-dropdown trigger="click" style="cursor:pointer">
            <span class="el-dropdown-link">
             <i class="fa fa-bars fa-2x"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <router-link :to="{path: '/gucrm/main/resetPwd'}">
                <el-dropdown-item>个人资料</el-dropdown-item>
              </router-link>
              <router-link :to="{path: '/gucrm/login'}">
                <el-dropdown-item>退出</el-dropdown-item>
              </router-link>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </nav>
    <section>
      <el-row>
        <!-- 左侧列表 -->
        <el-col :span="2" class="nav">
          <el-menu :default-active="$route.path" :router="true" :collapse="isCollapse" theme="dark">
            <el-menu-item v-for="item in navList" :index="item.src" :key="item.src">
              <i :class="item.icon"></i>
              <span slot="title">{{item.name}}</span>
            </el-menu-item>
          </el-menu>
        </el-col>
        <!-- 中间内容 -->
        <el-col :span="22">
          <!-- <transition name="el-fade-in-linear"> -->
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
          <!-- </transition> -->
        </el-col>
      </el-row>
    </section>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isCollapse: false, // 是否水平折叠收起菜单（仅在 mode 为 vertical 时可用）
      navList: [
        // {icon:'fa fa-home',name:'概览',src:'/gucrm/overview'},
        // {icon:'fa fa-signal',name:'呼入分析',src:'/gucrm/IncomingAnalysis'},
        // {icon:'fa fa-phone ',name:'呼入记录',src:'/gucrm/IncomingCall'},
        // {icon:'fa fa-bullhorn',name:'外呼记录',src:'/gucrm/CallRecord'},
        // {icon:'fa fa-user',name:'员工管理',src:'/gucrm/StaffAdmin'},
        // {icon:'fa fa-microphone',name:'外呼设置',src:'/gucrm/CallSetup'},
        // {icon:'fa fa-microphone',name:'公司管理',src:'/gucrm/company'},
        // {icon:'test',name:'test',src:'/gucrm/test'},
      ],
    }
  },
  methods: {
    // 菜单栏展开收起
    toggle() {
      this.isCollapse = !this.isCollapse;
    },
    // 获取导航列表
    getNav() {
      this.$axios.get('sysUser_queryLoginRole.action').then(response => {
        this.navList = JSON.parse(response.data)
        // console.table(JSON.parse(response.data))
      })
    },
    login() {
      this.$axios.get('sysUser_login.action').then(response => {
        let loginInfo = JSON.parse(response.data);
        sessionStorage.setItem('loginInfo', JSON.stringify(loginInfo));
        this.$message({ message: "登陆成功！", type: 'success', });
      }, response => {
        this.$message({ message: "登陆失败 " + response, type: 'error', });
      })
    }
  },
  created() {
    this.getNav();
  }
}

</script>
<style lang="less" scoped>
.header {
  background-color: #222d32;
  .title,
  i {
    color: white;
    line-height: 100%;
  }
  i {
    padding-top: 20px;
  }
}

a {
  text-decoration: none;
}

.el-menu {
  height: 880px;
}
.logo{
  margin-left: 12px
}

</style>
