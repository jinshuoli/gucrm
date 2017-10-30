<!-- 呼入记录的短信记录 -->
<template>
  <div>
    <el-form ref="smsLogForm" :inline="true">
      <!-- <p> 公司 【 {{smsLogForm.dept}} 】 <a href="javaScript:void(0)" @click="openTreeDialog">选择</a> </p> -->
      <!-- <el-form-item>
        <el-select v-model.trim="smsLogForm.Channel" clearable placeholder="全部渠道">
          <el-option v-for="item in ChannelGet" :label="item.label" :value="item.value" :key="item.value"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item style="width:150px;">
        <el-select v-model.trim="smsLogForm.adviser" placeholder="员工名称">
          <el-option label="员工名称" value="name"></el-option>
          <el-option label="员工号码" value="number"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model.trim="smsLogForm.nameOrUser" placeholder="按用户名或用户查询"></el-input>
      </el-form-item>
      <el-form-item style="width:150px;">
        <el-select v-model.trim="smsLogForm.customer" placeholder="客户号码">
          <el-option label="客户号码" value="number"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model.trim="smsLogForm.CustomerNumber" placeholder="按客户号码查询"></el-input>
      </el-form-item>
    </el-form>
    <!-- 部门选择树 —— start -->
    <tree-menu :dialogState="isTreeDialog" ref="postinfo" @on-close="closeDialog" @post-node="getNodes">
    </tree-menu>
    <!-- 部门选择树 —— end -->
    <!-- 时间区域选择 —— start-->
    <el-form ref="Timeform" :inline="true">
      <el-form-item label="时间：" tag="div">
        <el-date-picker type="datetimerange" @change="dateChange" v-model.trim="dateValue" placeholder="选择日期范围">
        </el-date-picker>
        <el-button type="primary" @click="QuerySms">查询</el-button>
        <el-button type="primary" @click="export2Excel">导出</el-button>
      </el-form-item>
    </el-form>
    <!-- 时间区域选择 —— end-->
    <!-- 表格 —— start-->
    <el-table ref="multipleTable" v-loading="tableLoading" :data="tableData" border tooltip-effect="dark" style="width: 100%">
      <el-table-column prop="name" label="员工名称">
      </el-table-column>
      <el-table-column prop="cuname" label="客户">
      </el-table-column>
      <el-table-column prop="acms" label="小号">
      </el-table-column>
      <el-table-column prop="tel" label="员工号码">
        <template scope="scope">
          <el-tag type="primary">{{scope.row.prtms}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="cutel" label="客户号码">
        <template scope="scope">
          <el-tag type="warning">{{scope.row.otherms}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="time_stamp" label="发送时间">
        <template scope="scope">
          {{scope.row.call_time.time | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column prop="sms_content" :show-overflow-tooltip="true" label="内容">
      </el-table-column>
    </el-table>
    <br>
    <!-- 表格 —— end-->
    <!-- 分页 —— start-->
    <el-row>
      <el-col :offset="8">
        <el-pagination @current-change="CurrentPageChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper,total" :total="totalrecord">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 分页 —— end-->
  </div>
</template>
<script>
import { formatDate } from '@/base/date'
import treeMenu from '@/components/selectSector'

export default {
  components: {
    treeMenu,
  },
  data() {
    return {
      ChannelGet: [],
      // 短信记录
      smsLogForm: {
        dept: '全部',
        deptId: '',
        Channel: '',
        adviser: 'name',
        nameOrUser: '',
        customer: 'number',
        CustomerNumber: '',
        // 时间
        dateVal: '',
      },
      // 选择部门
      isTreeDialog: false,
      // 时间
      dateValue: '',
      // 表格(短信记录)
      tableData: [],
      tableLoading: false,
      // 分页--默认状态
      currentPage: 1, // 选中页
      pageSize: 5, // 每页显示条数
      totalrecord: 0, // 总数据条数
      // 表格(短信记录)
    };
  },
  methods: {
    // 获取渠道下拉框信息（通话记录和短信记录的渠道一样）
    getChannel() {
      this.$axios.get('channel_channelList.action').then(response => {
        this.ChannelGet = JSON.parse(response.data)
      })
    },
    // ******* 员工 *********
    // 部门选择
    openTreeDialog() { // 打开部门树
      this.isTreeDialog = true;
      this.$refs.postinfo.TreeQuery(); // 触发查询部门树的方法
    },
    closeDialog() { // 关闭部门树
      this.isTreeDialog = false;
    },
    getNodes(nodes) {
      this.isTreeDialog = false;
      this.smsLogForm.dept = nodes[0].name
      this.smsLogForm.deptId = nodes[0].value
    },
    /************* 短信记录 **************/
    // 格式化后的时间2
    dateChange(val) {
      this.smsLogForm.dateVal = val;
    },
    // 查询短信
    QuerySms() {
      this.smsLogForm.currentPage = this.currentPage; // 当前页数
      this.getSmsTable()
    },
    // 分页变化时触发
    CurrentPageChange(val) {
      this.smsLogForm.currentPage = val; // 当前页数
      this.getSmsTable()
    },
    // 获取短信记录表格的数据
    getSmsTable() {
      this.tableLoading = true;
      this.$axios.get('callRecords_queryCallInMessage.action?jsonData=' + JSON.stringify(this.smsLogForm)).then(response => {
        this.tableLoading = false;
        try {
          console.log(JSON.parse(response.data))
          let outgoingFmt = JSON.parse(response.data)
          let outgoingData = outgoingFmt.pageview
          this.tableData = outgoingData.records; // 表格数据
          this.pageSize = +outgoingData.page_size; // 每页显示条数
          this.totalrecord = +outgoingData.totalrecord; // 总数据条数
        } catch (e) {
          this.tableData = [];
          this.$message({ message: "未查询到数据！", type: 'error', });
        }
      }, response => {
        this.tableLoading = false;
        this.$message({ message: "查询数据失败：" + response, type: 'error', });
      })
    },
    // 导出表格
    export2Excel() {　　　　　　
      require.ensure([], () => {　　　　　　　　
        const { export_json_to_excel } = require('@/vendor/Export2Excel');　　　　　　　　
        const tHeader = ["员工名称", "客户", "小号", "员工号码", "客户号码", "发送时间", "内容"];　　　　　　　　
        const filterVal = ["name", "cuname", "acms", "tel", "cutel", "time_stamp", "sms_content"];　
        // const filterVal = ["name", "name", "acms", "call_time", "code", "tel", "sms_content","callId"];　　　　　　　
        const data = this.formatJson(filterVal, this.tableData);　　　　　　　　
        export_json_to_excel(tHeader, data, "短信记录");
      })　　　　
    },
    formatJson(filterVal, jsonData) {　　　　　　
      return jsonData.map(v => filterVal.map(j => v[j]))　　　　
    },
  },
  // 时间格式化--后台传的时间戳格式化
  filters: {
    dateFormat(time) {
      if (time == undefined) { return "未获取到时间"; }
      var date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm');
    }
  },
  created() {
    this.getChannel()
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
