<template>
  <div class=" test-main flex " style="">
    <div class="slice-left flex column">
      <el-button type="success" size='mini' @click="showCreateMenu()" style="margin:6px 0">创建目录</el-button>
      <div class="folder-list flex justify-content-between align-items-center" :class="{'active-folder': item.id === activeTab}" v-for="(item, index) of menuList" :key="index" :label="item.name" @click="getData(item.id, $event)">
        <div class="folder-name flex justify-content-center align-items-center">
          <span v-if="item.editActive && item.id === activeTab">
            <el-input size="mini" ref="editActive" v-model="addMenuName"
                      :key="item.id" class="edit-input" @blur="showMessage"
                      :class="'edit-name'+index" style="width: 120px"
                      @keypress.native.enter="createMenu(item.id,'2',$event)"></el-input>
          </span>
          <span type="text" v-else :key="index" @dblclick="editFolderName(item,index)">{{item.name}}</span>
        </div>
        <div class="folder-count">
          <el-tag size="mini">{{item.slices_count}}</el-tag>
          <i class="el-icon-delete" style="color:red;height:16px;width:16px" @click="deleteFolder(item.id)"></i>
        </div>
      </div>
    </div>
    <div class="slice-right">
      <el-card class="allocation-card" shadow="hover">
        <div slot="header" class="flex justify-content-between align-items-start" :style="{height:expandHeight}">
          <div class="detail">
            <span>概况</span>
            <span>{{folderList.folder_name}} &nbsp;&nbsp;&nbsp;
              1.切片总数量: &nbsp;{{folderInfo.total_slice_count}} &nbsp;&nbsp;&nbsp;
              2.ROI框数量: &nbsp;{{folderInfo.total_roi_count}}&nbsp;&nbsp;&nbsp;
              3.细胞分类统计：&nbsp;
              <span v-for="(item,index) of cateTotal" :key="index">
                {{item.label_type_name}} :&nbsp;{{item.total}}&nbsp;&nbsp;&nbsp;
              </span>
            </span>
          </div>
          <el-button type="text" class="more text-right" @click="expandHeight === '40px' ? expandHeight = '60px' : expandHeight = '40px'">
            {{expandHeight === '60px'?'收起':'展开'}}
          </el-button>
        </div>
      </el-card>
      <div style='position: relative;'>
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="">
            <el-input size="mini" v-model="searchForm.name" clearable placeholder="请输入切片名称" v-on:keyup.enter.native="onSubmit()"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-input size="mini" v-model="searchForm.pathology_id" clearable placeholder="请输入病理号" v-on:keyup.enter.native="onSubmit()"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-input size="mini" v-model="searchForm.real_name" clearable placeholder="请输入姓名" v-on:keyup.enter.native="onSubmit()"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-select size="mini" v-model="searchForm.slice_type" clearable placeholder="请选择切片类型" @change="onSubmit()">
              <el-option v-for="type in slice_type_list" :label="type.name" :value="type.id" :key="type.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style='position: absolute;right:10px;top:0;'>
            <el-button size="mini" type="primary" @click="onSubmit">查询</el-button>
            <el-button size="mini" type="primary" @click="clearValue()">重置</el-button>
            <el-button type="danger" size="mini" @click="removeSlice">移除</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table" style="margin:0;padding:0">
        <el-table ref="tableData" :height="vHeight" v-loading="tableLoading" @selection-change="handleSelect" :data="data" border :header-cell-style="headerCellStyle" @row-click="selectRow" :cell-style="cellStyle" :row-class-name="rowClassName">
          <el-table-column type="selection" width="35"></el-table-column>
          <el-table-column align="center" type="index" label="序号" width="50" :index="indexMethod"></el-table-column>
          <el-table-column v-for="(data, index) in headers" :key="index" :fixed="data.fixed" :prop="data.prop" :label="data.label" show-overflow-tooltip :min-width="data['min-width']" :align="data.align">
          </el-table-column>
        </el-table>
        <div class="slicePage" style="position: absolute;bottom: 10px; width:100%;
        display: flex;justify-content:center ;height: 30px;align-items:flex-start">
          <el-pagination @current-change="handleCurrentChange" :current-page.sync="pagination.current_page" :page-size="pagination.per_page" layout="total ,prev, pager, next, jumper" :total="pagination.count">
          </el-pagination>
        </div>

      </div>
    </div>
    <el-dialog title="新增目录" :visible.sync="menuDialogVisible" width="400px">
      目录名称：<el-input size="mini" style="width: 240px" v-model="addMenuName"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="menuDialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="createMenu('','1',$event)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import trainingSetService from './trainingSet.service'
