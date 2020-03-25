<template>
    <div class="component_focus">
        <div class="search"
            v-if="isHost">
            <el-autocomplete class="inline-input"
                v-model="searchName"
                :fetch-suggestions="querySearch"
                placeholder="请输入成员姓名"
                :trigger-on-focus="false"
                prefix-icon="el-icon-search"
                @select="handleSelect">
                <i
                    class="el-icon-error el-input__icon"
                    slot="suffix"
                    @click="cleanInput">
                </i>
            </el-autocomplete>
            <el-button type="primary"
                @click="addRecordUser">加关注</el-button>
        </div>
        <el-table :data="focusList"
            style="width: 100%"
            :show-header="false">
            <el-table-column>
                <template slot-scope="scope">
                    <div class="cell-hd">
                        <router-link :to="{name: 'personalCenter', params: {userId: scope.row._id}}">
                            <img class="cell-hd-pic" :src="scope.row.headPortrait | photoFilter" alt="">
                        </router-link>
                            <span>{{ scope.row.nickName }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column width="120"
                v-show="isHost">
                <span slot-scope="scope" @mouseover="changeStateOn" @mouseout="changeStateOut">
                    <el-button  size="mini" @click="delRecordUser(scope.row._id)">{{btnText}}</el-button>
                </span>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import {
    Autocomplete,
    Table,
    TableColumn
} from 'element-ui'
import {
    API_RECORD,
    API_USER_NAME
} from '@/api'
export default {
    name: 'focusList',
    props: {
        userId: {
            type: String
        },
        isHost: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            focusList: [],
            dialogVisible: false,
            userList: [],
            choosenUser: '',
            filterContent: '',
            searchName: '',
            searchList: [],
            searchId: '',
            btnText: '已关注'
        }
    },
    components: {
        'el-autocomplete': Autocomplete,
        'el-table': Table,
        'el-table-column': TableColumn
    },
    filters: {
        photoFilter(val) {
            return val || require('../../image/cat.png')
        },
        leterFilter(val) {
            return val.slice(0, 1)
        }
    },
    computed: {
        focusListFilted() {
            if (this.filterContent && this.focusList.length) {
                return this.focusList.filter((item) => {
                    return item.subUserName.indexOf(this.filterContent) !== -1
                })
            } else {
                return this.focusList
            }
        }
    },
    mounted() {
        this.initData()
    },
    // watch: {
    //     '$route': {
    //         handler: 'initData',
    //         deep: true,
    //         immediate: true
    //     }
    // },
    methods: {
        initData() {
            this.$_get(API_RECORD, { userId: this.userId }).then((res) => {
                // 不知道为什么测试数据库返回的数据第一个为null，导致测试无法继续进行
                this.focusList = res.filter(data => data !== null)
            })
        },
        querySearch(searchName, cb) {
            this.$_get(API_USER_NAME, { searchName }).then((res) => {
                let searchList = res.data
                for (let key in searchList) {
                    let item = searchList[key]
                    item.value = item.nickName + '<' + item.eMail + '>'
                }
                this.searchList = searchList
                cb(this.searchList)
            })
        },
        handleSelect(item) {
            this.searchId = item._id
        },
        addRecordUser() {
            if (!this.searchId) {
                this.$message.error('你要找谁呢？')
                return
            }
            this.$_post(API_RECORD, { subUserId: this.searchId }).then((res) => {
                this.initData()
                this.cleanInput()
            }).catch((err) => {
                this.$message.error(err.resultDes)
            })
        },
        delRecordUser(id) {
            this.$_delete(API_RECORD, { subUserId: id }).then((res) => {
                this.initData()
            }).catch((err) => {
                this.$message.error(err.resultDes)
            })
        },
        changeStateOn(el) {
            el.target.innerText = '取消关注'
        },
        changeStateOut(el) {
            el.target.innerText = '已关注'
        },
        cleanInput() {
            this.searchId = ''
            this.searchName = ''
        }
    }
}
</script>
<style lang="scss"
    scoped>
.search {
    margin: 20px 0;
}

.cell-hd {
    display: flex;
    align-items: center;
}

.cell-hd-pic {
    display: inline-block;
    margin-right: 10px;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    line-height: 100%;
}
</style>
