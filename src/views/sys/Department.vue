<template>
    <section class="main">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-rank"></i>部门人员管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="drag-box">
                <div class="drag-box-item">
                    <div class="item-title">部门列表</div>
                    <div class="drag-box">
                        <span class="del-dialog-font">部门名称：</span>
                        <el-input v-model="select_Dept" placeholder="部门名称" class="handle-input mr10"></el-input>
                        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                        <el-button type="primary" class="handle-del mr10" @click="addDepartment">添加部门</el-button>
                    </div>
                    <div>
                        <el-tree
                                :data="deptData"
                                show-checkbox
                                node-key="id"
                                :expand-on-click-node="false"
                                @node-click="handleNodeClick"
                        >
                            <span class="custom-tree-node" slot-scope="{ node, data }">
                            <span>{{ node.label }}</span>
                            <span>
                            <el-button type="text" size="mini" @click="() => append(data)"> 编辑 </el-button>
                            <el-button type="text" size="mini" @click="() => remove(node, data)">删除</el-button>
                            </span>
                            </span>
                        </el-tree>
                    </div>

                </div>
                <div class="drag-box-item1">
                    <div class="item-title">人员列表</div>
                    <div class="container">
                        <div class="handle-box">
                            <!--<el-button type="primary" icon="el-icon-add" class="handle-del mr10" @click="delAll">批量删除</el-button>-->
                            <el-input v-model="select_word" placeholder="用户名" class="handle-input mr10"></el-input>
                            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                        </div>
                        <el-table :data="tableData" border class="table" ref="multipleTable"
                                  @selection-change="handleSelectionChange">
                            <el-table-column type="selection" width="55" align="center"></el-table-column>
                            <el-table-column prop="userName" label="姓名" width="100">
                            </el-table-column>
                            <el-table-column prop="email" label="部门" width="200">
                            </el-table-column>
                            <el-table-column prop="tel" label="电话号码" width="180">
                            </el-table-column>
                            <el-table-column prop="gmtCreate" label="创建日期" sortable width="250">
                            </el-table-column>
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
                            <el-table-column label="操作" width="300" align="center">
                                <template slot-scope="scope">
                                    <el-button type="text" icon="el-icon-edit"
                                               @click="handleEdit(scope.$index, scope.row)">编辑
                                    </el-button>
                                    <el-button type="text" icon="el-icon-delete" class="red"
                                               @click="handleDelete(scope.$index, scope.row)">删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination">
                            <el-pagination
                                    @current-change="handleCurrentChange"
                                    :current-page.sync="currentPage1"
                                    :page-size="10"
                                    layout="total, prev, pager, next"
                                    :total="total">
                            </el-pagination>
                        </div>
                    </div>


                </div>
            </div>

            <!-- 编辑弹出框 -->
            <el-dialog :title=dialogTitle :visible.sync="editVisible" width="30%">
                <el-form ref="form" :model="form" label-width="70px">

                    <el-form-item label="部门名称">
                        <el-input v-model="form.daptName"></el-input>
                    </el-form-item>

                    <el-form-item label="排序值">
                        <el-input v-model="form.sort"></el-input>
                    </el-form-item>
                    <el-form-item label="上级部门">
                        <div>
                            <el-cascader
                                    v-model="value"
                                    :options="options"
                                    :props="{ checkStrictly: true }"
                                    @change="handleChange"
                                    style="width: 100%;"
                                    clearable></el-cascader>
                        </div>

                    </el-form-item>

                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
            </el-dialog>
        </div>
    </section>
</template>

<script>
    import draggable from 'vuedraggable'
    import {getDeptTree, insertDept} from '../../api/sys/dept';

    export default {
        name: 'department',
        data() {
            return {
                tableData: [],
                deptData: [],
                options: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_Dept: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                dialogTitle: '添加部门',
                delVisible: false,
                currentPage1: 1,
                total: 0,
                PopUpBox: '',
                isEnable: '',
                value: 0,
                form: {
                    daptName: '',
                    sort: '',
                    parentId: '',
                },
                dragOptions: {
                    animation: 120,
                    scroll: true,
                    group: 'sortlist',
                    ghostClass: 'ghost-style'
                },
            }
        },
        mounted() {
            this.selectDeptTree();
        },
        components: {
            draggable
        },

        methods: {
            // 添加部门
            addDepartment() {
                this.editVisible = true;
                // alert(this.form.value)

            },
            // 获得数据
            selectDeptTree() {

                getDeptTree().then((res) => {
                    console.log(res);
                    if (res.status === 0) {
                        this.deptData = res.data;
                        this.options = res.data;
                    }
                })


            },

            handleNodeClick() {

            },
            // 获取部门树
            renderContent() {
                console.log("12221212")
                getDeptTree().then((res) => {
                    console.log(res);
                    console.log(res.data.data);
                    if (res.status === 0) {
                        this.deptData = res.data;
                    }
                })
            }
            ,
            // 级联菜单
            handleChange(value) {
                console.log(value);
                this.value = value;

            },

            // 处理根据单位的模糊查询
            search() {

            },
            handleSelectionChange() {
            },
            handleCurrentChange() {
            },
            // 添加保存按钮的时候
            saveEdit() {
                console.log("添加部门信息")
                console.log(this.value[0])
                const param = {
                    name: this.form.daptName,
                    sort: this.form.sort,
                    parentId: this.value[0]
                }
                insertDept(param).then((res) => {
                    if (res.status === 0) {
                        this.$message.success(`添加成功`);
                        this.editVisible = false;
                        this.refresh();
                    }
                })
            },
            // 编辑部门信息
            append(data) {
                console.log(data);
                this.form.daptName = data.name;
                this.form.sort = data.sort;
                this.form.parentId = data.label;

                this.dialogTitle = "编辑部门";
                this.editVisible = true;
            },
            removeHandle(event) {
                console.log(event);
                this.$message.success(`从 ${event.from.id} 移动到 ${event.to.id} `);
            },
            // 刷新
            refresh() {
                this.getDeptTree()
            },


        },


    }

</script>

<style scoped>
    .drag-box {
        display: flex;
        user-select: none;
    }

    .drag-box-item {
        flex: 1;
        max-width: 37%;
        min-width: 300px;
        background-color: #ffffff;
        margin-right: 10px;
        border-radius: 6px;
        border: 1px #e1e4e8 solid;
    }

    .drag-box-item1 {
        flex: 1;
        max-width: 100%;
        min-width: 300px;
        background-color: #eff1f5;
        margin-right: 10px;
        border-radius: 6px;
        border: 1px #e1e4e8 solid;
    }

    .item-title {
        padding: 8px 8px 8px 12px;
        font-size: 14px;
        line-height: 1.5;
        color: #24292e;
        font-weight: 600;
    }

    .item-ul {
        padding: 0 8px 8px;
        height: 500px;
        overflow-y: scroll;
    }

    .item-ul::-webkit-scrollbar {
        width: 0;
    }

    .drag-list {
        border: 1px #e1e4e8 solid;
        padding: 10px;
        margin: 5px 0 10px;
        list-style: none;
        background-color: #fff;
        border-radius: 6px;
        cursor: pointer;
        -webkit-transition: border .3s ease-in;
        transition: border .3s ease-in;
    }

    .del-dialog-font {
        font-size: 15px;
        padding: 0 0 0 10px;
    }

    .drag-list:hover {
        border: 1px solid #20a0ff;
    }

    .drag-title {
        font-weight: 400;
        line-height: 25px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }

    .ghost-style {
        display: block;
        color: transparent;
        border-style: dashed
    }

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
        text-align: center
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

    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
</style>
