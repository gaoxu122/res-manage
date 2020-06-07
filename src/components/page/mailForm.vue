<template>
  <div class="mailFormlly">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="收件人">
        <el-input v-model="form.responsePerson"></el-input>
      </el-form-item>

      <el-form-item label="主题">
        <el-input v-model="form.item"></el-input>
      </el-form-item>
      <el-form-item label="正文">
        <quill-editor ref="myTextEditor" v-model="form.emailContent" :options="editorOption"></quill-editor>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
export default {
  name: "mailForm",
  components: {
    quillEditor
  },

  
  props:{//第二种方式
    // toSonData:{
    //   type:JSON,
    //   default:function(){
    //     return ""
    //   }
    // }
  },

  data: function() {
    return {
      tabPosition: "left",
      editorOption: {},
      form: {
        responsePerson: "",
        item: "",
        emailContent: "",
      }
    };
  },
  methods: {
  
  }
};
</script>
<style scoped>
</style>