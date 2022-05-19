<template>
  <div class="main-container entry-main">
    <div class="common-header">
      <div class="common-header-end flex align-items-center">
        <el-input style="margin-right: 12px" v-model="keyword" size="mini" clearable placeholder="请输入切片名称" suffix-icon="el-icon-search" v-on:keyup.enter.native="sliceTable()"></el-input>
        <el-date-picker style="margin-right: 9px" v-model="start_at" type="date" clearable size="mini" value-format="yyyy-MM-dd HH:mm:ss" @change="handleTimeChange" placeholder="请选择分享开始日期">
        </el-date-picker>
        <el-date-picker style="margin-right: 9px" v-model="end_at" type="date" clearable size="mini" value-format="yyyy-MM-dd HH:mm:ss" @change="handleTimeChange" placeholder="请选择分享结束日期">
        </el-date-picker>
        <el-select style="margin-right: 12px" v-model="user_id" size="mini" placeholder="请选择分享人" clearable @change="shareList()">
          <el-option v-for="user in users" :key="user.id" :value="user.id" :label="user.nickname"></el-option>
        </el-select>
        <el-select style="margin-right: 12px" v-model="cate_id" size="mini" placeholder="请选择切片分类" clearable @change="shareList()">
          <el-option v-for="classify in classifies" :label="classify.label" :value="classify.id" :key="classify.id"></el-option>
        </el-select>
        <el-select style="margin-right: 12px" v-model="status" size="mini" @clear="clearValue" placeholder="请选择当前状态" clearable @change="shareList()">
          <el-option label="已取消" :value="0"></el-option>
          <el-option label="分享中" :value="1"></el-option>
          <el-option label="已过期" :value="2"></el-option>
        </el-select>

      </div>
    </div>
    <div class="slice-body flex">
      <div class="slice-table common-table">
        <el-table ref="pTable" v-loading="tableLoading" :data="data" @selection-change="handleSelect" border :height='tableHeight' style="width: 100%">
          <el-table-column align="center" type="expand" width="50">
            <template slot-scope="scope">
              <el-table :data="scope.row.share" style="width:100%;align:center" :height='tableHeight' class="two-list" border>
                <!-- <el-table-column align="center" wdith="120"></el-table-column> -->
                <el-table-column align="center" label="分享人" wdith="120">
                  <template slot-scope="scope">
                    <span>
                      {{scope.row.user.nickname}}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="start_at" label="开始时间" min-wdith="200px"></el-table-column>
                <el-table-column align="center" prop="end_at" label="结束时间" min-wdith="200px">
                  <template slot-scope="scope">
                    <span v-if="scope.row.end_at ==null">
                      <span style="color:#00B46D">永久分享</span>
                    </span>
                    <span v-else>
                      {{scope.row.end_at}}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="status" label="分享状态" width="250px">
                  <template slot-scope="scope">
                    <span v-if="scope.row.status ==0">
                      <span style="color:#D75C89">已取消</span>
                    </span>
                    <span v-if="scope.row.status ==1">
                      <span style="color:#00B46D">分享中</span>
                    </span>
                    <span v-if="scope.row.status ==2">
                      <span style="color:#999">已过期</span>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column align="center"  label="" width="500px">

                </el-table-column>
                <el-table-column prop="operate" align="center" label="操作" fixed="right" width="280px">
                  <template slot-scope="scope">
                    <el-button-group>
                      <el-button v-if="allowSharing" type="primary" size="mini" @click="stopShare(scope.row)">取消分享</el-button>
                    </el-button-group>
                  </template>
                </el-table-column>
              </el-table>

            </template>
          </el-table-column>
          <el-table-column align="center" type="index" label="序号" width="50" :index="indexMethod"></el-table-column>

          <el-table-column show-overflow-tooltip align="center" prop="pathology_id" label="病理号" width="120">
            <template slot-scope="scope">
              <span style="color:#4F93FE">{{ scope.row.pathology_id }}</span>
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
          <!-- <el-table-column align="center" label="共享人数" width="120">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>{{ scope.row.user_name }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.user_number}}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column> -->
          <el-table-column align="center" prop="share_status" label="当前状态" min-width="120px">
            <template slot-scope="scope">
              <span style="color:#D75C89" v-if="scope.row.share_status === 0">未分享</span>
              <span style="color:#00B46D" v-if="scope.row.share_status === 1">已分享</span>
              <!-- <span style="color:grey" v-if="scope.row.share_status === 2">已过期</span> -->
            </template>
          </el-table-column>
          <el-table-column prop="operate" align="center" label="操作" fixed="right" width="280px">
            <template slot-scope="scope">
              <el-button-group>
                <el-button v-if="allowSharing" type="primary" size="mini" @click="stopAllShare(scope.row)">取消全部分享</el-button>
                <el-button v-if="allowSharing" type="primary" size="mini" @click="shareAgain(scope.row)">新增分享人</el-button>
                <el-button v-if="allowCheck" type="primary" size="mini" @click="seeSlice(scope.row)">查看</el-button>
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
    <el-dialog v-show="shareDialog === 0" width="20%" title="取消全部" :visible.sync="innerVisible0" append-to-body>

      <el-form label-width="100px" :model="shareForm">
        <p>是否取消该切片的全部分享？</p>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="mini" @click="unshareAll">确认取消分享</el-button>
        <el-button type="primary" size="mini" @click="innerVisible0 = false">退出</el-button>
      </div>
    </el-dialog>
    <el-dialog v-show="shareDialog === 1" width="40%" title="新增分享" :visible.sync="innerVisible1" append-to-body>
      <br>
      <el-form label-width="100px" :model="shareForm">
        <el-form-item label="新增分享人:" prop="user_id" style="margin-bottom:30px" :validate-on-rule-change="false">
          <el-row :gutter="17">
            <el-col :span="8" style="padding:0">
              <el-select multiple v-model="shareForm.user_id" placeholder="请选择分享人" style="width: 100%;">
                <el-option v-for="user in users" :key="user.id" :value="user.id" :label="user.nickname">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
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
    <el-dialog v-show="shareDialog === 2" width="20%" title="取消分享" :visible.sync="innerVisible2" append-to-body>

      <p>是否取消分享该切片给{{ reName }}？</p>

      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="mini" @click="unshare">取消分享</el-button>
        <el-button type="primary" size="mini" @click="innerVisible2 = false">继续分享</el-button>
      </div>
    </el-dialog>
    <el-dialog class="slice-pathological-dialog" title="切片详情" :visible.sync="outerVisible" center>
      <el-form label-width="100px" :model="sliceForm">
        <el-form-item label="病理号：">
          <span>{{ sliceForm.pathology_id }}</span>
        </el-form-item>
        <el-form-item label="切片名称：">
          <span>{{ sliceForm.name }}</span>
        </el-form-item>
        <el-form-item label="切片分类：">
          <span>{{ sliceForm.cate_name }}</span>
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
  </div>
