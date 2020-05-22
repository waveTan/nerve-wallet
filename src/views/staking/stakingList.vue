<template>
  <el-table :data="data" stripe>
    <el-table-column width="10"></el-table-column>
    <el-table-column min-width="60" :label="$t('staking.staking15')" align="center" prop="blockHeight">
    </el-table-column>
    <el-table-column min-width="55" :label="$t('staking.staking4')" align="center" prop="symbol">
    </el-table-column>
    <el-table-column min-width="90" :label="$t('staking.staking16')" align="center" prop="amounts">
    </el-table-column>
    <el-table-column min-width="90" :label="$t('staking.staking17')" align="center" prop="type">
      <template v-slot="scope">
        <span>{{ $t('stakingType.'+scope.row.type)}}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="95" :label="$t('staking.staking31')" align="center" prop="extra">
    </el-table-column>
    <el-table-column min-width="95" :label="$t('staking.staking19')" align="center" prop="extra">
    </el-table-column>
    <el-table-column min-width="120" :label="$t('staking.staking20')" align="center" prop="createTime">
    </el-table-column>
    <el-table-column min-width="120" :label="$t('staking.staking21')" align="center" prop="endTime" v-if="staking">
    </el-table-column>
    <el-table-column min-width="90" :label="$t('staking.staking22')" v-if="staking">
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
        default: () => []
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
