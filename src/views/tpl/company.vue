<!-- 公司管理页面 -->
<template>
  <el-row>
    <el-col :offset="1" :span="22">
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
          <el-button type="primary" @click="AddDialogVisible = true">新增</el-button>
        </el-form-item>
      </el-form>
      <!-- 表单 ——end-->
      <!-- 表格 ——start-->
      <el-table ref="multipleTable" v-loading="tableLoading" :data="tableData" border tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="c_name" label="公司名称"></el-table-column>
        <el-table-column prop="code" label="公司编码"></el-table-column>
        <el-table-column label="公司状态">
          <template scope="scope">{{ scope.row.status==='V'?'有效':'无效' }}</template>
        </el-table-column>
        <el-table-column prop="state" label="审核状态">
          <template scope="scope">
            <span v-if="scope.row.state==='S'">审核成功</span>
            <span v-else-if="scope.row.state==='M'">审核中</span>
            <span v-else="scope.row.state==='F'">审核失败</span>
          </template>
        </el-table-column>
        <el-table-column prop="social_code" label="工商执照注册号">
        </el-table-column>
        <el-table-column prop="legalperson" label="企业法人"> </el-table-column>
        <el-table-column label="录音">
          <template scope="scope">{{ scope.row.callrecording==='1'?'是':'否' }}</template>
        </el-table-column>
        <el-table-column prop="linkman" label="联系人"> </el-table-column>
        <el-table-column prop="linktel" label="联系电话"> </el-table-column>
        <el-table-column fiexd="right" label="操作" width="200">
          <template scope="scope">
            <el-button size="small" type="text" @click="clickEdit(scope.$index, scope.row)">修改</el-button>
            <el-button size="small" type="text" @click="clickDel(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <br />
      <!-- 表格 ——end-->
      <!-- 分页1 —— start-->
      <el-col :offset="8" :span="6">
        <el-pagination @current-change="CurrentPageChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper,total" :total="totalrecord">
        </el-pagination>
      </el-col>
      <!-- 分页1 —— end-->
      <!-- 新增公司弹框 —— start-->
      <el-dialog title="公司管理" :visible.sync="AddDialogVisible">
        <el-form :model="addCompanyForm" :rules="rules" ref="addCompanyForm" label-width="80px">
          <el-form-item label="公司" prop="c_name">
            <el-input v-model.trim="addCompanyForm.c_name" class="inp"></el-input>
          </el-form-item>
          <el-form-item label="编号" prop="code">
            <el-input v-model.trim="addCompanyForm.code" class="inp"></el-input>
          </el-form-item>
          <el-form-item label="法人" prop="legalperson">
            <el-input v-model.trim="addCompanyForm.legalperson" class="inp"></el-input>
            </el-select>
          </el-form-item>
          <el-form-item label="联系人" prop="linkman">
            <el-input v-model.trim="addCompanyForm.linkman" class="inp"></el-input>
            </el-select>
          </el-form-item>
          <el-form-item label="联系电话" prop="linktel">
            <el-input v-model.trim="addCompanyForm.linktel" class="inp"></el-input>
            </el-select>
          </el-form-item>
          <el-form-item label="注册号" prop="social_code">
            <el-input v-model.trim="addCompanyForm.social_code" class="inp" placeholder="工商执照注册号/统一社会信用代号"></el-input>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="AddDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCompanyOK('addCompanyForm')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 新增公司弹框 —— end-->
      <!-- 修改公司弹框 —— start-->
      <el-dialog title="公司管理" :visible.sync="EditDialogVisible">
        <el-form :model="EditCompanyForm" :rules="rules" ref="EditCompanyForm" label-width="80px">
          <el-form-item label="公司" prop="c_name">
            <el-input v-model.trim="EditCompanyForm.c_name" class="inp"></el-input>
          </el-form-item>
          <el-form-item label="编号" prop="code">
            <el-input v-model.trim="EditCompanyForm.code" class="inp"></el-input>
          </el-form-item>
          <el-form-item label="法人" prop="legalperson">
            <el-input v-model.trim="EditCompanyForm.legalperson" class="inp"></el-input>
            </el-select>
          </el-form-item>
          <el-form-item label="联系人" prop="linkman">
            <el-input v-model.trim="EditCompanyForm.linkman" class="inp"></el-input>
            </el-select>
          </el-form-item>
          <el-form-item label="联系电话" prop="linktel">
            <el-input v-model.trim="EditCompanyForm.linktel" class="inp"></el-input>
            </el-select>
          </el-form-item>
          <el-form-item label="注册号" prop="social_code">
            <el-input v-model.trim="EditCompanyForm.social_code" class="inp" placeholder="工商执照注册号/统一社会信用代号"></el-input>
            </el-select>
          </el-form-item>
          <el-form-item label="录音">
            <el-checkbox label="是否录音" v-model.trim="EditCompanyForm.callrecording" true-label="1" false-label="0"></el-checkbox>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="EditDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="EditCompanyOK('EditCompanyForm')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 修改公司弹框 —— end-->
    </el-col>
  </el-row>
