<!-- 这是员工管理的号码 -->
<template>
  <div>
    <br>
    <el-form ref="Nstateform" :inline="true">
      <el-form-item>
        <el-select v-model.trim="numberForm.state" placeholder="全部状态">
          <el-option label="全部状态" value="all"></el-option>
          <el-option label="使用" value="V"></el-option>
          <el-option label="未使用" value="I"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model.trim="numberForm.nameOrNum" placeholder="名称">
          <el-option label="名称" value="name"></el-option>
          <el-option label="号码" value="number"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model.trim="numberForm.UnameOrNum" placeholder="请输入用户名或号码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryNumber">查询</el-button>
        <!-- <el-dropdown>
          <el-button type="primary">
            操作<i class="el-icon-caret-bottom el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <p @click="delNumber">删除</p>
            </el-dropdown-item>
            <el-dropdown-item>
              <p @click="export2Excel">导出</p>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="NewAddNumber">新增</el-button>
        <el-button type="primary" @click="openUpFileDialog(1)">渠道分配</el-button>
        <el-button type="primary" @click="openUpFileDialog(2)">外呼分配</el-button>
      </el-form-item>
    </el-form>
    <!-- 渠道分配 && 外呼分配 弹框 ——start-->
    <el-dialog title="号码分配" :visible.sync="dialogUpFile">
      <el-form :model="uploadFile">
        <el-form-item label="上传文件：">
          <el-upload ref="uploadFile" action="/grucm/number_importExcel.action" accept="text/csv" name="numFile" :auto-upload="false">
            <el-button type="primary" icon="upload">选择文件</el-button>
            <div slot="tip" class="el-upload__tip">请根据下载的样例文件格式上传</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="下载样例：">
          <a href="/grucm/assign-media.xls" v-if="isXls === 1">
            <el-button type="info" icon="document">样例文件下载</el-button>
          </a>
          <a href="/grucm/assign-callout.xls" v-if="isXls === 2">
            <el-button type="info" icon="document">样例文件下载</el-button>
          </a>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUpFile = false">取 消</el-button>
        <el-button type="primary" @click="pushAllot">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 渠道分配 && 外呼分配 弹框 ——end-->
    <el-row>
      <!-- 表格 ——start-->
      <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" v-loading="tableLoading" element-loading-text="拼命加载中" style="width: 100%" @selection-change="tableSelectionChange">
        <el-table-column type="selection" width="50">
        </el-table-column>
        <el-table-column prop="acms" label="小号">
        </el-table-column>
        <!-- <el-table-column prop="channel_name" label="渠道">
        </el-table-column> -->
        <el-table-column prop="code" label="用户">
        </el-table-column>
        <el-table-column prop="name" label="姓名">
        </el-table-column>
        <!-- <el-table-column prop="bnum" label="呼转">
        </el-table-column>
        <el-table-column label="外呼">
          <template scope="scope">{{ scope.row.purpose==='O'?'是':'否' }}</template>
        </el-table-column>
        <el-table-column label="上线">
          <template scope="scope">{{ scope.row.state==='U'?'是':'否' }}</template>
        </el-table-column> -->
        <!-- <el-table-column label="操作">
          <template scope="scope">
            <el-button size="small" type="text" @click="seeNumber(scope.$index, scope.row)">查看</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <br>
      <!-- 表格 ——end-->
    </el-row>
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
export default {
  data() {
    return {
      ChannelGet: [],
      // 号码 select
      numberForm: {
        state: 'all',
        trumpet: 'all',
        bind: 'nothing',
        channel: '',
        Outbound: 'nothing',
        nameOrNum: 'name',
        UnameOrNum: '',
      },
      // 号码表格
      tableData: [],
      tableLoading: false,
      // 判断下载那个样例文件
      isXls: 1,
      // 渠道分配（弹框默认值）
      dialogUpFile: false,
      uploadFile: {},
      // 外呼分配（弹框默认值）
      // 分页
      pageSize: 5, // 每页显示条数
      totalrecord: 0, // 总数据条数
      currentPage: 1, // 分页选中
      multipleSelection: [], // 表格多选框的值
      // 详细信息表格
      InfoTable: [],
    }
  },
  methods: {
    // 获取渠道下拉框信息
    getChannel() {
      this.$axios.get('channel_channelList.action').then(response => {
        this.ChannelGet = JSON.parse(response.data)
      })
    },
    // *****号码
    // 查询号码
    queryNumber() {
      this.numberForm.currentPage = this.currentPage;
      this.getNumberTable()
    },
    // 分页变化时触发
    CurrentPageChange(val) {
      this.numberForm.currentPage = val;
      this.getNumberTable()
    },
    // 表格多选框变化时触发
    tableSelectionChange(val) {
      this.multipleSelection = val.map((r) => { return r.acms });
      console.log(this.multipleSelection)
    },
    // 获取号码表格的数据
    getNumberTable() {
      this.tableLoading = true;
      this.$axios.get('number_queryNumberList.action?jsonData=' + JSON.stringify(this.numberForm)).then(response => {
        this.tableLoading = false;
        try {
          let numberData = JSON.parse(response.data)
          this.pageSize = +numberData.pageview.page_size; // 每页显示条数
          this.totalrecord = +numberData.pageview.totalrecord; // 总数据条数
          this.tableData = numberData.pageview.records;
          console.log(numberData.pageview.records)
        } catch (e) {
          this.tableData = [];
          this.$message({ message: "未查询到数据！", type: 'error', });
        }
      }, response => {
        this.tableLoading = false;
        this.$message({  type: 'error', message: "查询数据失败："+response,});
      })
    },
    // 新增（媒体号码）
    NewAddNumber() {
      this.$prompt('请输入媒体号码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[1-9]\d*$/,
        inputErrorMessage: '媒体号码格式不正确'
      }).then(({ value }) => {
        this.$axios.get('number_add.action?acms=' + value).then(response => {
          this.$message({ type: 'success', message: '新增媒体号码成功'});
          this.queryNumber();
        }, response => {
          this.$message({ type: 'error',  message: "新增媒体号码失败："+response});
        })
      }).catch(() => {
        this.$message({ type: 'info', message: '取消输入' });
      });
    },
    // 删除
    delNumber() {
      if (this.multipleSelection.length <= 0) {
        this.$message({ type: 'info', message: '请选择您要删除的账户' });
        return;
      }
      this.$confirm('您确定要将选中的用户删除吗？', '删除账户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.get("number_delete.action?acms=" + JSON.stringify(this.multipleSelection)).then(response => {
          this.$message({ type: 'success', message: '删除账户成功' });
          this.queryNumber();
        }, response => {
          this.$message({  type: 'error', message: "删除账户失败："+response});
        })
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除账户' });
      });
    },
    // 导出
    // 导出表格
    export2Excel() {　　　　　　
      require.ensure([], () => {　　　　　　　　
        const { export_json_to_excel } = require('@/vendor/Export2Excel');　　　　　　　　
        // const tHeader = ["小号", "渠道", "用户", "姓名", "呼转", "外呼", "上线"];　　　　　　　　
        // const filterVal = ["acms", "channel_name", "code", "name", "bnum", "purpose", "state"];
        const tHeader = ["小号",  "用户", "姓名"];　　　　　　　　
        const filterVal = ["acms",  "code", "name"];
        const data = this.formatJson(filterVal, this.tableData);　　　　　　　　
        export_json_to_excel(tHeader, data, "员工管理-号码");
      })　　　　
    },
    formatJson(filterVal, jsonData) {　　　　　　
      return jsonData.map(v => filterVal.map(j => v[j]))　　　　
    },
    // 打开 渠道分配 && 外呼分配 弹框
    openUpFileDialog(isXls) {
      this.dialogUpFile = true;
      this.isXls = isXls; // 判断下载那个样例文件
    },
    // 渠道分配 && 外呼分配
    pushAllot() {
      console.log("uploadAllot")
      this.$refs.uploadFile.submit();
      this.dialogUpFile = false;
      this.$message({ message: "上传成功！", type: 'success', });
      this.queryNumber();
    },
    // 查看
    seeNumber(i, row) {
      this.$axios.get('number_queryStaffByAcms.action?acms=' + row.acms).then(response => {
        let searchData = JSON.parse(response.data)
        if (searchData.totalrecord > 0) {
          this.$emit('on-search-table-info', response.data)
        } else {
          this.$message({ type: 'info', message: "未查询到数据！" });
        }
      }, response => {
        this.$message({ type: 'error',  message: "查看账户失败："+response});
      })
    },
  },
  created() {
    this.getChannel()
  }
}

</script>
<style lang="less" scoped>
.el-dropdown-menu__item>p {
  margin: 0px;
}

</style>
