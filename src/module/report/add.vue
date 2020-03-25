<template>
    <div>
        <date-range type="week" v-on:change="changeDetail">
            <p slot="header" class="add-des">{{des}}</p>
        </date-range>
        <el-tabs v-model="activeName"
            @tab-click="handleClick">
            <el-tab-pane label="个人周报"
                name="weekly"></el-tab-pane>
            <el-tab-pane label="小组总结"
                name="summary"
                v-if="isAdmin"></el-tab-pane>
        </el-tabs>
        <div class="add-box" v-loading="uploadLoading">
            <el-upload
              style="display: none;"
              ref="upload"
              :action="uploadTarget"
              :before-upload="handleAvatarBeforeUpload"
              :on-success="handleAvatarSuccess"
              :show-file-list="false">
                <el-button size="small" type="primary" ref="uploadButton">点击上传</el-button>
            </el-upload>
            <markdown-editor
              v-if="isEdit"
              v-model="obj.content"
              ref="markdownEditor"
              :configs="configs">
            </markdown-editor>
            <report-entry
              v-else
              :reportData="previewDate | reportFilter"
              :key="obj.id">
            </report-entry>
        </div>
        <el-button class="add-btn"
            @click="btnActive(activeName)">{{btnText}}</el-button>
        <a href="javascript:;" class="add-link" @click="back()">返回列表</a>
    </div>
</template>
<script>
import {
    Tabs,
    TabPane,
    Upload
} from 'element-ui'
import {
    getFirstDayOfWeek,
    getLastDayOfWeek
} from '@/assets/util/day'
import dateRange from 'components/daterange'
import {
    API_REPORT_DETAIL,
    API_UPLOAD
} from '@/api'
import { markdownEditor } from 'vue-simplemde'
import reportEntry from 'module/components/report/entry'
export default {
    name: 'weekly',
    data() {
        return {
            uploadTarget: API_UPLOAD,
            configs: {
                status: false, // 禁用底部状态栏
                spellChecker: false, // 禁用拼写检查
                autofocus: true,
                toolbar: [
                    'bold',
                    'italic',
                    'heading-bigger',
                    '|',
                    'code',
                    'quote',
                    'unordered-list',
                    'ordered-list',
                    '|',
                    'link', {
                        name: 'custom',
                        action: (editor) => {
                            this.$refs.uploadButton.$el.click()
                        },
                        className: 'fa fa-picture-o',
                        title: 'Insert Image'
                    },
                    'table',
                    '|',
                    'preview',
                    'side-by-side',
                    'fullscreen'
                ]
            },
            obj: {
                content: '',
                type: this.$route.query.type
            },
            user: {},
            isAdmin: false,
            isEdit: true,
            activeName: this.$route.query.type,
            beginDate: '',
            endDate: '',
            uploadLoading: false
        }
    },
    components: {
        dateRange,
        reportEntry,
        markdownEditor,
        'el-tabs': Tabs,
        'el-tab-pane': TabPane,
        'el-upload': Upload
    },
    computed: {
        btnText() {
            return this.isEdit ? '保存' : '编辑'
        },
        des() {
            return this.activeName === 'summary' ? '本周小组总结' : '本周周报'
        },
        previewDate() {
            return Object.assign(this.user, this.obj)
        }
    },
    filters: {
        reportFilter(obj) {
            return {
                head: obj.headPortrait || require('../user/image/cat.png'),
                name: obj.nickName,
                date: obj.createTime,
                content: obj.content,
                answerListLength: obj.answerListLength,
                reportId: obj._id
            }
        }
    },
    watch: {
        '$route': {
            handler: 'init',
            deep: true,
            immediate: true
        }
    },
    methods: {
        init() {
            this.beginDate = this.$route.query.beginDate || getFirstDayOfWeek()
            this.endDate = this.$route.query.endDate || getLastDayOfWeek()
            this.initData()
        },
        initData() {
            this.$_get(API_REPORT_DETAIL, {
                beginDate: this.beginDate,
                endDate: this.endDate,
                type: this.activeName
            }).then((res) => {
                this.user = res.user
                this.obj = res.detail[0]
                this.obj.answerListLength = res.answerLength
                this.isAdmin = res.isAdmin
            }).catch(error => {
                console.log(error.error)
            })
        },
        btnActive() {
            if (!this.isEdit) {
                this.isEdit = !this.isEdit
                return
            }
            Object.assign(this.obj, {
                beginDate: this.beginDate,
                type: this.activeName
            })
            this.$_post(API_REPORT_DETAIL, this.obj).then((res) => {
                if (res.reportId) {
                    this.obj._id = res.reportId
                }
                this.isEdit = false
            }).catch(error => {
                console.log(error.error)
            })
        },
        changeDetail(val1 = '', val2 = '') {
            this.$router.push({
                name: 'reportDetail',
                query: {
                    beginDate: val1,
                    endDate: val2,
                    type: this.activeName
                }
            })
        },
        back() {
            this.$router.push({
                name: 'reportList',
                query: {
                    beginDate: this.beginDate,
                    endDate: this.endDate
                }
            })
        },
        handleClick(tab, val) {
            this.initData()
        },
        handleAvatarBeforeUpload() {
            this.uploadLoading = true
        },
        handleAvatarSuccess(res, file) {
            this.uploadLoading = false
            if (res.success) {
                this.$message.success('上传图片成功！')
                let newContent = `${this.obj.content}\n![](${res.files[0].url})`
                this.$set(this.obj, 'content', newContent)
            } else {
                this.$message.error(res.msg)
            }
        }
    }
}
</script>
<style lang="scss">
@import '../../assets/style/base.scss';
@import 'simplemde/dist/simplemde.min.css';

.add-box {
    margin-bottom: 20px;
    min-height: 370px;
}

.add-des {
    font-size: $fontSizeLevel3;
}

/deep/ .report-entry {
    border-bottom: 0;
}
</style>
