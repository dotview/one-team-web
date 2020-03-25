<template>
    <div class="date">
        <p class="date-week">
            <i v-if="!disabled" class="el-icon-arrow-left point" @click="changeWeek('prev')"></i>
            <span>{{ dateText }}</span>
            <i v-if="!disabled" class="el-icon-arrow-right point" @click="changeWeek('next')"></i>
        </p>
        <div class="date-picker">
            <p class="date-day">{{begin}} - {{end}}</p>
            <i class="el-icon-date"></i>
            <el-date-picker
              :type="type"
              :picker-options="{
                  firstDayOfWeek: 1
              }"
              v-model="dateValue"
              :disabled="disabled"
              @change="changeDate"
              placeholder="选择日期">
            </el-date-picker>
        </div>
        <slot name="header"></slot>
    </div>
</template>
<script>
import {
    dateFormat,
    getYear,
    getMonth,
    getDay,
    getWeekOfYear,
    getFirstDayOfWeek,
    getLastDayOfWeek,
    getDayOfNextWeek,
    getDayOfPrevWeek,
    isSameWeek
} from '@/assets/util/day'
import {
    DatePicker
} from 'element-ui'
export default {
    name: 'daterange',
    props: {
        type: {
            type: String,
            default: 'week'
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            firstDayOfWeek: getFirstDayOfWeek(), // 获取当周的第一天，返回格式“2019-01-09”
            lastDayOfWeek: getLastDayOfWeek(), // 获取当周的最后一天
            beginDate: '',
            endDate: '',
            dateValue: ''
        }
    },
    computed: {
        beginYear() {
            return getYear(this.beginDate) // 开始时间所在的年份
        },
        endYear() {
            return getYear(this.endDate)// 结束时间所在的年份
        },
        beginWeekOfYear() {
            return getWeekOfYear(this.beginDate) // 开始时间所在年中的第几周
        },
        endWeekOfYear() {
            return getWeekOfYear(this.endDate) // 结束时间所在年中的第几周
        },
        isSameWeek() {
            return isSameWeek(this.beginDate, this.endDate)
        },
        dateText() {
            if (this.beginYear === this.endYear) {
                if (this.beginWeekOfYear === this.endWeekOfYear) {
                    return `${this.beginYear}年 第${this.beginWeekOfYear}周`
                } else {
                    return `${this.beginYear}年 第${this.beginWeekOfYear}~${this.endWeekOfYear}周`
                }
            } else {
                if (this.isSameWeek) {
                    if (this.beginWeekOfYear === 1) {
                        return `${this.endYear}年 第${this.endWeekOfYear}周`
                    } else {
                        return `${this.beginYear}年 第${this.beginWeekOfYear}周`
                    }
                } else {
                    return `${this.beginYear}年 第${this.beginWeekOfYear}周 ~ ${this.endYear}年 第${this.endWeekOfYear}周`
                }
            }
        },
        begin() {
            return `${getMonth(this.beginDate)}/${getDay(this.beginDate)}`
        },
        end() {
            return `${getMonth(this.endDate)}/${getDay(this.endDate)}`
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
            this.beginDate = this.$route.query.beginDate || this.firstDayOfWeek
            this.endDate = this.$route.query.endDate || this.lastDayOfWeek
            this.setPickerDate()
        },
        changeWeek(action) {
            if (action === 'next') {
                this.beginDate = getDayOfNextWeek(this.beginDate)
                this.endDate = getDayOfNextWeek(this.endDate)
            } else {
                this.beginDate = getDayOfPrevWeek(this.beginDate)
                this.endDate = getDayOfPrevWeek(this.endDate)
            }
            this.setPickerDate()
            // 传出去的时间格式为'YYYY-MMM-DD'
            this.$emit('change', this.beginDate, this.endDate)
        },
        changeDate(date) {
            if (this.type === 'daterange') {
                this.beginDate = dateFormat(date[0])
                this.endDate = dateFormat(date[1])
            } else if (this.type === 'week') {
                this.beginDate = getFirstDayOfWeek(date)
                this.endDate = getLastDayOfWeek(date)
            }
            // 传出去的时间格式为'YYYY-MMM-DD'
            this.$emit('change', this.beginDate, this.endDate)
        },
        setPickerDate() {
            if (this.type === 'daterange') {
                this.dateValue = [this.beginDate, this.endDate]
            } else if (this.type === 'week') {
                this.dateValue = this.beginDate
            }
        }
    }
}
</script>
<style lang="scss" scoped>
// @import '../../../assets/style/base.scss';
.point {
    cursor: pointer;
}
.date {
    text-align: center;
}
.date-week {
    color: #333;
    margin-bottom: 5px;
    font-size: 18px;
    span {
        padding: 0 20px;
    }
}
.date-day {
    margin: 0;
    font-size: 14px;
    color: #666666;
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
