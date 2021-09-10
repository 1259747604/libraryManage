<template>
  <div class="book-manage">
    <!-- 筛选 -->
    <div class="condition">
      <el-form inline :model="conditionForm">
        <el-form-item label="书名">
          <el-input v-model="conditionForm.bookName" clearable></el-input>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="conditionForm.bookAuthor" clearable></el-input>
        </el-form-item>
        <el-form-item label="出版社">
          <el-input v-model="conditionForm.bookPub" clearable></el-input>
        </el-form-item>
        <el-form-item label="ISBN">
          <el-input v-model="conditionForm.isbn" clearable></el-input>
        </el-form-item>
        <el-form-item label="类别">
          <el-select
            v-model="conditionForm.bookType"
            placeholder="类别"
            clearable
          >
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.typeName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 操作 -->
    <div>
      <el-button type="primary" icon="el-icon-plus" @click="goAdd(0)"
        >新增</el-button
      >
      <el-button icon="el-icon-delete" @click="batchDel">批量删除</el-button>
    </div>
    <!-- 数据 -->
    <div class="table m_t-20">
      <el-table
        :data="dt"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="img" label="书籍封面">
          <template slot-scope="scope">
            <img class="bookimg" :src="scope.row.img" alt="" />
          </template>
        </el-table-column>
        <el-table-column prop="bookName" label="书名"> </el-table-column>
        <el-table-column prop="bookAuthor" label="作者名"> </el-table-column>
        <el-table-column prop="bookPub" label="出版社"> </el-table-column>
        <el-table-column prop="isbn" label="ISBN"> </el-table-column>
        <el-table-column label="书籍类型">
          <template slot-scope="scope">
            <span>{{ scope.row.booktype.typeName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="bookNum" label="数量"> </el-table-column>
        <el-table-column prop="bookPrice" label="价格"> </el-table-column>
        <el-table-column prop="createTime" label="创建时间"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click="goAdd(1, scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="del([scope.row.id], [scope.row.bookType])"
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
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      conditionForm: {
        bookName: "",
        bookAuthor: "",
        bookPub: "",
        bookType: "",
        isbn: ""
      },
      dt: [],
      pageSize: 10,
      pageNumber: 1,
      total: 0,
      typeList: [],
      multipleSelection: []
    };
  },
  created() {
    this.getTypeList();
    this.getDt();
  },
  methods: {
    async getTypeList() {
      let res = await this.$api.book.typeList({
        pageNumber: -1
      });
      if (res.status) {
        this.typeList = res.data.list;
      }
    },

    async getDt() {
      let res = await this.$api.book.bookList({
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        ...this.conditionForm
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

    reset() {
      this.conditionForm = {
        bookName: "",
        bookAuthor: "",
        bookPub: "",
        bookType: "",
        isbn: ""
      };
    },

    goAdd(type, id = 0) {
      this.$router.push({
        path: `/bookmanage/add`,
        query: {
          isEdit: !!type,
          id
        }
      });
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    batchDel() {
      let ids = this.multipleSelection.map(item => item.id);
      let types = this.multipleSelection.map(item => item.bookType);
      if (ids.length) {
        this.del(ids, types);
      }
    },

    async del(ids, types) {
      this.$confirm("此操作将删除书籍信息 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await this.$api.book.delBook({ ids, types });
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
.bookimg {
  width: 50px;
  height: 50px;
  object-fit: contain;
}
</style>