</template>
<script>
export default {
  data() {
    return {
      ChannelGet: [],
      // 查询
      companyForm: {
        id: "", //公司id
        code: '', //编号
        c_name: '', //公司
        legalperson: "", //法人
        linkman: "", //联系人
        linktel: "", //联系电话
      },
      // 表格
      tableData: [],
      tableLoading: false,
      // 新增
      AddDialogVisible: false,
      addCompanyForm: {
        code: '', //编号
        c_name: '', //公司
        legalperson: "", //法人
        linkman: "", //联系人
        linktel: "", //联系电话
        social_code: "", //注册号
      },
      // 修改
      EditDialogVisible: false,
      EditCompanyForm: {
        id: "", //公司id
        code: '', //编号
        c_name: '', //公司
        legalperson: "", //法人
        linkman: "", //联系人
        linktel: "", //联系电话
        social_code: "", //注册号
        callrecording: '0'
      },
      // 分页选中
      currentPage: 1,
      pageSize: 5, // 每页显示条数
      totalrecord: 0, // 总数据条数
      // 表单验证
      rules: {
        c_name: [
          { required: true, message: '请输入公司名', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入编号', trigger: 'blur' },
          { min: 0, max: 11, message: '长度在 0 到 11 个字符', trigger: 'blur' }
        ],
        legalperson: [
          { required: true, message: '请输入法人姓名', trigger: 'blur' },
          { min: 2, max: 4, message: '长度在 2 到 4 个字符', trigger: 'blur' }
        ],
        linkman: [
          { required: true, message: '请输入联系人', trigger: 'blur' },
          { min: 2, max: 4, message: '长度在 2 到 4 个字符', trigger: 'blur' }
        ],
        linktel: [
          { required: true, message: '请输入联系人电话', trigger: 'blur' },
          { min: 11, max: 11, message: '长度位11位手机号', trigger: 'blur' }
        ],
        social_code: [
          { required: true, message: '请输入工商执照注册号', trigger: 'blur' }
        ]

      }
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
    addCompanyOK(formName) {
      // debugger;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post("company_addCompany.action?jsonData=" + JSON.stringify(this.addCompanyForm)).then(response => {
            try {
              let returnInfo = JSON.parse(response.data)
              this.$message({ message: returnInfo.message, type: returnInfo.type, });
            } catch (e) {
              this.$message({ message: "新增公司失败：return data error", type: 'error', });
            }
            this.getCompanyTable();
            this.$refs[formName].resetFields();
          }, response => {
            this.$message({ message: "新增公司失败：" + response, type: 'error' })
          })
          this.AddDialogVisible = false
        } else {
          this.$message({ message: "请正确填写公司信息！", type: 'error' })
          return false;
        }
      })
    },
    clickEdit(i, row) {
      this.EditDialogVisible = true
      this.EditCompanyForm.id = row.id
      this.EditCompanyForm.c_name = row.c_name
      this.EditCompanyForm.code = row.code
      this.EditCompanyForm.status = row.status
      this.EditCompanyForm.state = row.state
      this.EditCompanyForm.social_code = row.social_code
      this.EditCompanyForm.legalperson = row.legalperson
      this.EditCompanyForm.linkman = row.linkman
      this.EditCompanyForm.linktel = row.linktel
      this.EditCompanyForm.callrecording = row.callrecording
    },
    EditCompanyOK(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post("company_updateCompany.action?jsonData=" + JSON.stringify(this.EditCompanyForm)).then(response => {
            this.$message({ message: "修改公司成功", type: 'success' });
            this.getCompanyTable();
            this.$refs[formName].resetFields();
          }, response => {
            this.$message({ message: "修改公司失败：" + response, type: 'error' })
          })
          this.EditDialogVisible = false
        } else {
          this.$message({ message: "请正确填写公司信息！", type: 'error' })
          return false;
        }
      })
    },
    // 删除
    clickDel(i, row) {
      this.$confirm('您确定要将这个公司删除吗？', '删除公司', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.get("company_delete.action?id=" + row.id).then(response => {
          this.$message({ message: "删除账号成功", type: 'success' });
          this.getCompanyTable();
          // try {
          //   let returnInfo = JSON.parse(response.data)
          //   this.$message({ message: returnInfo.message, type: returnInfo.type, });
          // } catch (e) {
          //   this.$message({ message: "删除公司失败：return data error", type: 'error', });
          // }
          // this.getCompanyTable();
        }, response => {
          this.$message({ message: "删除公司失败：" + response, type: 'error', })//不是200都会提示
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
.inp {
  width: 80%;
}

</style>
