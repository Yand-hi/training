<template>
  <div class="main-container entry-main">
    <div class="common-header" style="min-height:10px">
    </div>
    <div class="slice-body flex">
      <div class="slice-table common-table">
        <el-table stripe v-loading="tableLoading" :row-style="{height:'20px'}" :cell-style="{padding:'0px'}" :data="data" border :height='tableHeight' style="width: 100%">
          <el-table-column align="center" type="index" label="序号" width="45" :index="indexMethod"></el-table-column>
          <el-table-column v-for="(data, index) in headers" :key="index" :fixed="data.fixed" :prop="data.prop" :label="data.label" show-overflow-tooltip :min-width="data['min-width']" :align="data.align">
              <template slot-scope="scope">
              <viewer class="flex justify-content-center">
                <img style="width: 80px" v-if="data.prop === 'label_img'" :src="imgUrl+scope.row[data.prop]">
              </viewer>
              <span v-if="data.prop !== 'label_img'">{{ scope.row[data.prop] }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="operate" align="center" label="操作" fixed="right" min-width="80px">
            <template slot-scope="scope">
              <el-button-group>
                <el-button type="success" size="mini" @click="bindSlice(scope.row)">绑定</el-button>
                <el-button type="danger" size="mini" @click="deleteSlice(scope.row)">删除</el-button>
                <el-button type="primary" size="mini" @click="rowDblClick(scope.row)">阅片</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <div class="slicePage" style="position: absolute;bottom: 0; width:100%;
        display: flex;justify-content:center ;height: 40px;align-items:flex-start">
          <el-pagination @current-change="handleCurrentChange" :current-page.sync="pagination.current_page" :page-size="pagination.per_page" layout="total ,prev, pager, next, jumper" :total="pagination.count">
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog title="绑定" :visible.sync="dialogVisible" width="400px">
      <div class="column flex justify-content-center align-items-center">
        <img :src="imgUrl+current_slice.label_img" alt="" width="180px" style="margin:10px auto">
      </div>
      <el-form ref="bindForm" label-width="80px" :model="bindForm">
        <el-form-item label="病理号" prop="pathology_id" :rules="{ 
                required: true, message: '病理号不能为空', trigger: 'blur'}">
          <el-input size="mini" v-model="bindForm.pathology_id"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="liceBind">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import hzztTitle from '@/components/hzztTitle';
import pisSlideView from '@/components/pisSlideView/pisSlideView';
import { distributeService } from '@/page/manage/training/distribute/distribute.service';
import { fileService } from '@/page/manage/file/file.service';
import { mapState } from 'vuex';
import {imgUrl} from '@/config/utils';




