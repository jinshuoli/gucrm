<template>
  <div>
    <el-button type="primary" @click="pushTpl">提交模板</el-button>
    <el-button type="primary" @click="updataTpl">状态刷新</el-button>
    <a href="javascript:void(0);" style="color:red;" @click="sindInfo"> 发送限制</a>
    <a href="javascript:void(0);" style="color:red;" @click="explainInfo"> 变量说明</a>
    <!-- 表格 ——start-->
    <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" v-loading="tableLoading" element-loading-text="拼命加载中" style="width: 100%">
      <el-table-column prop="name" label="模板名称">
      </el-table-column>
      <el-table-column prop="content" label="模板内容">
      </el-table-column>
      <el-table-column label="审核状态">
        <template scope="scope">
          <span v-if="scope.row.status==='c'">审核成功</span>
          <span v-if="scope.row.status==='w'">正在审核</span>
          <span v-if="scope.row.status==='f'">审核失败</span>
        </template>
      </el-table-column>
      <el-table-column label="使用状态">
        <template scope="scope">{{ scope.row.type==='u' ?'闪信':'短信' }}</template>
      </el-table-column>
      <el-table-column label="编辑">
        <template scope="scope">
          <el-button size="small" type="warning" @click="clickEditTpl(scope.$index, scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格 ——end-->
    <!-- 模板弹框 ——start-->
    <el-dialog title="短信模板:" :visible.sync="dialogTpl">
      <el-form :model="TplForm">
        <el-form-item label="模板名称">
          <el-input v-model.trim="TplForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="模板内容">
          <el-input type="textarea" :rows="2" v-model.trim="TplForm.content" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <a href="javascript:void(0);" @click="addInfo('#Agent#')">顾问姓名</a>
          <a href="javascript:void(0);" @click="addInfo('#AgentNo#')">顾问号码</a>
          <a href="javascript:void(0);" @click="addInfo('#CustomerNo#')">客户号码</a>
          <a href="javascript:void(0);" @click="addInfo('#CustomerId#')">客户标识</a>
          <a href="javascript:void(0);" @click="addInfo('#ProductId#')">产品标识</a>
          <a href="javascript:void(0);" @click="addInfo('#Time#')">来电时间</a>
          <a href="javascript:void(0);" @click="addInfo('#VirtualNo#')">小号</a>
          <a href="javascript:void(0);" @click="addInfo('#Channel#')">渠道名称</a>
          <a href="javascript:void(0);" @click="addInfo('#Phone#')">号码</a>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTpl = false">取 消</el-button>
        <el-button type="primary" @click="EditTplTable()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 模板弹框 ——end-->
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 短信模板
      tableData: [],
      tableLoading: false,
      dialogTpl: false,
      isEditPush: 0, // 判断是修改模板还是提交模板（短信）
      TplForm: { // 修改模板
        name: '',
        content: '',
      },
    };
  },
  methods: {
    // ***** 短信模板
    // 提交模板
    pushTpl() { // 提交模板和修改模板用的是一个dialog
      this.dialogTpl = true;
      this.isEditPush = 0;
      // 清空
      this.TplForm = {
        name: '',
        content: '',
      };
    },
    // 刷新短信模板
    updataTpl() {
      this.tableLoading = true;
      this.$axios.get('template_getfindTemplate.action').then(response => {
        this.tableLoading = false;
        let tplData = JSON.parse(response.data)
        this.tableData = tplData;
      }, response => {
        this.$message({ message: "刷新模板失败：" + response, type: 'error', });
      })
    },
    // 点击修改模板
    clickEditTpl(index, row) { // 提交模板和修改模板用的是一个dialog
      this.dialogTpl = true;
      this.isEditPush = 1;
      this.TplForm.id = row.id
      this.TplForm.name = row.name
      this.TplForm.content = row.content
    },
    // 点击确认模板
    EditTplTable() {
      console.log(JSON.stringify(this.TplForm))
      let url;
      this.isEditPush === 1 ?
        url = "template_update.action" :
        url = "template_add.action";
      this.$axios({
        method: 'post',
        url: url,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: this.TplForm
      }).then(response => {
        this.dialogTpl = false;
        // 清空
        this.TplForm = { name: '', content: '', };
        this.updataTpl()
          this.isEditPush === 1 ?
          this.$message({ message: "修改成功！", type: 'success', }) :
          this.$message({ message: "添加成功！", type: 'success', })

      }, response => {
        this.$message({ message: "失败："+response, type: 'error', });
      })
    },
    // 添加信息
    addInfo(info) {
      this.TplForm.content += info;
    },
    // 发送限制
    sindInfo() {
      const h = this.$createElement;
      this.$msgbox({
        title: '发送限制',
        message: h('ol', null, [
          h('li', null, '同一手机号30秒内重复提交相同的内容 '),
          h('li', null, '同一手机号5分钟内重复提交相同的内容超过3次'),
          h('li', null, '24小时内同一手机号发送次数超过限制'),
          h('li', null, '1小时内同一手机号发送次数超过限制')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => { done(); }
      })
    },
    // 变量说明
    explainInfo() {
      const h = this.$createElement;
      this.$msgbox({
        title: '变量说明',
        message: h('ul', null, [
          h('li', null, '#Agent#, 顾问姓名, 适用于发给客户的挂机短信 '),
          h('li', null, '#AgentNo#, 顾问号码, 适用于发给客户的挂机短信'),
          h('li', null, '#CustomerNo#,客户号码,适用于发给顾问的挂机短信'),
          h('li', null, '#CustomerId#, 客户标识, 适用于外呼场景中发给顾问的挂机短信'),
          h('li', null, '#ProductId#, 产品标识, 适用于外呼场景中发给顾问的挂机短信'),
          h('li', null, '#Time#, 来电时间'),
          h('li', null, '#Channel#, 渠道名称, 适用于渠道呼入场景中发给顾问的挂机短信'),
          h('li', null, '#Phone#, 号码, 发给客户的挂机短信中是顾问真实号码, 发给顾问的挂机短信中是客户真实号码, 不推荐使用')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => { done(); }
      })
    },
  },
  created() {}
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
