<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 权限管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="menuContainer">
        <span class="menu_span">菜单赋权</span>
        <el-drawer title="我是标题" :visible.sync="drawer" :with-header="false">
          <span>我来啦!</span>
          <el-transfer
            filterable
            :filter-method="filterMethod"
            filter-placeholder="请输入城市拼音"
            v-model="value"
            :data="data"
          ></el-transfer>
        </el-drawer>
      </div>
    </div>
  </div>
</template>
<script>
export default {};
</script>

<style scoped>
.menuContainer {
  width: 100%;
  height: 100%;
}
.menu_span {
  color: chartreuse;
}
</style>