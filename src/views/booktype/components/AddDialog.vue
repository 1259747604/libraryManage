<template>
  <el-dialog
    :title="isEdit ? '修改类名' : '新增类名'"
    :visible.sync="dialogVisible"
    width="30%"
  >
    <div class="flex_ai-c">
      <div>书籍类名:</div>
      <div class="m_l-20 flex-1">
        <el-input v-model="name" placeholder="请输入..."></el-input>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    selectRow: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  watch: {
    selectRow(v) {
      this.name = v.typeName || "";
    }
  },
  data() {
    return {
      name: ""
    };
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(v) {
        this.$emit("update:visible", v);
      }
    }
  },
  methods: {
    // 新增
    async add() {
      let res = await this.$api.book.addType({ name: this.name });
      if (res.status) {
        this.$emit("update:visible", false);
        this.$message.success("新增成功");
        this.$emit("refresh");
        return;
      }
      this.$message.error("新增失败");
    },

    // 修改
    async edit() {
      if (this.name === this.selectRow.typeName) {
        this.$message.error("与原名相同，无需修改");
        return;
      }
      let res = await this.$api.book.editType({
        name: this.name,
        id: this.selectRow.id
      });
      if (res.status) {
        this.$emit("update:visible", false);
        this.$message.success("修改成功");
        this.$emit("refresh");
        return;
      }
      this.$message.error(res.msg);
    },

    // 点击确认按钮
    submit() {
      if (this.isEdit) {
        this.edit();
      } else {
        this.add();
      }
    }
  }
};
</script>
