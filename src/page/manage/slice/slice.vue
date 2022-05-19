<template>
  <div class="main-container slice-main">
    <div class="common-header">
      <hzzt-title>数据列表</hzzt-title>
      <div class="common-header-end flex align-items-center">
        <el-input style="margin-right: 12px" v-model="keyword" size="mini" clearable placeholder="请输入切片名称" suffix-icon="el-icon-search" v-on:keyup.enter.native="sliceTable()"></el-input>

        <!--<el-button style="margin-right: 7px" type="text" disabled>扫描时间</el-button>-->
        <el-date-picker style="margin-right: 9px" v-model="scanTime" type="date" clearable size="mini" value-format="yyyy-MM-dd" @change="handleTimeChange" placeholder="请选择扫描日期">
        </el-date-picker>
        <el-select style="margin-right: 12px" v-model="label_status" size="mini" placeholder="请选择标注状态" clearable @change="sliceTable()">
          <el-option label="未标注" :value="0"></el-option>
          <el-option label="已标注" :value="1"></el-option>
          <el-option label="已精修" :value="2"></el-option>
        </el-select>
        <el-select style="margin-right: 12px" v-model="source_id" size="mini" placeholder="请选择来源" clearable @change="getSliceList()">
          <el-option v-for="source in sourceList" :label="source.hospital" :value="source.id" :key="source.id"></el-option>
        </el-select>
        <el-button type="primary" size="mini" v-show="label_status===0" @click="relateJSON" :disabled="isShowRelateProgress">关联JSON
        </el-button>
        <el-button type="primary" size="mini" @click="sliceDuplicate">数据查重</el-button>
        <el-button type="primary" size="mini" @click="batchStatus()">批量修改状态</el-button>
        <el-button type="primary" size="mini" @click="loadJSON()">批量下载JSON</el-button>
        <el-button type="primary" size="mini" @click="deleteSlice()">批量移除</el-button>
        <el-button type="danger" size="mini" @click="batchDelete(multipleSelection)">批量删除</el-button>
      </div>
    </div>
    <div class="slice-body flex">
      <div class="slice-tree relative" style="margin-right: 10px">
        <div class="show-icon" :class="[showCate?'el-icon-arrow-left':'el-icon-arrow-right']" @click="showCate=!showCate"></div>
        <el-row class="tree-page" v-show="showCate">
          <el-input size="mini" class="filter-text" placeholder="输入关键字进行过滤" v-model="filterText">
          </el-input>
          <el-tree v-loading="loading" class="filter-tree" :data="classifies" node-key="id" :check-strictly="true" :default-expanded-keys="defaultExpandedKeys" :highlight-current="true" @node-click="handleNodeClick" :filter-node-method="filterNode" ref="sliceTree">
            <span class="custom-tree-node" slot-scope="{node,data}">
              <span>{{ data.label }}</span>
              <span>
                <el-button type="text" size="mini">{{ data.count.unmark }}</el-button>
                <el-button type="text" size="mini">{{ data.count.marked }}</el-button>
                <el-button type="text" size="mini">{{ data.count.refinement }}</el-button>
                <el-button type="text" size="mini">{{ data.count.total }}</el-button>
              </span>
            </span>
          </el-tree>
        </el-row>
      </div>
      <div class="slice-table common-table">
        <el-table ref="pTable" v-loading="tableLoading" :data="data" @selection-change="handleSelect" border :height=tableHeight style="width: 100%">
          <el-table-column fixed="left" type="selection" align="center">
          </el-table-column>
          <el-table-column show-overflow-tooltip align="center" prop="pathology_id" label="病理号" width="140" fixed="left">
            <template slot-scope="scope">
              <a class="pathology-id" style="cursor:pointer;color:#4F93FE" @click="pathologyMessages(scope.row.pathology_id)">{{ scope.row.pathology_id }}</a>
            </template>
          </el-table-column>
          <el-table-column v-for="(data, index) in headers" :key="index" :fixed="data.fixed" :prop="data.prop" :label="data.label" show-overflow-tooltip :min-width="data['min-width']" :align="data.align">
            <template slot-scope="scope">
              <viewer v-if="data.prop === 'label_img'" class="flex justify-content-center">
                <img style="width: 40px" :src="scope.row[data.prop]">
              </viewer>
              <span v-if="data.prop !== 'label_img'">{{ scope.row[data.prop] }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="operate" align="center" label="操作" fixed="right" min-width="250px">
            <template slot-scope="scope">
              <el-button-group>
                <el-button type="danger" size="mini" @click="deleteSlice(scope.row)">移除</el-button>
                <el-button v-if="allowSharing" type="primary" size="mini" @click="shareSlice(scope.row)">分享</el-button>
                <el-button type="primary" size="mini" @click="seeSlice(scope.row)">查看</el-button>
                <el-button type="primary" size="mini" @click="readSlice(scope.row)">阅片</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <div class="slicePage" style="position: absolute;bottom: 0; width:100%;
        display: flex;justify-content:center ;height: 40px;align-items:flex-start">
          <el-pagination @current-change="handleCurrentChange" :current-page.sync="pagination.current_page" :page-size="pagination.per_page" layout="prev, pager, next, jumper" :total="pagination.count">
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog class="slice-pathological-dialog" title="切片详情" :visible.sync="outerVisible" center>
      <el-form label-width="100px" :model="sliceForm">
        <el-form-item label="病理号：">
          <span>{{ sliceForm.pathology_id }}</span>
        </el-form-item>
        <el-form-item label="切片名称：">
          <span>{{ sliceForm.name }}</span>
        </el-form-item>
        <el-form-item label="切片分类：">
          <span>{{ sliceForm.cate }}</span>
        </el-form-item>
        <el-form-item label="来源：">
          <span>{{ sliceForm.source }}</span>
        </el-form-item>
        <el-form-item label="扫描机器名：">
          <span>{{ sliceForm.scanistor }}</span>
        </el-form-item>
        <el-form-item label="扫描人：">
          <span>{{ sliceForm.scanUser }}</span>
        </el-form-item>
        <el-form-item label="扫描时间：">
          <span>{{ sliceForm.scanTime }}</span>
        </el-form-item>
        <el-form-item label="切片路径：">
          <span style="word-break: break-all">{{ sliceForm.path }}</span>
        </el-form-item>
        <el-form-item label="切片缩略图：">
          <img width="180px" height="180px" class="preview-img" alt="切片缩略图" :src="sliceForm.previewImg">
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="loadPicture(sliceForm)">下载KFB</el-button>
        <el-button v-if="sliceForm.label_status==='已标注'" type="primary" size="mini" @click="loadSingleJSON(sliceForm)">
          下载JSON
        </el-button>
        <el-button size="mini" @click="outerVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog class="slide-view-dialog" :fullscreen="true" :visible.sync="showFile" title="阅片" :close-on-press-escape="false" :show-close="false">
      <div slot="title" class="slide-dialog-header flex align-items-center justify-content-between">
        <span>阅片</span>
        <div class="close-btn" @click="showFile=false">
          <img src="assets/img/close.png">
        </div>
      </div>
      <pis-slide-view v-if="showFile" :file-name-list="fileNameList" :file-index="fileIndex">
      </pis-slide-view>
    </el-dialog>
    <el-dialog class="slide-share-dialog flex" :visible.sync="showShare" title="分享" center>
      <el-form :model="shareForm" ref="shareForm" :label-position="labelPosition" label-width="100px" class="flex" style="margin-bottom:20px">
        <div class="form-left">
          <el-form-item label="新增分享人:" prop="user_id" style="margin-bottom:30px" :validate-on-rule-change="false">
            <el-row :gutter="20">
              <el-col :span="21" style="padding:0">
                <el-select multiple v-model="shareForm.user_id" placeholder="请选择分享人" style="width: 100%;">
                  <el-option v-for="user in users" :key="user.id" :value="user.id" :label="user.nickname">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="有效期:">
            <el-row :gutter="20">
              <el-col :span="10" style="padding:0">
                <el-form-item prop="start_at">
                  <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="shareForm.start_at" :picker-options="pickerOptions1" type="datetime" placeholder="开始时间">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="1" style="padding:0;text-align:center">-</el-col>
              <el-col :span="10" style="padding:0">
                <el-form-item prop="end_at">
                  <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="shareForm.end_at" :picker-options="pickerOptions2" type="datetime" placeholder="结束时间">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>

          </el-form-item>
          <p style="text-align:center;margin-right:220px;font-size:12px;color:blue">

            不选择结束时间默认永久有效
          </p>
        </div>
        <div class="form-right flex justify-content-center align-items-center" style="width:50px">
          <el-form-item>
            <el-button style="margin-bottom:20px" type="primary" @click="createShare">添加</el-button>
          </el-form-item>

        </div>
      </el-form>
      <el-scrollbar style="height:100%">
        <el-table :data="shareData" :key="mainTableKey" align="center" style="width: 100%" size="mini">
          <el-table-column align="center" type="index" label="序号" :index="indexMethod"></el-table-column>
          <el-table-column align="center" prop="user_id" label="分享人" :formatter="userFormat" width="120"></el-table-column>
          <el-table-column align="center" prop="start_at" label="开始时间" width="180"></el-table-column>
          <el-table-column align="center" prop="end_at" label="结束时间" width="180"></el-table-column>
          <el-table-column align="center" prop="status" label="状态" width="111">
            <template slot-scope="scope">
              <span style="color:red" v-if="scope.row.status === 0">已取消</span>
              <span style="color:green" v-if="scope.row.status === 1">分享中</span>
              <span style="color:grey" v-if="scope.row.status === 2">已过期</span>
              <span style="color:blue;font-size:12px" v-if="scope.row.end_at === null && scope.row.status !== 0&& scope.row.status !== 2"><br>(永久分享)</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="111">
            <template slot-scope="scope">
              <el-button v-if="scope.row.status !== 1" type="primary" plain size="mini" @click="shareAgain(scope.row)">重新分享</el-button>
              <el-button v-if="scope.row.status === 1" type="danger" plain size="mini" @click="stopShare(scope.row)">取消分享</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
      <el-dialog v-show="shareDialog === 0" width="20%" title="取消分享" :visible.sync="innerVisible0" append-to-body>
        <p>是否取消分享该切片给{{ reName }}？</p>

        <div slot="footer" class="dialog-footer">
          <el-button type="danger" size="mini" @click="unshare">取消分享</el-button>
          <el-button type="primary" size="mini" @click="innerVisible0 = false">继续分享</el-button>
        </div>
      </el-dialog>
      <el-dialog v-show="shareDialog === 1" width="35%" title="重新分享" :visible.sync="innerVisible1" append-to-body>
        <p>是否分享该切片给{{ reName }}？请选择分享有效期</p>
        <br>
        <el-form :model="shareForm">
          <el-form-item label="有效期:">
            <el-row :gutter="17">
              <el-col :span="8" style="padding:0">
                <el-form-item prop="start_at">
                  <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="shareForm.start_at" :picker-options="pickerOptions1" type="datetime" placeholder="开始时间" width="100%">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="1" style="padding:0;text-align:center">-</el-col>
              <el-col :span="8" style="padding:0">
                <el-form-item prop="end_at">
                  <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="shareForm.end_at" :picker-options="pickerOptions2" type="datetime" placeholder="结束时间" width="100%">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <p style="text-align:left;margin-left:80px;font-size:12px;color:blue">

            不选择结束时间默认永久有效
          </p>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" size="mini" @click="innerVisible1 = false">取 消</el-button>
          <el-button type="primary" size="mini" @click="reShare">重新分享</el-button>
        </div>
      </el-dialog>
    </el-dialog>
    <el-dialog title="修改状态" class="status-dialog" :visible.sync="statusVisible" center width="400px">
      <el-form :model="statusForm" label-width="120px" ref="statusForm">
        <el-form-item label="标注状态" prop="label_status">
          <el-select v-model="statusForm.label_status" size="mini" placeholder="请选择标注状态">
            <el-option label="未标注" :value="0"></el-option>
            <el-option label="已标注" :value="1"></el-option>
            <el-option label="已精修" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标注人" prop="label_user" v-if="statusForm.label_status===1">
          <el-input v-model="statusForm.label_user" size="mini" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="精修人" prop="refinement_user" v-if="statusForm.label_status===2">
          <el-input v-model="statusForm.refinement_user" size="mini" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="statusFormSubmit">确 定</el-button>
        <el-button size="mini" @click="statusVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="重复列表" class="repeat-dialog" :visible.sync="repeatVisible" center width="80%">
      <div class="flex" style="margin-bottom: 10px">
        <el-input style="margin-right: 12px" v-model="repeatName" size="mini" clearable placeholder="请输入切片名称" suffix-icon="el-icon-search" v-on:keyup.enter.native="repeatData()"></el-input>
        <el-button type="danger" size="mini" @click="batchDelete(repeatMultipleSelection)">
          批量删除
        </el-button>
      </div>
      <el-table :data="repeatList" @selection-change="handleRepeatSelect" border height="550px" v-loading="repeatLoading" :span-method="arraySpanMethod" style="width: 100%">
        <el-table-column fixed="left" type="selection" align="center">
        </el-table-column>
        <el-table-column v-for="(data, index) in repeatHeaders" :key="index" :fixed="data.fixed" :prop="data.prop" :label="data.label" show-overflow-tooltip :min-width="data['min-width']" :align="data.align">
          <template slot-scope="scope">
            <viewer v-if="data.prop === 'label_img'" class="flex justify-content-center">
              <img style="width: 40px" :src="scope.row[data.prop]">
            </viewer>
            <span v-if="data.prop !== 'label_img'">{{ scope.row[data.prop] }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>

</template>

<script>
import hzztTitle from '@/components/hzztTitle';
import { sliceService } from './slice.service';
import { userService } from "../system/user/user.service";
import { originService } from '../system/origin/origin.service';
import { baseUrl } from '@/config/utils';
import pisSlideView from '@/components/pisSlideView/pisSlideView';
import { mapState, createNamespacedHelpers } from 'vuex';
import moment from 'moment';

const moduleMapState = createNamespacedHelpers('stomp').mapState;


export default {
  components: {
    hzztTitle,
    pisSlideView,
  },
  data() {
    return {
      cate_id: undefined,
      classifies: [],
      // classify: undefined,
      // classifyOptions: [],
      data: [],
      defaultExpandedKeys: [],
      fileIndex: 0,
      fileNameList: [],
      filterText: '',
      allowSharing:false,
      headers: [
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
          'prop': 'label_status',
          'label': '标注状态',
          'min-width': 90,
          'align': 'center',
        }, {
          'prop': 'label_user',
          'label': '标注人',
          'min-width': 80,
          'align': 'center',
        }, {
          'prop': 'refinement_user',
          'label': '精修人',
          'min-width': 80,
          'align': 'center',
        }, {
          'prop': 'scanistor',
          'label': '扫描机器名',
          'min-width': 120,
          'align': 'center',
        }, {
          'prop': 'scan_time',
          'label': '扫描时间',
          'min-width': 120,
          'align': 'center',
        }, {
          'prop': 'scan_user',
          'label': '扫描人',
          'min-width': 120,
          'align': 'center',
        }],
      initData: [],
      innerVisible0: false,
      innerVisible1: false,
      keyword: '',
      loading: false,
      messageList: {},
      multipleSelection: [],
      outerVisible: false,
      pagination: { count: 0, current_page: 1, per_page: 15 },
      pathologyForm: {},
      pathologyLoading: false,
      scanTime: undefined,
      showFile: false,
      showShare: false,
      sliceForm: {},
      sliceMode: true,
      tableHeight: '100%',
      tableLoading: false,
      statusVisible: false,
      statusForm: {},
      label_status: undefined,
      source_id: undefined,
      sourceList: [],
      repeatVisible: false,
      repeatList: [],
      repeatName: '',
      repeatMultipleSelection: [],
      repeatLoading: false,
      repeatHeaders: [
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
          'prop': 'label_status',
          'label': '标注状态',
          'min-width': 80,
          'align': 'center',
        }, {
          'prop': 'label_user',
          'label': '标注人',
          'min-width': 80,
          'align': 'center',
        }, {
          'prop': 'refinement_user',
          'label': '精修人',
          'min-width': 80,
          'align': 'center',
        }],
      showCate: document.body.clientWidth > 1400 ? true : false,
      shareForm: {
        user_id: [],
        slice_id: '',
        start_at: null,
        end_at: null,
        status: '',
        nickname: ''
      },
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() < new Date().getTime() - 86400000;
        },
        // shortcuts: [{
        //   text: '今天',
        //   onClick(picker) {
        //     picker.$emit('pick', new Date());
        //   }
        // }, {
        //   text: '三天后',
        //   onClick(picker) {
        //     const date = new Date();
        //     date.setTime(date.getTime() + 3600 * 1000 * 24 * 3);
        //     picker.$emit('pick', date);
        //   }
        // }, {
        //   text: '一周后',
        //   onClick(picker) {
        //     const date = new Date();
        //     date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
        //     picker.$emit('pick', date);
        //   }
        // }]
      },
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() < new Date().getTime() - 86400000;
        },
        shortcuts: [{
          text: '三天后',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 3);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周后',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }, {
          text: '一个月后',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 30);
            picker.$emit('pick', date);
          }
        }, {
          text: '三个月后',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 90);
            picker.$emit('pick', date);
          }
        }]
      },
      labelPosition: 'right',
      shareData: [],
      pagination: {
        current: 1,
        pageSize: 15,
        showTotal: total => `共 ${total} 条`,
        total: 0,
      },
      users: [],
      sharelist: [],
      sharemeta: [],
      shareDialog: '',
      reName: [],
      reShareID: [],
      unshareData: [],
      mainTableKey: 1
    };
  },
  watch: {
    filterText(val) {
      this.$refs.sliceTree.filter(val);
    },
  },
  activated() {
    this.cateList();
    this.originList();
    this.userList();
    this.shareList()

  },

  mounted() {
  },
  created() {
    this.cateList();
    this.originList();
    this.userList();
    this.shareList();
    this.sharePower();
    this.$root.$on('refresh-slice-list', () => this.cateTwoList());
  },
  computed: {
    ...mapState(['user']),
    ...moduleMapState([
      'isConnected',
      'relateJSONProgress',
    ]),
    isShowRelateProgress() {
      return !!this.relateJSONProgress;
    },
  },
  methods: {
    sharePower(){
        console.log(this.user?.role)
        const roles = this.user?.role
        if(roles.find((role) => role.name ==='管理员')){
        this.allowSharing = true
        }
        
    },
    userList() {
      this.loading = true;
      userService.userList()
        .then(({ body }) => {
          if (body?.ret_code === 0) {
            this.users = body.data.list;
          }
        }).finally(() => {
          this.loading = false;
        })
    },
    shareList() {
      this.loading = true;
      sliceService.shareList()
        .then(({ body }) => {
          //   console.log(body.data.list)
          //   this.sharelist = body.data.list
          this.$set(this, 'sharelist', body.data.list)
        }).finally(() => {
          this.loading = false;
        })
    },
    getSliceList() {
      this.loading = true;
      sliceService.cateList({ source_id: this.source_id }).then(({ body }) => {
        if (body?.ret_code === 0) {
          this.classifies = body.data;
          const key = this.$refs.sliceTree.getCurrentKey();
          if (this.classifies[0]) {
            this.defaultExpandedKeys = [key];
            this.cate_id = key;
            this.$nextTick(() => {
              this.$refs.sliceTree.setCurrentKey(key);
            });
          }
          this.sliceTable();
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    //获取树形结构的分类
    cateList() {
      this.loading = true;
      sliceService.cateList().then(({ body }) => {
        if (body?.ret_code === 0) {
          this.classifies = body.data;
          if (this.classifies[0]) {
            this.defaultExpandedKeys = [this.classifies[0]?.id];
            this.cate_id = this.classifies[0]?.id;
            this.$nextTick(() => {
              this.$refs.sliceTree.setCurrentKey(this.classifies[0]?.id);
            });
          }
          this.sliceTable();
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    originList() {
      originService.originList().then(({ body }) => {
        if (body?.ret_code === 0) {
          this.sourceList = body.data;
        }
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleTimeChange() {
      this.sliceTable();
    },
    //分页页码改变事件
    handleCurrentChange(val) {
      this.sliceTable();
    },
    //点击树形结构分类的某一项的回调函数
    handleNodeClick(item, node) {
      this.cate_id = item.id;
      this.sliceTable();
    },
    //得到切片列表
    sliceTable() {
      let params = {
        page: this.pagination.current_page,
        status: 1,
        label_status: this.label_status,
        name: this.keyword || undefined,
        cate_id: this.cate_id || this.classifies[0].id||undefined,
        source_id: this.source_id,
      };
      this.tableLoading = true;
      sliceService.sliceList(params).then(({ body }) => {
        this.data = [];
        if (body?.ret_code === 0) {
          this.data = (body.data.list || []).map((item) => ({
            ...item,
            label_img: `/api/process/get_image?file=${item.path}&type=label`,
          }));
          this.pagination = body.data.meta;
        }
      }).catch(() => {
        this.pagination = { count: 0, current_page: 1, per_page: 15 };
      }).finally(() => {
        this.tableLoading = false;
      });
    },
    userFormat(row){
      if(row){
        return row.user.nickname
      }
    },
    //分享切片
    shareSlice(row) {
      this.showShare = true
      console.log(row)
      let params = {
        name: row.name
      }
      console.log(params)
      sliceService.shareList(params).then(({ body }) => {
        this.data = [];
        if (body?.ret_code === 0) {
          this.$set(this, 'sharelist', body.data.list)
          this.$set(this, 'sharemeta', body.data.meta)
          this.pagination = body.data.meta;
        }
      }).catch(() => {
        this.pagination = { count: 0, current_page: 1, per_page: 15 };
      }).finally(() => {
      });
      this.slice_id = row ? row.id : this.multipleSelection.map((item) => item.id)
      this.shareInfo = this.sharelist.filter((item) => item.id === this.slice_id)
      console.log(this.shareInfo)
      if (this.shareInfo.length !== 0) {
      console.log(this.shareInfo[0].share)
        this.shareData = this.shareInfo[0].share
      }else{
        this.shareData = []  
      }



      this.sliceTable()
    },
    indexMethod(index) {
      return index + 1;
    },
    //新建分享
    createShare(row) {
      console.log(this.shareForm)
      if (this.shareForm.user_id.length === 0) {
        this.$message.error('请至少选择一个用户');
      } else {
        if (this.shareForm.start_at === null) {
          this.shareForm.start_at = moment().format('YYYY-MM-DD HH:mm:ss')
          console.log(this.shareForm.start_at)
        }
        if (this.shareForm.end_at === null) {

        }
        this.shareForm.status = 1
      }
      const params = {
        // slice_id :this.shareForm.id,
        slice_id: this.slice_id,
        user_id: this.shareForm.user_id,
        start_at: this.shareForm.start_at,
        end_at: this.shareForm.end_at
      }
      sliceService.sliceShare(params).then(({ body }) => {
        if (body?.ret_code === 0) {
          this.outerVisible = false;
          this.$message.success('分享成功');
          this.shareList();
          this.mainTableKey = Math.random()
        } else {
          this.$message.error(body?.ret_msg || '分享失败');
          this.shareList();
          this.mainTableKey = Math.random()
        }
      })
    },
    shareAgain(data) {
      this.shareDialog = 1;
      this.innerVisible1 = true;
      this.reName = data.user.nickname
      this.reshareData = data
    },
    stopShare(data) {
      this.shareDialog = 0
      this.innerVisible0 = true;
      this.reName = data.user.nickname
      this.unshareData = data


    },
    reShare() {
      this.shareForm.user_id = this.reshareData.user_id
      console.log(this.reshareData)
      if (this.shareForm.start_at === null) {
        this.shareForm.start_at = moment().format('YYYY-MM-DD HH:mm:ss')
        console.log(this.shareForm.start_at)
      }
      this.shareForm.status = 1
      const params = {
        slice_id: this.reshareData.slice_id,
        user_id: this.reshareData.user_id,
        start_at: this.shareForm.start_at,
        end_at: this.shareForm.end_at
      }
      sliceService.sliceShare(params).then(({ body }) => {
        if (body?.ret_code === 0) {
          this.outerVisible = false;
          this.$message.success('重新分享成功');
          this.shareList();
          this.mainTableKey = Math.random()
        } else {
          this.$message.error(body?.ret_msg || '分享失败');
          this.shareList();
          this.mainTableKey = Math.random()
        }
      })
      this.innerVisible1 = false;

    },
    unshare() {
      const params = {
        slice_id: this.unshareData.slice_id,
        user_id: this.unshareData.user_id
      }
      sliceService.sliceUnShare(params).then(({ body }) => {
        if (body?.ret_code === 0) {
          this.outerVisible = false;
        }
      })
      this.$message.success('已成功取消该分享！');
      this.innerVisible0 = false;
      this.shareList();
      this.mainTableKey = Math.random()

    },
    //阅片
    readSlice(row) {
      this.showFile = true;
      this.fileNameList = [row.path];
      this.fileIndex = 0;
    },
    //查看切片
    seeSlice(data) {
      this.sliceForm = data;
      this.sliceForm.previewImg = `${baseUrl}/slice_thumb?file=${this.sliceForm.path}&type=thumbnail`;
      this.outerVisible = true;
    },
    relateJSON() {
      this.$prompt('关联JSON的路径地址', '关联JSON', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: 'JSON的路径地址',
      }).then((res) => {
        const path = res.value;
        if (!path) return;
        sliceService.relateJSON({
          status: 1,
          label_status: 0,
          json_dir: path,
          cate_id: this.cate_id || undefined,
          source_id: this.source_id || undefined,
          queue: `file_${this.user.username}_relate_json`,
        }).then((res) => {

        });
      }).catch(() => {

      });
    },
    sliceDuplicate() {
      this.repeatVisible = true;
      this.repeatList = [];
      this.repeatMultipleSelection = [];
      this.repeatLoading = true;
      this.repeatName = '';
      this.repeatData();
    },
    repeatData() {
      sliceService.sliceDuplicate({ page_size: 100, name: this.repeatName }).then((res) => {
        const obj = res.body.data.list;
        for (let key in obj) {
          this.repeatList = [
            ...this.repeatList, ...obj[key].map((item, index) => {
              if (index === 0) item.count = obj[key].length;
              item.label_img = `/api/process/get_image?file=${item.path}&type=label`;
              return item;
            })];
        }
      }).finally(() => {
        this.repeatLoading = false;
      });
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        if (row.count) {
          return {
            rowspan: row.count,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
    batchStatus() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择项');
        return;
      }
      this.statusForm = {
        label_user: '',
        refinement_user: '',
        label_status: '',
      };
      this.statusVisible = true;
    },
    statusFormSubmit() {
      sliceService.sliceUpdate({
        id: this.multipleSelection.map((item) => item.id),
        label_user: this.statusForm.label_status !== 2 ? this.statusForm.label_user : undefined,
        refinement_user: this.statusForm.label_status !== 1 ? this.statusForm.refinement_user : undefined,
        label_status: this.statusForm.label_status,
      }).then(({ body }) => {
        if (body?.ret_code === 0) {
          this.$message.success('修改成功');
          this.cateTwoList();
          this.statusVisible = false;
        } else {
          this.$message.error(body?.ret_msg || '修改失败');
        }
      }).catch(() => {
        this.$message.error('修改失败');
      });
    },
    cateTwoList() {
      sliceService.cateList().then(({ body }) => {
        if (body?.ret_code === 0) {
          this.classifies = body.data;
          if (this.classifies[0]) {
            this.$nextTick(() => {
              this.$refs.sliceTree.setCurrentKey(this.cate_id);
            });
          }
          this.sliceTable();
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    //单个删除
    deleteSlice(row) {
      if (!row && this.multipleSelection.length === 0) {
        this.$message.warning('请选择移除项');
        return;
      }
      const params = {
        id: row ? [row.id] : this.multipleSelection.map((item) => item.id),
      };
      // console.log(params)
      sliceService.deleteSlice(params).then(({ body }) => {
        if (body?.ret_code === 0) {
          this.outerVisible = false;
          this.$message.success('切片移除成功');
          this.sliceTable();
        } else {
          this.$message.error(body?.ret_msg || '切片移除失败');
        }
      });
    },
    batchDelete(list) {
      if (list.length === 0) {
        this.$message.warning('请选择需删除的数据');
        return;
      }
      sliceService.batchDelete({
        id: list.map((item) => item.id),
      }).then(({ body }) => {
        if (body?.ret_code === 0) {
          this.$message.success('切片删除成功');
          if (this.repeatVisible) {
            this.repeatList = [];
            this.repeatData();
          } else {
            this.sliceTable();
          }
        } else {
          this.$message.error(body?.ret_msg || '切片删除失败');
        }
      });
    },
    handleSelect(list) {
      this.multipleSelection = list.concat();
    },
    handleRepeatSelect(list) {
      this.repeatMultipleSelection = list.concat();
    },
    //下载
    loadPicture(row) {
      let anchor = document.createElement('a');
      anchor.setAttribute('href', row.path);
      anchor.setAttribute('target', '_blank');
      anchor.setAttribute('download', row.name);
      anchor.click();
    },
    loadSingleJSON(row) {
      let anchor = document.createElement('a');
      anchor.setAttribute('href', (row.path).replace('.kfb', '.json'));
      anchor.setAttribute('target', '_blank');
      anchor.setAttribute('download', row.name.replace('.kfb', '.json'));
      anchor.click();
    },
    loadJSON() {
      let params = {
        slice_ids: this.multipleSelection.length > 0 ? this.multipleSelection.map((item) => item.id) : undefined,
      };
      sliceService.downloadJSON(params).then(({ body }) => {
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
    pathologyMessages(id) {
      this.$router.push(`/message/${id}`);
    },
  },
};
</script>

<style lang="scss">
@import "../../../style/variables";

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
.slide-share-dialog {
  .el-dialog--center {
    width: 800px;
    .el-form-item {
      width: 600px;
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
/* .status-dialog {
   .el-dialog--center {
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
 }*/

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

.repeat-dialog {
  .el-dialog__body {
    padding-top: 0;
    height: 600px;

    .el-input {
      max-width: 217px;
    }
  }
}
</style>
