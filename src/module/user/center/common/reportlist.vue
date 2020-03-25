<template>
    <div>
        <date-range type="daterange" v-on:change="changeList" />
        <el-button class="add-btn" type="primary" @click="edit" v-show="isBtnShow">填写周报</el-button>
        <div class="tips" v-if="differWeek !== 1 && objList[0] && objList[0]._id">
            <el-alert
                :closable="false"
                type="info">
                <div v-if="differWeek === length" slot="title">
                    此人很强👍👍👍，这{{ differWeek }}周的周报<span class="text-mark">一周不落</span>！！
                </div>
                <div v-else slot="title">
                    此人在这{{ differWeek }}周内，写了{{ length || '-' }}篇周报，有 <span class="text-mark">{{ differWeek - length }}</span> 周没写周报！!
                </div>
            </el-alert>
        </div>
        <div class="report-wrapper">
            <editor
              v-for="(main, index) in objList"
              :isEditing="isEditing"
              :isHost="isHost"
              :main="main"
              :user="user"
              :key="index"
              @refreshDate="initData"
              @cancel="initData"
            />
            <span v-if="objList[0] && !objList[0]._id && !isEditing" class="empty-wrapper">
                <img :src="emptyImg" class="empty-image" alt="没写周报" />
                <span class="empty-text">本阶段还没有填写周报</span>
            </span>
        </div>
    </div>
</template>
<script>
import editor from './editor'
import dateRange from 'components/daterange'
import {
    Alert
} from 'element-ui'
import {
    API_REPORT_DETAIL
} from '@/api'
import {
    isSameWeek,
    getFirstDayOfWeek,
    getLastDayOfWeek,
    differWeek
} from '@/assets/util/day'
export default {
    name: 'reportDetail',
    props: {
        userId: {
            type: String
        },
        isHost: {
            type: Boolean,
            default: false
        },
        isSingle: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            beginDate: null,
            endDate: null,
            isEditing: false,
            user: {},
            objList: [],
            defaultHead: require('../../image/leader.png'),
            emptyImg: require('./img/fail.png'),
            differWeek: '',
            length: 1
        }
    },
    components: {
        dateRange,
        editor,
        'el-alert': Alert
    },
    computed: {
        // 本人并且在完整一周范围内没有周报记录，则显示填写周报按钮
        isBtnShow() {
            return this.isHost && !this.isEditing && (this.objList[0] && !this.objList[0]._id) && isSameWeek(this.beginDate, this.endDate)
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
        changeList(val1 = '', val2 = '') {
            this.$router.push({
                name: 'personalCenter',
                params: {
                    userId: this.userId
                },
                query: {
                    beginDate: val1,
                    endDate: val2
                }
            })
        },
        initData() {
            this.$_get(API_REPORT_DETAIL, {
                beginDate: this.beginDate,
                endDate: this.endDate,
                type: 'weekly',
                userId: this.userId
            }, {loading: true}).then((res) => {
                this.objList = res.detail
                this.length = res.detail.length
                this.differWeek = differWeek(this.beginDate, this.endDate)
                this.user = res.user
                // 如果没有返回周报内容，则显示填写周报按钮
                if (!this.objList[0]._id) {
                    this.isEditing = false
                }
            }).catch(error => {
                console.log(error.error)
            })
        },
        edit() {
            // 隐藏填写周报按钮
            this.isEditing = true
        }
    }
}
</script>
<style lang="scss" scoped>
.add-btn {
    position: absolute;
    top: 5px;
    right: 10px;
}
.empty {
    &-wrapper {
        width: 100%;
        background: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    &-image {
        margin: 30px 0;
        width: 200px;
    }
    &-text {
        font-size: 18px;
    }
}
.btn-wrapper {
    margin-top: 15px;
}
.text-mark {
    color: red;
}
.tips {
    margin-top: 20px;
    width: 100%;
}
.report-wrapper {
    margin-top: 3%;
}
</style>
