<template>
  <div class="container flex_jc-fs">
    <div class="left">
      <div
        class="type"
        :class="[active === item.id ? 'active' : '']"
        v-for="(item, index) of typeList"
        :key="index"
        @click="changeType(item.id)"
      >
        {{ item.typeName }}
      </div>
    </div>
    <div class="right flex-1 flex_d-c">
      <!-- 筛选 -->
      <div class="condition">
        <el-form inline :model="conditionForm">
          <el-form-item label="书名">
            <el-input v-model="conditionForm.bookName" clearable></el-input>
          </el-form-item>
          <el-form-item label="作者">
            <el-input v-model="conditionForm.bookAuthor" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 主体 -->
      <div class="content flex-1">
        <div
          class="book"
          v-for="(item, index) of dt"
          :key="item.id"
        >
          <img :src="item.img" alt="" />
          <div class="book-left">
            <p>{{ item.bookName }}</p>
            <div class="second-info">
              <i class="el-icon-s-custom"></i>
              <span>{{ item.bookAuthor }}</span>
              <span style="margin: 0 5px 0 5px;">|</span>
              <span>{{ item.booktype.typeName }}</span>
            </div>
            <div class="desc" :title="item.desc">简介: {{ item.desc }}</div>
            <div class="pub">
              出版社: {{ item.bookPub }} 余量: {{ item.bookNum }}
            </div>
          </div>
          <div class="btn">
            <el-button
              v-if="item.bookNum > 0"
              type="primary"
              @click="showD(item)"
              >申请借阅</el-button
            >
            <el-button v-else>不可借阅</el-button>
          </div>
        </div>
      </div>
      <!-- 分页 -->
      <div>
        <el-divider></el-divider>
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
    <el-dialog title="申请借阅" :visible.sync="visible" width="30%">
      <div>
        <span class="m_r-10">预计归还日期</span>
        <el-date-picker v-model="returnTime" type="date" placeholder="选择日期">
        </el-date-picker>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="submit">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
import { mapState } from "vuex";
export default {
  data() {
    return {
      typeList: [],
      active: 0,
      conditionForm: {
        bookName: "",
        bookAuthor: ""
      },
      pageSize: 10,
      pageNumber: 1,
      total: 0,
      dt: [],
      selectBook: {},
      visible: false,
      returnTime: null
    };
  },
  created() {
    this.getTypeList();
    this.getDt();
  },
  computed: {
    ...mapState("user", {
      userInfo: state => state.userInfo
    })
  },
  methods: {
    async getTypeList() {
      let res = await this.$api.book.typeList({
        pageNumber: -1
      });
      if (res.status) {
        let all = {
          typeName: "全部",
          id: 0
        };
        this.typeList = [all, ...res.data.list];
      }
    },

    async getDt() {
      let params = {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        ...this.conditionForm
      };
      if (this.active) {
        params.bookType = this.active;
      }
      let res = await this.$api.book.bookList(params);
      if (res.status) {
        this.total = res.data.total;
        this.dt = res.data.list;
      } else {
        this.$message.error("查询数据失败~");
      }
    },

    changeType(id) {
      this.active = id;
      this.getDt();
    },
    search() {
      this.pageNumber = 1;
      this.getDt();
    },
    reset() {
      this.conditionForm = {
        bookName: "",
        bookAuthor: ""
      };
    },
    pageChange(v) {
      this.pageNumber = v;
      this.getDt();
    },
    showD(item) {
      if (this.userInfo.isRisk) {
        this.$message.info("您的账户存在异常，请联系管理员~");
        return;
      }
      this.selectBook = item;
      this.visible = true;
    },
    async submit() {
      if (!this.returnTime) {
        this.$message.error("请选择归还时间");
      }
      let params = {
        userId: this.userInfo.id,
        userName: this.userInfo.userName,
        bookId: this.selectBook.id,
        expectedReturnTime: moment(this.returnTime).format(
          "YYYY-MM-DD 23:59:59"
        )
      };
      let res = await this.$api.book.applyBorrow(params);
      this.visible = false;
      if (res.status) {
        this.$message.success("申请成功");
        this.getDt();
        return;
      }
      this.$message.error(res.msg);
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  .left {
    height: 100%;
    width: 200px;
    border-right: 1px solid #dddddd;
    overflow-x: hidden;
    overflow-y: auto;
    .type {
      padding: 15px;
      border-bottom: 1px dashed #dddddd;
      cursor: pointer;
      &.active {
        color: #e3703e;
      }
    }
  }
  .right {
    margin-left: 20px;
    overflow: hidden;
    .content {
      overflow-x: hidden;
      overflow-y: auto;
      // display: flex;
      // flex-wrap: wrap;
      // align-items: flex-start;
      .book {
        float: left;
        padding: 15px;
        display: flex;
        width: 50%;
        height: 180px;
        border-bottom: 1px solid #dddddd;
        overflow: hidden;
        cursor: pointer;
        img {
          width: 120px;
          height: 150px;
          object-fit: cover;
          // overflow: hidden;
        }
        .book-left {
          margin-left: 10px;
          flex: 1;
          .second-info {
            font-size: 13px;
            color: #d7d7d7;
          }
          .desc {
            margin-top: 10px;
            height: 36px;
            overflow: hidden;
            color: #383838;
            word-break: break-all;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
          }
          .pub {
            margin-top: 10px;
            font-size: 15px;
            color: #d7d7d7;
          }
        }
      }
    }
  }
}
</style>
