<template>
  <div>
    <TopNav />
    <Nuxt />
  </div>
</template>

<script>
import TopNav from "./partials/TopNav";

export default {
  components: {
    TopNav
  }
};
</script>

<style type="text/css">
  html, body {
    font-size: 14px;
  }
</style>
