<template>
    <div class="editor-box" v-if="isShow">
        <markdown-editor
          v-if="isAgainEdit && isHost"
          v-model="main.content"
          ref="markdownEditor"
          :configs="configs"
        />
        <report-entry
          v-else
          :reportData="previewData"
          :reportId="previewData._id"
          :isHost="isHost"
          @reportEdit="editReport"
          @reportDelete="deleteReport"
        />
        <div v-if="isAgainEdit" class="btn-wrapper">
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary" @click="save">保存</el-button>
        </div>
    </div>
</template>

<script>
import markdownEditor from 'vue-simplemde/src/markdown-editor'
import reportEntry from 'module/components/report/entry'
import {
    dateFormatCN,
    getFirstDayOfWeek
} from '@/assets/util/day'
import {
    API_REPORT_DETAIL
} from '@/api'
export default {
    name: 'reportEditor',
    props: {
        main: {
            type: Object
        },
        user: {
            type: Object
        },
        isEditing: {
            type: Boolean,
            default: false
        },
        isHost: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isShow: this.main._id,
            isAgainEdit: false,
            configs: {
                status: false, // 禁用底部状态栏
                spellChecker: false // 禁用拼写检查
            }
        }
    },
    watch: {
        isEditing(newVal, oldVal) {
            this.isShow = newVal
            this.isAgainEdit = newVal
        },
        main: {
            handler(newVal, oldVal) {
                if (newVal._id !== oldVal._id) {
                    this.isShow = newVal._id
                }
            },
            deep: true
        }
    },
    components: {
        reportEntry,
        markdownEditor
    },
    computed: {
        previewData() {
            let createDate = `创建于${dateFormatCN(this.main.createTime)}`
            let updateDate = null
            if (this.main.updateTime && this.main.updateTime !== this.main.createTime) {
                updateDate = `修改于${dateFormatCN(this.main.updateTime)}`
            }
            return {
                head: this.user.headPortrait || this.defaultHead,
                name: this.user.nickName,
                createDate,
                updateDate,
                content: this.main.content,
                answerListLength: this.main.commentLength || 0,
                reportId: this.main._id
            }
        }
    },
    methods: {
        editReport() {
            this.isAgainEdit = true
            this.tempContent = this.main.content
        },
        deleteReport() {
            this.$emit('refreshDate')
        },
        cancel() {
            if (this.main._id) {
                this.isAgainEdit = false
                this.main.content = this.tempContent
            } else {
                this.$emit('cancel')
            }
        },
        save() {
            if (!this.main._id) {
                Object.assign(this.main, {
                    beginDate: this.$route.query.beginDate || getFirstDayOfWeek(),
                    type: 'weekly'
                })
            }
            this.$_post(API_REPORT_DETAIL, this.main).then((res) => {
                // this.previewDate.reportId = res.reportId
                this.main._id = res.reportId
                this.isAgainEdit = false
                this.$emit('save')
            }).catch(error => {
                console.log(error.error)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.editor-box {
    position: relative;
    margin-bottom: 10px;
}
.btn-wrapper {
    margin-top: 15px;
}
</style>
