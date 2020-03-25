<template>
    <div class="forum-markdown">
        <avator :src="content.userId.headPortrait" style="margin-right: 15px;" width="50px" radius="5px" :placeholder="content.userId.nickName" />
        <div :class="['forum-markdown_box', { 'clickable': clickable, 'forum-markdown_owner': (owner && comment) }]">
            <div :class="['box-header', { 'box-header_owner': (owner && comment) }]">
                <span style="color: #24292e;font-weight: 600;font-size: 16px;margin-right: 10px;">{{ content.userId.nickName }}</span>
                <span>发布于 {{ createTime }}</span>
                <!-- <span v-if="comment" style="margin-left: 10px; display: flex; align-items: center;">
                    <i class="el-icon-s-opportunity" style="color: #E6A23C"></i>
                    亮了
                </span> -->
                <div class="comment-owner" :style="{opacity: (owner && comment) ? 1 : 0}">楼 主</div>
                <el-popover
                  placement="bottom"
                  v-model="popoverVisible"
                  trigger="click">
                    <ul>
                        <li class="handle-item" @click.stop="editForum">编辑</li>
                        <li class="handle-item" @click.stop="deleteForum">删除</li>
                    </ul>
                    <svg slot="reference" v-if="userInfo._id === content.userId._id" aria-label="Show options" class="octicon" viewBox="0 0 13 16" version="1.1" width="13" height="16" role="img"><path fill-rule="evenodd" d="M1.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM13 7.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path></svg>
                </el-popover>
            </div>
            <vue-markdown
              v-highlight
              :source="content.content"
              :anchor-attributes="anchorAttributes"
              class="markdown-body">
            </vue-markdown>
            <div :class="['forum-markdown_action', {'forum-markdown_action_comment': comment}]">
                <span class="action" v-if="owner && !comment">
                    <img class="action-icon" @click.stop="clickComment" src="../../../assets/icon/comment.png" alt="评论" />
                    <span class="action-name" v-if="content.countComment">{{ content.countComment }}</span>
                </span>
                <span :class="['action', {'action_comment': comment}]">
                    <!-- <img v-if="viewerHasLiked" class="action-icon" src="../../../assets/icon/like-fill.png" alt="赞" /> -->
                    <img class="action-icon" @click.stop="clickLike" src="../../../assets/icon/like.png" alt="赞" />
                    <span class="action-name" v-for="(whoLike, index) in whoLikes" :key="whoLike">{{ whoLike }}<span v-if="index+1 !== whoLikes.length">，</span></span>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import { mapState } from 'vuex'
import { Popover } from 'element-ui'
// import xss from 'assets/js/xss'
import avator from 'components/avator'

export default {
    props: {
        content: {
            type: Object,
            default: () => {
                return {
                    userId: {},
                    createTime: '',
                    content: '',
                    whoLikes: []
                }
            }
        },
        clickable: {
            type: Boolean,
            default: () => false
        },
        owner: {
            type: Boolean,
            default: () => false
        },
        comment: {
            type: Boolean,
            default: () => false
        }
    },
    components: {
        VueMarkdown,
        avator,
        'el-popover': Popover
    },
    data() {
        return {
            whoLikes: this.content.whoLikes,
            popoverVisible: false,
            anchorAttributes: {
                target: '_blank'
            }
        }
    },
    computed: {
        ...mapState({
            userInfo: 'userInfo'
        }),
        createTime() {
            if (this.content.createTime) {
                let createDate = new Date(this.content.createTime)
                return createDate.toLocaleDateString().replace(/\//g, '-') + ' ' + createDate.toTimeString().slice(0, 8)
            }
        }
    },
    methods: {
        deleteForum() {
            this.$emit('delete', this.content._id)
            this.popoverVisible = false
        },
        editForum() {
            this.$emit('edit', this.content)
            this.popoverVisible = false
        },
        clickLike() {
            let viewerHasLiked = this.whoLikes.includes(this.userInfo.nickName)
            if (viewerHasLiked) {
                this.whoLikes = this.whoLikes.filter(data => data !== this.userInfo.nickName)
            } else {
                this.whoLikes.push(this.userInfo.nickName)
            }
            this.$emit('clickLike', this.content._id, !viewerHasLiked)
        },
        clickComment() {
            this.$emit('clickComment', this.content._id)
        }
    }
}
</script>

<style lang="scss" scoped>

.forum-markdown {
    width: 100%;
    display: flex;
    margin-bottom: 20px;
    &_box {
        width: calc(100% - 65px);
        border: 1px solid #ddd;
        position: relative;
        border-radius: 4px;
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
            border-right-color: #f6f8fa;
            border-width: 8px;
        }
        &.forum-markdown_owner {
            border-color: #c0d3eb;
            &:before {
                border-right-color: #c0d3eb;
            }
            &:after {
                border-right-color: #f1f8ff;
            }
        }
    }
    &_delete {
        cursor: pointer;
        // font-size: 16px;
        font-weight: 600;
        &:hover {
            color: #409EFF;
        }
    }
    &_action {
        display: flex;
        border-top: 1px solid #e1e4e8;
        min-height: 37px;
        width: 100%;
        &_comment {
            border-color: #c0d3eb;
        }
    }
}
.box-header {
    align-items: center;
    justify-content: space-between;
    background-color: #f6f8fa;
    border-bottom: 1px solid #d1d5da;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    color: #586069;
    display: flex;
    padding-left: 16px;
    padding-right: 16px;
    height: 39px;
    width: 100%;
    font-size: 15px;
    &.box-header_owner {
        background-color: #f1f8ff;
        border-bottom-color: #c0d3eb;
    }
}
.comment-owner {
    border-radius: 3px;
    background-color: #909399;
    font-size: 12px;
    padding: 4px 8px;
    font-weight: 600;
    margin-left: auto;
    color: #fff;
}
.markdown-body {
    padding: 18px;
    min-height: 100px;
}
.clickable {
    transition: all .3s;
    cursor: pointer;
    &:hover {
        box-shadow: 15px 15px 6px -8px #eee;
        transform: translateX(5px);
        transition: all .3s
    }
}
.action {
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 0 15px;
    border-right: 1px solid #e1e4e8;
    &_comment {
        border-color: #c0d3eb;
    }
    &-icon {
        width: 20px;
        height: 20px;
        cursor: pointer;
    }
    &-name:first-of-type {
        margin-left: 10px;
    }
}
.octicon {
    vertical-align: middle;
    display: inline-block;
    fill: currentColor;
    cursor: pointer;
    margin-left: 10px;
    &:hover {
        color: #0366d6;
    }
}
.handle-item {
    color: #24292e;
    display: block;
    overflow: hidden;
    padding: 4px 10px 4px 16px;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
    width: 100%;
    cursor: pointer;
    &:hover {
        color: #0366d6;
    }
}
</style>
