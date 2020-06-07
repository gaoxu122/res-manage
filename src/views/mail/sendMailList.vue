<template>
  <div class="sendMailtable">
    <el-table
      :data="tableData"
      border
      class="table"
      ref="multipleTable"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column prop="id" label="id" width="55" align="center"></el-table-column>
      <el-table-column prop="sendUserName" label="发送人姓名" width="100" align="center"></el-table-column>
      <el-table-column prop="responseUserName" label="接收人姓名" width="300" align="center"></el-table-column>
      <el-table-column prop="mailItem" label="邮件主题" width="100" align="center"></el-table-column>
      <el-table-column prop="mailContent" label="邮件内容" width="290" align="center"></el-table-column>
      <el-table-column prop="gmtCreate" label="创建日期" sortable width="200" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" width="80" align="center">
        <!--<el-tag size="medium">{{isEnable}}</el-tag>-->
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>状态: {{ scope.row.isEnable ? "启用" :"禁用" }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.isEnable ? "启用" :"禁用"}}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            type="text"
            icon="el-icon-delete"
            class="red"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { selectMail } from "../../api/mail";
export default {
  name: "sendMailtable",
  data() {
    return {
      tableData: [],
      cur_page: 1,
      multipleSelection: [],
      select_cate: "",
      select_word: "",
      del_list: [],
      is_search: false,
      currentPage1: 1,
      total: 0,
      PopUpBox: "",
      isEnable: "",
      value: "",
      form: {
        id: "",
        userName: "",
        gmtCreate: "",
        sex: "",
        email: "",
        tel: ""
      },
      options: [
        {
          value: true,
          label: "启用"
        },
        {
          value: false,
          label: "禁用"
        }
      ],
      idx: -1,
      id: -1
    };
  },
    created:{

    },
  methods: {
    handleSelectionChange() {

        console.log('1233343 :', 1233343);
        selectMail({}).then((res)=>{
            if(res.status==0){
                 this.tableData=res.data;
                 console.log('object :', res.data);
            }
        });
    }
  }
};
</script>


<style  scoped>
</style>