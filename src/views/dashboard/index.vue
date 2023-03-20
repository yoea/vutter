<template>
  <div class="dashboard-container">
    <h1>欢迎登录Yoea管理平台</h1>
    <div class="dashboard-text">username: {{ name }}</div>
    <div class="dashboard-text">nickname: {{ nickname }}</div>
    <div class="dashboard-text">email: {{ email }}</div>
    <div class="dashboard-text">motto: {{ motto }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name',
      'nickname',
      'email',
      'motto'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