</template>

<script>

import hzztTitle from '@/components/hzztTitle';
import pisSlideView from '@/components/pisSlideView/pisSlideView';
import { sliceService } from '../slice/slice.service';
import { shareService } from './share.service';
import { originService } from '../system/origin/origin.service';
import { baseUrl } from '@/config/utils';
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
      allowSharing:false,
      allowCheck:false,
      defaultExpandedKeys: [],
      fileIndex: 0,
      fileNameList: [],
      filterText: '',
      headers: [
        {
          'prop': 'name',
          'label': '切片名称',
          'min-width': 120,
          'align': 'center',
        }, {
          'prop': 'cate_name',
          'label': '切片分类',
          'min-width': 120,
          'align': 'center',
        }, {
          'prop': 'path',
          'label': '切片路径',
          'min-width': 350,
          'align': 'center',
        }, {
          'prop': 'hospital',
          'label': '切片来源',
          'min-width': 120,
          'align': 'center',

        }, {
          'prop': 'user_number',
          'label': '共享人数',
          'min-width': 120,
          'align': 'center',
        }
      ],
      initData: [],
      innerVisible0: false,
      innerVisible1: false,
      innerVisible2: false,
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
      user_id: undefined,
      source_id: undefined,
      start_at: undefined,
      end_at: undefined,
      status: undefined,
      share_status: undefined,
      sourceList: [],
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
      shareDialog: '',
      reName: [],
      reShareID: [],
      unshareData: []
    };
  },
  mounted() {

  },
  computed: {
    ...mapState(['user']),

  },
  created() {
    this.cateList();
    this.originList();
    this.userList();
    this.shareList();
    this.sharePower();
  },
  methods: {
    sharePower(){
        console.log(this.user?.role)
        const roles = this.user?.role
        if(roles.find((role) => role.name ==='管理员')){
        this.allowSharing = true
        this.allowCheck = true
        }
        if(roles.find((role) => role.name ==='分享人')){
        this.allowCheck = true
        }
        // console.log(this.data)
    },
    userList() {
      this.loading = true;
      shareService.userList()
        .then(({ body }) => {
          if (body?.ret_code === 0) {
            this.users = body.data.list;
          }
        }).finally(() => {
          this.loading = false;
        })
    },
    shareList() {
      let params = {
        page: this.pagination.current_page,
        user_id: this.user_id || undefined,
        start_at: this.start_at || undefined,
        end_at: this.end_at || undefined,
        cate_id: this.cate_id || undefined,
        source_id: this.source_id || undefined,
        status: this.status,
      };
    //   console.log(params)
      this.tableLoading = true;
      shareService.shareList(params).then(({ body }) => {
        this.data = [];
        if (body?.ret_code === 0) {
          this.data = (body.data.list || []).map((item) => ({
            ...item,
            cate_name: item.cate.cate_name,
            user_number: item.share.length,
            share: item.share,
            children: Array.prototype.concat.apply([], (Array.prototype.concat.apply([], (item.share).map(d => d))).map(d => d.user)),
            hospital: item.source.hospital,
            // user_id: Array.prototype.concat.apply([], (Array.prototype.concat.apply([], (item.share).map(d => d))).map(d => d.user.id)),
            // start_at: Array.prototype.concat.apply([], (Array.prototype.concat.apply([], (Array.prototype.concat.apply([], (item.share).map(d => d))).map(d => d.start_at))).map(d => d)),
            // end_at: Array.prototype.concat.apply([], (Array.prototype.concat.apply([], (item.share).map(d => d))).map(d => d.end_at)),
          }));
        //   console.log(this.data)
          this.pagination = body.data.meta;
        }
      }).catch(() => {
        this.pagination = { count: 0, current_page: 1, per_page: 15 };
      }).finally(() => {
        this.tableLoading = false;
      });
    },
    originList() {
      originService.originList().then(({ body }) => {
        if (body?.ret_code === 0) {
          this.sourceList = body.data;
        }
      });
    },
    //获取树形结构的分类
    cateList() {
      this.loading = true;
      sliceService.cateList().then(({ body }) => {
        if (body?.ret_code === 0) {
          this.classifies = body.data;
          //   if (this.classifies[0]) {
          //     this.defaultExpandedKeys = [this.classifies[0]?.id];
          //     this.cate_id = this.classifies[0]?.id;
          //     this.$nextTick(() => {
          //       this.$refs.sliceTree.setCurrentKey(this.classifies[0]?.id);
          //     });
          //   }
          this.shareList();
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    // getShareList() {
    //   this.loading = true;
    //   sliceService.shareList(). then(({ body }) => {
    //       this.data = (body.data.list || []).map((item) => ({
    //         ...item,
    //         cate_name: item.cate.cate_name,
    //         user_number: item.share.length,
    //         user_name: Array.prototype.concat.apply([], (Array.prototype.concat.apply([], (item.share).map(d => d))).map(d => d.user.nickname)),
    //         user_id: Array.prototype.concat.apply([], (Array.prototype.concat.apply([], (item.share).map(d => d))).map(d => d.user.id)),
    //         start_at: Array.prototype.concat.apply([], (Array.prototype.concat.apply([], (Array.prototype.concat.apply([], (item.share).map(d => d))).map(d => d.start_at))).map(d => d)),
    //         end_at: Array.prototype.concat.apply([], (Array.prototype.concat.apply([], (item.share).map(d => d))).map(d => d.end_at)),

    //       }));


    //       console.log(this.data)
    //     }).finally(() => {
    //     })
    // },
    //分页页码改变事件
    handleCurrentChange(val) {
      this.sliceTable();
    },
    //得到切片列表
    sliceTable() {
      let params = {
        page: this.pagination.current_page,
        status: 1,
        label_status: this.label_status,
        name: this.keyword || undefined,
        // cate_id: this.cate_id || this.classifies[0].id,
        source_id: this.source_id,
      };
    //   console.log(params)
      this.tableLoading = true;
      sliceService.sliceList(params).then(({ body }) => {
        this.slicedata = [];
        if (body?.ret_code === 0) {
          this.slicedata = (body.data.list || []).map((item) => ({
            ...item,
            label_img: `/api/process/get_image?file=${item.path}&type=label`,
          }));
          this.pagination = body.data.meta;
        //   console.log(this.slicedata)
        }
      }).catch(() => {
        this.pagination = { count: 0, current_page: 1, per_page: 15 };
      }).finally(() => {
        this.tableLoading = false;
      });
    },
    handleTimeChange() {
      this.shareList();
    },
    clearValue(val) {
    //   console.log(this.status)
      this.status = undefined
    //   console.log(this.status)
    },
    handleSelect(list) {
      this.multipleSelection = list.concat();
    },
    //分享切片
    shareSlice(row) {
      this.showShare = true
      this.slice_id = row ? row.id : this.multipleSelection.map((item) => item.id)
      this.shareInfo = this.sharelist.filter((item) => item.id === this.slice_id)
      //   console.log(this.shareInfo)
      this.shareData = this.shareInfo[0].share
      //   console.log(this.shareData)

    },
    //查看切片
    seeSlice(data) {
    //   console.log(data)
      this.sliceForm = data;
      this.sliceForm.source = data.source.hospital;
      this.sliceForm.previewImg = `${baseUrl}/slice_thumb?file=${this.sliceForm.path}&type=thumbnail`;
      this.outerVisible = true;
    },

    indexMethod(index) {
      return index + 1;
    },
    //新建分享
    createShare(row) {
      if (this.shareForm.id.length === 0) {
        this.$message.error('请至少选择一个用户');
      } else {
        if (this.shareForm.start_at === null) {
          this.shareForm.start_at = moment().format('YYYY-MM-DD HH:mm:ss')
        //   console.log(this.shareForm.start_at)
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
          this.sliceTable();
        } else {
          this.$message.error(body?.ret_msg || '分享失败');
        }
      })
    },
    shareAgain(data) {
      this.shareDialog = 1;
      this.innerVisible1 = true;
      this.reshareData = data
    //   console.log(data)
    },
    stopAllShare(data) {
      this.shareDialog = 0
      this.innerVisible0 = true;
      this.unshareData = data
    //   console.log(data)

    },
    stopShare(data) {
    //   console.log(data)
      this.shareDialog = 2
      this.innerVisible2 = true;
      this.unshareData = data
      this.reName = data.user.nickname
    },
    reShare() {
      //   this.shareForm.user_id = this.reshareData.user_id
    //   console.log(this.shareForm)
      if (this.shareForm.start_at === null) {
        this.shareForm.start_at = moment().format('YYYY-MM-DD HH:mm:ss')
        // console.log(this.shareForm.start_at)
      }
      this.shareForm.status = 1
      const params = {
        slice_id: this.reshareData.id,
        user_id: this.shareForm.user_id,
        start_at: this.shareForm.start_at,
        end_at: this.shareForm.end_at
      }
    //   console.log(params)
      sliceService.sliceShare(params).then(({ body }) => {
        if (body?.ret_code === 0) {
          this.outerVisible = false;
          this.$message.success('重新分享成功');
          this.sliceTable();
        } else {
          this.$message.error(body?.ret_msg || '分享失败');
        }
      })
      this.innerVisible1 = false;

    },
    unshare() {
    //   console.log(this.unshareData)
      const params = {
        slice_id: this.unshareData.slice_id,
        user_id: this.unshareData.user_id
      }
    //   console.log(params)
      sliceService.sliceUnShare(params).then(({ body }) => {
        if (body?.ret_code === 0) {
          this.outerVisible = false;
          this.sliceTable();
        } else {
          this.$message.error(body?.ret_msg || '分享失败');
        }
      })
      this.$message.success('已成功取消该分享！');
      this.innerVisible2 = false;
      this.shareList();
    },
    unshareAll() {
      const ID = ((this.unshareData.share).map((item) => ({
        ...item
      })) || []).map((item) => (
        item.user_id
      ))
    //   console.log(ID)
      const params = {
        slice_id: this.unshareData.id,
        user_id: ID,
        all: 1
      }
    //   console.log(params)
      sliceService.sliceUnShare(params).then(({ body }) => {
        if (body?.ret_code === 0) {
          this.outerVisible = false;
          this.sliceTable();
        } else {
          this.$message.error(body?.ret_msg || '分享失败');
        }
      })
      this.$message.success('已成功取消该分享！');
      this.innerVisible0 = false;
      this.shareList();
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
    margin: 5px 0;

    & + .el-button {
      margin-left: 0;
    }
  }
}
</style>
