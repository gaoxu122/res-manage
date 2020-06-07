<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> 邮件
        </el-breadcrumb-item>
        <el-breadcrumb-item>写邮件</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="container">
      <div class="form-box">
        <el-tabs :tab-position="tabPosition" style="height: 700px;">
          <el-tab-pane label="写邮件">
            <div class="mailForm">
              <el-tabs type="border-card" style="width: 100%">
                <el-tab-pane label="普通邮件">
                  <SendMailNormally style="height: 700px"></SendMailNormally>
                </el-tab-pane>
                <el-tab-pane label="群组邮件">
                  <SendMailNormally></SendMailNormally>
                </el-tab-pane>
                <el-tab-pane label="贺卡"></el-tab-pane>
                <el-tab-pane label="明信片"></el-tab-pane>
              </el-tabs>
            </div>
          </el-tab-pane>
          <el-tab-pane label="收件箱">
            <SendMailList></SendMailList>
              
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>


<script>
import sendMail from "./sendMail";
import sendMailtable from "./sendMailList"
export default {
  name: "SendMailNormally",
  components: {
    SendMailNormally: sendMail,
    SendMailList: sendMailtable
  },
  name: "baseform",
  data: function() {
    return {
      tabPosition: "left",
      
    
    };
  },
  methods: {
    onSubmit() {
      this.$message.success("提交成功！");
    }
  }
};
</script>

<style  scoped>
.mailForm {
  width: 100%;
  height: 100%;
}

.form-box {
  width: 100%;
  height: 100%;
}
</style>