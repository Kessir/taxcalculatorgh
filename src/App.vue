<template>
  <div id="app">
    <div id="nav" class="container grid-480">
      <router-link to="/">Income Taxes</router-link> |
      <router-link to="/sales-tax">Sales Taxes</router-link>
    </div>
    <router-view />
  </div>
</template>

<style>
@import "assets/styles/tailwind.postcss";

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
