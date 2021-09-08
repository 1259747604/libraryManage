<template>
  <div class="login-container">
    <div class="bg"></div>
    <div class="form-container">
      <el-form
        ref="loginForm"
        :model="loginForm"
        class="login-form"
        autocomplete="on"
        label-position="left"
      >
        <div class="title-container">
          <h3 class="title">图书管理系统</h3>
        </div>

        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="Username"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="on"
          />
        </el-form-item>

        <el-tooltip
          v-model="capsTooltip"
          content="大写已锁定"
          placement="right"
          manual
        >
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="Password"
              name="password"
              tabindex="2"
              autocomplete="on"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon
                :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
              />
            </span>
          </el-form-item>
        </el-tooltip>

        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
          >登录</el-button
        >
        <div class="register" @click="handleRegister">去注册</div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      passwordType: "password",
      capsTooltip: false,
      loading: false
    };
  },
  watch: {
    $route: {
      handler: function(route) {},
      immediate: true
    }
  },
  mounted() {},
  methods: {
    checkCapslock(e) {
      const { key } = e;
      this.capsTooltip = key && key.length === 1 && key >= "A" && key <= "Z";
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.loading = true;
      this.$store
        .dispatch("user/login", this.loginForm)
        .then(res => {
          if (res.data.roles.includes("admin")) {
            this.$router.push({ path: "/" });
          } else {
            this.$router.push({ path: "/borrow/index" });
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleRegister() {
      this.$router.push({ path: "/register" });
    }
  }
};
</script>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  position: relative;
  min-height: 100%;
  width: 100%;
  .bg {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url("../../assets/images/login-bg.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    overflow: hidden;
    z-index: 1;
    opacity: 0.6;
  }
  .login-form {
    position: relative;
    width: 520px;
    padding: 35px;
    margin: 0 auto;
    overflow: hidden;
    z-index: 2;
    ::v-deep .el-input {
      width: 93%;
    }
  }
  .svg-container {
    padding: 6px 15px 6px 5px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: #000000;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }
}
.form-container {
  position: absolute;
  left: 50%;
  top: 20%;
  transform: translate(-50%, 0);
  background: rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  z-index: 2;
  .register {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    display: inline-block;
    margin-top: 15px;
    color: #1890ff;
    cursor: pointer;
  }
}
</style>
