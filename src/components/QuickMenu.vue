<template>
  <div class="quick-menu-container">
    <div class="menu-btn">
      <div class="menu-text">
        <h4>함께 배팅 목록들을 확인해볼까요?</h4>
        <p>배팅목록으로 바로가기 ></p>
      </div>
      <div class="menu-icon">✨</div>
    </div>
    
    <div class="menu-btn">
      <div class="menu-text">
        <h4>다른 사람들의 랭킹도 확인해볼까요?</h4>
        <p>랭킹으로 바로가기 ></p>
      </div>
      <div class="menu-icon">🏆</div>
    </div>
  </div>
</template>

<style scoped>
.quick-menu-container {
  display: flex;
  gap: 20px;
}

.menu-btn {
  flex: 1;
  background-color: #262730;
  border-radius: 16px;
  padding: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
}

.menu-btn:hover {
  transform: translateY(-5px);
  background-color: #2d2f3a;
}

.menu-text h4 {
  margin: 0 0 10px 0;
  font-size: 20px;
  color: #ffffff;
}

.menu-text p {
  margin: 0;
  color: #a0a5b1;
  font-size: 14px;
}

.menu-icon {
  font-size: 50px; /* 임시 이모지 크기 */
}
</style>