<template>
  <div class="SendMailNormally">
    <div class="top">
      <el-button type="primary" icon="el-icon-lx-forward" @click="sendMailclick" round>发送邮件</el-button>
      <el-button type="primary" icon="el-icon-lx-remind" round>定时发送</el-button>
      <el-button type="primary" icon="el-icon-lx-copy" round>存草稿</el-button>
      <el-button type="primary" icon="el-icon-lx-refresh" round>清空</el-button>
    </div>
    <el-divider></el-divider>
    <div class="content">
      <mailFormlly ref="mailFromlly"></mailFormlly>
    </div>
  </div>
</template>

<script>
import { sendmail } from "../../api/mail.js";
import mailForm from "../../components/page/mailForm";
import { METHODS } from "http";
import { CLIENT_RENEG_WINDOW } from "tls";

export default {
  name: "sendMail",

  components: {
    mailFormlly: mailForm
  },

  methods: {
    // 发送邮件
    sendMailclick(data) {
      console.log(
        "父组件获取子组件 :",
        this.$refs.mailFromlly,
        this.$refs.mailFromlly.form
      );
      const param = this.$refs.mailFromlly.form;
      const param2 = {
        item: param.item,
        responsePerson: param.responsePerson + ",",
        emailContent: param.emailContent
      };
      sendmail(param2)
        .then(res => {
          this.$refs.mailFromlly.form.item = "";
          this.$refs.mailFromlly.form.responsePerson = "";
          this.$refs.mailFromlly.form.emailContent = "";
          if (res.status === 0) {
            this.$notify({
              title: res.message,
              message: "发送邮件成功!",
              type: "success"
            });
          }
        })
        .catch(err => {});
      // console.log('父组件获取子组件 :', data);
    }
  }
};
</script>

<style  scoped>
.top {
  width: 100%;
  height: 30px;
}
</style>