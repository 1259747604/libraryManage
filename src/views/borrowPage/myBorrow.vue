<template>
  <div class="container">
    <!-- 筛选 -->
    <div class="condition">
      <el-form inline :model="conditionForm">
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
            <span>{{ scope.row.book ? scope.row.book.bookName : "未知"  }}</span>
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
            <div>
              <el-link
                :type="
                  [
                    'primary',
                    'info',
                    'danger',
                    'success',
                    'warning',
                    'warning'
                  ][scope.row.status]
                "
                >{{
                  [
                    "申请中",
                    "借阅中",
                    "拒绝借阅",
                    "已归还",
                    "超时未归还",
                    "超时已归还"
                  ][scope.row.status]
                }}</el-link
              >
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
import { mapState } from "vuex";
export default {
  data() {
    return {
      conditionForm: {
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
          label: "借阅中",
          value: 1
        },
        {
          label: "拒绝借阅",
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
        }
      ]
    };
  },
  mounted() {
    this.getDt();
  },
  computed: {
    ...mapState("user", {
      userInfo: state => state.userInfo
    })
  },
  methods: {
    async getDt() {
      let res = await this.$api.book.borrowList({
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        userId: this.userInfo.id,
        status: this.conditionForm.status
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
    }
  }
};
</script>

<style lang="scss" scoped></style>
