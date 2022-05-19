<template>
  <div class="main-container enter-main flex">
    <div class="enter-left flex column">
      <span>外部切片入库</span>
      <div style="margin-top:20px;">
        <el-button type="primary" @click="dialogVisible=true;visible=true">新增入库</el-button>
      </div>
      <div class="add-form flex column justify-content-center" v-show="visible">
        <!-- <el-dialog center title="" :visible.sync="dialogVisible" width="25%" :modal="false">
            <el-form :model="form1">
                <el-form-item style="margin-bottom: 12px;" label="入库切片库" :label-width="formLabelWidth">
                    <el-input v-model="form1.library"></el-input>
                </el-form-item>
                <el-form-item style="margin-bottom: 12px;" label="扫描人" :label-width="formLabelWidth">
                    <el-input v-model="form1.person"></el-input>
                </el-form-item>
                <el-form-item style="margin-bottom: 12px;" label="医院名称" :label-width="formLabelWidth">
                    <el-input v-model="form1.hospital"></el-input>
                </el-form-item>
                <el-form-item style="margin-bottom: 12px;" label="选择路径" :label-width="formLabelWidth">
                    <el-button size="small" type="primary">指定本地路径</el-button>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" @click="dialogVisible = false">完成创建</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </div>
        </el-dialog> -->
        <el-form :model="addForm" ref="addForm">
          <el-form-item style="margin-bottom: 12px;" label="入库切片库" :label-width="formLabelWidth">
            <el-select clearable v-model="addForm.slide_type_id" placeholder="请选择切片库">
              <el-option v-for="item in slices" :value="item" :key="item"></el-option>
            </el-select>
            <!-- <el-input v-model="addForm.slide_type_id"></el-input> -->
          </el-form-item>
          <el-form-item style="margin-bottom: 12px;" label="扫描人" :label-width="formLabelWidth">
            <el-input v-model="addForm.scan_username"></el-input>
          </el-form-item>
          <el-form-item style="margin-bottom: 12px;" label="医院名称" :label-width="formLabelWidth">
              <el-input v-model="addForm.hospital_name"></el-input>
          </el-form-item>
          <el-form-item style="margin-bottom: 12px;" label="扫描倍率" :label-width="formLabelWidth">
             <el-select clearable v-model="addForm.scale" placeholder="请选择扫描倍率">
               <el-option label="" value="20X"></el-option>
               <el-option label="" value="40X"></el-option>
             </el-select>
          </el-form-item>
          <el-form-item style="margin-bottom: 12px;" label="选择路径" :label-width="formLabelWidth">
              <el-input v-model="addForm.local_folder_path" type="file"></el-input>
              <!-- <el-button size="small" type="primary" @click="upload">指定本地路径</el-button> -->
          </el-form-item>
        </el-form>
        <div class="flex justify-content-center" style="margin:20px 0 10px;">
          <el-button type="primary" @click="onSubmit">完成创建</el-button>
          <el-button @click="dialogVisible=false;visible=false">取 消</el-button>
        </div>
      </div>
    </div>
    <div class="enter-right flex column">
      <span>入库历史记录</span>
      <div>
        <el-form inline size="mini" ref="searchForm" :model="searchForm" label-width="80px">
          <el-form-item label="">
            <el-date-picker editable v-model="searchForm.date" type="date" placeholder="请选择入库时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.person" placeholder="请选择入库人">
              <el-option v-for="person in enter_person" :key="person" label="label" :value="person"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="common-table" style="padding:0;margin-top:10px;position: relative;">
        <el-table :data="data" style="width:100%;">
          <el-table-column align="center" prop="time" label="入库时间" width="width" fixed> </el-table-column>
          <el-table-column align="center" prop="library" label="入库切片库" width="width"> </el-table-column>
          <el-table-column align="center" prop="enter_person" label="入库人" width="width"> </el-table-column>
          <el-table-column align="center" prop="enter_number" label="入库切片数量" width="width"> </el-table-column>
          <el-table-column align="center" prop="succeed_number" label="已成功数量" width="width"> </el-table-column>
          <el-table-column align="center" prop="hospital" label="医院名称" width="width"> </el-table-column>
          <el-table-column align="center" prop="scanner" label="扫描人" width="width"> </el-table-column>
          <el-table-column align="center" prop="status" label="执行状态" width="width">
            
          </el-table-column>
          <el-table-column align="center" prop="operation" label="操作" width="width" fixed="right">
            <template slot-scope="scope">
              <el-button @click="handleView($index, scope.row)" type="text" size="mini">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- <div class="slicePage" style="position: absolute;bottom: 10px; width:100%;
        display: flex;justify-content:center ;height: 30px;align-items:flex-start">
          <el-pagination  @current-change="handleCurrentChange" :current-page.sync="pagination.current_page" :page-size="pagination.per_page" layout="total ,prev, pager, next, jumper" :total="pagination.count">
          </el-pagination>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { fileService } from '@/page/manage/file/file.service';
export default {
  data() {
    return {
      data: [],
      slices: [],
      addForm: {
        slide_type_id: '',
        scan_username: '',
        hospital_name: '',
        scale: '',
        local_folder_path: '',
        // arr_file_path: [''],
      },
      searchForm: {
        date: '',
        person: '',
      },
      visible: true,
      dialogVisible: false,
      formLabelWidth: '100px',
      enter_person: [],
      enter_number: '',
      succeed_number: '',
      scanner: '',
      status: '',
      operation: '',
      pagination: {
        current: 1,
        pageSize: 15,
        showTotal: total => `共 ${total} 条`,
        total: 0,
      },
    };
  },
  created() {
    fileService.taskList()
  },
  methods: {
    handleView(el) {
      console.log(el);
    },
    handleCurrentChange() {
    },
    upload() {
      document.getElementById('open').click()
    },
    onSubmit() {
      let params = {
        ...this.addForm
      }
      console.log(params);
      fileService.uploadTask(params).then((res)=>{
        console.log(res);
      })
    }
  }
};
</script>

<style lang="scss">
.enter-main {
  padding: 12px;
  background: #fff;
  height: calc(100% - 30px);
  span {
    margin-bottom: 20px;
  }
  .enter-left {
    padding: 20px;
    margin-right: 15px;
    width: 20%;
    border: 1px solid #ebeef5;
    border-radius: 6px;
    .add-form {
      margin-top:30px;
      border:1px solid #ebeef5;
      padding:12px
    }
  }
  .enter-right {
    padding: 20px;
    width: 80%;
    flex: 1;
    border-radius: 6px;
    border: 1px solid #ebeef5;
  }
}
</style>
