<template>
    <div class="date">
        <p class="date-week">
            <i class="el-icon-arrow-left point" @click="changeWeek(-7)"></i>
            <span>{{ dateText }}</span>
            <i class="el-icon-arrow-right point" @click="changeWeek(7)"></i>
        </p>
        <div class="date-picker">
            <p class="date-day">{{begin}} - {{end}}</p>
            <i class="el-icon-date"></i>
            <el-date-picker :type="type"
                :picker-options="{
                  firstDayOfWeek: 1
                }"
                v-model="dateValue"
                @change="changeDate"
                placeholder="选择日期">
            </el-date-picker>
        </div>
        <slot name="header"></slot>
    </div>
</template>
<script>
import dateFormate from './index'
import {
    DatePicker
} from 'element-ui'
export default {
    name: 'dateFormate',
    props: {
        type: {
            type: String,
            default: 'week'
        }
    },
    data() {
        return {
            firstDayOfWeek: dateFormate.getDayOfWeek(new Date(), 1),
            lastDayOfWeek: dateFormate.getDayOfWeek(new Date(), 7),
            beginDate: '',
            endDate: '',
            dateValue: ''
        }
    },
    computed: {
        yearBegin() {
            return dateFormate.getYear(this.beginDate)
        },
        yearEnd() {
            return dateFormate.getYear(this.endDate)
        },
        weekStartNum() {
            return dateFormate.getYearWeek(this.beginDate)
        },
        weekEndNum() {
            return dateFormate.getYearWeek(this.endDate)
        },
        dateText() {
            if (this.yearBegin === this.yearEnd) {
                if (this.weekStartNum === this.weekEndNum) {
                    return `${this.yearBegin}年 第${this.weekStartNum}周`
                } else {
                    return `${this.yearBegin}年 第${this.weekStartNum}~${this.weekEndNum}周`
                }
            } else {
                return `${this.yearBegin}年 第${this.weekStartNum}周 ~ ${this.yearEnd}年 第${this.weekEndNum}周`
            }
        },
        begin() {
            return `${dateFormate.getMonth(this.beginDate)}/${dateFormate.getDay(this.beginDate)}`
        },
        end() {
            return `${dateFormate.getMonth(this.endDate)}/${dateFormate.getDay(this.endDate)}`
        }
    },
    watch: {
        '$route': {
            handler: 'initDate',
            deep: true,
            immediate: true
        }
    },
    components: {
        'el-date-picker': DatePicker
    },
    methods: {
        initDate() {
            this.beginDate = this.$route.query.beginDate ? new Date(this.$route.query.beginDate) : this.firstDayOfWeek
            this.endDate = this.$route.query.endDate ? new Date(this.$route.query.endDate) : this.lastDayOfWeek
            if (this.type === 'daterange') {
                this.dateValue = [this.$route.query.beginDate || this.firstDayOfWeek, this.$route.query.endDate || this.lastDayOfWeek]
            } else if (this.type === 'week') {
                // el-date-picker如果给的v-model值是星期日，则默认显示的是上个星期，坑啊！！！
                let nextDay = Date.parse(this.beginDate) + 24 * 60 * 60 * 1000
                this.dateValue = new Date(nextDay)
            }
        },
        changeWeek(action) {
            let beginDate = Date.parse(this.beginDate) + 24 * 60 * 60 * 1000 * action
            let endDate = Date.parse(this.endDate) + 24 * 60 * 60 * 1000 * action
            this.beginDate = new Date(beginDate)
            this.endDate = new Date(endDate)
            if (this.type === 'daterange') {
                this.dateValue = [this.beginDate, this.endDate]
            } else if (this.type === 'week') {
                this.dateValue = this.beginDate
            }
            // 传出去的时间格式为'yyyy-mm-dd'
            this.$emit('change', dateFormate.format1(this.beginDate), dateFormate.format1(this.endDate))
        },
        changeDate(date) {
            if (this.type === 'daterange') {
                this.beginDate = date[0]
                this.endDate = date[1]
            } else if (this.type === 'week') {
                this.beginDate = dateFormate.getDayOfWeek(date, 1)
                this.endDate = dateFormate.getDayOfWeek(date, 7)
            }
            // 传出去的时间格式为'yyyy-mm-dd'
            this.$emit('change', dateFormate.format1(this.beginDate), dateFormate.format1(this.endDate))
        }
    }
}
</script>
<style lang="scss"
    scoped>
@import '../../../assets/style/base.scss';

.point {
    cursor: pointer;
}

.date {
    text-align: center;
}

.date-week {
    color: #333;
    margin-bottom: 5px;
    font-size: $fontSizeLevel2;

    span {
        padding: 0 20px;
    }
}

.date-day {
    margin: 0;
    font-size: $fontSizeLevel4;
    color: $colorTextGeneral;
}

.bd-date_next {
    transform: rotate(180deg);
}

.date-picker {
    position: relative;
}

/deep/ .el-range-editor {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    width: 200px;
}

/deep/ .el-range-input {
    cursor: pointer;
}

/deep/ .el-range-separator {
    cursor: pointer;
}

/deep/ .el-input {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
}

/deep/ .el-input__inner {
    cursor: pointer;
}
</style>
