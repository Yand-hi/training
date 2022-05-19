<template>
  <div class="main-container catalogue-main">
    <div class=" tab">
      <div class="flex align-items-center " style='width:100%'>
        <el-tabs v-model="activeTabName" @tab-click="handleClick">
          <el-tab-pane v-for="tab in tabList" :key="tab.name" :label="tab.label" :name="tab.name">
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="common-table" style="padding: 5px 10px;margin-top: 0">
    </div>
    <div class="slice-body flex">
      <div v-show="activeTabName !== '未分配'" class="slice-tree" style="">
        <el-row class="tree-page">
          <hzzt-directory-tree
            ref="entryTree"
            v-loading="loading"
            filterable
            :show-checkbox="true"
            :node-data="classifies"
            :expanded-keys="defaultExpandedKeys"
            :checked-keys="defaultCheckedKeys"
            @node-drop="handleDrop"
            @check="handleCheckChange"
          />

          <el-breadcrumb separator-class="el-icon-arrow-right" style="position:absolute;bottom:15px;left:5px">
            <el-breadcrumb-item>全部</el-breadcrumb-item>
            <el-breadcrumb-item>活动管理</el-breadcrumb-item>
            <el-breadcrumb-item>活动列表</el-breadcrumb-item>
            <el-breadcrumb-item>活动详情</el-breadcrumb-item>
          </el-breadcrumb>
        </el-row>
      </div>
      <div class="slice-table common-table">
        <div class="" style="width: 100%;margin-bottom:5px">
          <div class="flex" v-if="activeTabName === '已分配'">
            <el-input class="slice-name-input" style="margin-right: 12px" v-model="keyword" size="mini" clearable
                      placeholder="请输入切片名称" suffix-icon="el-icon-search"
                      v-on:keyup.enter.native="getSliceList({name:keyword})"></el-input>
            <el-select style="margin-right: 12px" v-model="source_id" size="mini" placeholder="请选择来源" clearable
                       @change="getSliceList({source_id:source_id})">
              <el-option v-for="source in origins" :label="source.label" :value="source.id"
                         :key="source.id"></el-option>
            </el-select>
          <div  style='position: absolute;right:10px;top:0;'>
            <el-button size="mini" type="primary" @click="clearValue()">重置</el-button>
            <el-button size="mini" type="success" @click="showAssignDialog()">批量分配</el-button>
          </div>
            
          </div>
          <div class="flex" v-if="activeTabName === '未分配'">
            <el-input style="margin-right: 12px" v-model="keyword" size="mini" clearable placeholder="请输入切片名称"
                      suffix-icon="el-icon-search"
                      v-on:keyup.enter.native="getSliceList({is_assign_cate: 2})"></el-input>
            <!-- <el-button type="primary" size="mini" @click="loadJSON()">批量下载JSON</el-button>
            <el-button type="danger" size="mini" @click="batchDelete()">批量删除</el-button> -->
          </div>
        </div>

        <el-table ref="pTable" v-loading="tableLoading" :data="data" border :height=tableHeight style="width: 100%"
                  @selection-change="handleSelectionChange">
          <el-table-column fixed="left" type="selection" align="center">
          </el-table-column>
          <el-table-column prop="pathology_id" align="center" label="病理号" width="80px"></el-table-column>
          <el-table-column align="center" prop="real_name" label="姓名" min-width="80px"></el-table-column>
          <el-table-column align="center" prop="age_str" label="年龄" min-width="80px"></el-table-column>
          <!-- <el-table-column prop="name" align="center" label="切片名称" width="120px"></el-table-column> -->
          <el-table-column prop="cate" align="center" label="切片分类" width="80px">
            <template slot-scope="scope">
              {{ scope.row.slice_type.name }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="sample_name" label="蜡块名称" min-width="80px" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-for="item in scope.row.paraffin_blocks" :key="item.id">
                {{ item.sample_name }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="library_name" align="center" label="检查项目" width="80px"></el-table-column>
          <!-- <el-table-column prop="path" align="center" label="切片路径" width="120px"></el-table-column> -->
          <el-table-column v-for="(data, index) in headers" :key="index" :fixed="data.fixed" :prop="data.prop"
                           :label="data.label" show-overflow-tooltip :min-width="data['min-width']" :align="data.align">
            <template slot-scope="scope">
              <viewer class="flex justify-content-center">
                <img style="width: 40px" v-if="data.prop === 'label_img'" :src="scope.row[data.prop]">
              </viewer>
              <span v-if="data.prop !== 'label_img'">{{ scope.row[data.prop] }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="operate" align="center" label="操作" fixed="right" width="130px">
            <template slot-scope="scope">
              <div class="entry-template-btn" v-if="activeTabName === '已分配'">
                <el-button-group>
                  <el-button type="primary" size="mini" @click="showAssignDialog(scope.row)">分配</el-button>
                  <!-- <el-button type="success" size="mini" @click="readSlide(scope.row)">阅片</el-button>
                  <el-button type="primary" size="mini" @click="readSlide(scope.row)">标注</el-button> -->
                  <!-- <el-button v-if="scope.row.label_status==='已标注'" type="primary" size="mini" @click="loadSingleJSON(scope.row)">下载JSON
                  </el-button> -->
                  <!-- <el-button type="primary" size="mini" @click="loadPicture(scope.row)">下载KFB</el-button> -->
                </el-button-group>
              </div>
              <div v-if="activeTabName === '未分配'"
                   class="flex align-items-center justify-content-around wrap entry-template-btn">

                <el-button type="primary" size="mini" @click="showAssignDialog(scope.row)">分配</el-button>
                <!-- <el-button type="danger" size="mini" @click="batchDelete(scope.row)">删除</el-button>
                <el-button type="primary" size="mini" @click="loadPicture(scope.row)">下载KFB</el-button> -->
                <!-- <el-button v-if="scope.row.label_status==='已标注'" type="primary" size="mini" @click="loadSingleJSON(scope.row)">下载JSON
                </el-button>-->
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="slicePage" style="position: absolute;bottom: 10px; width:100%;
        display: flex;justify-content:center ;height: 30px;align-items:flex-start">
          <el-pagination @current-change="handleCurrentChange" :current-page.sync="pagination.current_page"
                         :page-size="pagination.per_page" layout="total ,prev, pager, next, jumper"
                         :total="pagination.count">
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog class="slice-pathological-dialog" title="病理详情" :visible.sync="pathologyFormVisible" center
               append-to-body>
      <el-form label-width="100px" :form="pathologyForm" ref="pathologyForm">
        <el-form-item label="病理号：">
          <span>{{ pathologyForm.id }}</span>
        </el-form-item>
        <el-form-item label="姓名：">
          <span>{{ pathologyForm.patient_name }}</span>
        </el-form-item>
        <el-form-item label="性别：">
          <span>{{ pathologyForm.gender }}</span>
        </el-form-item>
        <el-form-item label="年龄：">
          <span>{{ pathologyForm.age }}</span>
        </el-form-item>
        <el-form-item label="送检医生：">
          <span>{{ pathologyForm.inspection_doctor }}</span>
        </el-form-item>
        <el-form-item label="身份证号码：">
          <span>{{ pathologyForm.id_number }}</span>
        </el-form-item>
        <el-form-item label="民族：">
          <span>{{ pathologyForm.nation }}</span>
        </el-form-item>
        <!--<el-form-item label="籍贯：">
          <span>{{pathologyForm.origin}}</span>
        </el-form-item>-->
        <el-form-item label="职业：">
          <span>{{ pathologyForm.career }}</span>
        </el-form-item>
        <el-form-item label="联系电话：">
          <span>{{ pathologyForm.phone }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="pathologyFormVisible = false">确定</el-button>
        <el-button size="mini" @click="pathologyFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog class="slide-assign-dialog" title="分配切片" :visible.sync="assignFormVisible" append-to-body>
      <div slot="title" class="slide-dialog-header flex align-items-center justify-content-between">
        <span>分配切片</span>

      </div>
      <div class="slide-catalogue-tree">
        请选择分配目录:
        <el-row class="tree-page">
          <hzzt-directory-tree
            ref="entryTree"
            v-loading="loading"
            :draggable="false"
            :node-data="classifies"
            @node-click="chooseCatalogue"
          />

        </el-row>
      </div>

    </el-dialog>
    <el-dialog class="slide-view-dialog" :fullscreen="true" :visible.sync="showFile" title="阅片"
               :close-on-press-escape="false" :show-close="false">
      <div slot="title" class="slide-dialog-header flex align-items-center justify-content-between">
        <span>阅片</span>
        <div class="close-btn" @click="showFile=false">
          <img src="assets/img/close.png">
        </div>
      </div>
      <pis-slide-view v-if="showFile" :file-name-list="fileNameList" :file-index="0">
      </pis-slide-view>
    </el-dialog>
  </div>
</template>

<script>

import hzztTitle from '@/components/hzztTitle';
import pisSlideView from '@/components/pisSlideView/pisSlideView';
import {catalogueService} from './catalogue.service';
import {baseUrl} from '@/config/utils';
import {mapState, createNamespacedHelpers} from 'vuex';

const moduleMapState = createNamespacedHelpers('stomp').mapState;

const headerCateList = [
  {
  'prop': 'label_img',
  'label': '切片标签图',
  'min-width': 120,
  'align': 'center',
}, {
  'prop': 'catalogue_name',
  'label': '目录名称',
  'min-width': 120,
  'align': 'center',
}, {
  'prop': 'diagnose_advice',
  'label': '诊断意见',
  'min-width': 200,
  'align': 'center',
}, {
  'prop': 'label_status',
  'label': '标注状态',
  'min-width': 80,
  'align': 'center',
}, {
  'prop': 'scanistor',
  'label': '扫描仪',
  'min-width': 80,
  'align': 'center',
}, {
  'prop': 'scan_end_at',
  'label': '扫描时间',
  'min-width': 120,
  'align': 'center',
}];
const headerUnKnowList = [
  {
    'prop': 'name',
    'label': '切片名称',
    'min-width': 120,
    'align': 'center',
  }, {
    'prop': 'path',
    'label': '切片路径',
    'min-width': 120,
    'align': 'center',
  }, {
    'prop': 'label_img',
    'label': '切片标签图',
    'min-width': 120,
    'align': 'center',
  }, {
    'prop': 'label_status',
    'label': '标注状态',
    'min-width': 80,
    'align': 'center',
  }, {
    'prop': 'scanistor',
    'label': '扫描仪',
    'min-width': 120,
    'align': 'center',
  }, {
    'prop': 'scan_time',
    'label': '扫描时间',
    'min-width': 120,
    'align': 'center',
  }, {
    'prop': 'scan_user',
    'label': '扫描用户',
    'min-width': 120,
    'align': 'center',
  }];

export default {
  components: {
    hzztTitle,
    pisSlideView,
  },
  data() {
    return {
      activeTabName: '已分配',
      _cateData: [],
      cateDirItem: {},
      classifies: [],
      classify: [],
      classifyOptions: [],
      data: [],
      defaultCheckedKeys: [],
      defaultExpandedKeys: [],
      entryFormVisible: false,
      assignFormVisible: false,
      entrySourceFormVisible: false,
      entryForm: {
        pathology_id: '',
        remark: [],
      },
      entryRules: {
        /* pathology_id: [
           {required: true, message: '请输入病理号', trigger: 'blur'},
         ],*/
        /* source_id: [
          {required: true, message: '请输入数据来源', trigger: 'blur'},
        ],
        liable_user: [
          {required: true, message: '请输入数据负责人', trigger: 'blur'},
        ],*/
      },
      fileNameList: [],
      headers: headerCateList,
      keyword: '',
      loading: false,
      multipleSelection: [],
      origins: [],
      source_id: undefined,
      pagination: {count: 0, current_page: 1, per_page: 15},
      path: '',
      pathList: [],
      pathologyForm: {},
      pathologyFormVisible: false,
      showFile: false,
      selectCate: {},
      tableHeight: '100%',
      tabList: [
        {
          label: '已分配',
          name: '已分配',
        }, {
          label: '未分配',
          name: '未分配',
        },
      ],
      tableLoading: false,
      labelImg: '',
      cate_ids: '',
      ids:'',
    };
  },
  mounted() {
    this.cateList();
    this.originList();
    this.$root.$on('refresh-list', () => this.getSliceList({
      page: this.pagination.current_page,
      size: this.pagination.per_page,
    }));
  },
  computed: {
    ...mapState(['user']),
    ...moduleMapState([
      'isConnected',
      'scanSliceProgress',
    ]),
    isShowScanProgress() {
      return !!this.scanSliceProgress;
    },
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    //获取分类
    cateList() {
      this.loading = true;
      this.classifies = [];
      const param = {
        is_show_disabled: 0,
      };
      catalogueService.cateList(param).then(res => {
        if (res.body?.ret_code === 0) {
          // this.classifyOptions = res.body.data.map((item) => ({...item}));
          // console.log(res.body.data);
          this.classifies = res.body.data;
          if (this.classifies[0]) {
            this.cateDirItem = this.classifies[0];
            // this.defaultCheckedKeys = [this.classifies[0]?.children[0]?.children[0]?.id];
            // this.defaultExpandedKeys = [this.classifies[0]?.id];
            this.$nextTick(() => {
              this.$refs.entryTree.setCurrentKey(this.classifies[0]?.id);
            });
            this.getSliceList();
          }
        }
      }).finally(() => {
        setTimeout(() => this.loading = false, 100);
      });
    },
    deleteKey(list, type) {
      for (let item of list) {
        let obj = item;
        for (let key in obj) {
          if (obj[key] === type) {
            delete obj[key];
          }
        }
      }
      return list;
    },
    originList() {
      this.loading = true;
      this.classifies = [];
      catalogueService.originList().then(res => {
        if (res.body?.ret_code === 0) {
          this.origins = res.body.data.map((item) => ({
            id: item.id,
            label: item.hospital,
            path: item.path,
          }));
        }
      }).finally(() => {
        setTimeout(() => this.loading = false, 100);
      });
    },
    getSliceList({is_assign_cate = 1, page = 1, size = 15, cate_ids,source_id,name} = {is_assign_cate: 1, page: 1, size: 15}) {
      this.tableLoading = true;
      this.data = [];
      catalogueService.sliceList({
        is_assign_cate,
        page,
        size,
        cate_ids,
        name,
        source_id,
      }).then(({body}) => {
        // if (this.activeTabName === '未分配') return;
        if (body?.ret_code === 0) {
          this.data = body.data.list.map((item) => ({
              ...item,
              label_img: `/api/process/get_image?file=${item.path}&type=label`,
              catalogue_name:item.cate?.cate_name
            }),
          );
          this.pagination = body.data.meta;
        } else {
          this.pagination = {count: 0, current_page: 1, per_page: 15};
        }
      }).finally(() => {
        this.tableLoading = false;
      });
    },
    clearValue(){
      this.keyword = null
      this.source_id = null
      this.getSliceList({ name: undefined, source_id: undefined})
    },
    handleChange(list) {
      let cateList = [...this.classifyOptions];
      let ids = [...list];
      let cate = {path: []};
      while (ids.length > 0) {
        let id = ids.shift();
        if (cateList.find((classify) => classify.id === id)) {
          cate = cateList.find((classify) => classify.id === id);
          cateList = cate?.children && [...cate.children];
        }
      }
      this.selectCate = cate;
      this.pathList = cate.path;
      this.path = this.pathList?.[0]?.path;
    },

    handleSelectionChange(list) {
      this.multipleSelection = list.concat();
    },
    // tab选项点击
    handleClick(tab) {
      this.pagination = {count: 0, current_page: 1, per_page: 15};
      this.pathList = [];
      this.selectCate = {};
      this.data = [];
      this.path = undefined;
      this.multipleSelection = [];
      if (tab.name === '已分配') {
        this.headers = headerCateList;
        this.cateList();
      }
      if (tab.name === '未分配') {
        this.headers = headerUnKnowList;
        this.getSliceList({is_assign_cate: 0});
      }
    },
    handleCurrentChange(page) {
      if (this.activeTabName === '待分类') {
        this.pagination.current_page = page;
        this.data = this._cateData.slice((page - 1) * this.pagination.per_page, page * this.pagination.per_page);
      } else {
        const is_assign_cate = this.activeTabName === '已分配' ? 1 : 0;
        this.getSliceList({page, cate_ids: this.cateDirItem.id, is_assign_cate});
      }
    },
    // 标记未分配
    markUnknown(row) {
      catalogueService.markUnknown({
        id: [row.id],
      }).then(({body}) => {
        if (body?.ret_code === 0) {
          this.$message.success('标记未分配成功');
          this.getSliceList({cate_ids: this.cateDirItem.id, is_assign_cate: 0});
        } else {
          this.$message.error(body?.ret_msg || '标记未分配失败');
        }
      }).catch(() => {
        this.$message.error('标记未分配失败');
      });
    },
    contactSlice(row) {
      this.$http.get(`/api/process/get_image?file=${row.path}&type=label`, {responseType: 'blob'})
        .then((res) => {
          //   const myBlob = new window.Blob([res.data], { type: 'image/jpeg' })
          // blob文档流转为url
          this.labelImg = URL.createObjectURL(res.data);
          // console.log(this.labelImg);
        });
      this.entryFormVisible = true;
      this.entryForm = {
        id: row.id,
        pathology_id: row.pathology_id,
        remark: [''],
        source_id: '',
        liable_user: '',
      };
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      // console.log('tree drag end: ', dropNode && dropNode.label, dropType);
    },
    deleteSlice(row) {
      if (!row && this.multipleSelection.length === 0) {
        this.$message.warning('请选择移除项');
        return;
      }
      const params = {
        id: row ? [row.id] : this.multipleSelection.map((item) => item.id),
      };
      catalogueService.deleteSlice(params).then(({body}) => {
        if (body?.ret_code === 0) {
          this.$message.success('切片移除成功');
          this.getSliceList({is_assign_cate: 2});
        } else {
          this.$message.error(body?.ret_msg || '切片移除失败');
        }
      }).catch(() => {
        this.$message.error('切片移除失败');
      });
    },
    batchDelete(row) {
      if (!row && this.multipleSelection.length === 0) {
        this.$message.warning('请选择需删除的数据');
        return;
      }
      const params = {
        id: row ? [row.id] : this.multipleSelection.map((item) => item.id),
      };
      catalogueService.batchDelete(params).then(({body}) => {
        if (body?.ret_code === 0) {
          this.$message.success('切片删除成功');
          this.getSliceList({
            cate_ids: this.cateDirItem.id,
            is_assign_cate: this.activeTabName === '已分配' ? undefined : 0,
          });
        } else {
          this.$message.error(body?.ret_msg || '切片删除失败');
        }
      }).catch(() => {
        this.$message.error('切片删除失败');
      });
    },
    showAssignDialog(row){
      if (!row && this.multipleSelection.length === 0) {
        this.$message.warning('请选择需分配的数据');
        return;
      }
      this.assignFormVisible = true
      // console.log(row)
      // console.log( row ? [row.id] : this.multipleSelection.map((item) => item.id));
      this.ids = row ? [row.id] : this.multipleSelection.map((item) => item.id)

    },
    chooseCatalogue(data){
      // console.log(data.id);
      
      this.$confirm('是否确认此次分配?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.assignSlice({cate_id:data.id,ids:(this.ids).toString()})
      })
    },
    assignSlice({ids,cate_id} = {is_assign_cate: 1, page: 1, size: 15}) {
      const param = {
        ids,
        cate_id,
      };
      catalogueService.sliceAssign(param).then(res => {
        if (res.body) {
          this.$message.success('分配成功');
          this.assignFormVisible = false
        }
      });
    },
    importMessages() {
      if (!this.entryForm.pathology_id) {
        this.$message.error('请输入病理号');
        return;
      }
      catalogueService.pathologyMessages(this.entryForm.pathology_id).then(({body}) => {
        if (body?.ret_code === 0) {
          if (body.data) {
            this.pathologyForm = body.data;
            if (this.$refs['pathologyForm']) this.$refs['pathologyForm'].resetFields();
            this.pathologyFormVisible = true;
          } else {
            this.$message.error('暂无该病理号的病例信息');
          }
        } else {
          this.$message.error(body?.ret_msg || '暂无该病理号的病例信息');
        }
      }).catch(() => {
        this.$message.error('暂无该病理号的病例信息');
      });
    },
    deleteRemark(index) {
      this.entryForm.remark.splice(index, 1);
    },
    addRemark() {
      if (this.entryForm?.remark && Array.isArray(this.entryForm?.remark)) {
        this.entryForm.remark.push('');
      } else {
        this.$set(this.entryForm, 'remark', ['']);
      }
    },
    readSlide(row) {
      this.fileNameList = [row.filepath || row.path];
      this.showFile = true;
    },
    loadPicture(row) {
      let anchor = document.createElement('a');
      anchor.setAttribute('href', row.path || row.filepath);
      anchor.setAttribute('target', '_blank');
      anchor.setAttribute('download', (row.name || row.filename));
      anchor.click();
    },
    loadSingleJSON(row) {
      let anchor = document.createElement('a');
      anchor.setAttribute('href', (row.path || row.filepath).replace('.kfb', '.json'));
      anchor.setAttribute('target', '_blank');
      anchor.setAttribute('download', (row.name || row.filename).replace('.kfb', '.json'));
      anchor.click();
    },
    loadJSON() {
      let params = {
        slice_ids: this.multipleSelection.length > 0 ? this.multipleSelection.map((item) => item.id) : undefined,
      };
      catalogueService.downloadJSON(params).then(({body}) => {
        if (body?.ret_code === 0) {
          let anchor = document.createElement('a');
          anchor.setAttribute('href', body.path);
          anchor.setAttribute('target', '_blank');
          anchor.setAttribute('download', new Date().getTime() + '.json.zip');
          anchor.click();
        } else {
          this.$message.error(body?.ret_msg || '下载失败');
        }
      }).catch(() => {
        this.$message.error('下载失败');
      });
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      const param = {
        cur_id: draggingNode.key,
        neighbor_id: dropNode.key,
        action: dropType,
      };
      catalogueService.moveCatalogue(param).then(res => {
        if (res.body) {
          this.$message.success('移动目录成功');
        }
      });
    },
    handleCheckChange(data, checked) {
      // console.log(checked.checkedKeys);
      this.getSliceList({cate_ids: checked.checkedKeys.toString()});
    },
  },
};
</script>

<style lang="scss">
.slice-name-input {
  max-width: 182px;
}

.slice-pathological-dialog {
  .el-dialog--center {
    width: 500px;

    .el-form-item {
      color: #676767;
      margin-bottom: 10px;

      .el-form-item__label {
        color: #222222;
      }

      .el-button--text {
        margin-left: 60px;
      }
    }
  }
}

.entry-source-dialog {
  .el-dialog--center {
    width: 400px;

    .el-form-item {
      color: #676767;
      margin-bottom: 20px;

      .el-form-item__label {
        color: #222222;
      }

      .el-input {
        max-width: 217px;
      }

      .el-textarea {
        max-width: 217px;
      }

      .form-age {
        display: inline-block;
        width: 217px;
      }

      .el-button--text {
        margin-left: 20px;
      }

      .el-input__inner {
        height: 31px;
      }
    }
  }
}

.entry-pathological-dialog {
  .el-dialog--center {
    min-width: 510px;
    max-width: 600px;

    .el-form-item {
      color: #676767;
      margin-bottom: 20px;

      .el-form-item__label {
        color: #222222;
      }

      .el-input {
        max-width: 217px;
      }

      .el-textarea {
        max-width: 217px;
      }

      .form-age {
        display: inline-block;
        width: 217px;
      }

      .el-button--text {
        margin-left: 20px;
      }

      .el-input__inner {
        height: 31px;
      }
    }
  }
}

.slide-assign-dialog {
  .el-dialog {
    display: flex;
    flex-direction: column;
    width: 400px;

    .slide-dialog-header {
      .close-btn {
        cursor: pointer;
        height: 25px;
        width: 25px;

        img {
          width: 100%;
        }
      }
    }

    .slide-catalogue-tree{
      height: 400px;
      overflow-y: auto;
      .tree-page{
        margin-top: 10px;
      }
    }

    .el-dialog__header {
      padding: 10px 20px;
      border-bottom: 1px solid #ebeef5;
    }

    .el-dialog__body {
      flex: 1;
      padding: 16px 20px;
    }
  }
}

.entry-template-btn {
  .el-button {
    margin: 5px 0;

    & + .el-button {
      margin-left: 0;
    }
  }
}

</style>
