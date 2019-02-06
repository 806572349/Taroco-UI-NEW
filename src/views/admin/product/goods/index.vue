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
                    <el-button style="float: right" @click="handleCustomEvent" type="primary" icon="el-icon-plus">新 增
                    </el-button>
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
        <el-dialog title="编辑商品" :visible.sync="dialogTableVisible" @close="formdialogclose">
            <el-form ref="goodsform" :model="goodsform" label-width="100px" :label-position="labelPosition">
                <el-form-item label="商品名称:">
                    <el-col :span="11">
                        <el-input v-model="goodsform.goodsName"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="商品描述:">
                    <el-input type="textarea" v-model="goodsform.goodsDesc"></el-input>
                </el-form-item>
                <el-form-item label="商品吊牌价:">
                    <el-col :span="11">
                        <el-input v-model="goodsform.displayPrice"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="商品销售价:">
                    <el-col :span="11">
                        <el-input v-model="goodsform.actualPrice"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="商品单位:">
                    <el-col :span='11'>
                        <el-input v-model="goodsform.goodsUnit"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="状态:">
                    <el-radio-group v-model="goodsform.status" @change="statusChange" size="medium">
                        <el-radio border :label="1">上架</el-radio>
                        <el-radio border :label="0">下架</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否多规格:">
                    <el-radio-group v-model="goodsform.isSku" @change="isSkuChange" size="medium">
                        <el-radio border :label="0">默认</el-radio>
                        <el-radio border :label="1">多规格</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="商品主图:">
                    <el-upload
                            class="avatar-uploader"
                            action="https://jsonplaceholder.typicode.com/posts/"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="goodsform.primaryPicUrl" :src="goodsform.primaryPicUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="商品内容:">
                    <d2-ueditor v-model="goodsform.goodsContent"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="createGoods">立即创建</el-button>
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
      labelPosition: 'right',
      dialogTableVisible: false,
      goodsform: {
        id: undefined,
        goodsName: undefined,
        goodsDesc: undefined,
        displayPrice: undefined,
        actualPrice: undefined,
        primaryPicUrl: undefined,
        goodsUnit: undefined,
        status: 1,
        isSku: 0,
        goodsContent: ''
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
    /* 创建商品 */
    createGoods () {
      console.log(this.goodsform)
    },
    statusChange (label) {
      console.log('statusChange', label)
    },
    isSkuChange (label) {
      console.log('isSkuChange', label)
    },
    formdialogclose () {
      console.log('formdialogclose关闭')
    },
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
    handleAvatarSuccess (res, file) {
      this.from.primaryPicUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    handleCustomEvent ({index, row}) {
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
    handleDialogOpen (row) {
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
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
