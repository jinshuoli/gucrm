<template>
  <div>
    <el-row>
      <el-col :offset="1" :span="20">
        <h3>呼入设置</h3>
        <el-tabs v-model.trim="activeName" type="card" @tab-click="tabchange">
          <el-tab-pane label="渠道" name="first">
            <el-button type="primary" @click="AddTableList">新增</el-button>
            <!-- 表格 ——start-->
            <el-table ref="multipleTable" :data="tableData1" border tooltip-effect="dark" v-loading="tableLoading1" element-loading-text="拼命加载中" style="width: 100%">
              <el-table-column prop="channelName" label="媒体名称">
              </el-table-column>
              <el-table-column prop="count" label="媒体号码（数量）">
              </el-table-column>
              <el-table-column label="操作">
                <template scope="scope">
                  <el-button size="small" type="danger" @click="DelTableList(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <br />
            <!-- 表格 ——end-->
            <!-- 分页 —— start-->
            <el-row>
              <el-col :offset="8">
                <el-pagination @current-change="CurrentPageChange1" :current-page.sync="currentPage1" :page-size="pageSize1" layout="prev, pager, next, jumper,total" :total="totalrecord1">
                </el-pagination>
              </el-col>
            </el-row>
            <!-- 分页 —— end-->
          </el-tab-pane>
          <el-tab-pane label="号显" name="second">
            <el-form ref="NumberDisplayform" label-width="150px">
              <el-form-item label="来电显示：">
                <el-select v-model.trim="NumberDisplay.id101" placeholder="真实">
                  <el-option label="真实" value="T"></el-option>
                  <el-option label="部分" value="P"></el-option>
                  <el-option label="不显示" value="N"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="记录显示客户号码：">
                <el-select v-model.trim="NumberDisplay.id102" placeholder="部分">
                  <el-option label="真实" value="T"></el-option>
                  <el-option label="部分" value="P"></el-option>
                  <el-option label="不显示" value="N"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="短信包含：">
                <el-select v-model.trim="NumberDisplay.id103" placeholder="真实">
                  <el-option label="真实" value="T"></el-option>
                  <el-option label="部分" value="P"></el-option>
                  <el-option label="不显示" value="N"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="记录显示客户短信：">
                <el-select v-model.trim="NumberDisplay.id104" placeholder="真实">
                  <el-option label="真实" value="T"></el-option>
                  <el-option label="部分" value="P"></el-option>
                  <el-option label="不显示" value="N"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label-width="150px">
                <el-button type="primary" @click="keepNumberDisplay">保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="彩铃" name="third">
            <el-form ref="CustomizedRingingToneform" label-width="150px">
              <el-form-item v-for="(items,index) in CLItem.parameterRing" :label="items.item" :key="index">
                <el-select v-model.trim="items.rid" placeholder="无">
                  <el-option v-for="item in sleectList" :label="item.name" :value="item.id" :key="item.id">
                  </el-option>
                </el-select>
                <a v-for="item in sleectList" v-if="items.rid === item.id" :href="item.url">
                  <el-button type="primary" size="small" tag="i" class="fa fa-arrow-circle-down"></el-button>
                </a>
              </el-form-item>
              <el-form-item v-for="(items,index) in CLItem.channelRing" :key="index">
                <span>{{ items.channelName }}：</span><br />
                <el-select v-model.trim="items.rid" placeholder="无">
                  <el-option v-for="item in sleectList" :label="item.name" :value="item.id" :key="item.id">
                  </el-option>
                </el-select>
                <a v-for="item in sleectList" v-if="items.rid === item.id" :href="item.url" target="_blank" :download="item.url">
                  <el-button type="primary" size="small" tag="i" class="fa fa-arrow-circle-down"></el-button>
                </a>
              </el-form-item>
              <el-form-item label-width="150px">
                <el-button type="primary" @click="keepCL">保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="挂机短信" name="fourth">
            <el-form ref="form" label-width="150px">
              <el-form-item label="呼入发给顾问：">
                <span>已接通</span>
                <el-select v-model.trim="SmsOnHook.id108" placeholder="无">
                  <el-option label="已接通客户侧短信" value="1"></el-option>
                  <el-option label="未接通客户侧短信" value="2"></el-option>
                </el-select>
                <span>&nbsp;&nbsp;未接通</span>
                <el-select v-model.trim="SmsOnHook.id109" placeholder="无">
                  <el-option label="已接通客户侧短信" value="1"></el-option>
                  <el-option label="未接通客户侧短信" value="2"></el-option>
                </el-select>
                <span>&nbsp;&nbsp;未振铃</span>
                <el-select v-model.trim="SmsOnHook.id110" placeholder="无">
                  <el-option label="已接通客户侧短信" value="1"></el-option>
                  <el-option label="未接通客户侧短信" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="呼入发给客户：">
                <span>已接通</span>
                <el-select v-model.trim="SmsOnHook.id111" placeholder="无">
                  <el-option label="已接通客户侧短信" value="1"></el-option>
                  <el-option label="未接通客户侧短信" value="2"></el-option>
                </el-select>
                <span>&nbsp;&nbsp;未接通</span>
                <el-select v-model.trim="SmsOnHook.id112" placeholder="无">
                  <el-option label="已接通客户侧短信" value="1"></el-option>
                  <el-option label="未接通客户侧短信" value="2"></el-option>
                </el-select>
                <span>&nbsp;&nbsp;提前挂机</span>
                <el-select v-model.trim="SmsOnHook.id113" placeholder="无">
                  <el-option label="已接通客户侧短信" value="1"></el-option>
                  <el-option label="未接通客户侧短信" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label-width="150px">
                <el-button type="primary" @click="keepSO">保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeName: 'first',
      //****** 号显(四个下拉框)
      // 表格
      tableData1: [],
      tableLoading1: false,
      // 分页
      currentPage1: 1, // 选中页
      pageSize1: 5, // 每页显示条数
      totalrecord1: 0, // 总数据条数
      // ****** 号显(四个下拉框)
      NumberDisplay: {
        id101: '', // 来电显示
        id102: '', // 记录显示客户号码
        id103: '', // 短信包含
        id104: '', // 记录显示客户号码
      },
      // ****** 彩铃
      CLItem: [],
      sleectList: [],
      // ***** 挂机短信
      SmsOnHook: {
        id108: '', // 已接通1
        id109: '', // 未接通1
        id110: '', // 未振铃1
        id111: '', // 已接通2
        id112: '', // 未接通2
        id113: '', // 未振铃2
      }
    }
  },
  methods: {
    // ***** 渠道
    // === 获取
    queryChannel() {
      this.currentPage1 = 1;
      this.getTabelList()
    },
    // 分页变化时触发
    CurrentPageChange1(val) {
      this.currentPage1 = val;
      this.getTabelList()
    },
    getTabelList() {
      this.tableLoading1 = true;
      this.$axios.get('channel_getChannelList.action?currentPage=' + this.currentPage1).then(response => {
        this.tableLoading1 = false;
        try {
          console.table(JSON.parse(response.data))
          let funFmt = JSON.parse(response.data)
          let funPage = funFmt.pageview;
          this.pageSize1 = +funPage.page_size; // 每页显示条数
          this.totalrecord1 = +funPage.totalrecord; // 总数据条数
          this.tableData1 = funPage.records; // 表格数据
        } catch (e) {
          this.tableData1 = [];
          this.$message({ message: "未查询到数据！", type: 'error', });
        }
      }, response => {
        this.tableLoading1 = false;
        this.$message({ message: "查询数据失败：" + response, type: 'error', });
      })
    },
    // ==== 新增
    AddTableList() {
      this.$prompt('请输入媒体名', '新增', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /(a-z|A-Z|\w|\d|[\u4e00-\u9fa5]){1,12}/,
        inputErrorMessage: '媒体名不能为空',
      }).then(({ value }) => {
        // 传给后台要增加的媒体名
        this.$axios.get('channel_add.action?channelName=' + value).then(response => {
          this.$message({ message: "新增成功！", type: 'success', });
          this.getTabelList()
        }, response => {
          this.$message({ message: "新增失败：" + response, type: 'error', });
        })
      }).catch(() => {
        this.$message({ type: 'info', message: '取消输入' });
      });
    },
    // 删除
    DelTableList(index, row) {
      this.$axios.get('channel_delete.action?Id=' + row.channelId).then(response => {
        this.$message({ message: "删除成功！", type: 'success', });
        this.getTabelList()
      })
    },
    // ***** 号显
    // 保存号显状态
    keepNumberDisplay() {
      let keepND = JSON.stringify(this.NumberDisplay)
      this.$axios.get('parameter_addCallInNumber.action?jsonData=' + keepND).then(response => {
        this.$message({ message: "保存成功！", type: 'success' });
      }, response => {
        this.$message({ message: "保存失败：" + response, type: "error" });
      })
    },
    // 获取号显状态
    getNumberDisplay() {
      this.$axios.get('parameter_getCallInNumber.action').then(response => {
        this.NumberDisplay = JSON.parse(response.data);
      })
    },
    // ***** 彩铃
    // 获取彩铃下拉框数据
    getCLSelect() {
      this.$axios.get('ringtone_getfindRingtone.action').then(response => {
        console.table(JSON.parse(response.data))
        this.sleectList = JSON.parse(response.data)
      }, response => {
        this.$message({ message: "获取失败：" + response, type: "error" });
      })
    },
    // 获取彩铃列表项
    getCLItem() {
      this.$axios.get('parameter_getCallInMusic.action').then(response => {
        console.table(JSON.parse(response.data))
        this.CLItem = JSON.parse(response.data)
      }, response => {
        this.$message({ message: "获取失败：" + response, type: "error" });
      })
    },
    // 保存彩铃状态
    keepCL() {
      let keepCL = JSON.stringify(this.CLItem)
      console.log(JSON.stringify(this.CLItem))
      this.$axios.get('parameter_addCallInMusic.action?jsonData=' + keepCL).then(response => {
        this.$message({ message: "保存成功！", type: 'success' });
      }, response => {
        this.$message({ message: "保存失败：" + response, type: "error" });
      })
    },
    // ***** 挂机短信
    // 保存挂机短信
    keepSO() {
      let keepSO = JSON.stringify(this.SmsOnHook)
      console.log(JSON.stringify(this.SmsOnHook))
      this.$axios.get('parameter_addCallInMessage.action?jsonData=' + keepSO).then(response => {
        this.$message({ message: "保存成功！", type: 'success' });
      }, response => {
        this.$message({ message: "保存失败：" + response, type: "error" });
      })
    },
    // 获取挂机短信
    getSO() {
      this.$axios.get('parameter_getCallInMessage.action').then(response => {
        this.SmsOnHook = JSON.parse(response.data);
      })
    },
    // tab变化时触发
    tabchange(tab, event) {
      this.getNumberDisplay()
      this.getCLSelect()
      this.getSO()
    },
  },
  created() {
    this.queryChannel();
    this.getCLItem()
  },
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
