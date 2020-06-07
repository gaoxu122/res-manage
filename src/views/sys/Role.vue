<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        /。
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 角色管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="danger" icon="el-icon-add" class="handle-del mr10" @click="delAll">批量删除</el-button>
        <el-button type="primary" class="handle-del mr10" @click="addRole">添加</el-button>
        <el-input v-model="select_word" placeholder="角色名" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="name" label="角色名" width="100"></el-table-column>
        <el-table-column prop="creator" label="创建用户" width="100"></el-table-column>
        <el-table-column prop="gmtCreate" label="创建日期" sortable width="250"></el-table-column>
        <el-table-column prop="sort" label="排序" sortable width="250"></el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>状态: {{ scope.row.isEnable ? "启用" :"禁用" }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.isEnable ? "启用" :"禁用"}}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="enable" label="启用/禁用" width="90" align="center">
          <el-switch
            v-model="enable_button"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="true"
            inactive-value="false"
            @change="enable"
          ></el-switch>
        </el-table-column>-->
        <el-table-column label="操作" width="363" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-add"
              @click="handleEdit(scope.$index, scope.row)"
            >菜单赋权</el-button>
            <el-button
              type="text"
              icon="el-icon-people"
              @click="user_auth(scope.$index, scope.row)"
            >角色赋权</el-button>
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage1"
          :page-size="10"
          layout="total, prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
    </div>

    <!-- 添加弹出框 -->
    <el-dialog title="添加" :visible.sync="addVisible" width="30%">
      <el-form ref="addform" :model="addform" label-width="70px">
        <el-form-item label="角色名称">
          <el-input v-model="addform.name"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="addform.sort"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="addform.value" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAdd">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="角色名称">
          <el-input v-model="form.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="form.sort" disabled></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.value" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="OK">确 定</el-button>
      </span>
    </el-dialog>

    <!--抽屉-->
    <el-drawer title="角色赋权" class="drawer" :visible.sync="drawer" size="50%">
      <el-transfer
        class="transfer"
        filterable
        v-model="value_promiss"
        :data="data_promiss"
        filter-placeholder="请输入用户姓名"
        :titles="['无权限用户', '有权限用户']"
        :button-texts="['移除', '赋权']"
      ></el-transfer>
    </el-drawer>
  </div>
</template>

<script>
import {
  getRole,
  insertRole,
  updateRole,
  deleteRole,
  selectNoPermissionUsers,
  selectPermissionUsers
} from "../../api/sys/role";

export default {
  name: "basetable",
  data() {
    return {
      tableData: [],
      cur_page: 1,
      multipleSelection: [],
      select_cate: "",
      select_word: "",
      del_list: [],
      is_search: false,
      editVisible: false,
      delVisible: false,
      currentPage1: 1,
      total: 0,
      PopUpBox: "",
      isEnable: "",
      drawer: false,
      value_promiss: [],
      data_promiss: [],
      enable_button: true,
      value: "",
      addVisible: false,
      addform: {
        name: "",
        sort: "",
        value: ""
      },
      form: {
        name: "",
        sort: "",
        value: ""
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
  created() {
    this.getData();
  },
  computed: {},
  methods: {
    //刷新
    refresh() {
      this.getData();
    },
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    // 获取 easy-mock 的模拟数据
    getData(parem) {
      console.log(parem);
      if (typeof parem == "undefined") {
        parem = { page: this.cur_page };
      }

      getRole(parem).then(res => {
        if (res.status === 0) {
          this.tableData = res.data.data;
          this.total = res.data.total;
          this.isEnable = res.data.isEnable ? "启用" : "禁用";
          this.enable_button = res.data.isEnable;
        } else {
          this.$notify.error({
            // title: '错误',
            message: res.message
          });
        }
      });
    },
    // 查询
    search() {
      this.is_search = true;
      console.log(this.select_word);
      const parem = {
        page: this.cur_page,
        name: this.select_word
      };
      this.getData(parem);
    },

    // 编辑
    handleEdit(index, row) {
      this.idx = index;
      this.id = row.id;
      this.form = {
        id: row.id,
        name: row.name,
        sort: row.sort,
        gmtCreate: row.gmtCreate,
        value: row.isEnable ? "启用" : "禁用"
      };
      this.editVisible = true;
    },
    // 删除
    handleDelete(index, row) {
      this.idx = index;
      this.id = row.id;
      this.delVisible = true;
    },

    OK() {
      const param = { roleId: this.id };
      deleteRole(param).then(res => {
        if (res.status === 0) {
          this.delVisible = false;
          this.$message.success(`删除成功`);
          this.getData();
        } else {
          this.$notify.error({
            message: res.message
          });
        }
      });
    },

    user_auth(index, row) {
      const param = {
        roleId: row.id
      };

      selectNoPermissionUsers(param).then(res => {
        if (res.status === 0) {
          this.$set(this, "data_promiss", res.data.keyValueList);
          this.value_promiss = res.data.keys;
        } else {
          this.$notify.error({
            message: res.message
          });
        }
      });

      this.drawer = true;
    },

    filterMethod(query, item) {
      return item.pinyin.indexOf(query) > -1;
    },

    // 批量删除
    delAll() {},
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 保存编辑
    saveEdit() {
      const param = {
        id: this.form.id,
        name: this.form.name,
        sort: this.form.sort,
        isEnable: this.form.value
      };
      updateRole(param).then(res => {
        if (res.status === 0) {
          this.$message.success(`修改成功`);
          this.editVisible = false;
          this.refresh();
        }
      });
    },
    // 确定删除
    deleteRow() {
      this.delVisible = false;
      deleteUser({ id: this.id }).then(res => {
        if (res.status === 0) {
          this.$message.success(`删除成功`);
          this.refresh();
        }
      });
    },

    saveAdd() {
      const param = {
        name: this.addform.name,
        sort: this.addform.sort,
        isEnable: this.addform.value
      };
      insertRole(param).then(res => {
        if (res.status === 0) {
          this.$message.success(`添加成功`);
          this.addVisible = false;
          this.refresh();
        }
      });
    },
    /**
     *  添加角色
     */
    addRole(form) {
      this.addVisible = true;
    }
  }
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}

.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}

.table {
  width: 100%;
  font-size: 14px;
}

.red {
  color: #ff0000;
}

.mr10 {
  margin-right: 10px;
}

.transfer {
  margin-left: 80px;
  height: 100%;
  width: 100%;
}
.drawer /deep/ .el-transfer-panel {
  width: 300px;
  height: 800px;
}
.drawer /deep/ .el-drawer__body {
  height: 100%;
}

.table-custom-drawer {
  height: 100%;
}
.drawer {
  height: 100%;
}
.drawer /deep/ .el-drawer__body {
  height: 100%;
}
.table-column-transfer {
  height: calc(100% - 160px);
  width: 100%;
  margin: 10px;
}
.table-column-transfer /deep/ .el-transfer-panel {
  height: 100%;
  width: 230px;
}
.table-column-transfer /deep/ .el-transfer-panel__header {
  height: 40px;
}
.table-column-transfer /deep/ .el-transfer-panel .el-transfer-panel__body {
  height: calc(100% - 40px);
}
/deep/ .el-transfer-panel__list {
  height: 100%;
}
.table-column-transfer /deep/ .el-transfer__buttons {
  margin: 10px;
  padding: 0px;
}
.table-column-transfer /deep/ .el-transfer__button {
  padding: 10px;
  width: 35px;
  height: 35px;
}
</style>
