<template>
  <div class="main-container entry-main">
    <!--<div class="common-header">
      <hzzt-title>数据录入</hzzt-title>
      <div class="common-header-end flex align-items-center">
      </div>
    </div>-->
    <div class="common-table" style="padding: 5px 10px;margin-top: 0">
      <div class="common-table-header flex justify-content-between align-items-center wrap"
           style="width: 100%;">
        <el-input class="slice-name-input" style="margin-right: 12px" v-model="keyword" size="mini" clearable
                  placeholder="请输入切片名称"
                  suffix-icon="el-icon-search" v-on:keyup.enter.native="getSliceList()"></el-input>
        <div>
          <el-button type="primary" size="mini" @click="batchUploadNoMove()">批量移动</el-button>
          <el-button type="primary" size="mini" @click="batchUpload()">批量上传</el-button>
        </div>
      </div>
    </div>
    <div class="slice-body flex">
      <div class="slice-tree" style="margin-right: 24px">
        <el-row class="tree-page">
          <el-input
            size="mini"
            class="filter-text"
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input>
          <el-tree
            v-loading="loading"
            class="filter-tree"
            :data="classifies"
            node-key="id"
            :check-strictly="true"
            :default-expanded-keys="defaultExpandedKeys"
            :default-checked-keys="defaultCheckedKeys"
            :highlight-current="true"
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
            ref="entryTree">
             <span class="custom-tree-node" slot-scope="{node,data}">
              <span>{{data.label}}</span>
               <el-button type="text" size="mini">{{data.count}}</el-button>
            </span>
          </el-tree>
        </el-row>
      </div>
      <div class="slice-table common-table">
        <el-table
          ref="pTable"
          v-loading="tableLoading"
          :data="data"
          border
          :height=tableHeight
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column fixed="left" type="selection" align="center">
          </el-table-column>
          <el-table-column v-for="(data, index) in headers"
                           :key="index"
                           :fixed="data.fixed"
                           :prop="data.prop"
                           :label="data.label"
                           :min-width="data['min-width']"
                           :align="data.align">
            <template slot-scope="scope">
              <img style="width: 80px" v-if="data.prop === 'label_img'" :src="scope.row[data.prop]">
              <span v-if="data.prop === 'status'">{{scope.row[data.prop]===1?'未处理':scope.row[data.prop]===2?'已上传':scope.row[data.prop]===3?'已同步':scope.row[data.prop]===4?'文件重复': '未知'}}</span>
              <span v-if="data.prop !== 'label_img'&&data.prop !== 'status'">{{scope.row[data.prop]}}</span>
            </template>
          </el-table-column>
          <!--<el-table-column prop="slides" align="center" label="阅片" fixed="right" width="100px">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="loadPicture(scope.row)">下载</el-button>
            </template>
          </el-table-column>-->
          <el-table-column prop="operate" align="center" label="操作" fixed="right" width="200px">
            <template slot-scope="scope">
              <div class="flex align-items-center justify-content-around wrap entry-template-btn">
                <el-button type="primary" size="mini" @click="readSlide(scope.row)">阅片</el-button>
                <el-button type="primary" size="mini" @click="batchUploadNoMove(scope.row)">移动</el-button>
                <el-button type="primary" size="mini" @click="batchUpload(scope.row)">上传</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="slicePage" style="position: absolute;bottom: 0; width:100%;
        display: flex;justify-content:center ;height: 40px;align-items:flex-start">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="pagination.current_page"
            :page-size="pagination.per_page"
            layout="prev, pager, next, jumper"
            :total="pagination.count">
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog class="slide-view-dialog" :fullscreen="true" :visible.sync="showFile" title="阅片"
               :close-on-press-escape="false" :show-close="false">
      <div slot="title" class="slide-dialog-header flex align-items-center justify-content-between">
        <span>阅片</span>
        <div class="close-btn" @click="showFile=false">
          <img src="assets/img/close.png">
        </div>
      </div>
      <pis-slide-view v-if="showFile"
                      :file-name-list="fileNameList"
                      :file-index="0">
      </pis-slide-view>
    </el-dialog>
  </div>
</template>

