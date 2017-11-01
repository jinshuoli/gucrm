<!-- 这是员工管理的员工 -->
<template>
  <div>
    <!-- <p> 部门 【 {{staffForm.org}} 】 <a href="javaScript:void(0)" @click="openTreeDialog">选择</a> </p> -->
    <!-- 部门选择树 —— start -->
    <tree-menu :dialogState="isTreeDialog" ref="postinfo" @on-close="closeDialog" @post-node="getNodes"></tree-menu>
    <!-- 部门选择树 —— end -->
    <!-- 查询项的表单 —— start -->
    <el-form ref="staffform">
      <el-form-item>
        <!-- <el-select v-model.trim="staffForm.duty" clearable placeholder="全部职务">
          <el-option v-for="item in dutyGet" :label="item.label" :value="item.label" :key="item.value">
          </el-option>
        </el-select>
        <el-select v-model.trim="staffForm.power" placeholder="全部权限">
          <el-option label="全部权限" value="all"></el-option>
          <el-option label="有" value="1"></el-option>
          <el-option label="无" value="0"></el-option>
        </el-select> -->
        <el-select v-model.trim="staffForm.state" placeholder="全部状态">
          <el-option label="全部状态" value="all"></el-option>
          <el-option label="正常" value="V"></el-option>
          <el-option label="冻结" value="I"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="小号">
        <el-select v-model.trim="staffForm.channel" clearable placeholder="不计渠道">
          <el-option v-for="item in ChannelGet" :label="item.label" :value="item.value" :key="item.value">
          </el-option>
        </el-select>
        <el-select v-model.trim="staffForm.outbound" placeholder="不计外呼">
          <el-option label="不计外呼" value="nothing"></el-option>
          <el-option label="有外呼" value="Y"></el-option>
          <el-option label="无外呼" value="N"></el-option>
        </el-select>//需要注释掉的
      </el-form-item> -->
    </el-form>
    <el-row>
      <el-col :span="5">
        <el-select v-model.trim="staffForm.Name" placeholder="姓名">
          <el-option label="姓名" value="name"></el-option>
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-input v-model.trim="staffForm.nameOrNum" placeholder="请输入用姓名或号码"></el-input>
      </el-col>
      <el-col :span="5">
        <el-button type="primary" @click="queryStaff">查询</el-button>
        <!-- <el-dropdown>
          <el-button type="primary">
            操作<i class="el-icon-caret-bottom el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown" style="">
            <el-dropdown-item><p @click="freeze">冻结</p></el-dropdown-item>
            <el-dropdown-item><p @click="unfreeze">解冻</p></el-dropdown-item>
            <el-dropdown-item><p @click="upLine">上线</p></el-dropdown-item>
            <el-dropdown-item><p @click="downLine">下线</p></el-dropdown-item>
            <el-dropdown-item><p @click="export2Excel">导出</p></el-dropdown-item>
            <el-dropdown-item><p @click="unAllBind">解绑</p></el-dropdown-item>
            <el-dropdown-item><p @click="AllDel">删除</p></el-dropdown-item>
            <el-dropdown-item><p @click="changeDept">更换部门</p></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
      </el-col>
      <el-col :offset="3" :span="5">
        <el-button type="primary" @click="AddStaffDialog = true">新增</el-button>
        <el-button type="primary" @click="dialogImportFile = true">导入</el-button>
        <!-- <el-button type="primary">删除</el-button> -->
      </el-col>
    </el-row>
    <br>
    <!-- 查询项的表单 —— end -->
    <!-- 表格 ——start-->
    <el-table ref="multipleTable" v-loading="tableLoading" :data="tableData" border tooltip-effect="dark" style="width: 100%" @selection-change="tableSelectionChange">
      <el-table-column type="selection" width="50">
      </el-table-column>
      <el-table-column prop="name" label="姓名">
      </el-table-column>
      <el-table-column prop="duty" label="职务">
      </el-table-column>
      <el-table-column prop="code" label="用户">
      </el-table-column>
      <el-table-column prop="org_name" label="公司">
      </el-table-column>
      <el-table-column label="绑定信息">
        <template scope="scope">
          <el-popover trigger="hover" placement="top">
            <template v-if="scope.row.subrelas.length === 0">
              <el-tag type="danger">无 号 码 关 系 :)</el-tag>
            </template>
            <template v-if="scope.row.subrelas.length >= 1" v-for="item in scope.row.subrelas">
              <p>
                <el-tag :type="'success'" close-transition>{{item.channelName}}</el-tag>
                <el-tag :type="'primary'" close-transition>主叫：{{item.anum}} </el-tag>
                <el-tag :type="'primary'" close-transition>小号：{{item.xnum}} </el-tag>
                <el-tag :type="'warning'" close-transition>{{item.upline}}</el-tag>
              </p>
            </template>
            <div slot="reference" class="name-wrapper">
              <el-tag>号码关系</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="权限">
        <template scope="scope">
          {{ scope.row.data_permission===1 ?'有权限':'无权限' }}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template scope="scope">{{ scope.row.status==='V' ?'正常':'冻结' }}</template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template scope="scope">
          <el-button size="small" type="text" @click="openEditStaff(scope.$index, scope.row)">编辑</el-button>
          <!-- <el-button size="small" type="text" @click="unBind(scope.$index, scope.row)">解绑</el-button>
          <el-button size="small" type="text" @click="openChangeBind(scope.$index, scope.row)">换绑</el-button> -->
          <el-button size="small" type="text" @click="handleDel(scope.$index, scope.row)">删除</el-button>
          <el-button size="small" type="text" @click="resetPwd(scope.$index, scope.row)">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br />
    <!-- 表格 ——end-->
    <!-- 分页 —— start-->
    <el-row>
      <el-col :offset="8">
        <el-pagination @size-change="currentPage" @current-change="CurrentPageChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper,total" :total="totalrecord">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 分页 —— end-->
    <!-- 新增员工弹框 —— start -->
    <el-dialog title="新增员工" :visible.sync="AddStaffDialog">
      <el-form :model="AddStaffV" :inline="true">
        <el-form-item label="用户：">
          <el-input v-model.trim="AddStaffForm.code" auto-complete="off" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <!-- <el-checkbox v-model.trim="AddStaffForm.power" :true-label="1" :false-label="0">权限</el-checkbox> -->
          <el-checkbox v-model.trim="AddStaffForm.frozen" true-label="I" false-label="V">冻结</el-checkbox>
        </el-form-item>
        <el-form-item label="姓名：">
          <el-input v-model.trim="AddStaffForm.name" auto-complete="off" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="职务：">
          <el-select v-model.trim="AddStaffForm.duty" placeholder="全部职务">
            <el-option v-for="item in dutyGet" :label="item.label" :value="item.label" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身份证">
          <el-input v-model.trim="AddStaffForm.idcard" auto-complete="off" placeholder="可选"></el-input>
        </el-form-item>
        <el-form-item label="部门：">
          【 {{AddStaffForm.org}} 】
          <el-button auto-complete="off" @click="openTreeDialog">选择部门</el-button>
        </el-form-item>
        <!-- <el-form-item label="号码：">
          <el-button auto-complete="off" icon="plus" @click="AddRow(AddStaffForm.numberList)">添加号码</el-button>
          <span style="color:gray">（用途-小号-被叫）</span>
        </el-form-item> -->
        <!-- 动态添加号码 —— start -->
        <el-form-item v-for="(items,index) in AddStaffForm.numberList" :key="index">
          <i class="el-icon-close" @click="delRow(AddStaffForm.numberList,items)"></i>
          <el-select style="width:160px;" v-model.trim="items.channelVal">
            <el-option v-for="(item,index) in items.channel" :value="item.value" :label="item.label" :key="index"></el-option>
          </el-select> -
          <el-input v-model.trim="items.master" style="width:160px;" placeholder="主叫">主叫</el-input> -
          <el-input v-model.trim="items.trumpet" style="width:160px;" placeholder="小号"></el-input> -
          <el-checkbox v-model.trim="items.upline">上线</el-checkbox>
        </el-form-item>
        <!-- 动态添加号码 —— end -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="AddStaffDialog = false">取 消</el-button>
        <el-button type="primary" @click="AddStaff">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 新增员工弹框 —— end -->
    <!-- 修改员工弹框 —— start -->
    <el-dialog title="修改员工" :visible.sync="EditStaffDialog">
      <el-form :model="EditStaffV" :inline="true">
        <el-form-item label="用户：">
          <el-input v-model.trim="EditStaffForm.code" auto-complete="off" :disabled="true" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model.trim="EditStaffForm.power" :true-label="1" :false-label="0">权限</el-checkbox>
          <el-checkbox v-model.trim="EditStaffForm.frozen" true-label="I" false-label="V">冻结</el-checkbox>
        </el-form-item>
        <el-form-item label="姓名：">
          <el-input v-model.trim="EditStaffForm.name" auto-complete="off" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="职务：">
          <el-select v-model.trim="EditStaffForm.duty" placeholder="全部职务">
            <el-option v-for="item in dutyGet" :label="item.label" :value="item.label" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身份证">
          <el-input v-model.trim="EditStaffForm.idcard" auto-complete="off" placeholder="可选"></el-input>
        </el-form-item>
        <el-form-item label="部门：">
          【 {{EditStaffForm.org}} 】
          <el-button auto-complete="off" @click="openTreeDialog">选择部门</el-button>
        </el-form-item>
        <!-- <el-form-item label="号码：">
          <el-button auto-complete="off" icon="plus" @click="AddRow(EditStaffForm.numberList)">添加号码</el-button>
          <span style="color:gray">（用途-小号-被叫）</span>
        </el-form-item> -->
        <!-- 动态添加号码 —— start -->
        <el-form-item v-for="(items,index) in AddStaffForm.numberList" :key="index">
          <i class="el-icon-close" @click="delRow(AddStaffForm.numberList,items)"></i>
          <el-select style="width:160px;" v-model.trim="items.channelVal" placeholder="外呼">
            <el-option v-for="(item,index) in items.channel" :value="item.value" :label="item.label" :key="index"></el-option>
          </el-select> -
          <el-input v-model.trim="items.master" style="width:160px;" placeholder="主叫">主叫</el-input> -
          <el-input v-model.trim="items.trumpet" style="width:160px;" placeholder="小号"></el-input> -
          <el-checkbox v-model.trim="items.upline" true-label="上线" false-label="下线">上线</el-checkbox>
        </el-form-item>
        <!-- 动态添加号码 —— end -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="EditStaffDialog = false">取 消</el-button>
        <el-button type="primary" @click="enterEditStaff">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改员工弹框 —— end -->
    <!-- 员工导入 弹框 ——start-->
    <el-dialog title="号码分配" :visible.sync="dialogImportFile">
      <el-form :model="ImportFile">
        <el-form-item label="上传文件：">
          <el-upload ref="ImportFile" action="/grucm/number_importExcel.action" accept="text/csv" name="numFile" :auto-upload="false">
            <el-button type="primary" icon="upload">选择文件</el-button>
            <div slot="tip" class="el-upload__tip">请根据下载的样例文件格式上传</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="下载样例：">
          <a href="/grucm/import-staff.xls">
            <el-button type="info" icon="document">样例文件下载</el-button>
          </a>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogImportFile = false">取 消</el-button>
        <el-button type="primary" @click="ImportFileOk">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 员工导入 弹框 ——end-->
    <!-- 换绑 弹框 —— start-->
    <el-dialog title="换绑" :visible.sync="changeBindDialog">
      <el-form :model="changeBindDialogFrom">
        <el-form-item label="用户名">
          <el-input v-model.trim="changeBindDialogFrom.name" style="width:300px;" placeholder="请输入要换绑的用户名"></el-input><span> ( 必填 )</span>
        </el-form-item>
        <el-form-item label="号码:" v-for="(item,index) in changeBindDialogFrom.subrelas" :key="index">
          <el-checkbox v-model.trim="item.isChange"></el-checkbox>
          <el-input v-model.trim="item.channelName" :disabled="true" style="width:160px;"></el-input>
          <el-input v-model.trim="item.anum" :disabled="true" style="width:160px;"></el-input>
          <el-input v-model.trim="item.xnum" :disabled="true" style="width:160px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeBindDialog = false">取 消</el-button>
        <el-button type="primary" @click="enterChangeBind">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 换绑 弹框 ——end-->
    <!-- 部门选择树(更换部门时触发) —— start -->
    <tree-menu :dialogState="isChangeDeptTreeDialog" ref="postChangeDept" @on-close="closeDialog" @post-node="getChangeDeptNodes"></tree-menu>
    <!-- 部门选择树(更换部门时触发) —— end -->
  </div>
