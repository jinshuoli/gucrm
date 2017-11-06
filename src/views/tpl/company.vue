<!-- 公司管理页面 -->
<template>
  <el-row>
    <el-col :offset="1" :span="18">
      <br>
      <!-- 表单 —— start-->
      <h3>公司管理</h3>
      <el-form ref="InboundAnalyForm" :inline="true">
        <el-form-item label="公司">
          <el-input v-model.trim="companyForm.c_name" style="width:225px" placeholder="按用企业名称查询"></el-input>
        </el-form-item>
        <el-form-item label="编号">
          <el-input v-model.trim="companyForm.code" style="width:225px" placeholder="按企业编号查询"></el-input>
        </el-form-item>
        <el-form-item label="法人">
          <!-- 这里需要加字段 -->
          <el-input v-model.trim="companyForm.legalperson" style="width:225px" placeholder="按企业法人查询"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="QueryCompany">查询</el-button>
          <el-button type="primary" @click="dialogFormVisible = true">新增</el-button>
        </el-form-item>
      </el-form>
      <!-- 表单 ——end-->
      <!-- 表格 ——start-->
      <el-table ref="multipleTable" v-loading="tableLoading" :data="tableData" border tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="c_name" label="公司名称"></el-table-column>
        <el-table-column prop="code" label="公司编码"></el-table-column>
        <el-table-column prop="descry" label="公司简称">
        </el-table-column>
        <el-table-column prop="status" label="公司状态">
          <template scope="scope">{{ scope.row.status==='V'?'有效':'无效' }}</template>
        </el-table-column>
        <el-table-column prop="state" label="审核状态"> </el-table-column>
        <el-table-column prop="business_licence" label="营业执照副本"> </el-table-column>
        <el-table-column prop="social_code" label="工商执照注册号">
        </el-table-column>
        <el-table-column prop="legalperson" label="企业法人"> </el-table-column>
        <el-table-column prop="linkman" label="联系人"> </el-table-column>
        <el-table-column prop="linktel" label="联系电话"> </el-table-column>
        <el-table-column label="操作" width="200px">
          <template scope="scope">
            <el-button size="small" type="text" @click="clickEdit(scope.$index, scope.row)">修改</el-button>
            <el-button size="small" type="text" @click="clickDel(scope.$index, scope.row)">删除</el-button>
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
      <!-- 弹框 —— start-->
      <el-dialog title="公司管理" :visible.sync="dialogFormVisible">
        <el-form :model="addCompanyForm" :rules="rules" label-width="80px">
          <el-form-item label="公司" prop="c_name">
            <el-input v-model.trim="addCompanyForm.c_name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="编号" prop="code">
            <el-input v-model.trim="addCompanyForm.code" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="法人" prop="legalperson">
            <el-input v-model.trim="addCompanyForm.legalperson" auto-complete="off"></el-input>
            </el-select>
          </el-form-item>
          <el-form-item label="联系人" prop="linkman">
            <el-input v-model.trim="addCompanyForm.linkman" auto-complete="off"></el-input>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCompanyOK">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 弹框 —— end-->
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
      // 查询
      companyForm: {
        code: '', //编号
        c_name: '', //公司
        legalperson: "", //法人
        linkman: "", //联系人
      },
      // 表格
      tableData: [],
      tableLoading: false,
      // 新增
      dialogFormVisible: false,
      addCompanyForm: {
        code: '', //编号
        c_name: '', //公司
        legalperson: "", //法人
        linkman: "", //联系人
      },
      // 分页选中
      currentPage: 1,
      pageSize: 5, // 每页显示条数
      totalrecord: 0, // 总数据条数
    };
  },
  methods: {
    // ========== 公司管理
    // 格式化后的时间
    dateChange(val) {
      this.companyForm.dateVal = val;
    },
    // 公司查询
    QueryCompany() {
      this.companyForm.currentPage = this.currentPage;
      this.getCompanyTable()
    },
    // 分页变化时触发
    CurrentPageChange(val) {
      this.companyForm.currentPage = val;
      this.getCompanyTable()
    },
    // 获取通话记录表格的数据
    getCompanyTable() {
      this.tableLoading = true;
      console.log(JSON.stringify(this.companyForm))
      this.$axios.get('company_findallCompany.action?jsonData=' + JSON.stringify(this.companyForm)).then(response => {
        this.tableLoading = false;
        try {
          console.log(response.data)
          let companyFmt = JSON.parse(response.data)
          let companyData = companyFmt.pageview
          this.tableData = companyData.records; // 表格数据
          this.pageSize = +companyData.page_size; // 每页显示条数
          this.totalrecord = +companyData.totalrecord; // 总数据条数
        } catch (e) {
          this.tableData = [];
          this.$message({ message: "未查询到数据！", type: 'error', });
        }
      }, response => {
        this.$message({ message: "查询数据失败：" + response, type: 'error', });
      })
    },
    //新增
    addCompanyOK() {
      this.dialogFormVisible = false
      this.$axios.post("company_addCompany.action?jsonData=" + JSON.stringify(this.addCompanyForm)).then(response => {
        this.$message({ message: "新增公司成功", type: 'success' });
        this.getCompanyTable();
      }, response => {
        this.$message({ message: "新增公司失败：" + response, type: 'error' })
      })
    },
    // 删除
    clickDel(index, row) {
      this.$confirm('您确定要将这个公司删除吗？', '删除公司', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        this.$axios.get("company_delete.action?id=" + row.id).then(response => {
          this.$message({ message: "删除公司成功", type: 'success' });
          this.getCompanyTable();
        }, response => {
          this.$message({ message: "删除公司失败：" + response, type: 'error' })
        })

      }).catch(() => {
        this.$message({ message: '已取消删除', type: 'info', });
      });
    },
  },
  created() {

  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