<script>

  import hzztTitle from '@/components/hzztTitle';
  import pisSlideView from '@/components/pisSlideView/pisSlideView';
  import {uploadService} from './upload.service';
  import {baseUrl} from '@/config/utils';

  const headerCateList = [
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
      'prop': 'cate',
      'label': '切片分类',
      'min-width': 120,
      'align': 'center',
    }, {
      'prop': 'label_img',
      'label': '切片标签图',
      'min-width': 120,
      'align': 'center',
    }, {
      'prop': 'source',
      'label': '来源',
      'min-width': 120,
      'align': 'center',
    }, {
      'prop': 'status',
      'label': '状态',
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
        activeTabName: '待关联',
        _cateData: [],
        cateDirItem: {},
        classifies: [],
        classify: [],
        classifyOptions: [],
        data: [],
        defaultCheckedKeys: [],
        defaultExpandedKeys: [],
        entryFormVisible: false,
        entrySourceFormVisible: false,
        entryForm: {
          pathology_id: '',
          remark: [],
        },
        entryRules: {
          /* pathology_id: [
             {required: true, message: '请输入病理号', trigger: 'blur'},
           ],*/
          /*source_id: [
            {required: true, message: '请输入数据来源', trigger: 'blur'},
          ],
          liable_user: [
            {required: true, message: '请输入数据负责人', trigger: 'blur'},
          ],*/
        },
        fileNameList: [],
        filterText: '',
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
        tableLoading: false,
      };
    },
    mounted() {
      this.cateList();
    },
    computed: {},
    methods: {
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      //获取分类
      cateList() {
        this.loading = true;
        this.classifies = [];
        uploadService.cateList().then(res => {
          if (res.body?.ret_code === 0) {
            // this.classifyOptions = res.body.data.map((item) => ({...item}));
            this.classifies = res.body.data.map((item) => ({
              label: item.cate,
              id: item.cate,
              count: item.count,
            }));
            if (this.classifies[0]) {
              this.cateDirItem = this.classifies[0];
              this.defaultCheckedKeys = [this.classifies[0]?.id];
              this.defaultExpandedKeys = [this.classifies[0]?.id];
              this.$nextTick(() => {
                this.$refs.entryTree.setCurrentKey(this.classifies[0]?.id);
              });
              this.getSliceList({limit: 15, offset: 0, cate: this.classifies[0]?.id});
            }
          }
        }).finally(() => {
          setTimeout(() => this.loading = false, 100);
        });
      },
      handleNodeClick(item, node) {
        if (!item.id) {
          return;
        }
        if (!item.path) {
          item.path = [];
        }
        this.cateDirItem = item;
        if (this.activeTabName === '待关联') {
          this.getSliceList({cate: item.id});
        }
      },
      getSliceList({offset = 0, limit = 15, cate = this.cateDirItem?.id} = {
        offset: 0,
        limit: 15,
        cate: this.cateDirItem?.id,
      }) {
        this.tableLoading = true;
        this.data = [];
        uploadService.sliceList({
          limit,
          offset,
          cate,
          keyword: this.keyword || undefined,
        }).then(({body}) => {
          if (body?.ret_code === 0) {
            this.data = body.data.list.map((item) => ({
              ...item,
              label_img: `/api/process/get_image?file=${item.path}&type=label`,
            }));
            this.pagination = {
              count: body.data.count,
              current_page: offset + 1,
              per_page: limit,
            };
          } else {
            this.pagination = {count: 0, current_page: 1, per_page: 15};
          }
        }).finally(() => {
          this.tableLoading = false;
        });
      },
      handleSelectionChange(list) {
        this.multipleSelection = list.concat();
      },
      handleCurrentChange(page) {
        this.getSliceList({offset: page - 1, cate: this.cateDirItem?.id});
      },
      deleteSlice(row) {
        if (!row && this.multipleSelection.length === 0) {
          this.$message.warning('请选择移除项');
          return;
        }
        const params = {
          id: row ? [row.id] : this.multipleSelection.map((item) => item.id),
        };
        uploadService.deleteSlice(params).then(({body}) => {
          if (body?.ret_code === 0) {
            this.$message.success('切片移除成功');
          } else {
            this.$message.error(body?.ret_msg || '切片移除失败');
          }
        }).catch(() => {
          this.$message.error('切片移除失败');
        });
      },
      batchUpload(row) {
        if (!row && this.multipleSelection.length === 0) {
          this.$message.warning('请选择需上传的数据');
          return;
        }
        const params = {
          id: row ? [row.id] : this.multipleSelection.map((item) => item.id),
        };
        uploadService.uploadKfb(params).then(({body}) => {
          if (body?.ret_code === 0) {
            this.$message.success('切片上传成功');
            this.getSliceList({cate: this.cateDirItem?.id});
          } else {
            this.$message.error(body?.ret_msg || '切片上传失败');
          }
        }).catch(() => {
          this.$message.error('切片上传失败');
        });
      },
      batchUploadNoMove(row) {
        if (!row && this.multipleSelection.length === 0) {
          this.$message.warning('请选择需移动的数据');
          return;
        }
        const params = {
          id: row ? [row.id] : this.multipleSelection.map((item) => item.id),
          type: 'move',
        };
        uploadService.uploadKfb(params).then(({body}) => {
          if (body?.ret_code === 0) {
            this.$message.success('切片移动成功');
            this.getSliceList({cate: this.cateDirItem?.id});
          } else {
            this.$message.error(body?.ret_msg || '切片移动失败');
          }
        }).catch(() => {
          this.$message.error('切片移动失败');
        });
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
        uploadService.downloadJSON(params).then(({body}) => {
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
    },
    watch: {
      filterText(val) {
        this.$refs.entryTree.filter(val);
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

  .slide-view-dialog {
    .el-dialog {
      display: flex;
      flex-direction: column;
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
      .el-dialog__header {
        padding: 10px 20px;
      }
      .el-dialog__body {
        flex: 1;
        padding: 0;
      }
    }
  }

  .entry-template-btn {
    .el-button {
      margin: 2px 0;
      & + .el-button {
        margin-left: 0;
      }
    }
  }
</style>
