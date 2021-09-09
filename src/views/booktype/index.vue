<template>
  <div class="book-type">
    <!-- 筛选 -->
    <div class="condition">
      <el-form inline :model="conditionForm">
        <el-form-item label="书籍类名">
          <el-input v-model="conditionForm.typeName" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 操作 -->
    <div>
      <el-button type="primary" icon="el-icon-plus" @click="openAddDialog(0)"
        >新增</el-button
      >
      <el-button icon="el-icon-delete" @click="batchDel">批量删除</el-button>
    </div>
    <!-- 数据 -->
    <div class="table">
      <el-table
        :data="dt"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="typeName" label="类名"> </el-table-column>
        <el-table-column prop="num" label="数量"> </el-table-column>
        <el-table-column prop="createTime" label="创建时间"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click="openAddDialog(1, scope.row)"
              >编辑</el-button
            >
            <el-button type="danger" size="small" @click="del([scope.row.id])"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="m_t-20">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        @current-change="pageChange"
      >
      </el-pagination>
    </div>
    <AddDialog
      :visible.sync="addDialogVisible"
      @refresh="getDt"
      :selectRow="selectRow"
      :isEdit="isEdit"
    ></AddDialog>
  </div>
</template>

<script>
import moment from "moment";
import AddDialog from "./components/AddDialog";
export default {
  components: {
    AddDialog
  },
  data() {
    return {
      conditionForm: {
        typeName: ""
      },
      dt: [],
      pageSize: 10,
      pageNumber: 1,
      total: 0,
      addDialogVisible: false,
      multipleSelection: [],
      selectRow: {},
      isEdit: false
    };
  },
  mounted() {
    this.getDt();
  },
  methods: {
    async getDt() {
      let res = await this.$api.book.typeList({
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        name: this.conditionForm.typeName
      });
      if (res.status) {
        this.total = res.data.total;
        this.dt = res.data.list.map(item => {
          item.createTime = moment(item.createTime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          return item;
        });
      } else {
        this.$message.error("查询数据失败~");
      }
    },

    search() {
      this.pageNumber = 1;
      this.getDt();
    },

    pageChange(v) {
      this.pageNumber = v;
      this.getDt();
    },

    openAddDialog(type, row) {
      this.selectRow = type ? row : {};
      this.isEdit = type ? true : false;
      this.addDialogVisible = true;
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    batchDel() {
      let ids = this.multipleSelection.map(item => item.id);
      if (ids.length) {
        this.del(ids);
      }
    },

    async del(ids) {
      this.$confirm("此操作将删除分类下所有书籍, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await this.$api.book.delType({ ids });
          if (res.status) {
            this.$message.success("删除成功");
            this.getDt();
          } else {
            this.$message.error("删除失败");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.table {
  margin-top: 20px;
}
</style>
