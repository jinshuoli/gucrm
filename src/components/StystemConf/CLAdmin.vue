<template>
  <div>
    <el-button type="primary" @click="dialogCL = true">提交彩铃</el-button>
    <el-button type="primary" @click="updataCL">状态刷新</el-button>
    <!-- 表格 ——start-->
    <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" v-loading="tableLoading" element-loading-text="拼命加载中" style="width: 100%">
      <el-table-column prop="name" label="彩铃名称">
      </el-table-column>
      <el-table-column label="下载">
        <template scope="scope">
          <a :href="scope.row.url" target="_blank" :download="scope.row.url">下载</a>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template scope="scope">{{ scope.row.status==='V' ?'正常':'冻结' }}</template>
      </el-table-column>
    </el-table>
    <!-- 表格 ——end-->
    <!-- 彩铃弹框 ——start-->
    <el-dialog title="提交彩铃" :visible.sync="dialogCL">
      <el-form :model="pushcl">
        <el-form-item label="彩铃名称">
          <el-input v-model.trim="CLname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="上传彩铃">
          <el-upload ref="uploadCL" action="/grucm/ringtone_uploadRingtone.action" accept="audio/*" name="bgm" :data="{'clName':CLname}" :file-list="fileList" :auto-upload="false">
            <el-button type="primary" icon="upload">选择彩铃</el-button>
            <div slot="tip" class="el-upload__tip">只能上传mp3/WAV文件，且不超过3M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCL = false">取 消</el-button>
        <el-button type="primary" @click="pushCL">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 彩铃弹框 ——end-->
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 彩铃管理
      tableData: [],
      tableLoading: false,
      fileList: [],
      pushcl: {},
      CLname: '',
      dialogCL: false,
    };
  },
  methods: {
    // ***** 彩铃
    // 提交模板
    pushCL() {
      console.log("pushCL")
      this.$refs.uploadCL.submit();
      this.dialogCL = false;
      this.$message({ message: "上传成功！", type: 'success', });
      this.updataCL();

    },
    // 刷新状态
    updataCL() {
      this.tableLoading = true;
      this.$axios.get('ringtone_getfindRingtone.action').then(response => {
        this.tableLoading = false;
        this.tableData = JSON.parse(response.data)
      }, response => {
          this.$message({ message: "刷新失败：" + response, type: 'error' })
        })
    },
  },
  created() {
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
