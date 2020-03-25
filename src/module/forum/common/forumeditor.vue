<template>
    <div class="forum-editor">
        <avator :src="userInfo.headPortrait" style="margin-right: 15px;" width="50px" radius="4px" :placeholder="userInfo.nickName" />
        <div class="forum-editor_box" v-loading="uploadLoading">
            <div class="tips">
                <i class="el-icon-s-flag" style="margin-right: 10px;"></i>
                <el-link href="https://guides.github.com/features/mastering-markdown/">填写内容请使用 markdown 格式。如需粘贴代码，必须将代码包裹在语法 ``` ``` 中，否则可能会导致排版异常。</el-link>
            </div>
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
              v-model="source"
              ref="markdownEditor"
              :configs="configs">
            </markdown-editor>
            <div class="forum-editor_btns">
                <el-button type="primary" class="add-btn" @click="submit">发 布</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import {
    Link,
    Upload
} from 'element-ui'
import { markdownEditor } from 'vue-simplemde'
import avator from 'components/avator'
import {
    API_UPLOAD
} from '@/api'

export default {
    name: 'forumEditor',
    props: {
        userInfo: {
            type: Object,
            default: () => {}
        },
        content: {
            type: String,
            default: () => ''
        }
    },
    watch: {
        content(value) {
            this.source = value
        }
    },
    components: {
        markdownEditor,
        'el-link': Link,
        'el-upload': Upload,
        avator
    },
    data() {
        return {
            uploadTarget: API_UPLOAD,
            configs: {
                status: false, // 禁用底部状态栏
                spellChecker: false, // 禁用拼写检查
                autofocus: true,
                placeholder: '说点什么吧',
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
            uploadLoading: false,
            source: ''
        }
    },
    methods: {
        submit() {
            if (this.source === '') {
                this.$message({
                    message: '请勿提交空内容',
                    type: 'warning'
                })
                return
            }
            this.$emit('submit', this.source)
        },
        handleAvatarBeforeUpload() {
            this.uploadLoading = true
        },
        handleAvatarSuccess(res, file) {
            this.uploadLoading = false
            if (res.success) {
                this.$message.success('上传图片成功！')
                this.source = `${this.source}\n![](${res.files[0].url})`
            } else {
                this.$message.error(res.msg)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.forum-editor {
    width: 100%;
    display: flex;
    &_input {
        margin-bottom: 18px;
    }
    &_box {
        flex: 1;
        border: 1px solid #ddd;
        padding: 18px;
        position: relative;
        border-radius: 4px;
        background: #f2f2f2;
        &:before {
            content: " ";
            border-color: transparent;
            border-style: solid solid outset;
            display: block;
            height: 0;
            left: -16px;
            pointer-events: none;
            position: absolute;
            right: 100%;
            top: 11px;
            width: 0;
            border-right-color: #ddd;
            border-width: 8px;
        }
        &:after {
            content: " ";
            border-color: transparent;
            border-style: solid solid outset;
            display: block;
            height: 0;
            left: -15px;
            pointer-events: none;
            position: absolute;
            right: 100%;
            top: 11px;
            width: 0;
            border-right-color: #f2f2f2;
            border-width: 8px;
        }
    }
    &_btns {
        margin-top: 14px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
}
.tips {
    color: #586069;
    display: inline-block;
    font-size: 14px;
    margin-right: auto;
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

/deep/ .markdown-editor {
    background: #fff!important;
}
</style>
