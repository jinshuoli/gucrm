<!-- 公司管理页面 -->
<template>
  <el-row>
    <el-col :offset="2" :span="17">
      <br>
      <!-- 表单 —— start-->
      <p>这是公司管理页面</p>
      <el-form ref="InboundAnalyForm" :inline="true">
        <!-- <el-form-item label="媒体">
          <el-select v-model.trim="InboundAnalysisForm.channelName" clearable placeholder="全部">
            <el-option v-for="item in ChannelGet" :label="item.label" :value="item.value" :key="item.value"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="公司">
          <el-input v-model.trim="InboundAnalysisForm.dept" style="width:225px" placeholder="按用部门查询"></el-input>
          <!-- <a href="javaScript:void(0)" @click="openTreeDialog">选择</a> -->
        </el-form-item>
        <el-form-item label="员工">
          <el-input v-model.trim="InboundAnalysisForm.name" style="width:225px" placeholder="按用户名或用户查询"></el-input>
        </el-form-item>
        <el-form-item label="时长">
          <el-select v-model.trim="InboundAnalysisForm.duration" placeholder="——请选择——">
            <el-option label=" >10秒" value="10"></el-option>
            <el-option label=" >30秒" value="30"></el-option>
            <el-option label=" >40秒" value="40"></el-option>
            <el-option label=" >1分钟" value="60"></el-option>
            <el-option label=" >5分钟" value="300"></el-option>
            <el-option label=" >15分钟" value="900"></el-option>
            <el-option label=" >30分钟" value="1800"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker v-model.trim="dateValue" type="datetimerange" @change="dateChange" placeholder="选择日期范围">
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="查看">
          <el-radio-group v-model.trim="InboundAnalysisForm.button">
            <el-radio label="media">按媒体</el-radio>
            <el-radio label="dept">按部门</el-radio>
            <el-radio label="rest">按坐席</el-radio>
          </el-radio-group>
          <el-checkbox v-model.trim="InboundAnalysisForm.checkBox">号码去重</el-checkbox>
        </el-form-item> -->
        <el-form-item label="">
          <el-button type="primary" @click="QueryAnalysis">统计</el-button>
          <el-button type="primary" @click="export2Excel">导出</el-button>
          <!-- <span>不参与统计： <a href="">0条</a></span>
          <span>无效数据： <a href="">0条</a></span> -->
        </el-form-item>
      </el-form>
      <!-- 表单 ——end-->
      <!-- 部门选择树 —— start -->
      <tree-menu :dialogState="isTreeDialog" ref="postinfo" @on-close="closeDialog" @post-node="getNodes">
      </tree-menu>
      <!-- 部门选择树 —— end -->
      <!-- 表格 ——start-->
      <el-table ref="multipleTable" v-loading="tableLoading" :data="tableData" border tooltip-effect="dark" style="width: 100%">
        <template v-if="isName">
          <el-table-column prop="name" label="用户名"></el-table-column>
        </template>
        <el-table-column label="名称">
          <template scope="scope">
            <span>{{scope.row.channelName }} </span>
            <span>{{scope.row.cName }} </span>
          </template>
        </el-table-column>
        <template v-if="isCode">
          <el-table-column prop="code" label="媒体"></el-table-column>
        </template>
        <el-table-column prop="connTotal" label="已接通"> </el-table-column>
        <el-table-column prop="disconnTotal" label="未接通"> </el-table-column>
        <el-table-column prop="callTotal" label="总电话量"> </el-table-column>
        <el-table-column label="接通率(%)">
          <template scope="scope">
            <span>{{scope.row.connRate}} %</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格 ——end-->
      <!-- 分页1 —— start-->
      <el-col :offset="6">
        <el-pagination @current-change="CurrentPageChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper,total" :total="totalrecord">
        </el-pagination>
      </el-col>
      <!-- 分页1 —— end-->
    </el-col>
  </el-row>
</template>
<script>
import treeMenu from '@/components/selectSector'

export default {
  components: {
    treeMenu,
  },
  data() {
    return {
      ChannelGet: [],
      // 呼入分析的表单
      InboundAnalysisForm: {
        channelName: '',
        dept: '',
        deptId: '',
        name: '',
        duration: '1800',
        button: 'media',
        checkBox: '',
        // 时间
        dateVal: '',
      },
      // 部门选择
      isTreeDialog: false,
      // 时间
      dateValue: '',
      // 表格
      tableData: [],
      tableLoading: false,
      isName: false, // 控制按坐席的用户名显示/隐藏
      isCode: false, // 控制按坐席的媒体显示/隐藏
      // 分页选中
      currentPage: 1,
      pageSize: 5, // 每页显示条数
      totalrecord: 0, // 总数据条数
    };
  },
  methods: {
    dateChange(val) {
      // console.log(val)
    },
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
      this.InboundAnalysisForm.dept = nodes[0].name
      this.InboundAnalysisForm.deptId = nodes[0].value
    },
    /************* 呼入分析 **************/
    // 格式化后的时间
    dateChange(val) {
      this.InboundAnalysisForm.dateVal = val;
    },
    // 呼入分析查询
    QueryAnalysis() {
      this.InboundAnalysisForm.currentPage = this.currentPage;
      this.getAnalysisTable()
    },
    // 分页变化时触发
    CurrentPageChange(val) {
      this.InboundAnalysisForm.currentPage = val;
      this.getAnalysisTable()
    },
    // 获取通话记录表格的数据
    getAnalysisTable() {
      this.tableLoading = true;
      console.log(JSON.stringify(this.InboundAnalysisForm))
      this.$axios.get('callInAnalyze_queryCallInList.action?jsonData=' + JSON.stringify(this.InboundAnalysisForm)).then(response => {
        this.tableLoading = false;
        try {
          console.log(response.data)
          let outgoingFmt = JSON.parse(response.data)
          let outgoingData = outgoingFmt.pageview
          this.tableData = outgoingData.records; // 表格数据
          this.pageSize = +outgoingData.page_size; // 每页显示条数
          this.totalrecord = +outgoingData.totalrecord; // 总数据条数
          this.tableData[0].name ? this.isName = true : this.isName = false; // 控制按坐席的用户名显示/隐藏
          this.tableData[0].code ? this.isCode = true : this.isCode = false; // 控制按坐席的媒体显示/隐藏
        } catch (e) {
          this.tableData = [];
          this.$message({ message: "未查询到数据！", type: 'error', });
        }
      }, response => {
        this.$message({ message: "查询数据失败："+response, type: 'error', });
      })
    },
    // 导出表格
    export2Excel() {　　　　　　
      require.ensure([], () => {　　　　　　　　
        const { export_json_to_excel } = require('@/vendor/Export2Excel');　　　　　　　　
        const tHeader = ["姓名", "已接通", "未接通", "总电话量", "接通率(%)"];　　　　　　　　
        const filterVal = ["channelName", "connTotal", "disconnTotal", "callTotal", "connRate"];　　　　　　　　
        const data = this.formatJson(filterVal, this.tableData);　　　　　　　　
        export_json_to_excel(tHeader, data, "呼入分析");
      })　　　　
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))　　　　
    },
  },
  created() {
    this.getChannel()
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
