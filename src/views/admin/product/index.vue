<template>
    <d2-container>
        <template slot="header">
            <br>
            <el-form
                    :inline="true"
                    size="mini"
                    style="margin-bottom: -18px;">
                <el-form-item label="商品规格名称" prop="name">
                    <el-input v-model="listQuery.name"> </el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="listQuery.status" filterable placeholder="请选择" clearable>
                        <el-option label="有效" value=1></el-option>
                        <el-option label="无效" value=0></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="default" icon="el-icon-search" @click="handleFilter" >搜 索</el-button>
                </el-form-item>

                <el-form-item style="float: right">
                    <el-button style="float: right" @click="addRow" type="primary" icon="el-icon-plus" >新 增</el-button>
                </el-form-item>
            </el-form>
        </template>
        <d2-crud
                ref="d2Crud"
                :form-options="formoptions"
                :columns="columns"
                :data="data"
                :rowHandle="rowHandle"
                :edit-template="editTemplate"
                :loading="loading"
                add-title="新增规格"
                @dialog-open="handleDialogOpen"
                @dialog-cancel="handleDialogCancel"
                @row-add="handleRowAdd"
                @row-edit="handleRowEdit"
                :add-template="addTemplate"
        >
        </d2-crud>
        <!-- footer 分页条 -->
        <template slot="footer">
            <el-pagination
                    background
                    @size-change="paginationSizeChange"
                    @current-change="paginationCurrentChange"
                    :current-page.sync="pagination.currentPage"
                    :page-sizes="pagination.pageSizes"
                    :page-size="pagination.pageSize"
                    :layout="pagination.layout"
                    :total="pagination.total"
                    style="margin: -10px;">
            </el-pagination>
        </template>
    </d2-container>
</template>

<script>
import { list, update, add } from '@/api/goosspecdict.js'
import dayjs from 'dayjs'

import MyTag from '../../../pages/mytag/mytag'
export default {
  name: 'index',
  components: {
    MyTag
  },
  data () {
    return {
      listQuery: {
        status: undefined
      },
      columns: [
        {
          title: 'id',
          key: 'id'
        },
        {
          title: '商品规格名称',
          key: 'name'
        },
        {
          title: '排序',
          key: 'sortOrder'
        },
        {
          title: '创建时间',
          key: 'createTime',
          formatter (row, column, cellValue, index) {
            return dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss')
          }

        },
        {
          title: '更新时间',
          key: 'updateTime',
          showOverflowTooltip: true,
          formatter (row, column, cellValue, index) {
            return dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss')
          }
        },
        {
          title: '状态',
          key: 'status',
          showOverflowTooltip: true,
          component: {
            name: MyTag
          }
        },
        {
          title: '备注',
          key: 'remark'
        }

      ],
      formOptions: {
        labelWidth: '80px',
        labelPosition: 'left',
        saveLoading: false
      },
      editTemplate: {
        name: {
          title: '规格名称',
          value: ''
        },
        sortOrder: {
          title: '排序',
          value: ''
        },
        remark: {
          title: '备注',
          value: ''
        },
        status: {
          title: '有效',
          value: '',
          component: {
            span: 30,
            name: 'el-select',
            options: [
              {
                value: 1,
                label: '有效'
              },
              {
                value: 0,
                label: '无效'
              }
            ]
          }
        }
      },
      addTemplate: {
        name: {
          title: '规格名称',
          value: ''
        },
        sortOrder: {
          title: '排序',
          value: 1
        },
        status: {
          title: '有效',
          value: 1,
          component: {
            span: 30,
            name: 'el-select',
            options: [
              {
                value: 1,
                label: '有效'
              },
              {
                value: 0,
                label: '无效'
              }
            ]
          }
        },
        remark: {
          title: '备注',
          value: ''
        }
      },
      data: [],
      formoptions: {
        labelWidth: '80px',
        labelPosition: 'left',
        saveLoading: false
      },
      loading: false,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        layout: 'total, sizes, prev, pager, next, jumper',
        pageSizes: [10, 20, 30, 40, 50, 100]
      },
      dialogFormVisible: false,
      rowHandle: {
        columnHeader: '操作',
        edit: {
          icon: 'el-icon-edit',
          text: '编辑',
          size: 'small',
          show (index, row) {
            if (row.showEditButton) {
              return true
            }
            return true
          },
          disabled (index, row) {
            if (row.forbidEdit) {
              return true
            }
            return false
          }
        }
      }

    }
  },
  mounted () {
    console.log(this.$refs.d2Crud.d2Data)
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.loading = true
      list({
        size: this.pagination.pageSize,
        current: this.pagination.currentPage,
        status: this.listQuery.status,
        name: this.listQuery.name
      }).then(respone => {
        this.loading = false
        this.data = respone.data.records
        this.pagination.total = respone.data.total
        console.log(respone.data.records)
      }).catch(err => {
        this.loading = false
        console.error(err)
      })
    },
    paginationCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.getList()
    },
    paginationSizeChange (pageSize) {
      console.log(pageSize)
      this.pagination.pageSize = pageSize
      this.getList()
    },
    handleFilter () {
      this.getList()
    },
    // 普通的新增
    addRow () {
      this.$refs.d2Crud.showDialog({
        mode: 'add'
      })
    },
    handleDialogOpen ({ mode }) {
      this.$message({
        message: '打开模态框，模式为：' + mode,
        type: 'success'
      })
    },
    handleDialogCancel (done) {
      this.$message({
        message: '取消保存',
        type: 'warning'
      })
      done()
    },
    handleRowAdd (row, done) {
      this.formOptions.saveLoading = true
      setTimeout(() => {
        console.log(row)
        add(row).then(resp => {
          console.log(resp)
          done({
            id: resp.data.id
          })
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        })
        // done可以传入一个对象来修改提交的某个字段

        this.formOptions.saveLoading = false
      }, 300)
    },
    handleRowEdit ({ index, row }, done) {
      this.formOptions.saveLoading = true
      setTimeout(() => {
        console.log(index)
        console.log(row)
        update(row).then(resp => {
          console.log(resp)
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
        })

        // done可以传入一个对象来修改提交的某个字段
        done({
          // address: '我是通过done事件传入的数据！'
        })
        this.formOptions.saveLoading = false
      }, 300)
    }
  }
}

</script>

<style scoped>

</style>