</template>
<script>
import treeMenu from '@/components/selectSector'

export default {
  components: {
    treeMenu,
  },
  data() {
    return {
      activeName: 'first', // 默认显示那个tab（tab-name）
      ChannelGet: [], // 动态获取渠道
      dutyGet: [], // 动态获取职务
      // 选择部门
      isTreeDialog: false,
      // 员工查询
      staffForm: {
        org: '全部',
        orgId: '',
        duty: "",
        power: 'all',
        state: 'all',
        channel: '',
        outbound: 'nothing',
        Name: 'name',
        nameOrNum: '',
      },
      // 员工表格
      tableData: [],
      // 导出的数据
      exportData: [],
      tableLoading: false,
      // 新增
      AddStaffDialog: false,
      AddStaffV: {},
      // 新增员工表单
      AddStaffForm: {
        org: '全部',
        orgId: '',
        code: '',
        power: '',
        frozen: '',
        name: '',
        duty: '',
        idcard: '',
        numberList: [
          // {
          //   channel: [{
          //     value: 1,
          //     label: "test",
          //   }],
          //   master: '',
          //   trumpet: '',
          //   upline: '',
          // }
        ],
      },
      // 修改
      EditStaffDialog: false,
      EditStaffV: {},
      // 修改员工表单
      EditStaffForm: {
        org: '全部',
        orgId: '',
        code: '',
        power: 0,
        frozen: '',
        name: '',
        duty: '',
        idcard: '',
        numberList: [],
      },

      // 导入文件弹框
      dialogImportFile: false,
      // 导入文件列表
      ImportFile: {},
      // 员工分页
      currentPage: 1, // 选中页
      pageSize: 5, // 每页显示条数
      totalrecord: 0, // 总数据条数
      // 换绑弹框
      changeBindDialog: false,
      changeBindDialogFrom: {
        name: '',
        subrelas: [], // 绑定号码信息
      },
      // 表格多选框的值
      multipleSelection: [],
      // 更换部门的树弹框
      isChangeDeptTreeDialog: false,
    }
  },
  methods: {
    // 添加一行小号（变异的todolist）
    AddRow(list) {
      this.$axios.get('channel_channelList.action').then(response => { // 查询select
        let dataArr = JSON.parse(response.data)
        // dataArr.unshift({ "value": "call", "label": "外呼" })
        list.push({
          channel: dataArr,
          channelVal: 'call',
          master: '',
          trumpet: '',
          upline: '',
        })
        // debugger;
      }, response => {})
    },
    // 删除一行小号
    delRow(list, row) {
      list.splice(list.indexOf(row), 1);
    },
    // 获取渠道下拉框信息
    getChannel() {
      this.$axios.get('channel_channelList.action').then(response => {
        this.ChannelGet = JSON.parse(response.data)
        this.cacheData = response.data;
      })
    },
    // 获取职务下拉框信息
    getDuty() {
      this.$axios.get('staff_getDutyList.action').then(response => {
        this.dutyGet = JSON.parse(response.data)
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
      this.isChangeDeptTreeDialog = false;
    },
    getNodes(nodes) {
      this.isTreeDialog = false;
      // 查询
      this.staffForm.org = nodes[0].name
      this.staffForm.orgId = nodes[0].value
      // 新增
      this.AddStaffForm.org = nodes[0].name
      this.AddStaffForm.orgId = nodes[0].value
      // 修改
      this.EditStaffForm.org = nodes[0].name
      this.EditStaffForm.orgId = nodes[0].value
    },
    // 查询
    // 查询号码
    queryStaff() {
      this.staffForm.currentPage = this.currentPage;
      this.getStaffTable()
    },
    // 分页变化时触发
    CurrentPageChange(val) {
      this.staffForm.currentPage = val;
      this.getStaffTable()
    },
    // 此方法将被父组件触发
    searchTable(data){
      console.log(data)
          let staffPage = JSON.parse(data)
          this.pageSize = +staffPage.page_size; // 每页显示条数
          this.totalrecord = +staffPage.totalrecord; // 总数据条数
          let staffData = staffPage.records;
          this.tableData = staffData; // 表格数据
    },
    // 获取号码表格的数据
    getStaffTable() {
      this.tableLoading = true;
      this.$axios.get('staff_queryList.action?jsonData=' + JSON.stringify(this.staffForm)).then(response => {
        this.tableLoading = false;
        console.log(response.data)
        try {
          let staffPage = JSON.parse(response.data)
          this.pageSize = +staffPage.page_size; // 每页显示条数
          this.totalrecord = +staffPage.totalrecord; // 总数据条数
          let staffData = staffPage.records;
          this.tableData = staffData; // 表格数据
        } catch (e) {
          this.$message({ message: "未查询到数据！", type: 'info', });
        }
      }, response => {
        this.tableLoading = false;
        this.$message({ message: "未查询到数据：" + response, type: 'error', });
      })
    },
    // ===== 新增
    // 点击新增确定
    AddStaff() {
      console.log("发给后台的数据---------", JSON.stringify(this.AddStaffForm))
      this.$axios.get('staff_add.action?jsonData=' + JSON.stringify(this.AddStaffForm)).then(response => {
        this.AddStaffDialog = false;
        try {
          let returnInfo = JSON.parse(response.data)
          if (typeof returnInfo.result === "string") {
            this.$message({ message: returnInfo.result, type: 'success', });
            return;
          }
          this.$message({ message: "新增成功！", type: 'success', });
        } catch (e) {
          this.$message({ message: "亲！没有新增成功哟！", type: 'info', });
        }
        this.queryStaff();
      }, response => {
        this.AddStaffDialog = false;
        this.$message({ message: "亲！没有新增成功哟！" + response, type: 'error', });
      })
    },
    // 导入员工文件
    ImportFileOk() {
      console.log("ImportFile")
      this.$refs.ImportFile.submit();
      console.log(this.ImportFile)
      this.dialogImportFile = false;
      this.$message({ message: "导入成功！", type: 'success', });
      this.queryStaff();
    },
    // ===== 修改
    // 修改(编辑)
    openEditStaff(i, row) {
      this.EditStaffDialog = true;
      this.EditStaffForm.org = row.org_name;
      this.EditStaffForm.org_id = row.org_id;
      this.EditStaffForm.code = row.code;
      this.EditStaffForm.power = row.data_permission;
      this.EditStaffForm.frozen = row.status;
      this.EditStaffForm.name = row.name;
      this.EditStaffForm.duty = row.duty;
      this.EditStaffForm.idcard = row.idcard;
      // 添加小号部分：设置默认值&&获取渠道的下拉框值
      this.EditStaffForm.numberList = [];
      if (this.EditStaffForm.numberList.length === 0) {
        this.$axios.get('channel_channelList.action').then(response => {
          let dataArr = JSON.parse(response.data)
          dataArr.unshift({ "value": "call", "label": "外呼" })
          let subrelas = row.subrelas.map(d => {
            this.EditStaffForm.numberList.push({
              channel: dataArr,
              channelVal: d.channelId,
              master: d.anum,
              trumpet: d.xnum,
              upline: d.upline,
            })
          })
        }, response => {})
      }
    },
    // 确认修改
    enterEditStaff() {
      console.log("发给后台的数据---------", JSON.stringify(this.EditStaffForm))
      this.$axios.get('staff_update.action?jsonData=' + JSON.stringify(this.EditStaffForm)).then(response => {
        this.EditStaffDialog = false;
        console.log(response.data)
        try {
          let returnInfo = JSON.parse(response.data)
          if (typeof returnInfo.result === "string") {
            this.$message({ message: returnInfo.result, type: 'error', });
            return;
          }
          this.$message({ message: "修改成功！", type: 'success', });
        } catch (e) {
          this.$message({ message: "修改失败：return data error", type: 'error', });
        }
        this.queryStaff();
      }, response => {
        this.EditStaffDialog = false;
        this.$message({ message: "修改失败：" + response, type: 'error', });
      })
    },
    // 解除绑定
    unBind(i, row) {
      this.$confirm('此操作将会解绑全部号码，您确定要继续吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.get('staff_axUnSub.action?code=' + row.code).then(response => {
          this.AddStaffDialog = false;
          this.$message({ message: "解绑成功！", type: 'success', });
          this.queryStaff();
        }, response => {
          this.AddStaffDialog = false;
          this.$message({ message: "解绑失败：" + response, type: 'error', });
        })
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消解绑' });
      });
    },
    // ==== 换绑
    // 打开换绑弹框
    openChangeBind(i, row) {
      this.changeBindDialog = true;
      row.subrelas.map(r => {
        // delete r.upline
        this.$delete(r, "upline")
        this.$set(r, "isChange", true)
      })
      this.changeBindDialogFrom.subrelas = row.subrelas;
    },
    // 确认换绑
    enterChangeBind() {
      this.changeBindDialog = false;
      this.$confirm('此操作将会换绑您选中的号码，您确定要继续吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.get('staff_changeBinding.action?jsonData=' + JSON.stringify(this.changeBindDialogFrom)).then(response => {
          let resInfo = JSON.parse(response.data)
          if (typeof resInfo.result == 'string') {
            this.$message({ message: "换绑失败," + resInfo.result, type: 'error', });
            return;
          } else {
            this.$message({ message: "换绑成功！", type: 'success', });
          }
          this.queryStaff();
        }, response => {
          this.$message({ message: "换绑失败：" + response, type: 'error', });
        })
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消换绑' });
      });
    },
    // 删除
    handleDel(i, row) {
      this.$confirm('此操作将会删除这个员工，您确定要继续吗？', '删除员工', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.get('staff_delete.action?code=' + row.code).then(response => {
          this.$message({ message: "删除成功！", type: 'success', });
          this.queryStaff();
        }, response => {
          this.$message({ message: "删除失败：" + response, type: 'error', });
        })
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' });
      });
    },
    // 重置密码
    resetPwd(i, row) {
      this.$confirm('您确定要将这个用户重置密码吗？', '重置密码', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        this.$axios.get("staff_resetPassword.action?code=" + row.code).then(response => {
          this.$alert('您的新密码是：' + response.data, '重置成功', {
            confirmButtonText: '确定',
            callback: action => {}
          });
        }, response => {
          this.$message({ message: "重置失败：" + response, type: 'error', });
        })

      }).catch(() => {
        this.$message({ type: 'info', message: '已取消重置密码' });
      });
    },
    // 表格多选框变化时触发
    tableSelectionChange(val) {
      this.multipleSelection = val.map((r) => { return r.userId });
      console.log(this.multipleSelection)
    },
    // 冻结
    freeze() {
      console.log(this.multipleSelection.length)
      if (this.multipleSelection.length <= 0) {
        this.$message({ type: 'info', message: '请选择您要冻结的账户' });
        return;
      }
      this.$confirm('您确定要将选中的用户冻结吗？', '冻结账户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.get("staff_freeze.action?userId=" + JSON.stringify(this.multipleSelection)).then(response => {
          this.$message({ type: 'success', message: '冻结账户成功' });
          this.queryStaff();
        }, response => {
          this.$message({ message: "冻结账户失败：" + response, type: 'error', });
        })
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消冻结账户' });
      });
    },
    // 解冻
    unfreeze() {
      if (this.multipleSelection.length <= 0) {
        this.$message({ type: 'info', message: '请选择您要解冻的账户' });
        return;
      }
      this.$confirm('您确定要将选中的用户解冻吗？', '解冻账户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.get("staff_unfreeze.action?userId=" + JSON.stringify(this.multipleSelection)).then(response => {
          this.$message({ type: 'success', message: '解冻账户成功' });
          this.queryStaff();
        }, response => {
          this.$message({ message: "解冻账户失败：" + response, type: 'error', });
        })
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消解冻账户' });
      });
    },
    // 上线
    upLine() {
      if (this.multipleSelection.length <= 0) {
        this.$message({ type: 'info', message: '请选择您要上线的账户' });
        return;
      }
      this.$confirm('您确定要将选中的所有账户上线吗？', '上线账户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.get("staff_online.action?userId=" + JSON.stringify(this.multipleSelection)).then(response => {
          this.$message({ type: 'success', message: '上线账户成功' });
          this.queryStaff();
        }, response => {
          this.$message({ message: "上线账户失败：" + response, type: 'error', });
        })
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消上线账户' });
      });
    },
    // 下线
    downLine() {
      if (this.multipleSelection.length <= 0) {
        this.$message({ type: 'info', message: '请选择您要下线的账户' });
        return;
      }
      this.$confirm('您确定要将选中的所有账户下线吗？', '下线账户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.get("staff_offline.action?userId=" + JSON.stringify(this.multipleSelection)).then(response => {
          console.log(response.data)
          this.$message({ type: 'success', message: '下线账户成功' });
          this.queryStaff();
        }, response => {
          this.$message({ message: "下线账户失败：" + response, type: 'error', });
        })
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消下线账户' });
      });
    },
    // 导出
    // 导出表格
    export2Excel() {　　　　　　
      require.ensure([], () => {　　　　　　　　
        // ==== 处理导出数据 === start
        let cacheData = this.tableData;
        const subrelasVal = ["channelName", "anum", "xnum", "upline"];
        cacheData.map(item => {
          let elmt = ""
          item.subrelas.map(d => {
            subrelasVal.map(r => elmt += d[r] + ' ')
            elmt += ", "
          })
          item.subrelas = elmt;
        })
        this.exportData = cacheData;
        // ==== 处理导出数据 === end

        const { export_json_to_excel } = require('@/vendor/Export2Excel');　　　　　　　　
        const tHeader = ["姓名", "职务", "用户", "部门", "绑定信息", "权限", "状态"];
        const filterVal = ["name", "duty", "code", "org_name", "subrelas", "data_permission", "status"];
        const data = this.formatJson(filterVal, this.exportData);　　　　　　　　
        export_json_to_excel(tHeader, data, "员工管理-员工");
      })　　　　
    },
    formatJson(filterVal, jsonData) {　　　　　　
      return jsonData.map(v => filterVal.map(j => v[j]));　　　
    },
    // 解绑
    unAllBind() {

    },
    // 删除
    AllDel() {

    },
    // 更换部门
    changeDept() {
      this.isChangeDeptTreeDialog = true;
      this.$refs.postChangeDept.TreeQuery(); // 触发查询部门树的方法
    },
    getChangeDeptNodes(nodes) {
      let ChangeDeptInfo = { list: this.multipleSelection, id: nodes[0].value }

      console.log("更换部门：", JSON.stringify(ChangeDeptInfo))

      this.$axios.get("staff_changeOrg.action?jsonData=" + JSON.stringify(ChangeDeptInfo)).then(response => {
        this.$message({ type: 'success', message: '更换部门成功' });
        this.queryStaff();
      }, response => {
        this.$message({ message: "更换部门失败：" + response, type: 'error', });
      })
    },
  },
  created() {
    this.getChannel();
    this.getDuty();
  }
}

</script>
<style lang="less" scoped>
.el-dropdown-menu__item>p {
  margin: 0px;
}

.el-icon-close:hover {
  color: red;
  cursor: pointer;
}

</style>
