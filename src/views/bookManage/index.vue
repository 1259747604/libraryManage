<template>
  <div class="book-manage">
    <!-- 筛选 -->
    <div class="condition">
      <el-form inline :model="conditionForm">
        <el-form-item label="书名">
          <el-input v-model="conditionForm.bookName"></el-input>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="conditionForm.author"></el-input>
        </el-form-item>
        <el-form-item label="出版社">
          <el-input v-model="conditionForm.pub"></el-input>
        </el-form-item>
        <el-form-item label="类别">
          <el-select v-model="conditionForm.type" placeholder="活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 数据 -->
    <div class="table"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      conditionForm: {
        bookName: "",
        author: "",
        pub: "",
        type: ""
      }
    }
  },
  methods: {
    search() {

    }
  }
};
</script>

<style lang="scss" scoped></style>
