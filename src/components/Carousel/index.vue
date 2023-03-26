<template>
  <el-carousel :interval="3000" height="400px">
    <el-carousel-item v-for="item in carouselImages" :key="item.url">
      <img :src="item.url" alt="无图片" style="width: 100%">
    </el-carousel-item>
  </el-carousel>
</template>

<script>
export default {
  data() {
    return {
      carouselImages: [
        { url: 'https://xhef.oss-cn-hangzhou.aliyuncs.com/xhef/2023-03-01/3fe26e2a690e4127819150915bc92da1/news_20230301165154414.jpeg' },
        { url: 'https://xhef.oss-cn-hangzhou.aliyuncs.com/xhef/2023-03-01/ffc859350a34497cbb0a3322f41ff842/news_20230301165229969.jpeg' },
        { url: 'https://xhef.oss-cn-hangzhou.aliyuncs.com/xhef/2023-03-01/e2120987af684c5992acf55eee04b533/news_20230301165252832.jpeg' },
        { url: 'https://xhef.oss-cn-hangzhou.aliyuncs.com/xhef/2023-03-01/1bf50aa8718e4a7988b49d89872af70b/news_20230301165311856.jpeg' }
      ]
    }
  }
}
</script>
