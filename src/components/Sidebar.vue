<template>
  <aside class="sidebar">
    <div class="logo">
      <h2><span class="logo-icon">◩</span> MATCH</h2>
    </div>

    <div class="user-profile">
      <div class="profile-icon">👤</div>
      <span class="user-name">한태영님</span>
    </div>

    <nav class="menu">
      <ul>
        <li class="active" @click="goToMain()"><span>🗂️</span> 홈</li>
        <li><span>⚡</span> 배팅 목록</li>
        <li><span>📊</span> 랭킹</li>
      </ul>
    </nav>

    <div class="logout">
      <span>🚪</span> 로그아웃
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToMain = () => {
  router.push('/'); 
};
</script>

<style scoped>
.sidebar {
  width: 250px;
  min-width: 250px;
  height: 100vh;
  position: sticky;
  top: 0;
  background-color: #1a1b22;
  display: flex;
  flex-direction: column;
  padding: 30px 0;
  border-right: 1px solid #2a2b33;
}

.logo {
  padding: 0 30px;
  margin-bottom: 40px;
}
.logo h2 { margin: 0; color: #ffffff; font-size: 24px; display: flex; align-items: center; gap: 10px;}
.logo-icon { color: #5c8aff; }

.user-profile {
  padding: 0 30px;
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
  color: #a0a5b1;
}
.profile-icon { font-size: 20px; }
.user-name { font-weight: bold; color: #fff;}

.menu ul { list-style: none; padding: 0; margin: 0; }
.menu li {
  padding: 15px 30px;
  color: #a0a5b1;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: 0.2s;
}

.menu li.active, .menu li:hover {
  background-color: #23242d;
  color: #5c8aff;
  border-left: 4px solid #5c8aff;
  font-weight: bold;
}

.logout {
  margin-top: auto;
  padding: 0 30px;
  color: #a0a5b1;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 15px;
}
.logout:hover { color: #ff6b81; }
</style>