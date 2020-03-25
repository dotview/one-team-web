<template>
    <div>
        <el-tabs v-model="activeName"
            @tab-click="handleClick">
            <el-tab-pane label="周报模板"
                name="weekly">
                <h2 class="config-title">设置周报模版</h2>
                <markdown-editor v-if="weeklyEdit"
                    v-model="resultTemplate.weeklyTemplate.template"
                    ref="markdownEditor"
                    :configs="configs"></markdown-editor>
                <vue-markdown v-else
                    :source="resultTemplate.weeklyTemplate.template"
                    v-highlight></vue-markdown>
            </el-tab-pane>
            <el-tab-pane label="总结模板"
                name="summary">
                <h2 class="config-title">设置总结模版</h2>
                <markdown-editor v-if="summaryEdit"
                    v-model="resultTemplate.summaryTemplate.template"
                    ref="markdownEditor"
                    :configs="configs"></markdown-editor>
                <vue-markdown v-else
                    :source="resultTemplate.summaryTemplate.template"
                    v-highlight></vue-markdown>
            </el-tab-pane>
            <el-button @click="btnActive()"
                class="config-btn">{{btnText}}</el-button>
            <a href="javascript:;" @click="back()">返回列表</a>
        </el-tabs>
    </div>
</template>
<script>
import {
    API_REPORT_CONFIG,
    API_REPORT_TEMPLATE
} from '@/api'
import {
    Tabs,
    TabPane
} from 'element-ui'
import VueMarkdown from 'vue-markdown'
import markdownEditor from 'vue-simplemde/src/markdown-editor'
export default {
    name: 'weekly',
    data() {
        return {
            activeName: this.$route.query.type,
            configs: {
                status: false, // 禁用底部状态栏
                spellChecker: false // 禁用拼写检查
            },
            resultTemplate: {
                weeklyTemplate: {
                    template: ''
                },
                summaryTemplate: {
                    template: ''
                }
            },
            weeklyEdit: true,
            summaryEdit: true
        }
    },
    computed: {
        btnText() {
            return this[this.activeName + 'Edit'] ? '保存' : '编辑'
        }
    },
    components: {
        markdownEditor,
        VueMarkdown,
        'el-tabs': Tabs,
        'el-tab-pane': TabPane
    },
    mounted() {
        this.initData()
    },
    methods: {
        initData() {
            this.$_get(API_REPORT_CONFIG).then((res) => {
                if (res.weeklyTemplate) {
                    this.resultTemplate.weeklyTemplate = res.weeklyTemplate
                }
                if (res.summaryTemplate) {
                    this.resultTemplate.summaryTemplate = res.summaryTemplate
                }
            }).catch(error => {
                console.log(error.error)
            })
        },
        saveConfig(type) {
            let res = Object.assign(this.resultTemplate[type + 'Template'], {
                type: this.activeName
            })
            this.$_post(API_REPORT_TEMPLATE, res).then((res) => {
                this[this.activeName + 'Edit'] = false
            })
        },
        btnActive(num) {
            if (!this[this.activeName + 'Edit']) {
                this[this.activeName + 'Edit'] = true
                return
            }
            this.saveConfig(this.activeName)
        },
        back() {
            this.$router.go(-1)
        },
        handleClick(tab, val) {}
    }
}
</script>
<style lang="scss">
@import 'simplemde/dist/simplemde.min.css';

.config-title {
    text-align: center;
    padding: 10px 0;
}

.config-btn {
    margin-top: 10px;
    display: inline-block;
}
</style>
