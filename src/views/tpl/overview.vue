<template>
  <div class="conent-bg">
    <el-row>
      <el-col class="box" :offset="1" :span="6">
        <p class="title">个人信息</p>
        <ul>
          <li>姓名 : {{userInfo.name}} </li>
          <li>职务 : {{userInfo.duty}} </li>
          <li>公司 : {{userInfo.cName}}
            <router-link :to="{path: '/gucrm/StaffAdmin'}">员工管理</router-link>
          </li>
        </ul>
      </el-col>
      <el-col class="box" :offset="1" :span="6">
        <p class="title">小号使用
          <router-link :to="{path: '/gucrm/StaffAdmin'}">查看</router-link>
        </p>
        <ul>
          <li>总共 : {{userInfo.total}} &nbsp;&nbsp;&nbsp;&nbsp;使用 : {{userInfo.vtotal}} &nbsp;&nbsp;&nbsp;&nbsp; 空闲 : {{userInfo.itotal}}</li>
          <!-- <li>渠道 : {{userInfo.ctotal}}</li> -->
          <!-- <li>外呼 : {{userInfo.ototal}}</li> -->
        </ul>
      </el-col>
    </el-row>
    <!-- <el-row>
      <el-col class="box" :offset="1" :span="6">
        <p class="title">今日数据</p>
        <ul>
          <li>渠道呼入电话 : {{userInfo.channelCallIn}}</li>
          <li>顾问外呼电话 : {{userInfo.callOut}}</li>
          <li>客户呼入电话 : {{userInfo.custCallIn}} </li>
        </ul>
      </el-col> -->
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userInfo: {
        total: 0,
        vtotal: 0,
        ctotal: 0,
        duty: "经理",
        ototal: 0,
        itotal: 0,
        name: "test",
        channelCallIn: 0,
        cName: "",
        custCallIn: 0,
        callOut: 0
      }
    }
  },
  methods: {
    getUserInfo() {
      this.$axios.get('overview_overview.action').then(response => {
        this.userInfo = JSON.parse(response.data)
      }, response => {
        this.$message({ message: "获取用户信息失败：" + response, type: "error" })
      })
    }
  },
  created() {
    this.getUserInfo()
  },
};

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.conent-bg {
  background-color: #F2F0F0;
}
.box {
  width: 440px;
  height: 250px;
  background: white;
  margin-top: 15px;
  margin-bottom: 15px;
}

.title {
  height: 30px;
  margin-left: 20px;
  margin-top: 10px;
  font-size: 14px;
  line-height: 30px;
  border-bottom: 1px solid #F2F0F0;
}

.box ul li {
  list-style: none;
  line-height: 40px;
}

</style>
