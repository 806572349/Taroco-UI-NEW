<template>
    <d2-container>
        <template slot="header">
            <br>
            <el-form
                    :inline="true"
                    size="mini"
                    style="margin-bottom: -18px;">
                <el-form-item label="商品规格名称" prop="type">
                    <el-input> </el-input>
                </el-form-item>
                <el-form-item label="状态" prop="type">
                    <el-select  filterable placeholder="请选择" clearable>
                        <el-option label="有效" value="1"></el-option>
                        <el-option label="无效" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="default" icon="el-icon-search" @click="handleFilter" >搜 索</el-button>
                </el-form-item>

                <el-form-item style="float: right">
                    <el-button style="float: right" @click="handleCreate" type="primary" icon="el-icon-plus" >新 增</el-button>
                </el-form-item>
            </el-form>
        </template>
        <d2-crud
                ref="d2Crud"
                :options="options"
                :columns="columns"
                :data="data"
                :loading="loading"
                :pagination="pagination"
                @pagination-current-change="paginationCurrentChange"
                @pagination-size-change="paginationSizeChange"
        >
        </d2-crud>
    </d2-container>
</template>

<script>
import { list } from '@/api/goosspecdict.js'
import dayjs from 'dayjs'
export default {
  name: 'index',
  data () {
    return {
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
          formatter (row, column, cellValue, index) {
            console.log('状态值', cellValue)
            return cellValue === 1 ? '有效' : '无效'
          }
        },
        {
          title: '备注',
          key: 'remark'
        }

      ],
      data: [],
      listquery: {
        size: 10,
        current: 1

      },
      options: {
        border: true
      },
      loading: false,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        layout: 'prev, pager, next, total,sizes,slot',
        pageSizes: [10, 20, 30, 40, 50, 100]
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
        current: this.pagination.currentPage
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

    }

  }
}

</script>

<style scoped>

</style>
