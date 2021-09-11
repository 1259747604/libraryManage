<template>
  <div class="container">
    <!-- 筛选 -->
    <div class="condition">
      <el-form inline :model="conditionForm">
        <el-form-item label="用户名">
          <el-input v-model="conditionForm.userName" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="conditionForm.status"
            placeholder="类别"
            clearable
          >
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 数据 -->
    <div class="table">
      <el-table :data="dt" border style="width: 100%">
        <el-table-column label="书名">
          <template slot-scope="scope">
            <span>{{ scope.row.book.bookName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="用户名"> </el-table-column>
        <el-table-column prop="recordTime" label="申请时间"> </el-table-column>
        <el-table-column label="预计归还时间">
          <template slot-scope="scope">
            <span>{{ scope.row.expectedReturnTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实际归还时间">
          <template slot-scope="scope">
            <span>{{ scope.row.returnTime || "-" }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <div v-if="scope.row.status === 0">
              <el-button
                type="primary"
                size="small"
                @click="handleStatus(1, scope.row)"
                >同意借阅</el-button
              >
              <el-button
                type="danger"
                size="small"
                @click="handleStatus(2, scope.row)"
                >拒绝借阅</el-button
              >
            </div>
            <div v-if="scope.row.status === 1">
              <el-button
                type="primary"
                size="small"
                @click="handleStatus(3, scope.row)"
                >同意归还</el-button
              >
            </div>
            <div v-if="scope.row.status === 2">
              <el-link type="info">已拒绝借阅</el-link>
            </div>
            <div v-if="scope.row.status === 3">
              <el-link type="success">已归还</el-link>
            </div>
            <div v-if="scope.row.status === 4">
              <el-button
                type="primary"
                size="warning"
                @click="handleStatus(5, scope.row)"
                >超时归还</el-button
              >
            </div>
            <div v-if="scope.row.status === 5">
              <el-link type="warning">已超时归还</el-link>
            </div>
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
        userName: "",
        status: ""
      },
      dt: [],
      pageSize: 10,
      pageNumber: 1,
      total: 0,
      statusList: [
        {
          label: "申请中",
          value: 0
        },
        {
          label: "借出中",
          value: 1
        },
        {
          label: "已拒绝",
          value: 2
        },
        {
          label: "已归还",
          value: 3
        },
        {
          label: "超时未归还",
          value: 4
        },
        {
          label: "超时已归还",
          value: 5
        },
      ]
    };
  },
  mounted() {
    this.getDt();
  },
  methods: {
    async getDt() {
      let res = await this.$api.book.borrowList({
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        userName: this.conditionForm.userName,
        status: this.conditionForm.status,
      });
      if (res.status) {
        this.dt = res.data.list.map(item => {
          item.recordTime = moment(item.recordTime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          item.expectedReturnTime = moment(item.expectedReturnTime).format(
            "YYYY-MM-DD"
          );

          if (item.returnTime) {
            item.returnTime = moment(item.returnTime).format("YYYY-MM-DD");
          }

          return item;
        });
        this.total = res.data.total;
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

    async handleStatus(status, row) {
      let params = {
        status,
        id: row.id,
        bookId: row.bookId
      };
      let res = await this.$api.book.editBorrowStatus(params);
      if (res.status) {
        this.$message.success("操作成功");
        this.getDt();
        return;
      }
      this.$message.error("操作失败");
    }
  }
};
</script>

<style lang="scss" scoped></style>
