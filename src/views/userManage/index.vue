<template>
  <div class="container">
    <!-- 筛选 -->
    <div class="condition">
      <el-form inline :model="conditionForm">
        <el-form-item label="用户名">
          <el-input v-model="conditionForm.userName" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 数据 -->
    <div class="table">
      <el-table :data="dt" border style="width: 100%">
        <el-table-column label="用户名">
          <template slot-scope="scope">
            <span>{{ scope.row.userName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="性别">
          <template slot-scope="scope">
            <span>{{ scope.row.sex ? "男" : "女" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="年龄">
          <template slot-scope="scope">
            <span>{{ scope.row.age }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号">
          <template slot-scope="scope">
            <span>{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="!scope.row.isRisk"
              type="primary"
              size="small"
              @click="handleStatus(1, scope.row.id)"
              >标记为风险人员</el-button
            >
            <el-button
              v-else
              size="small"
              @click="handleStatus(0, scope.row.id)"
              >取消标记</el-button
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
export default {
  data() {
    return {
      conditionForm: {
        userName: ""
      },
      dt: [],
      pageSize: 10,
      pageNumber: 1,
      total: 0
    };
  },
  mounted() {
    this.getDt();
  },
  methods: {
    async getDt() {
      let res = await this.$api.user.userList({
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        userName: this.conditionForm.userName
      });
      if (res.status) {
        this.dt = res.data.list;
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

    async handleStatus(status, id) {
      let params = {
        status,
        id
      };
      let res = await this.$api.user.editUserStatus(params);
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
