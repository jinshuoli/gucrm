<!-- 呼入记录里的通话记录 -->
<template>
  <div>
    <el-form ref="CallLogForm" :inline="true">
      <!-- <p> 公司 【 {{callLogForm.dept}} 】 <a href="javaScript:void(0)" @click="openTreeDialog">选择</a> </p> -->
      <!-- <el-form-item>
        <el-select v-model.trim="callLogForm.Channel" clearable placeholder="全部渠道">
          <el-option v-for="item in ChannelGet" :label="item.label" :value="item.value" :key="item.value"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item style="width:150px;">
        <el-select v-model.trim="callLogForm.adviser" placeholder="员工名称">
          <el-option label="员工名称" value="name"></el-option>
          <el-option label="员工号码" value="tel"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model.trim="callLogForm.nameOrUser" placeholder="按顾问名称或号码查询"></el-input>
      </el-form-item>
      <el-form-item style="width:150px;">
        <el-select v-model.trim="callLogForm.customer" placeholder="客户号码">
          <el-option label="客户号码" value="utel"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model.trim="callLogForm.CustomerNumber" placeholder="按客户号码查询"></el-input>
      </el-form-item>
    </el-form>
    <!-- 部门选择树 —— start  -->
    <tree-menu :dialogState="isTreeDialog" ref="postinfo" @on-close="closeDialog" @post-node="getNodes">
    </tree-menu>
    <!-- 部门选择树 —— end -->
    <!-- 时间区域选择 —— start -->
    <el-form ref="Timeform" :inline="true">
      <el-form-item label="时间：" tag="div">
        <el-date-picker v-model.trim="dateValue" type="datetimerange" @change="dateChange" placeholder="选择日期范围">
        </el-date-picker>
        <!-- <el-checkbox v-model.trim="callLogForm.isDiff">号码去重</el-checkbox> -->
        <el-button type="primary" @click="QueryOutgoing">查询</el-button>
        <el-button type="primary" @click="export2Excel">导出</el-button>
      </el-form-item>
    </el-form>
    <!-- 时间区域选择 —— end-->
    <!-- 表格 —— start -->
    <el-table ref="multipleTable" v-loading="tableLoading" :data="tableData" border tooltip-effect="dark" style="width: 100%">
      <el-table-column prop="name" label="员工名称">
      </el-table-column>
      <el-table-column prop="tel" label="员工号码">
      </el-table-column>
      <el-table-column prop="utel" label="客户号码">
      </el-table-column>

        <el-table-column label="拨打时间" width="160px">
          <template scope="scope">
            <!-- {{scope.row.call_time.time | dateFormat}} -->
            {{scope.row.call_time}}
          </template>
        </el-table-column>
      <template v-hide="!callLogForm.isDiff">
        <el-table-column prop="duration" label="时长(秒)">
        </el-table-column>
        <el-table-column prop="csName" label="状态">
        </el-table-column>
        <el-table-column label="录音" width="80px">
          <template scope="scope">
            <el-tooltip class="item" effect="dark" content="无录音" placement="left-start ">
              <el-button v-if="scope.row.callrecording <= 0" size="small" :plain="true" :disabled="true">
                <i class="fa fa-pause-circle fa-2x" aria-hidden="true"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="播放录音" placement="right-start ">
              <el-button v-if="scope.row.callrecording > 0" size="small" @click="playAudio(scope.$index, scope.row)">
                <i class="fa fa-play-circle fa-2x" aria-hidden="true"></i>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </template>
      <!--      <el-table-column prop="" label="更多">
      </el-table-column> -->
    </el-table>
    <br>
    <!-- 表格 —— end-->
    <!-- 分页 —— start -->
    <el-row>
      <el-col :offset="8">
        <el-pagination @current-change="CurrentPageChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper,total" :total="totalrecord">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 分页 —— end-->
    <!-- 播放录音弹框 —— start -->
    <el-dialog title="播放录音" :visible.sync="dialogAudio" @close="stopAudio">
      <audio autoplay controls onclick="this.play();" id="audio" style="width:100%">
        <source :src="audioSrc" type="audio/mpeg"> 您的浏览器版本太低，不支持播放音频文件！
      </audio>
      <p>录音文件：
        <a :href="audioSrc" :download="audioSrc">
          <el-button type="primary" size="small" tag="i" class="fa fa-arrow-circle-down">&nbsp;&nbsp;下载</el-button>
        </a>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="stopAudio">取 消</el-button>
        <el-button type="primary" @click="stopAudio">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 播放录音弹框 —— end-->
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
      // 选择部门
      isTreeDialog: false,
      // 呼出记录的表单（头）
      callLogForm: {
        dept: '全部',
        deptId: '',
        Channel: '',
        adviser: 'name',
        nameOrUser: '',
        customer: '客户号码',
        CustomerNumber: '',
        isDiff: false,
        // 时间
        dateVal: '',
      },
      dateValue: '',
      audioSrc: '',
      // 表格(通话记录)
      tableData: [],
      tableLoading: false,
      dialogAudio: false,
      // 分页--默认状态1
      currentPage: 1, // 选中页
      pageSize: 5, // 每页显示条数
      totalrecord: 0, // 总数据条数
    };
  },
  methods: {
    // 获取渠道下拉框信息
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
      this.callLogForm.dept = nodes[0].name
      this.callLogForm.deptId = nodes[0].value
    },
    /************* 通话记录 **************/
    // 格式化后的时间
    dateChange(val) {
      this.callLogForm.dateVal = val;
    },
    // 呼出查询
    QueryOutgoing() {
      this.callLogForm.currentPage = this.currentPage;
      this.getOutgoingTable()
    },
    // 分页变化时触发1
    CurrentPageChange(val) {
      this.callLogForm.currentPage = val;
      this.getOutgoingTable()
    },
    // 获取通话记录表格的数据
    getOutgoingTable() {
      this.tableLoading = true;
      this.$axios.get('callRecords_queryCallInList.action?jsonData=' + JSON.stringify(this.callLogForm)).then(response => {
        this.tableLoading = false;
        try {
          console.table(JSON.parse(response.data))
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
        this.$message({ message: "查询数据失败" + response, type: 'error', });
      })
    },
    // 导出表格
    export2Excel() {　　　　　　
      require.ensure([], () => {　　　　　　　　
        const { export_json_to_excel } = require('@/vendor/Export2Excel');
        const tHeader = ["员工名称", "员工号码", "客户号码", "拨打时间", "时长", "状态"];　　　　　　　　
        const filterVal = ["name", "tel", "utel", "call_time", "duration", "csName"];　　　　　　　　　　　　
        const data = this.formatJson(filterVal, this.tableData);　　　　　　　　
        export_json_to_excel(tHeader, data, "通话记录");
      })　　　　
    },
    formatJson(filterVal, jsonData) {　　　　　　
      return jsonData.map(v => filterVal.map(j => v[j]))　　　　
    },
    // 播放录音
    playAudio(index, row) {
      this.dialogAudio = true;
      // 给后台传ID，获取音频文件路径
      this.$axios.get('callRecords_audioPlayer.action?callId=' + row.callId).then(response => {
        this.audioSrc = "/gucrm/record/" + response.data;
        // 重载录音
        document.getElementById('audio').load()
      })
    },
    // 停止播放录音
    stopAudio() {
      document.getElementById('audio').pause();
      this.audioSrc = "";
      this.dialogAudio = false;
    },
  },
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
