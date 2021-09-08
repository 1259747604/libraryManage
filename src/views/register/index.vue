<template>
  <div class="register-container">
    <div class="bg"></div>
    <div class="form-container">
      <div class="title">注册新用户</div>
      <el-form
        label-position="left"
        label-width="120px"
        :model="form"
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName"></el-input>
        </el-form-item>
        <el-form-item label="请输入密码" prop="password">
          <el-input v-model="form.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="请确认密码" prop="confirmPassword">
          <el-input v-model="form.confirmPassword" show-password></el-input>
        </el-form-item>
        <el-form-item label="请选择性别" prop="sex">
          <el-radio v-model="form.sex" :label="1">男</el-radio>
          <el-radio v-model="form.sex" :label="0">女</el-radio>
        </el-form-item>
        <el-form-item label="请填写年龄" prop="age">
          <el-input v-model="form.age"></el-input>
        </el-form-item>
        <el-form-item label="请输入手机号" prop="phone">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="请选择头像" prop="icon">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            action=""
            :http-request="upload"
          >
            <img v-if="form.icon" :src="form.icon" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div class="btn">
        <el-button type="primary" @click="submit">注册</el-button>
        <el-button @click="goLogin">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        const reg = /^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])\S*$/;
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error("密码需大于6位包含数字大小写字母"));
        }
      }
    };

    const validateComfirmPass = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error("两次密码输入不一致"));
      } else {
        callback();
      }
    };

    const validatePhone = (rule, value, callback) => {
      const reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确手机号"));
      }
    };

    return {
      form: {
        userName: "",
        password: "",
        confirmPassword: "",
        sex: 1,
        age: "",
        phone: "",
        icon: ""
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ validator: validatePass, trigger: "blur" }],
        confirmPassword: [{ validator: validateComfirmPass, trigger: "blur" }],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        age: [{ required: true, message: "请输入年龄", trigger: "blur" }],
        phone: [{ validator: validatePhone, trigger: "blur" }],
        icon: [{ required: true, message: "请上传头像", trigger: "blur" }]
      }
    };
  },
  methods: {
    async upload(o) {
      let formD = new FormData();
      formD.append("file", o.file);
      let res = await this.$api.upload.uploadImg(formD);
      if (res.status) {
        this.form.icon = res.data;
      } else {
        this.$message.error(res.msg);
      }
    },

    submit() {
      this.$refs["ruleForm"].validate(async valid => {
        if (valid) {
          let params = {
            userName: this.form.userName,
            password: this.form.password,
            sex: this.form.sex,
            age: this.form.age,
            phone: this.form.phone,
            icon: this.form.icon
          };
          let res = await this.$api.user.register(params);
          if (res.status) {
            this.$message({
              message: "恭喜您注册成功！即将跳转登录页",
              type: "success",
              duration: 2000,
              onClose: () => {
                this.goLogin();
              }
            });
            return;
          }
          this.$message.error(res.msg);
        }
      });
    },

    goLogin() {
      this.$router.push("/login");
    }
  }
};
</script>

<style lang="scss" scoped>
.register-container {
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
  .form-container {
    position: absolute;
    left: 50%;
    top: 20%;
    transform: translate(-50%, 0);
    padding: 30px 60px;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 20px;
    z-index: 2;
    .title {
      margin-bottom: 20px;
      text-align: center;
      font-size: 26px;
      font-weight: 600;
    }
    .btn {
      display: flex;
      justify-content: center;
    }
    .avatar-uploader {
      ::v-deep .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        &:hover {
          border-color: #409eff;
        }
      }
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
    }
    .avatar {
      width: 100px;
      height: 100px;
      display: block;
    }
  }
}
</style>
