<template>
  <div>
    <el-row>
      <el-col :offset="1" :span="22">
        <h3>员工管理</h3>
        <el-tabs v-model.trim="activeName" type="card" @tab-click="tabClick">
          <el-tab-pane label="员工" name="first">
              <staff-com ref="postTabelData">
                <!-- 员工组件 -->
              </staff-com>
          </el-tab-pane>
          <el-tab-pane v-if="isAdmin" label="部门" name="second">
            <branch-com  @on-search-table-info="searchTableInfo">
              <!-- 部门组件 -->
            </branch-com>
          </el-tab-pane>
          <el-tab-pane label="号码" name="third">
            <number-com @on-search-table-info="searchTableInfo">
              <!-- 号码组件 -->
            </number-com>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import staffCom from '@/components/StaffAdmin/staffCom'
import branchCom from '@/components/StaffAdmin/branchCom'
import numberCom from '@/components/StaffAdmin/numberCom'
export default {
  components: {
    staffCom,
    branchCom,
    numberCom,
  },
  data() {
    return {
      activeName: 'first', // 默认显示那个tab（tab-name）
      isAdmin: false,
    }
  },
  methods: {
    tabClick(tab, event) {
      // console.log(tab,event);
    },
    ifAdmin() { // 判断是否是超级用户（如果不是超级用户，不显示部门）
      let loginInfo = sessionStorage.getItem('loginInfo');
      let adminInfo = JSON.parse(loginInfo);
      this.isAdmin = adminInfo.permission;
    },
    // 员工组件传递来的，查询到的数据
    searchTableInfo(data) {
      this.activeName = "first";
      this.$refs.postTabelData.searchTable(data); // 触发查询部门树的方法
    },
  },
  created() {
    this.ifAdmin()
  }
}

</script>
<style lang="less" scoped>


</style>
