<template>
  <router-view></router-view>
</template>

<style>
/* 💡 scoped를 빼고 전역 스타일로 만듭니다. 모든 페이지에 공통 적용될 바탕색과 스크롤 설정입니다. */
html, body, #app {
  margin: 0; 
  padding: 0; 
  width: 100%; 
  height: 100%;
  background-color: #121318; 
  color: white;
  overscroll-behavior: none;
  font-family: 'Pretendard', sans-serif;
}

/* 모든 페이지의 기본 레이아웃 틀 */
.app-container { 
  display: flex; 
  width: 100%; 
  min-height: 100vh; 
}
</style>