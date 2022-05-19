<template>
  <div class="main-container entry-main">
    <div class="common-header">
      <div class="flex align-items-center" style='position: relative;width:100%'>
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="病理号">
            <el-input style="margin-right: 12px" v-model="searchForm.pathology_id" size="mini" clearable placeholder="请输入病理号"  v-on:keyup.enter.native="sliceList()"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input style="margin-right: 12px" v-model="searchForm.real_name" size="mini" clearable placeholder="请输入姓名"  v-on:keyup.enter.native="sliceList()"></el-input>
          </el-form-item>
          <el-form-item label="检查项目">
            <el-select style="margin-right: 12px" v-model="searchForm.library_name" size="mini" placeholder="请选择检查项目" clearable   @change="sliceList()">
              <el-option v-for="(item,index) in library_name_list" :label="item.library_name" :value="item.library_name" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style='position: absolute;right:0;top:0;'>
            <el-button size="mini" type="primary" @click="sliceList">查询</el-button>
            <el-button size="mini" type="primary" @click="clearValue()">重置</el-button>
            <el-button size="mini" type="danger" @click="sync">同步</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="slice-body flex">
      <div class="slice-table common-table">
        <el-table stripe v-loading="tableLoading" :row-style="{height:'20px'}" @row-dblclick="rowDblClick" :cell-style="{padding:'0px'}" :data="data" @selection-change="handleSelect" border :height='tableHeight' style="width: 100%">
          <el-table-column type="selection" width="35"></el-table-column>
          <el-table-column align="center" type="index" label="序号" width="45" :index="indexMethod"></el-table-column>
          <el-table-column align="center" prop="pathology_id" label="病理号" min-width="80px" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="real_name" label="姓名" min-width="80px"></el-table-column>
          <el-table-column align="center" prop="age_str" label="年龄" min-width="80px"></el-table-column>
          <el-table-column align="center" prop="sample_name" label="蜡块名称" min-width="80px" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-for="item in scope.row.paraffin_blocks" :key="item.id">
                {{item.sample_name}}
              </span>
            </template>
          </el-table-column>
          <el-table-column v-for="(data, index) in headers" :key="index" :fixed="data.fixed" :prop="data.prop" :label="data.label" show-overflow-tooltip :min-width="data['min-width']" :align="data.align">
          </el-table-column>
          <el-table-column prop="operate" align="center" label="操作" fixed="right" min-width="120px">
            <template slot-scope="scope">
              <el-button-group>
                <el-button type="primary" size="mini" @click="rowDblClick(scope.row)">阅片</el-button>
              </el-button-group>
            </template>
          </el-table-column>

        </el-table>
        <div class="slicePage" style="position: absolute;bottom: 0; width:100%;
        display: flex;justify-content:center ;height: 40px;align-items:flex-start">
          <el-pagination @current-change="handleCurrentChange" 
          @size-change="sliceList()"
          :current-page.sync="meta.current_page" 
          :page-size="meta.per_page" layout="total ,prev, pager, next, jumper" :total="meta.count">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import hzztTitle from '@/components/hzztTitle';
import pisSlideView from '@/components/pisSlideView/pisSlideView';
import { fileService } from '@/page/manage/file/file.service';
import { mapState } from 'vuex';


export default {
  components: {
    hzztTitle,
    pisSlideView,
  },
  data() {
    return {
      cate_id: undefined,
      data: [],
      filterText: '',
      headers: [
        {
          'prop': 'library_name',
          'label': '检查项目',
          'min-width': 50,
          'align': 'center',
        }, {
          'prop': 'slice_count',
          'label': '切片数量',
          'min-width': 120,
          'align': 'center',
        }, {
          'prop': 'sync_at',
          'label': '上次同步时间',
          'min-width': 120,
          'align': 'center',
        }, {
          'prop': 'diagnose_advice',
          'label': '诊断意见',
          'min-width': 200,
          'align': 'center',
        },
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
      searchForm: {},
      library_name_list: [],
      tableHeight: '100%',
      tableLoading: false,
      label_status: undefined,
      status: undefined,
      pagination: {
        current: 1,
        pageSize: 15,
        showTotal: total => `共 ${total} 条`,
        total: 0,
      },
      users: [],
      distributeForm: {},
      distributeDialogVisible: false,
      testFolder: [],
      trainFolder: [],
      meta: {
        count: 0,
        current_page: 1,
        per_page: 30,
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
    this.getSelection();
  },
  methods: {

    // 切片列表
    sliceList() {
      let params = {
        pathology_id: this.searchForm.pathology_id,
        real_name: this.searchForm.real_name,
        library_name: this.searchForm.library_name,
        ...this.meta
      };
      this.tableLoading = true;
      fileService.sliceList(params).then(({ body }) => {
        this.data = [];
        if (body.ret_code === 0) {
          this.data = body.data.list
          this.meta = body.data.meta;
        }
      }).catch(() => {
        this.meta = { count: 0, current_page: 1, per_page: 15 };
      }).finally(() => {
        this.tableLoading = false;
      });
    },
    getSelection() {
      fileService.libraryList().then(({ body }) => {
        this.trainFolder = {};
        if (body?.ret_code === 0) {
          this.library_name_list = body.data
        }
      })
    },
    rowDblClick(row) {
      this.readingQuery = {
        ...row,
        type: 'pathologyID'
      }
      console.log(this.readingQuery)
      this.$router.push({ path: '/reading', query: { row: JSON.stringify(this.readingQuery) } })
    },
    //分页页码改变事件
    handleCurrentChange(val) {
      this.meta.page = val;
      this.sliceList();
    },


    // 重置
    clearValue() {
      this.searchForm = {}
      this.sliceList();
    },

    // 多选
    handleSelect(list) {
      this.multipleSelection = list.concat();
      console.log(list.concat())
      this.slice_id = Array.prototype.concat.apply([], (this.multipleSelection).map(d => d.id))
      console.log(this.slice_id)

    },

    sync() {
      if (this.slice_id) {
        fileService.syncSlice({ ids: (this.slice_id).toString() }).then(({ body }) => {
          if (body.ret_code === 0) {
            this.$message.success(body.ret_msg)
            this.sliceList()
          }
        })

      } else {
        this.$message.warning('请先选择切片！')
      }
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

</style>