export default {
  name: 'trainingSet',
  data() {
    return {
      data: [],
      headers: [{
        'prop': 'name',
        'label': '切片名称',
        'min-width': 140,
        'align': 'center',
      }, {
        'prop': 'pathology_id',
        'label': '病理号',
        'min-width': 120,
        'align': 'center',
      }, {
        'prop': 'real_name',
        'label': '姓名',
        'min-width': 80,
        'align': 'center',
      }, {
        'prop': 'gender',
        'label': '性别',
        'min-width': 50,
        'align': 'center',
      }, {
        'prop': 'diagnose',
        'label': '诊断类型',
        'min-width': 120,
        'align': 'center',
      }, {
        'prop': 'diagnose_advice',
        'label': '诊断意见',
        'min-width': 120,
        'align': 'center',
      }, {
        'prop': 'roi_count',
        'label': 'ROI框数量',
        'min-width': 100,
        'align': 'center',
      }, {
        'prop': 'label_count',
        'label': '标注数量',
        'min-width': 80,
        'align': 'center',
      }, {
        'prop': 'slice_type',
        'label': '切片类型',
        'min-width': 80,
        'align': 'center',
      },
      ],
      tableHeight: '100%',
      menuList: [],
      slice_type_list: [
        {
          name: '',
          id: ''
        }
      ],
      searchForm: {},
      pagination: {
        current: 1,
        pageSize: 15,
        showTotal: total => `共 ${total} 条`,
        total: 0,
      },
      menuDialogVisible: false,
      editActive: false,
      tableLoading: false,
      addMenuName: '',
      editMenuName: '',
      activeTab: '1',
      activeNames: '1',
      activeFolder: [],
      folderInfo: [],
      folderList: [],
      cateTotal: [],
      expandHeight: '40px',
      initial: false,
      slice_list: [],
      selectData: [],

    }
  },
  watch: {
    selectData(data) {
      this.selectRow = []
      if (data.length > 0) {
        data.forEach((item, index) => {
          this.selectRow.push(this.data.indexOf(item))
        })
      }
    }
  },
  created() {
    this.getMenu();
    this.getData();
    this.getType();
  },
  computed: {
    setType() {
      return this.$route.path.includes('testSet') ? 2 : this.$route.path.includes('trainingSet') ? 1 : 0;
    },
    vHeight() {
      return '84vh'
    }
  },
  methods: {
    showMessage(){
      this.$confirm('修改未保存！！ 是否保存', '提示', {
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        if(this.$refs['editActive'][0].$vnode?.data?.model?.value){
          this.createMenu(this.$refs['editActive'][0].$vnode.data.key,'2')
          this.editActive = false;
        } else {
          this.$message({
            type: 'warning',
            message: '训练集名称不能为空'
          });
          this.$refs['editActive'][0].focus();
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
        this.$refs['editActive'][0].focus();
      });
    },

    getType() {
      trainingSetService.sliceType({ type: 1 }).then(({ body }) => {
        if (body.ret_code === 0) {
          this.slice_type_list = body.data.list
        }
      })
    },

    reload() {
      this.$refs.tableData.refresh();
    },
    showCreateMenu() {
      this.menuDialogVisible = true;
      this.addMenuName = null;
    },
    showEditMenu() {
      this.menuDialogVisible = true;
      this.addMenuName = null;
    },
    editFolderName(item, index) {
      this.menuList.forEach(i => i.editActive = false);
      item.editActive = true
      this.addMenuName = item.name;
      this.$nextTick(()=>{
        this.$refs['editActive'][0].focus();
      })
    },
    createMenu(val, type, $event) {
      this.editActive = false
      if (type === '1') {
        if (this.addMenuName === null) {
          this.$message.warning('请填写目录名称！');
        } else {
          trainingSetService.addMenu({ name: this.addMenuName, type: this.setType }).then(res => {
            if (res.body.ret_code === 0) {
              this.$message.success('创建成功');
              this.getMenu();
              this.menuDialogVisible = false;
            } else {
              this.$message.error('创建失败');
            }
          })

        }
      } else if (type === '2') {
        trainingSetService.addMenu({ name: this.addMenuName, type: this.setType, id: val }).then(res => {
          if (res.body.ret_code === 0) {
            this.$message.success('修改成功');
            this.getMenu();
            this.menuDialogVisible = false;
          } else {
            this.$message.error('修改失败');

          }
        })

      }
      this.addMenuName = null;
    },
    getMenu() {
      trainingSetService.getMenu().then(res => {
        this.menuList = res.body.data.list?.filter(item => this.setType === item?.type).map(i => ({
          ...i,
          editActive: false,
        }));
      })
    },
    getData(data) {
      if (data) {
        this.activeTab = data
      }
      const params = {
        ids: this.activeTab
      }
      trainingSetService.getFolderInfo(params).then(({ body }) => {
        if (body.ret_code === 0) {
          this.folderInfo = body.data
          this.folderList = this.folderInfo.list[0]
          this.cateTotal = this.folderList.cate
        }
      }).catch(() => {
        this.pagination = { count: 0, current_page: 1, per_page: 15 };
      }).finally(() => {
        this.tableLoading = false;
      })
      trainingSetService.sliceList({ folder_id: this.activeTab }).then(({ body }) => {
        if (body.ret_code === 0) {
          this.data = (body.data.list).map((item) => ({
            ...item,
            slice_type: item.slice_type?.name
          }))
          this.pagination = body.data.meta;
        }
      }).catch(() => {
        this.pagination = { count: 0, current_page: 1, per_page: 15 };
      }).finally(() => {
        this.tableLoading = false;
      });
    },
    deleteFolder(data) {
      this.$confirm('是否删除该目录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        trainingSetService.deleteMenu({ id: data }).then(({ body }) => {
          if (body?.ret_code === 0) {
            this.$message.success('删除成功')
            this.getMenu()
            this.getData()
          }
        })
      });
    },
    // 多选
    handleSelect(list) {
      this.selectData = list
      this.multipleSelection = list.concat();
      if (this.multipleSelection) {
        this.slice_id = Array.prototype.concat.apply([], (this.multipleSelection).map(d => d.id))
      }
    },
    selectRow(row) {
      this.$refs.tableData.toggleRowSelection(row)
    },
    //分页页码改变事件
    handleCurrentChange(val) {
      this.getData();
    },
    indexMethod(index) {
      return index + 1;
    },
    onSubmit() {
      const params = {
        name: this.searchForm.name,
        pathology_id: this.searchForm.pathology_id,
        real_name: this.searchForm.real_name,
        slice_type_id: this.searchForm.slice_type,
        folder_id: this.activeTab
      }
      trainingSetService.sliceList(params).then(({ body }) => {
        if (body.ret_code === 0) {
          this.data = (body.data.list).map((item) => ({
            ...item,
            slice_type: item.slice_type?.name
          }))
          this.pagination = body.data.meta;
        }
      }).catch(() => {
        this.pagination = { count: 0, current_page: 1, per_page: 15 };
      }).finally(() => {
        this.tableLoading = false;
      });

    },
    clearValue() {
      this.searchForm.name = undefined
      this.searchForm.pathology_id = undefined
      this.searchForm.real_name = undefined
      this.searchForm.slice_type = undefined
      this.onSubmit()
    },
    headerCellStyle({ row, rowIndex }) {
      return 'background-color: #D3E1F4;text-align: center; padding:0;height:30px;color:#666'
    },
    cellStyle({ row, rowIndex }) {
      return 'text-align: center;text-align: center; padding:0;height:30px'
    },
    rowClassName({ row }) {
      console.log(this.slice_id)
      if (this.slice_id) {
        var arr = this.slice_id
        for (let i = 0; i < arr.length; i++) {
          if (row.id === arr[i]) {
            return 'warning-row ';
          }
        }
      }
    },
    install() {
      Vue.prototype.$TAB_ROW_ACTIVE = TAB_ROW_ACTIVE;
    },
    removeSlice() {
      console.log(this.slice_id)
      //   console.log(this.activeTab)
      if (this.multipleSelection === undefined) {
        this.$message.warning('请选择需要移除的切片');
        return;
      } else {
        this.$confirm('是否从此目录移除该切片?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          trainingSetService.removeSlice({ slice_ids: (this.slice_id).toString(), folder_id: this.activeTab }).then(({ body }) => {
            if (body?.ret_code === 0) {
              this.$message.success('移除成功')
              this.getData()
              this.getMenu();
            }
          })
        })
      }
    },
  }
}
</script>