export default {
  components: {
    hzztTitle,
    pisSlideView,
  },
  data() {
    return {
      imgUrl,
      cate_id: undefined,
      data: [],
      filterText: '',
      headers: [
        {
          'prop': 'name',
          'label': '切片名称',
          'min-width': 80,
          'align': 'center',
        },
        {
          'prop': 'label_img',
          'label': '标签图',
          'min-width': 80,
          'align': 'center',
        },
        {
          'prop': 'scan_start_at',
          'label': '开始时间',
          'min-width': 80,
          'align': 'center',
        },
        {
          'prop': 'scan_end_at',
          'label': '结束时间',
          'min-width': 80,
          'align': 'center',
        }
      ],
      pathology_id: '',
      is_assign: '',
      slice_type_id: '',
      name: '',
      real_name: '',
      slice_folder_type: '',
      loading: false,
      multipleSelection: [],
      slice_type_list: [],
      tableHeight: '100%',
      tableLoading: false,
      dialogVisible: false,
      label_status: undefined,
      status: undefined,
      pagination: {
        current: 1,
        pageSize: 15,
        showTotal: total => `共 ${total} 条`,
        total: 0,
      },
      users: [],
      distributeDialogVisible: false,
      testFolder: [],
      trainFolder: [],
      meta: {
        count: 0,
        current_page: 1,
        per_page: 15,
      },
      current_slice: '',
      bindForm: {
        pathology_id: ''
      },
      readingQuery: {},
    };
  },
  mounted() {

  },
  computed: {
    ...mapState(['user']),

  },
  created() {
    this.sliceList();
    this.folderList();
    this.getType();
  },
  methods: {
    getType() {
      distributeService.sliceType({ type: 1 }).then(({ body }) => {
        if (body.ret_code === 0) {
          this.slice_type_list = body.data.list
        }
      })
    },
    // 初始化切片列表
    sliceList() {
      let params = {
        pathology_id: this.pathology_id,
        is_assign: this.is_assign,
        slice_type_id: this.slice_type_id,
        name: this.name,
        real_name: this.real_name,
        slice_folder_type: this.slice_folder_type,
        label_status: this.label_status,
        folder_id: this.folder_id,
        bind_status: 0
      };
      this.tableLoading = true;
      distributeService.sliceList(params).then(({ body }) => {
        this.data = [];
        if (body.ret_code === 0) {
          this.data = (body.data.list).map((item) => ({
            ...item,
            label_img: `/api/process/get_image?file=${item.path}&type=label`,
            // distribute_path: Array.prototype.concat.apply([], (Array.prototype.concat.apply([], (item.folder).map(d => d))).map(d => d.name)),
            // slice_type: item.slice_type.name
          }))
          this.pagination = body.data.meta;
        }
      }).catch(() => {
        this.pagination = { count: 0, current_page: 1, per_page: 15 };
      }).finally(() => {
        this.tableLoading = false;
      });
    },

    folderList() {
      let params = {
        type: 1
      }
      distributeService.folderList(params).then(({ body }) => {
        this.trainFolder = {};
        if (body?.ret_code === 0) {
          this.trainFolder = (body.data.list).map((item) => ({
            ...item,
          }))
        }
      }).catch(() => {

      }).finally(() => {

      });
      distributeService.folderList({ type: 2 }).then(({ body }) => {
        this.testFolder = [];
        if (body?.ret_code === 0) {
          this.testFolder = (body.data.list).map((item) => ({
            ...item,
          }))
        }
      }).catch(() => {

      }).finally(() => {

      });
    },

    //分页页码改变事件
    handleCurrentChange(val) {
      console.log(val)
      this.sliceList();
    },

   
    deleteSlice(val) {
      console.log(val.id)
      this.$confirm('是否删除该切片?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        fileService.deleteSlice({ id: val.id }).then(({ body }) => {
          if (body.ret_code === 0) {
            this.$message.success(body.ret_msg)
            this.sliceList();
          }
        })
      });

    },
    rowDblClick(row) {
      this.readingQuery = {
        ...row,
        type: 'slice'
      }
      this.$router.push({ path: '/reading', query: { row: JSON.stringify(this.readingQuery) } })
    },
    bindSlice(val) {
      console.log(val.id)
      console.log(val)
      this.current_slice = val
      this.dialogVisible = true
    },
    liceBind() {
      this.$refs['bindForm'].validate((valid) => {
        if (valid) {
          fileService.bindSlice({ id: this.current_slice.id, pathology_id: this.bindForm.pathology_id }).then(({ body }) => {
            if (body.ret_code === 0) {
              this.$message.success(body.ret_msg)
              this.dialogVisible = false
              this.sliceList()
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });

    },


    indexMethod(index) {
      return index + 1;
    },
  },
  watch: {
    filterText(val) {
      this.$refs.entryTree.filter(val);
    },
  },
};
</script>

<style lang="scss">
.el-dialog__header {
  padding: 10px 20px;
  border-bottom: 1px solid #ebeef5;
}
.el-dialog__body {
  padding: 16px 20px;
}

.el-form-item__content {
  margin: 0;
}
.el-form-item__label {
  height: 30px;
}
</style>
