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
        <!--        <el-tooltip content="彻底删除" style="margin-left: 10px">-->
        <!--          <el-button-->
        <!--            plain-->
        <!--            size="small"-->
        <!--            type="warning"-->
        <!--            icon="el-icon-delete"-->
        <!--            @click="multipleDelete"-->
        <!--          />-->
        <!--        </el-tooltip>-->
        <!--        <el-tooltip v-if="multipleSelection.length!==0" content="取消选择">-->
        <!--          <el-button-->
        <!--            plain-->
        <!--            size="small"-->
        <!--            icon="el-icon-document-checked"-->
        <!--            @click="unSelectAll"-->
        <!--          />-->
        <!--        </el-tooltip>-->
      </el-col>
      <!--搜索-->
      <el-col :span="4" style="min-width: 250px">
        <el-input
          v-model="pageDTO.keyWords"
          size="small"
          placeholder="查找图书..."
          clearable
          @keyup.enter.native="fetchData"
          @clear="fetchData"
        >
          <template #append>
            <el-button icon="el-icon-search" @click="fetchData"/>
          </template>
        </el-input>
      </el-col>
    </el-row>

    <!--表格区域-->
    <el-table
      ref="handSelect_multipleTable"
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在加载图书列表..."
      highlight-current-row
      height="565"
      max-height="600"
      :cell-style="{padding:'9px 0 9px 0'}"
      row-key="id"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" label="选择" :reserve-selection="true"/>
      <el-table-column label="编号" width="85" prop="id" sortable="custom" align="center">
        <template v-slot="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="书名" width="220" :show-overflow-tooltip="true">
        <template v-slot="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="作者" width="160" :show-overflow-tooltip="true">
        <template v-slot="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出版社" :show-overflow-tooltip="true">
        <template v-slot="scope">
          {{ scope.row.publisher }}
        </template>
      </el-table-column>
      <el-table-column label="译者" width="120" :show-overflow-tooltip="true">
        <template v-slot="scope">
          {{ scope.row.translator }}
        </template>
      </el-table-column>
      <el-table-column label="出版日期" align="center" width="110">
        <template v-slot="scope">
          <i v-if="scope.row.publish_date!=null" class="el-icon-time"/>
          <span> {{ scope.row.publishDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="页数" width="90" sortable prop="pages" align="center">
        <template v-slot="scope">
          {{ scope.row.pages }}
        </template>
      </el-table-column>
      <el-table-column label="售价" width="90" sortable prop="price" align="center">
        <template v-slot="scope">
          <i v-if="scope.row.price!=null">￥</i>
          {{ scope.row.price }}
        </template>
      </el-table-column>
      <!--行操作-->
      <el-table-column label="操作" width="190" sortable prop="options" align="center">
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
          <el-button title="回收" icon="el-icon-delete" circle type="danger" plain size="small"
                     @click="handleDelete(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next"
      :current-page="pageDTO.currentPage"
      :page-size="pageDTO.pageSize"
      :page-sizes="[10, 20, 50, 100, 200, 500, 1000, 2000]"
      :total="bookTotal"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <div class="app-container-footer"/>
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
        <i class="el-icon-upload"/>
        <div class="el-upload__text">将.xlsx文件拖到此处，或 <em>点击选择文件</em></div>
        <div slot="tip" class="el-upload__tip">只能上传.xlsx文件，限制1个，大小不超过2MB</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="importFormVisible = false">取消</el-button>
        <el-button type="success" plain @click="submitUpload">上传</el-button>
      </div>
    </el-dialog>

    <!-- 图书信息新增和编辑-->
    <el-dialog :visible.sync="bookFormVisible" :title="dialogTitle" top="45px" :before-close="handleBeforeClick">
      <el-form :ref="bookForm" :model="bookForm" style="height: 55vh;  overflow-x: hidden;">
        <el-tabs value="basicInfo">
          <el-tab-pane label="基本信息" name="basicInfo">
            <el-form-item label="书名" label-width="80px">
              <el-input v-model="bookForm.name"/>
            </el-form-item>
            <el-form-item label="作者" label-width="80px">
              <el-input v-model="bookForm.author"/>
            </el-form-item>
            <el-form-item label="出版日期" label-width="80px">
              <el-date-picker
                v-model="bookForm.publishDate"
                type="date"
                placeholder="请选择出版日期"
              />
            </el-form-item>
            <el-form-item label="出版社" label-width="80px">
              <el-input v-model="bookForm.publisher" autocomplete="off"/>
            </el-form-item>
            <el-form-item label="译者" label-width="80px">
              <el-input v-model="bookForm.translator" autocomplete="off"/>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="关于作者" name="aboutAuthor">
            <el-form-item label="关于作者" label-width="80px">
              <el-input
                v-model="bookForm.authorInfo"
                type="textarea"
                :autosize="{ minRows: 10, maxRows: 15 }"
              />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="图书简介" name="briefIntroduction">
            <el-form-item label="图书简介" label-width="80px">
              <el-input
                v-model="bookForm.summary"
                type="textarea"
                :autosize="{ minRows: 10, maxRows: 15 }"
              />
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="bookFormVisible = false">取消</el-button>
          <el-button type="primary" @click="saveBook">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { listBook, updateOrSave, deleteBook } from '@/api/book'

export default {
  name: 'Index',
  data() {
    return {
      list: [],
      multipleSelection: [],
      bookFormVisible: false,
      importFormVisible: false,
      showRecycling: window.sessionStorage.getItem('show_recycle') || false,
      listLoading: true,
      pageDTO: JSON.parse(window.sessionStorage.getItem('pagination_params')) || {
        currentPage: 1,
        pageSize: 10,
        keyWords: '',
        deleted: 0,
        orderIsAsc: false, // 是否正序
        orderColumns: ['id']
      },
      params: {
        id: ''
      },
      bookForm: {
        id: '',
        name: '',
        author: '',
        publishDate: '',
        publisher: '',
        pages: '',
        isbn: '',
        price: '',
        cover: '',
        translator: '',
        summary: '',
        authorInfo: '',
        deleted: 0
      },
      uploadHeaders: {
        'X-Token': this.$store.getters.token
      },
      dialogTitle: '',
      bookTotal: 0,
      hasBookID: ''
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
      listBook(this.pageDTO).then(response => {
        this.list = response.data.records
        this.pageDTO.currentPage = response.data.current
        this.pageDTO.pageSize = response.data.size
        this.bookTotal = response.data.total
        this.listLoading = false
      })
    },

    // 新增及更新书籍
    saveBook() {
      this.listLoading = true
      updateOrSave(this.bookForm).then(response => {
        if (response.data === true) {
          const title = response.message
          this.$notify({
            title: title,
            message: this.bookForm.name + ' 的信息已经存到云端',
            type: 'success',
            duration: 2500,
            position: 'top-left'
          })
        }
        this.fetchData()
        this.bookFormVisible = false
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
      console.log('点击了确认上传按钮')
      console.log(this.uploadHeaders)
      this.$refs.uploadFile.submit()
    },
    // 导入按钮打开dialog
    handleImport() {
      console.log('点击了导入按钮')
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
    // 回收站显示与否
    showRecyclingSwitch() {
      this.pageDTO.delFlg = this.showRecycling ? 1 : 0
      this.pageDTO.currentPage = 1
      window.sessionStorage.setItem('show_recycle', this.showRecycling)
      window.sessionStorage.setItem('pagination_params', JSON.stringify(this.pageDTO))
      this.fetchData()
      const sta = this.pageDTO.delFlg ? '草稿' : '发布'
      this.$message({
        message: '当前显示的是已标记为' + sta + '的条目',
        duration: 1000,
        showClose: true
      })
    },
    // 添加
    handleAdd() {
      this.hasBookID = ''
      this.dialogTitle = '新增图书'
      this.bookForm = {} // 清空缓冲区
      this.bookFormVisible = true
    },
    // 编辑
    handleEdit(row) {
      this.hasBookID = row.id
      this.dialogTitle = '修改图书信息'
      this.bookForm = JSON.parse(JSON.stringify(row))
      this.bookFormVisible = true
    },

    // 清空已选择项目
    unSelectAll() {
      console.log('清空选项')
      this.multipleSelection = []
      this.$refs.handSelect_multipleTable.clearSelection()
    },

    // 点击复选框触发，复选框样式的改变
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(this.multipleSelection) // 打印选中的行集合
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
    // 逻辑删除书籍信息
    handleDelete(row) {
      this.listLoading = true
      this.params.id = row.id
      console.log(this.params)
      deleteBook(this.params).then(res => {
        const msg = res.data ? '》成功！' : '》失败！'
        this.$message({
          message: '删除《' + row.name + msg,
          duration: 1000,
          type: res.data ? 'success' : 'warning',
          showClose: true
        })
        this.fetchData()
      })
    }

    // // 彻底删除多个已选项
    // multipleDelete() {
    //   const arr = this.getSelectedId()
    //   if (arr != null) {
    //     this.$confirm('确定删除 ' + arr.length + ' 项吗？该操作不可撤销！', {
    //       confirmButtonText: '确定',
    //       type: 'warning',
    //       callback: action => {
    //         if (action === 'confirm') {
    //           deleteBatchBooks(arr.toString()).then(res => {
    //             this.$notify({
    //               title: '操作成功',
    //               message: res.data,
    //               type: 'success'
    //             })
    //             this.unSelectAll()
    //             this.fetchData()
    //           })
    //         }
    //       }
    //     })
    //   } else {
    //     this.$message({
    //       message: '没有选定任何项目，删除失败。'
    //     })
    //   }
    // }
  }
}
</script>
