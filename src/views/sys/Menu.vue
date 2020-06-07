<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 菜单管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-add" class="handle-del mr10" @click="insertMenu">添加</el-button>

        <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </div>
      <el-table
        :data="tableData"
        row-key="id"
        default-expand-all
        border
        class="table"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="title" label="菜单名" width="120"></el-table-column>
        <el-table-column prop="index" label="索引" width="120"></el-table-column>
        <el-table-column prop="parentId" label="上级菜单" width="120"></el-table-column>
        <el-table-column prop="gmtCreate" label="创建时间" sortable width="250"></el-table-column>
        <el-table-column prop="gmtModfied" label="修改时间" width="300"></el-table-column>
        <el-table-column prop="path" label="深度" width="100"></el-table-column>
        <el-table-column prop="ioc" label="图标" width="100"></el-table-column>
        <el-table-column prop="status" label="状态" width="80">
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
        <el-table-column label="操作" width="220" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row,1)"
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
    </div>

    <!-- 弹出框 -->
    <el-dialog :title="bouncedItem" :visible.sync="editVisible" width="25%">
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="菜单名">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="索引">
          <el-input v-model="form.index" name="name"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="form.ioc" name="ioc"></el-input>
        </el-form-item>

        <el-form-item label="上级菜单">
          <el-cascader
            v-model="form.value"
            :options="options"
            :props="{ expandTrigger: '' }"
            :change-on-select="true"
            @change="handleChange"
            style="width: 100%;"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="ok(bouncedItem)">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getMenuTree,
  insertMenu,
  updateMenu,
  deleteMenu,
  enableMenu
} from "../../api/sys/menu";

export default {
  name: "basetable",
  data() {
    return {
      tableData: [],
      options: [],
      bouncedItem: "",
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
      value: "0",
      form: {
        title: "",
        index: "",
        ioc: "",
        parentId: ""
      },
      idx: -1,
      id: -1
    };
  },
  created() {
    this.getData();
  },
  computed: {},
  methods: {
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },

    getData() {
      getMenuTree().then(res => {
        if (res.status === 0) {
          this.tableData = res.data;
          this.options = this.getTreeData(res.data);
          this.isEnable = res.data.isEnable ? "启用" : "禁用";
        } else {
          this.$notify.error({
            // title: '错误',
            message: res.message
          });
        }
      });
    },
    search() {
      this.is_search = true;
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    ok(params){
      if(params == "菜单编辑"){
        console.log("菜单编辑")
        this.saveEdit();
      }
      this.addMenu();

    },

    // 编辑
    handleEdit(index, row) {
      this.idx = index;
      this.id = row.id;
      console.log(row.value);
    
      this.form = {
        title: row.title,
        index: row.index,
        ioc: row.ioc,
        value: row.value
      };
      this.bouncedItem = "菜单编辑";
       this.editVisible = true;
    
    },
    handleDelete(index, row) {
      this.id=row.value;
      console.log(row.value);
      this.delVisible = true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 保存编辑
    saveEdit() {
      const params = {
        title: this.form.title,
        name: this.form.index,
        ioc: this.form.ioc,
        parentId: this.form.parentId
      };
      updateMenu(params).then(res => {
        if (res.status == 0) {
          this.getData;
        } else {
          this.$notify.error({
            // title: '错误',
            message: res.message
          });
        }
      });
    },
    insertMenu(){
        this.bouncedItem = "创建菜单";
        this.editVisible = true;
    },

    addMenu(){

      console.log(this.value);
      const params={
        title: this.form.title,
        name: this.form.index,
        ioc: this.form.ioc,
        path: this.value,
      
      }
      console.log(params)
        insertMenu(params).then(res=>{
          if (res.status == 0) {
          this.editVisible=false;
          this.getData();
        } else {
          this.$notify.error({
            // title: '错误',
            message: res.message
          });
        }
        })
    },
    // 确定删除
    deleteRow() {
     const params={
        id: this.id
      }
      deleteMenu(params).then(res=>{
        if(res.status===0){
              this.$message.success("删除成功");
              this.getData;
        }else{
          this.$message.error("删除失败")
        }
      })
        this.delVisible = false;
    },
  
    // 级联菜单发生变化
    handleChange(value) {
      var number="";
      for(var a=0;a<value.length;a++){
        number+=","+value[a];
      }
      this.value=number;
    },
    getTreeData(data) {
      // 循环遍历json数据
      for (var i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].children = undefined;
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children);
        }
      }
      return data;
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
</style>
