<template>
    <div class="okr-list">
        <div class="okr-list_header">
            <div class="header-result">共<span style="color: red;"> {{ list.length }} </span>条数据</div>
            <div class="header-item">
                <div class="header-item_label">类型</div>
                <div class="header-item_wrapper">
                    <span
                      :class="['header-item_item', {'header-item_active': categorySelected === category.value}]"
                      v-for="category in [...allOption, ...categorys]"
                      @click="filterList(category.value, 'category')"
                      :key="category.value">
                        {{category.label}}
                    </span>
                </div>
            </div>
            <div class="header-item">
                <div class="header-item_label">分组</div>
                <div class="header-item_wrapper">
                    <span
                      :class="['header-item_item', {'header-item_active': groupSelected === group._id}]"
                      v-for="group in groupInfo"
                      @click="filterList(group._id, 'group')"
                      :key="group._id">
                        {{group.teamName}}
                    </span>
                </div>
            </div>
            <div class="header-item">
                <div class="header-item_label">年份</div>
                <div class="header-item_wrapper">
                    <span
                      :class="['header-item_item', {'header-item_active': yearSelected === year.value}]"
                      v-for="year in [...allOption, ...years]"
                      @click="filterList(year.value, 'year')"
                      :key="year.value">
                        {{year.label}}
                    </span>
                </div>
            </div>
            <div class="header-item">
                <div class="header-item_label">季度</div>
                <div class="header-item_wrapper">
                    <span
                      :class="['header-item_item', {'header-item_active': quarterSelected === quarter.value}]"
                      v-for="quarter in [...allOption, ...quarters]"
                      @click="filterList(quarter.value, 'quarter')"
                      :key="quarter.value">
                        {{quarter.label}}
                    </span>
                </div>
            </div>
        </div>
        <div class="okr-list_list" v-if="loading" v-loading="listLoading">
            <div class="okr-card_wrapper" v-for="item in list" :key="item._id" @click="checkOKR(item._id)">
                <okr-card :backgroundColor="item.theme">
                    <div slot="header">
                        {{item.title}}
                    </div>
                    <div slot="body">
                        {{item.describe}}
                    </div>
                </okr-card>
                <i class="el-icon-delete delete-icon" @click.stop="deleteOKR(item._id)" v-if="item.creater._id === userInfo._id"></i>
            </div>
            <div class="okr-card_wrapper" @click="dialogVisible = true">
                <okr-card position="center" backgroundColor="#909399">
                    <i class="el-icon-plus">添加 OKR</i>
                </okr-card>
            </div>
        </div>
        <el-dialog
          :visible.sync="dialogVisible"
          title="添加 OKR"
          width="430px">
            <el-form :model="form" :rules="rules" ref="ruleForm">
                <el-form-item label="类型" :label-width="formLabelWidth" prop="category" required>
                    <el-select v-model="form.category" placeholder="请选择类型">
                        <el-option
                          v-for="category in categorys"
                          :key="category.value"
                          :label="category.label"
                          :value="category.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分组" :label-width="formLabelWidth" prop="group" required>
                    <el-select v-model="form.group" placeholder="请选择分组">
                        <el-option
                          v-for="group in groupOptions"
                          :key="group._id"
                          :label="group.teamName"
                          :value="group._id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="年份" :label-width="formLabelWidth" prop="year" required>
                    <el-select v-model="form.year" placeholder="请选择年份">
                        <el-option
                          v-for="year in years"
                          :key="year.value"
                          :label="year.label"
                          :value="year.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="季度" :label-width="formLabelWidth" prop="quarter" required>
                    <el-select v-model="form.quarter" placeholder="请选择季度">
                        <el-option
                          v-for="quarter in quarters"
                          :key="quarter.value"
                          :label="quarter.label"
                          :value="quarter.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="createOKR('ruleForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import card from './common/card'
import { Select, Option } from 'element-ui'
import {
    API_OKRS
} from '@/api'
import { mapState } from 'vuex'

export default {
    components: {
        'okr-card': card,
        'el-select': Select,
        'el-option': Option
    },
    data() {
        return {
            list: [],
            groupInfo: [],
            loading: false,
            listLoading: false,
            dialogVisible: false,
            tempClick: '',
            formLabelWidth: '65px',
            categorySelected: this.$route.query.category || '0',
            groupSelected: this.$route.query.group || '0',
            yearSelected: this.$route.query.year || '0',
            quarterSelected: this.$route.query.quarter || '0',
            allOption: [{
                value: '0',
                label: '全部'
            }],
            form: {
                category: null,
                group: null,
                year: null,
                quarter: null
            },
            rules: {
                category: [
                    { required: true, message: '请选择类型', trigger: 'change' }
                ],
                group: [
                    { required: true, message: '请选择分组', trigger: 'change' }
                ],
                year: [
                    { required: true, message: '请选择年份', trigger: 'change' }
                ],
                quarter: [
                    { required: true, message: '请选择季度', trigger: 'change' }
                ]
            },
            groupOptions: [],
            categorys: [{
                value: '1',
                label: '小组'
            }, {
                value: '2',
                label: '项目'
            }, {
                value: '3',
                label: '问题'
            }, {
                value: '4',
                label: '其它'
            }],
            quarters: [{
                value: 'Q1',
                label: 'Q1'
            }, {
                value: 'Q2',
                label: 'Q2'
            }, {
                value: 'Q3',
                label: 'Q3'
            }, {
                value: 'Q4',
                label: 'Q4'
            }, {
                value: 'Q5',
                label: '年度'
            }],
            years: [{
                value: '2020',
                label: '2020'
            }, {
                value: '2019',
                label: '2019'
            }, {
                value: '2018',
                label: '2018'
            }, {
                value: '10000',
                label: '不限'
            }]
        }
    },
    computed: {
        ...mapState({
            teamGroup: 'teamGroup',
            teamInfo: 'teamInfo',
            userInfo: 'userInfo'
        }),
        groupName() {
            return this.groupOptions.find(data => data._id === this.form.group).teamName
        },
        okrTitle() {
            if (this.form.category === '1') {
                return `${this.groupName}-${this.form.year === '10000' ? `不限` : this.form.year}${this.form.quarter === 'Q5' ? '年度' : this.form.quarter}`
            } else {
                return '无标题'
            }
        },
        member() {
            if (this.form.group === '-1') {
                return [this.userInfo._id]
            } else if (this.form.group === '5aa5e5a44dcaed6feadbae19') {
                return this.teamInfo.map(data => data._id)
            } else {
                let member = this.teamGroup.find(data => data._id === this.form.group).memberList
                if (!member.find(data => data._id === this.userInfo._id)) {
                    return [this.userInfo].concat(member).map(data => data._id)
                } else {
                    return member.map(data => data._id)
                }
            }
        }
    },
    watch: {
        '$route': {
            handler: 'getList',
            deep: true,
            immediate: true
        },
        teamGroup: {
            handler(newVal) {
                this.groupOptions = this.teamGroup.concat([{_id: '5aa5e5a44dcaed6feadbae19', teamName: '大前端组'}, {_id: '-1', teamName: '自定义'}])
                this.groupInfo = [{_id: '0', teamName: '全部'}].concat(this.groupOptions)
            },
            deep: true,
            immediate: true
        },
        userInfo: {
            handler(newVal) {
                this.team = newVal.teamId
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        getList() {
            let params = {
                category: this.categorySelected,
                group: this.groupSelected,
                year: this.yearSelected,
                quarter: this.quarterSelected
            }
            this.listLoading = true
            this.$_get(API_OKRS, params).then(res => {
                this.list = res.list
                this.listLoading = false
                this.$nextTick(() => {
                    this.loading = true
                })
            })
        },
        filterList(value, type) {
            if (this.tempClick === `${type}${value}`) {
                return
            } else {
                this.tempClick = `${type}${value}`
            }
            switch (type) {
            case 'category':
                this.categorySelected = value
                break
            case 'group':
                this.groupSelected = value
                break
            case 'year':
                this.yearSelected = value
                break
            case 'quarter':
                this.quarterSelected = value
                break
            }
            this.$router.replace({
                name: 'okrList',
                query: {
                    category: this.categorySelected,
                    group: this.groupSelected,
                    year: this.yearSelected,
                    quarter: this.quarterSelected
                }
            })
        },
        checkOKR(id) {
            this.$router.push({
                name: 'okrDetail',
                params: {
                    id
                }
            })
        },
        createOKR(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.form.title = this.okrTitle
                    this.form.describe = ''
                    this.form.theme = '#409EFF'
                    this.form.member = this.member
                    this.$_post(API_OKRS, this.form).then((res) => {
                        this.$message({
                            type: 'success',
                            message: '保存成功！'
                        })
                        this.dialogVisible = false
                        this.$router.push({
                            name: 'okrDetail',
                            params: {
                                id: res.okrId
                            }
                        })
                    })
                } else {
                    return false
                }
            })
        },
        deleteOKR(id) {
            this.$confirm('确定要删除该OKR吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$_delete(API_OKRS, { id }).then((res) => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                    let index = this.list.findIndex(data => data._id === id)
                    this.list.splice(index, 1)
                })
            }).catch(() => {
                console.log('已取消删除！')
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.okr-list {
    position: relative;
    &_header {
        position: relative;
        margin-bottom: 15px;
        border: 1px solid #ebeef5;
        border-radius: 4px;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        padding: 20px;
        .header-result {
            position: absolute;
            right: 20px;
            top: 38px;
            font-size: 13px;
        }
        .header-item {
            display: flex;
            align-items: center;
            position: relative;
            user-select: none;
            &_label {
                min-width: 60px;
                margin-right: 20px;
                padding: 0 5px;
                border-radius: 16px 0 16px 16px;
                background-color: #7f7f8b;
                color: #fff;
                line-height: 30px;
                height: 30px;
                text-align: center;
                font-size: 15px;
            }
            &_wrapper {
                padding: 10px 0;
            }
            &_item {
                display: inline-block;
                margin: 2px 0;
                padding: 0 10px;
                border-radius: 15px;
                color: #999;
                line-height: 28px;
                vertical-align: top;
                font-size: 14px;
                cursor: pointer;
                &:hover {
                    color: #409EFF;
                }
            }
            &_active {
                color: #409EFF;
                background: #eaf5ff;
            }
            &_disabled {
                color: #ddd;
                background: transparent;
                cursor: not-allowed;
                &:hover {
                    color: #ddd;
                }
            }
            &:after {
                position: absolute;
                top: 50px;
                right: 0;
                left: 76px;
                height: 1px;
                background-color: #eee;
                content: "";
            }
            &:last-of-type {
                &:after {
                    display: none;
                }
            }
        }
    }
    &_list {
        display: flex;
        flex-wrap: wrap;
        margin: 0 -10px;
    }
}
.okr-card_wrapper {
    width: 33.33%;
    padding: 0 10px;
    margin: 10px 0;
    position: relative;
    .delete-icon {
        position: absolute;
        top: 11px;
        right: 20px;
        color: #fff;
        cursor: pointer;
        &:hover {
            font-weight: 700;
        }
    }
}
.header-btn {
    position: absolute;
    right: 20px;
    top: 15px;
}
</style>
