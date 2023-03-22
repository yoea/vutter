<template>
  <div class="app-container">
    <el-row type="flex" justify="space-between">
      <!--操作按钮-->
      <el-col :span="5" style="min-width: 260px;margin-right: 10px">
        <el-tooltip content="新增">
          <el-button
            plain
            size="small"
            type="success"
            icon="el-icon-plus"
            @click="handleAdd"
          />
        </el-tooltip>
        <!--        <el-tooltip content="导入" style="margin-left: 10px">-->
        <!--          <el-button plain size="small" type="info" icon="el-icon-upload2" @click="handleImport" />-->
        <!--        </el-tooltip>-->
        <!--        <el-dropdown trigger="click" style="margin-left: 10px" @command="handleExportCommand">-->
        <!--          <el-button plain size="small" type="primary" icon="el-icon-download" />-->
        <!--          <el-dropdown-menu v-slot="dropdown">-->
        <!--            <el-dropdown-item disabled>导出选项</el-dropdown-item>-->
        <!--            <el-dropdown-item command="selected" divided>导出所选</el-dropdown-item>-->
        <!--            <el-dropdown-item command="currentPage">导出本页</el-dropdown-item>-->
        <!--            <el-dropdown-item command="all">导出全部</el-dropdown-item>-->
        <!--            <el-dropdown-item command="advance" divided>高级导出</el-dropdown-item>-->
        <!--          </el-dropdown-menu>-->
        <!--        </el-dropdown>-->
        <el-tooltip content="批量删除" style="margin-left: 10px">
          <el-button
            plain
            size="small"
            type="warning"
            icon="el-icon-delete"
            @click="multipleDelete"
          />
        </el-tooltip>
        <el-tooltip v-if="multipleSelection.length!==0" content="取消选择">
          <el-button
            plain
            size="small"
            icon="el-icon-document-checked"
            @click="unSelectAll"
          />
        </el-tooltip>
      </el-col>
      <!--搜索-->
      <el-col :span="4" style="min-width: 250px">
        <el-input
          v-model="pageDTO.keyWords"
          size="small"
          placeholder="搜索用户..."
          clearable
          @keyup.enter.native="fetchData"
          @clear="fetchData"
        >
          <template #append>
            <el-button icon="el-icon-search" @click="fetchData" />
          </template>
        </el-input>
      </el-col>
    </el-row>

    <!--表格区域-->
    <el-table
      class="el-table-list"
      ref="handSelect_multipleTable"
      v-loading="listLoading"
      :data="userList"
      element-loading-text="正在加载用户列表..."
      highlight-current-row
      height="590"
      :max-height="maxTableHeight"
      :cell-style="{padding:'5px 0 5px 0'}"
      row-key="id"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" label="选择" :reserve-selection="true" />
      <el-table-column label="编号" width="80" prop="id" sortable="custom" align="center">
        <template v-slot="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="头像" width="50" prop="avatar" align="center">
        <template v-slot:default="scope">
          <el-avatar :src="scope.row.avatar" @error="errorAvatarHandler">
            <img src="https://yoea.github.io/facer/images/logo.png"/>
          </el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="100" align="center" sortable="custom" :show-overflow-tooltip="true">
        <template v-slot="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="昵称" width="120" align="center" :show-overflow-tooltip="true">
        <template v-slot="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>
      <el-table-column label="密码" align="center" :show-overflow-tooltip="true">
        <template v-slot="scope">
          <span>{{ scope.row.password }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="150" align="center" sortable="custom" :show-overflow-tooltip="true">
        <template v-slot="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column label="注册时间" align="center" sortable="custom" width="210">
        <template v-slot="scope">
          <i v-if="scope.row.registered!=null" class="el-icon-time" />
          <span> {{ scope.row.registered }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" width="180" align="center">
        <template v-slot="scope">
          {{ scope.row.motto }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80" prop="userStatus" sortable="custom" :show-overflow-tooltip="true">
        <!--接口中返回数字类型的值转化在浏览器中转化为对应文字-->
        <template v-slot="scope">
          <el-tag :type="userStatusOptions[scope.row.userStatus].type">
            {{ userStatusOptions[scope.row.userStatus].label }}
          </el-tag>
        </template>
      </el-table-column>
      <!--行操作-->
      <el-table-column label="操作" width="190" align="center">
        <template v-slot="scope">
          <el-button
            type="info"
            plain
            size="small"
            title="查看"
            icon="el-icon-view"
            circle
          />
          <el-button
            title="编辑"
            type="primary"
            plain
            size="small"
            icon="el-icon-edit"
            circle
            @click="handleEdit(scope.row)"
          />
          <el-button
            title="删除"
            icon="el-icon-delete"
            circle
            type="danger"
            plain
            size="small"
            @click="handleDelete(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container" style="margin-top: 5px">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next"
        :current-page="pageDTO.currentPage"
        :page-size="pageDTO.pageSize"
        :page-sizes="[10, 20, 50, 100, 200, 500, 1000, 2000]"
        :total="userTotal"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!--通过excel导入-->
    <el-dialog title="通过 Excel 导入图书信息" :visible.sync="importFormVisible" width="400px">
      <el-upload
        ref="uploadFile"
        class="upload-demo"
        drag
        :limit="1"
        name="file"
        :headers="uploadHeaders"
        :before-upload="handleBeforeUpload"
        action="http://localhost:8081/files/upload"
        :auto-upload="false"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将.xlsx文件拖到此处，或 <em>点击选择文件</em></div>
        <div slot="tip" class="el-upload__tip">只能上传.xlsx文件，限制1个，大小不超过2MB</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="importFormVisible = false">取消</el-button>
        <el-button type="success" plain @click="submitUpload">上传</el-button>
      </div>
    </el-dialog>

    <!-- 用户信息新增和编辑-->
    <el-dialog :visible.sync="editFormVisible" :title="dialogTitle" top="45px" width="45%" :before-close="handleBeforeClick">
      <el-form :ref="userForm" :model="userForm" auto-complete="on" style="height: 55vh;overflow-x: hidden;">
        <el-tabs value="basicInfo">
          <el-tab-pane label="基本信息" name="basicInfo">
            <el-row>
              <el-col :span="11">
                <el-form-item label="编号" label-width="80px" style="margin-right: 10px">
                  <el-input v-model="userForm.id" :disabled="true" placeholder="系统自动生成" />
                </el-form-item>
                <div class="grid-content bg-purple-light" />
              </el-col>
              <el-col :span="12">
                <el-form-item label="注册时间" label-width="80px">
                  <el-date-picker
                    v-model="userForm.registered"
                    type="datetime"
                    placeholder="默认为当前时间"
                    :disabled="hasUserID"
                  />
                </el-form-item>
                <div class="grid-content bg-purple" />
              </el-col>
            </el-row>
            <el-form-item label="用户名" label-width="80px" style="margin-right: 50px">
              <el-input
                v-model="userForm.username"
                placeholder="用户名不小于6位"
                maxlength="36"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="邮箱" label-width="80px" style="margin-right: 50px">
              <el-input
                v-model="userForm.email"
                placeholder="如：example@ewing.com"
                maxlength="45"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="昵称" label-width="80px" style="margin-right: 50px">
              <el-input v-model="userForm.nickname" />
            </el-form-item>
            <el-form-item label="头像链接" label-width="80px" style="margin-right: 50px">
              <el-input
                v-model="userForm.avatar"
              />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="关于用户" name="aboutUser">
            <el-form-item label="个性描述" label-width="80px" style="margin-right: 50px">
              <el-input
                v-model="userForm.motto"
                type="textarea"
                maxlength="254"
                show-word-limit
                :autosize="{ minRows: 6, maxRows: 10 }"
              />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="高级设置" name="advancedSetting">
            <el-form-item label="删除用户" label-width="80px" >
              <el-switch
                v-model="userForm.deleted"
                active-text="删除"
                inactive-text="正常"
                active-color="#F56C6C"
              />
            </el-form-item>
            <el-form-item label="用户角色" label-width="80px">
              <el-select v-model="userForm.userStatus" clearable placeholder="请选择角色">
                <el-option
                  v-for="item in userStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="登录密码" label-width="80px" style="margin-right: 50px">
              <el-input v-model="userForm.password" placeholder="可输入密码或由系统自动生成" show-password />
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click="saveBook">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { listUser, updateOrSave, deleteUser, deleteBatchByIds } from '@/api/user'

export default {
  name: 'Index',
  data() {
    return {
      userList: [],
      multipleSelection: [],
      editFormVisible: false,
      importFormVisible: false,
      listLoading: true,
      pageDTO: JSON.parse(window.sessionStorage.getItem('pagination_params')) || {
        currentPage: 1,
        pageSize: 10,
        keyWords: '',
        deleted: 0,
        orderIsAsc: true, // 是否正序
        orderColumns: ['id']
      },
      params: {
        id: ''
      },
      userForm: {
        id: '',
        username: '',
        password: '',
        email: '',
        registered: '',
        avatar: '',
        motto: '',
        userStatus: 0,
        deleted: 0
      },
      uploadHeaders: {
        'X-Token': this.$store.getters.token
      },
      maxTableHeight: 585,
      dialogTitle: '',
      userTotal: 0,
      hasUserID: false,
      userStatusOptions: [{
        value: 0,
        label: '普通用户',
        type: 'info'
      }, {
        value: 1,
        label: '编辑者',
        type: 'default'
      }, {
        value: 2,
        label: '会员',
        type: 'danger'
      }, {
        value: 3,
        label: '超级会员',
        type: 'warning'
      }, {
        value: 4,
        label: '管理员',
        type: 'success'
      }]
    }
  },
  created() {
    this.fetchData()
  },

  methods: {
    handleBeforeClick(done) {
      this.$confirm('您所作的更改将全部丢失，确认关闭吗？', '内容尚未保存')
        .then(_ => {
          done()
        })
        .catch(_ => {
        })
    },
    fetchData() {
      this.listLoading = true
      listUser(this.pageDTO).then(response => {
        this.userList = response.data.records
        this.pageDTO.currentPage = response.data.current
        this.pageDTO.pageSize = response.data.size
        this.userTotal = response.data.total
        this.listLoading = false
        // window.innerHeight 浏览器窗口的可见高度，减掉的是除了table最大高度的剩余空间
        this.maxTableHeight = window.innerHeight - 145
      })
    },

    // 新增及更新
    saveBook() {
      this.listLoading = true
      if (this.userForm.deleted) {
        this.params.id = this.userForm.id
        deleteUser(this.params)
      }
      updateOrSave(this.userForm).then(response => {
        if (response.data === true) {
          const title = response.message
          this.$notify({
            title: title,
            message: this.userForm.username + ' 的信息已经存到云端',
            type: 'success',
            duration: 2500,
            position: 'top-left'
          })
        }
        this.fetchData()
        this.editFormVisible = false
      }).catch(() => {
        this.fetchData()
      })
    },
    // 上传前判断
    handleBeforeUpload(file) {
      const uploadLimit = 2
      const uploadTypes = ['xlsx']
      const filetype = file.name.replace(/.+\./, '')
      const isRightSize = (file.size || 0) / 1024 / 1024 < uploadLimit
      if (!isRightSize) {
        this.$message.error('文件大小超过 ' + uploadLimit + 'MB')
        return false
      }
      if (uploadTypes.indexOf(filetype.toLowerCase()) === -1) {
        this.$message.warning({
          message: '请上传后缀名为.xlsx的表格文件'
        })
        return false
      }
      return true
    },
    // 确认上传
    submitUpload() {
      console.log(this.uploadHeaders)
      this.$refs.uploadFile.submit()
    },
    // 导入按钮打开dialog
    handleImport() {
      this.importFormVisible = true
    },
    // 导出菜单
    // handleExportCommand(command) {
    //   if (command === 'advance') {
    //     this.$message({ // todo：自定义导出、高级导出
    //       message: 'click on item ' + command,
    //       type: 'success'
    //     })
    //   } else if (command === 'selected') { // 导出所选项目
    //     const arr = this.getSelectedId()
    //     if (arr != null) {
    //       this.$message({
    //         message: '即将导出 ' + arr.length + ' 条数据',
    //         type: 'success'
    //       })
    //       exportByIds(arr.toString()).then(res => {
    //         const fileName = '共' + arr.length + '行_' + decodeURI(res.headers['content-disposition']).split('filename=')[1]
    //         const blob = new Blob([res.data], { type: res.headers['content-type'] })
    //         const dom = document.createElement('a')
    //         const url = window.URL.createObjectURL(blob)
    //         dom.href = url
    //         dom.download = decodeURI(fileName)
    //         dom.style.display = 'none'
    //         document.body.appendChild(dom)
    //         dom.click()
    //         dom.parentNode.removeChild(dom)
    //         window.URL.revokeObjectURL(url)
    //         console.log('导出成功')
    //         this.unSelectAll()
    //       }).catch(err => {
    //         console.log('导出过程中产生一些错误' + err)
    //       })
    //     } else {
    //       this.$message({
    //         message: '未选择任何选项，无法导出！',
    //         type: 'error'
    //       })
    //     }
    //   } else if (command === 'currentPage') { // todo：导出当前页
    //     this.$message({
    //       message: 'click on item ' + command,
    //       type: 'info'
    //     })
    //   } else if (command === 'all') { // todo：导出全部
    //     this.$message({
    //       message: '导出所有数据时间可能稍久，请耐心等待，不要刷新页面...',
    //       type: 'warning'
    //     })
    //   } else {
    //   }
    // },
    // 分页之页容量变化
    handleSizeChange(newSize) {
      this.pageDTO.pageSize = newSize
      window.sessionStorage.setItem('pagination_params', JSON.stringify(this.pageDTO))
      this.fetchData()
    },
    // 分页之页码变化
    handleCurrentChange(newPage) {
      this.pageDTO.currentPage = newPage
      window.sessionStorage.setItem('pagination_params', JSON.stringify(this.pageDTO))
      this.fetchData()
    },
    // 排序规则变化
    handleSortChange(column) {
      this.pageDTO.currentPage = 1
      window.sessionStorage.setItem('pagination_params', JSON.stringify(this.pageDTO))
      console.log(column)
      if (column.prop === 'id') {
        if (column.order === 'ascending') {
          this.pageDTO.orderIsAsc = true
        } else if (column.order === 'descending') {
          this.pageDTO.orderIsAsc = false
        } else { // null
          this.pageDTO.orderIsAsc = false
        }
        window.sessionStorage.setItem('pagination_params', JSON.stringify(this.pageDTO))
        this.fetchData()
      }
    },

    // 添加
    handleAdd() {
      this.hasUserID = false
      this.dialogTitle = '新增用户'
      this.userForm = {} // 清空缓冲区
      this.editFormVisible = true
    },
    // 编辑
    handleEdit(row) {
      this.hasUserID = true
      this.dialogTitle = '修改信息'
      this.userForm = JSON.parse(JSON.stringify(row))
      this.editFormVisible = true
    },

    // 清空已选择项目
    unSelectAll() {
      this.multipleSelection = []
      this.$refs.handSelect_multipleTable.clearSelection()
    },

    // 点击复选框触发，复选框样式的改变
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 获取已选择的数据的ID
    getSelectedId() {
      const checkArr = []
      // 遍历点击选择的对象集合，拿到每一个对象的id添加到新的集合中
      this.multipleSelection.forEach(row => checkArr.push(row.id))
      if (checkArr.length !== 0) {
        return checkArr
      } else {
        return null
      }
    },
    // 删除单个
    handleDelete(row) {
      this.$confirm('此操作将彻底删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        this.params.id = row.id
        console.log(this.params)
        deleteUser(this.params).then(res => {
          const msg = res.data ? '成功！' : '失败！'
          this.$message({
            message: '删除' + msg,
            duration: 1000,
            type: res.data ? 'success' : 'warning',
            showClose: true
          })
          this.fetchData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
          duration: 1000
        })
      })
    },
    // 头像加载失败时候触发
    errorAvatarHandler() {
      return true
    },

    // 处理按钮点击后不失去焦点的问题
    clickHandler(evt) {
      let target = evt.target
      if (target.nodeName === 'SPAN') {
        target = evt.target.parentNode
      }
      target.blur()
    },

    // 批量删除多个已选项
    multipleDelete(e) {
      const arr = this.getSelectedId()
      this.clickHandler(e)
      if (arr != null) {
        this.$confirm('确定删除 ' + arr.length + ' 项吗？', {
          confirmButtonText: '确定',
          type: 'warning',
          callback: action => {
            if (action === 'confirm') {
              deleteBatchByIds(arr.toString()).then(res => {
                this.$notify({
                  title: '操作成功',
                  message: '此次共删除 ' + res.data + ' 条数据',
                  type: 'success'
                })
                this.unSelectAll()
                this.fetchData()
              })
            }
          }
        })
      } else {
        this.$message({
          message: '没有选定任何项目，删除失败。'
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
