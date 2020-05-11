<template>
  <el-table :data="data" stripe>
    <el-table-column width="20"></el-table-column>
    <el-table-column min-width="60" :label="$t('staking.staking15')" prop="height"></el-table-column>
    <el-table-column min-width="55" :label="$t('staking.staking4')" prop="symbol"></el-table-column>
    <el-table-column min-width="90" :label="$t('staking.staking16')" prop="amount"></el-table-column>
    <el-table-column min-width="90" :label="$t('staking.staking17')" prop="deadline"></el-table-column>
    <el-table-column min-width="90" :label="$t('staking.staking18')" prop="nodeType"></el-table-column>
    <el-table-column min-width="95" :label="$t('staking.staking19')" prop="extra"></el-table-column>
    <el-table-column min-width="90" :label="$t('staking.staking25')" prop="totalReward" v-if="!staking">
      <template v-slot="scope">
        <span>{{scope.row.totalReward}} {{prefix}}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="120" :label="$t('staking.staking20')" prop="joinTime"></el-table-column>
    <el-table-column min-width="120" :label="$t('staking.staking21')" prop="endTime"></el-table-column>
    <el-table-column min-width="90" :label="$t('staking.staking22')"  v-if="staking">
      <template v-slot="scope">
        <div v-if="scope.row.type===1">
          <span class="click" @click="handleChange(scope.row)">{{$t('staking.staking23')}}</span> 丨
          <span class="click" @click="handleQuit(scope.row)">{{$t('staking.staking24')}}</span>
        </div>
        <span v-else>-</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  import {MAIN_INFO} from '@/config'
  export default {
    name: "",
    props: {
      data: {
        type: Array,
        default: ()=>[]
      },
      staking: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        prefix: MAIN_INFO.prefix,
      }
    },
    methods: {
      handleChange(e) {
        this.$emit('changeStaking', e)
      },
      handleQuit(e) {
        this.$emit('quitStaking', e)
      }
    }

  }
</script>

<style lang="less">

</style>