<style scoped lang="scss">
::v-deep {
  .el-card__body {
    padding: 0 !important;
  }
  .el-table .cell {
    padding: 0;
  }
  .el-table th > .cell {
    padding: 0;
  }
  .el-table--border th:first-child .cell,
  .el-table--border td:first-child .cell {
    padding: 0;
  }
  .el-table__row.warning-row {
    background-color: #b4cced;
  }
  .el-table__row.current-row.warning-row {
    background-color: #b4cced;
  }
}
.test-main {
  background: #fff;
  padding: 12px;
  height: calc(100% - 30px);
  .slice-left {
    flex: 1;
    padding: 6px;
    border: 1px solid #ebeef5;
    margin-right: 15px;
    border-radius: 6px;
    min-width: 200px;

    .folder-list {
      &:hover {
        background: #1989fa;
        color: #fff;
      }
      cursor: pointer;
      color: #606266;
      height: 42px;
      background: #f5f6f8;
      margin-top: 6px;
      border-radius: 2px;
      padding: 0 15px;
      .folder-count {
        font-size: 15px;
        // text-align: right;
      }
      .folder-name {
        .edit-input {
          input {
            padding: 0;
          }
        }
      }
    }
    .active-folder,
    .initial-folder {
      background: #1989fa !important;
      color: #fff;
    }
  }
  .slice-right {
    flex: 7;
    min-width: 1000px;
    background: #fff;
  }
}
.testSet {
  margin: 15px;
}

.table {
  margin: 0;
  padding: 0;
  position: relative;
  background: #fff;
}
</style>
