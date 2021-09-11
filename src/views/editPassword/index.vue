<template>
  <div class="container">
    <el-steps :active="active" finish-status="success">
      <el-step title="请输入当前密码"></el-step>
      <el-step title="请输入新密码"></el-step>
      <el-step title="修改成功"></el-step>
    </el-steps>
    <div class="content">
      <div v-if="active === 0" class="flex_jc-fs">
        <el-input v-model="oldP" show-password></el-input>
        <div class="m_l-20">
          <el-button
            type="primary"
            icon="el-icon-right"
            @click="confirmPwd"
          ></el-button>
        </div>
      </div>
      <div v-if="active === 1" class="flex_jc-fs">
        <el-input v-model="newP" show-password></el-input>
        <div class="m_l-20">
          <el-button
            type="primary"
            icon="el-icon-right"
            @click="submitNPwd"
          ></el-button>
        </div>
      </div>
      <div v-if="active === 2">修改成功，即将跳转至登录页.......</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      oldP: "",
      newP: ""
    };
  },
  methods: {
    async confirmPwd() {
      if (this.oldP) {
        let params = {
          pwd: this.oldP
        };
        let res = await this.$api.user.checkPwd(params);
        if (res.status) {
          if (res.data) {
            this.active = 1;
          } else {
            this.$message.error("密码错误");
          }
        } else {
          this.$message.error(res.msg);
        }
      }
    },

    async submitNPwd() {
      if (this.newP) {
        const reg = /^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])\S*$/;
        if (!reg.test(this.newP)) {
          this.$message.error("密码需要包含数字和大小写字母")
          return;
        }
        let params = {
          pwd: this.newP
        };
        let res = await this.$api.user.updatePwd(params);
        if (res.status) {
          if (res.data) {
            this.active = 2;
            setTimeout(async ()=>{
              await this.$store.dispatch('user/logout')
              this.$router.push('/login')
            },2000)
          } else {
            this.$message.error("修改失败");
          }
        } else {
          this.$message.error(res.msg);
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  margin: 400px auto;
  width: 500px;
}
</style>
