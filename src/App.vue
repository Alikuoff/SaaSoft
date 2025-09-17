<template>
  <div class="app">
    <!-- Background decoration removed -->
    <AccountForm />
  </div>
</template>

<script setup lang="ts">
import AccountForm from './components/AccountForm.vue';
</script>

<style>
#app {
  min-height: 100vh;
  background: #f5f6fa;
  padding: 20px 0;
  position: relative;
  overflow-x: hidden;
}

.app {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 40px 20px;
  position: relative;
  z-index: 2;
}



/* Global styles */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}

/* Element Plus custom theme */
:root {
  --el-color-primary: #667eea;
  --el-color-primary-light-3: #8a9eff;
  --el-color-primary-light-5: #a8b5ff;
  --el-color-primary-light-7: #c6ccff;
  --el-color-primary-light-8: #d5d9ff;
  --el-color-primary-light-9: #e4e6ff;
  --el-color-primary-dark-2: #5265bb;
  --el-color-success: #11998e;
  --el-color-warning: #f093fb;
  --el-color-danger: #fc466b;
  --el-color-error: #fc466b;
  --el-color-info: #909399;
}

/* Responsive typography */
@media (max-width: 768px) {
  .app {
    padding: 20px 10px;
  }
  
  .floating-shape {
    display: none;
  }
}
</style>