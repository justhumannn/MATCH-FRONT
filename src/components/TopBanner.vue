<template>
  <div class="banner">
    <div class="banner-content">
      <h1 class="welcome-text">한태영님, 환영합니다!</h1>
      <hr class="divider" />
      <div class="user-stats">
        <p>현재 내 자산 : <strong>100,000,000 코인</strong></p>
        <p>현재 내 랭킹 : <strong>1등</strong></p>
      </div>
    </div>
    <div class="banner-image">🐳</div>
  </div>
</template>

<style scoped>
.banner {
  background: linear-gradient(135deg, #3a5cff, #5778ff);
  border-radius: 20px;
  padding: 40px 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}

.banner-content { z-index: 2; }

.welcome-text {
  font-size: 32px;
  font-weight: 900;
  margin: 0 0 15px 0;
}

.divider {
  border: none;
  height: 2px;
  background-color: rgba(255, 255, 255, 0.3);
  margin-bottom: 20px;
  width: 100%;
}

.user-stats p {
  margin: 8px 0;
  font-size: 18px;
  opacity: 0.9;
}

.banner-image {
  font-size: 100px; /* 임시 이모지 크기 */
  z-index: 2;
  filter: drop-shadow(0 10px 10px rgba(0,0,0,0.2));
}
</style>