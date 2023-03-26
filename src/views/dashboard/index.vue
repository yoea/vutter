<template>
  <div class="dashboard-container">
    <Carousel />
    <h1>欢迎登录Yoea管理平台</h1>
    <div class="dashboard-text">username: {{ name }}</div>
    <div class="dashboard-text">nickname: {{ nickname }}</div>
    <div class="dashboard-text">email: {{ email }}</div>
    <div class="dashboard-text">motto: {{ motto }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Carousel from '@/components/Carousel'

export default {
  name: 'Dashboard',
  components: {
    Carousel
  },
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
    margin: 10px;
  }
  &-text {
    font-size: 20px;
    line-height: 28px;
  }
}
</style>
