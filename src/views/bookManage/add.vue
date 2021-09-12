<template>
  <div class="bookAorE flex_d-c">
    <!-- 头部文字 -->
    <div class="title">{{ isEdit ? "编辑书籍" : "新增书籍" }}</div>
    <!-- 条 -->
    <div class="line m_t-20">基本信息</div>
    <div class="form m_t-20 flex-1">
      <el-form label-width="120px" :model="form" :rules="rules" ref="ruleForm">
        <div class="flex_d-c flex_ai-c">
          <el-form-item label="书籍名称" prop="bookName">
            <div class="w-400">
              <el-input v-model="form.bookName"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="书籍作者" prop="bookAuthor">
            <div class="w-400">
              <el-input v-model="form.bookAuthor"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="出版社" prop="bookPub">
            <div class="w-400">
              <el-input v-model="form.bookPub"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="类别" prop="bookType">
            <div class="w-400">
              <el-select
                v-model="form.bookType"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.typeName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="数量" prop="bookNum">
            <div class="w-400">
              <el-input v-model="form.bookNum"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="价格" prop="bookPrice">
            <div class="w-400">
              <el-input v-model="form.bookPrice"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="ISBN" prop="isbn">
            <div class="w-400">
              <el-input v-model="form.isbn"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="简介" prop="desc">
            <div class="w-400">
              <el-input type="textarea" :rows="5" v-model="form.desc"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="书籍封面" prop="img">
            <div class="w-400">
              <el-upload
                class="avatar-uploader"
                :show-file-list="false"
                action=""
                :http-request="upload"
              >
                <img v-if="form.img" :src="form.img" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- 底部按钮 -->
    <el-divider></el-divider>
    <div class="flex_jc-fe">
      <el-button type="primary" @click="submit">提交</el-button>
      <el-button @click="goListPage">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const validateBookNum = (rule, value, callback) => {
      const reg = /^\d{1,}$/;
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入合法数量"));
      }
    };

    const validateBookPrice = (rule, value, callback) => {
      const reg = /(?:^[1-9]([0-9]+)?(?:\.[0-9]{1,2})?$)|(?:^(?:0)$)|(?:^[0-9]\.[0-9](?:[0-9])?$)/;
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入合法价格"));
      }
    };
    return {
      form: {
        bookName: "",
        bookAuthor: "",
        bookPub: "",
        bookType: "",
        bookNum: "",
        bookPrice: "",
        isbn: "",
        img: "",
        desc: ""
      },
      rules: {
        bookName: [
          { required: true, message: "请输入书籍名称", trigger: "blur" }
        ],
        bookAuthor: [
          { required: true, message: "请输入作者", trigger: "blur" }
        ],
        bookPub: [{ required: true, message: "请输入出版社", trigger: "blur" }],
        bookType: [{ required: true, message: "请选择类型", trigger: "blur" }],
        isbn: [
          { required: true, message: "请输入书籍isbn号", trigger: "blur" }
        ],
        bookNum: [
          { required: true, message: "请输入书籍书籍数量", trigger: "blur" },
          { validator: validateBookNum, trigger: "blur" }
        ],
        bookPrice: [
          { required: true, message: "请输入书籍价格", trigger: "blur" },
          { validator: validateBookPrice, trigger: "blur" }
        ],
        img: [{ required: true, message: "请上传书籍封面", trigger: "blur" }],
        desc: [{ required: true, message: "请填写简介", trigger: "blur" }]
      },
      typeList: [],
      isEdit: false,
      id: 0,
      originInfo: {}
    };
  },
  created() {
    this.isEdit = JSON.parse(this.$route.query.isEdit);
    this.id = JSON.parse(this.$route.query.id) || 0;
    if (this.id) {
      this.getInfo();
    }
    this.getTypeList();
  },
  methods: {
    async getInfo() {
      let res = await this.$api.book.getBook({ id: this.id });
      if (res.status) {
        this.originInfo = res.data;
        this.form = {
          bookName: res.data.bookName,
          bookAuthor: res.data.bookAuthor,
          bookPub: res.data.bookPub,
          bookType: res.data.bookType,
          bookNum: res.data.bookNum,
          bookPrice: res.data.bookPrice,
          isbn: res.data.isbn,
          img: res.data.img,
          desc: res.data.desc,
        };
      } else {
        this.$message.error(res.msg);
      }
    },

    async upload(o) {
      let formD = new FormData();
      formD.append("file", o.file);
      let res = await this.$api.upload.uploadImg(formD);
      if (res.status) {
        this.form.img = res.data;
      } else {
        this.$message.error(res.msg);
      }
    },

    async getTypeList() {
      let res = await this.$api.book.typeList({
        pageNumber: -1
      });
      if (res.status) {
        this.typeList = res.data.list;
      }
    },

    submit() {
      this.$refs["ruleForm"].validate(async valid => {
        if (valid) {
          let params = {
            bookName: this.form.bookName,
            bookAuthor: this.form.bookAuthor,
            bookPub: this.form.bookPub,
            bookType: this.form.bookType,
            bookNum: this.form.bookNum,
            bookPrice: this.form.bookPrice,
            isbn: this.form.isbn,
            img: this.form.img,
            desc: this.form.desc,
          };
          if (this.isEdit) {
            params.id = this.originInfo.id;
            params.oldType = this.originInfo.bookType;
            let res = await this.$api.book.editBook(params);
            if (res.status) {
              this.$message({
                message: "修改成功",
                type: "success",
                duration: 1000,
                onClose: () => {
                  this.goListPage();
                }
              });
              return;
            }
            this.$message.error(res.msg);
          } else {
            let res = await this.$api.book.addBook(params);
            if (res.status) {
              this.$message({
                message: "新增成功",
                type: "success",
                duration: 1000,
                onClose: () => {
                  this.goListPage();
                }
              });
              return;
            }
            this.$message.error(res.msg);
          }
        }
      });
    },

    goListPage() {
      this.$router.push("/bookmanage/index");
    }
  }
};
</script>

<style lang="scss" scoped>
.bookAorE {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}
.title {
  font-size: 28px;
  font-weight: 600;
}
.line {
  background: #dddddd;
  padding: 10px;
  font-size: 13px;
}
.card {
  width: 100%;
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
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}
.avatar {
  width: 150px;
  height: 150px;
  display: block;
}
</style>
