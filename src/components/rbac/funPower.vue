<!-- 这是权限管理的功能权限 -->
<template>
  <div>
    <el-row>
      <el-col :span="2">
        <!-- <el-button type="primary" icon="plus" @click="isDialog = true">添加</el-button> -->
      </el-col>
      <el-col :span="8">
        <el-col :span="12">
          <el-input v-model.trim="searchForm.functionName" placeholder="搜索名称……"></el-input>
        </el-col>
        <el-col :offset="1" :span="2">
          <el-button type="primary" :plain="true" icon="search" @click="query">搜索</el-button>
        </el-col>
      </el-col>
    </el-row>
    <br />
    <!-- 添加弹框 —— start-->
  <!--   <el-dialog title="添加功能" :visible.sync="isDialog">
      <el-form :model="addFunForm" :rules="rules" ref="addFunForm" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="addFunForm.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="目标" prop="task">
          <el-input v-model.trim="addFunForm.task" placeholder="目标"></el-input>
        </el-form-item>
        <el-form-item label="功能代码" prop="code">
          <el-input v-model.trim="addFunForm.code" placeholder="功能代码"></el-input>
        </el-form-item>
        <el-form-item label="父级功能">
          <el-select v-model.trim="addFunForm" style="width:100%" placeholder="请选择父级功能">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="等级">
          <el-select v-model.trim="addFunForm" style="width:100%" placeholder="请选择等级">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isDialog = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog> -->
    <!-- 添加弹框 —— end-->
    <!-- 表格 ——start-->
    <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" v-loading="tableLoading" element-loading-text="拼命加载中" style="width: 100%">
      <el-table-column prop="functionId" label="ID">
      </el-table-column>
      <el-table-column prop="functionName" label="列表名称">
      </el-table-column>
      <el-table-column label="状态">
        <template scope="scope">{{ scope.row.status ==='V'?'有效':'无效' }}</template>
      </el-table-column>
      <el-table-column label="状态日期">
        <template scope="scope">{{ scope.row.statusDate.time | dateFormat }}</template>
      </el-table-column>
<!--       <el-table-column label="操作">
        <template scope="scope">
          <el-button size="small" type="danger" @click="delRow(scope.$index, scope.row)">删除</el-button>
          <el-button size="small" type="warning" @click="editRow(scope.$index, scope.row)">修改</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <br />
    <!-- 表格 ——end-->
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
// 功能权限以后可能会有增加，删除，修改等功能 先将html注释以后打开直接按需求整改
export default {
  data() {
    return {
      // 添加
      addFunForm: {
        name: '',
        task: '',
        code: '',
      },
      // 添加--验证
      rules: {
        name: { required: true, message: '请输入名称', trigger: 'blur' },
        task: { required: true, message: '请输入目标', trigger: 'blur' },
        code: { required: true, message: '请输入功能代码', trigger: 'blur' },
      },
      // 弹框
      isDialog: false,
      // 搜索
      searchForm: {functionName:''},
      // 表格
      tableData: [],
      tableLoading: false,
      // 分页
      currentPage: 1, // 选中页
      pageSize: 5, // 每页显示条数
      totalrecord: 0, // 总数据条数
    }
  },
  methods: {
    // 添加
    // add() {
    //   this.$refs.addFunForm.validate((valid) => {
    //     console.log(valid)
    //     if (valid) {
    //       this.tableLoading = true;
    //       this.$axios.get('sysUser_login.action?jsonData=', JSON.stringify(this.addFunForm)).then(response => {
    //         this.$message({ message: "新增成功！", type: 'success', });
    //         this.getTable();
    //         this.tableLoading = false;
    //       }, response => {
    //         this.$message({ message: "新增失败！", type: 'error', });
    //         this.tableLoading = false;
    //         return false;
    //       })
    //     } else {
    //       return false;
    //     }
    //   });
    // },
    // 查询
    query() {
      this.searchForm.currentPage = this.currentPage;
      this.getTable()
    },
    // 分页变化时触发
    CurrentPageChange(val) {
      this.searchForm.currentPage = val;
      this.getTable()
    },
    getTable() {
      this.tableLoading = true;
      this.$axios.get('function_queryList.action?jsonData=' + JSON.stringify(this.searchForm)).then(response => {
        this.tableLoading = false;
        try {
          let funFmt = JSON.parse(response.data)
          let funPage = funFmt.pageview;
          this.pageSize = +funPage.page_size; // 每页显示条数
          this.totalrecord = +funPage.totalrecord; // 总数据条数
          this.tableData = funPage.records; // 表格数据
          console.log(JSON.stringify(funPage.records))
        } catch (e) {
          this.tableData = [];
          this.$message({ message: "未查询到数据！", type: 'error', });
        }
      }, response => {
        this.tableData = [];
          this.$message({ message: "未查询到数据！", type: 'error', });
      })
    },
  },
  filters: {
    dateFormat(time) {
      if (time == undefined) { return "未获取到时间"; }
      var date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
    }
  },
  created() {

  }
}

</script>
<style lang="less" scoped>


</style>
