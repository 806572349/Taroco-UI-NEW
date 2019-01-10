<template>
    <d2-container>
        <template slot="header">
            <br>
            <el-form
                    :inline="true"
                    size="mini"
                    style="margin-bottom: -18px;">
                <el-form-item label="商品名称" prop="goodsName">
                    <el-input v-model="listQuery.goodsName"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="listQuery.status" filterable placeholder="请选择" clearable>
                        <el-option label="有效" value=1></el-option>
                        <el-option label="无效" value=0></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="default" icon="el-icon-search" @click="handleFilter">搜 索</el-button>
                </el-form-item>

                <el-form-item style="float: right">
                    <el-button style="float: right" @click="handleCustomEvent" type="primary" icon="el-icon-plus">新 增</el-button>
                </el-form-item>
            </el-form>
        </template>
        <d2-crud
                ref="d2Crud"
                :form-options="formoptions"
                :columns="columns"
                :data="data"
                :rowHandle="rowHandle"
                :loading="loading"
                :options="options"
                @custom-emit-1="handleCustomEvent"
        >
        </d2-crud>

        <!--表单-->
        <el-dialog title="编辑商品" :visible.sync="dialogTableVisible">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="活动名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="活动区域">
                    <el-select v-model="form.region" placeholder="请选择活动区域">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="活动时间">
                    <el-col :span="11">
                        <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                        <el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="即时配送">
                    <el-switch v-model="form.delivery"></el-switch>
                </el-form-item>
                <el-form-item label="活动性质">
                    <el-checkbox-group v-model="form.type">
                        <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
                        <el-checkbox label="地推活动" name="type"></el-checkbox>
                        <el-checkbox label="线下主题活动" name="type"></el-checkbox>
                        <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="特殊资源">
                    <el-radio-group v-model="form.resource">
                        <el-radio label="线上品牌商赞助"></el-radio>
                        <el-radio label="线下场地免费"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="活动形式">
                    <el-input type="textarea" v-model="form.desc"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" >立即创建</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

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
import {list, update, add} from '@/api/goods.js'
import dayjs from 'dayjs'

import MyTag from '../../../../pages/mytag/mytag'

import images from '../../../../pages/mytag/image'

export default {
  name: 'index',
  components: {
    MyTag, images
  },
  data () {
    return {
      listQuery: {
        status: undefined,
        goodsName: undefined
      },
      dialogTableVisible: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      columns: [
        {
          title: '商品名称',
          key: 'goodsName',
          showOverflowTooltip: true,
          width: '180'
        },
        {
          title: '商品编码',
          key: 'goodsCode'
        },
        {
          title: '吊牌价',
          key: 'displayPrice',
          formatter (row, column, cellValue, index) {
            return cellValue + '元'
          }
        },
        {
          title: '销售价',
          key: 'actualPrice',
          formatter (row, column, cellValue, index) {
            return cellValue + '元'
          }
        },
        {
          title: '商品主图',
          key: 'primaryPicUrl',
          showOverflowTooltip: true,
          component: {
            name: images
          }
        },
        {
          title: '发布时间',
          key: 'updateTime',
          width: '180',
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
        }
      ],
      formOptions: {
        labelWidth: '80px',
        labelPosition: 'left',
        saveLoading: false
      },
      editTemplate: {
        goodsName: {
          title: '规格名称',
          value: ''
        },
        displayPrice: {
          title: '展示价格',
          value: ''
        },
        actualPrice: {
          title: '实际价格',
          value: 1
        },
        primaryPicUrl: {
          title: '商品主图',
          value: ''
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
      addTemplate: {
        goodsName: {
          title: '规格名称',
          value: ''
        },
        displayPrice: {
          title: '展示价格',
          value: ''
        },
        actualPrice: {
          title: '实际价格',
          value: 1
        },
        primaryPicUrl: {
          title: '商品主图',
          value: ''
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
      options: {
        border: false
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
        width: 300,
        custom: [
          {
            text: '编辑',
            type: 'success',
            size: 'small',
            emit: 'custom-emit-1'
          },
          {
            text: '规格编辑',
            type: 'warning',
            size: 'small',
            emit: 'custom-emit-1'
          }
        ]
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
        goodsName: this.listQuery.goodsName
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
    handleCustomEvent ({index, row}) {
      console.log(index)
      console.log(row)
      this.dialogTableVisible = true
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
    handleDialogOpen ({mode}) {
      // this.$message({
      //     message: '打开模态框，模式为：' + mode,
      //     type: 'success'
      // })
      this.dialogTableVisible = true
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
    handleRowEdit ({index, row}, done) {
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
