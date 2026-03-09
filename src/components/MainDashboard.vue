<template>
  <div class="app-container">
    <Sidebar />

    <main class="main-content">
      <TopBanner />

      <section class="section">
        <h3 class="section-title">메뉴</h3>
        <QuickMenu />
      </section>

      <section class="section">
        <h3 class="section-title">태영님이 투자한 배팅</h3>
        <div class="card-grid">
          <BettingCard 
            v-for="(card, index) in bettingList" 
            :key="index"
            :cardData="card"
            @click="goToDetail(card.id)"
          />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// 💡 아까 만든 Axios 인터셉터 설정 파일을 불러옵니다! (경로가 다르면 수정해주세요)
import api from '../api/axios'; 

import Sidebar from './Sidebar.vue';
import TopBanner from './TopBanner.vue';
import QuickMenu from './QuickMenu.vue';
import BettingCard from './BettingCard.vue';

const route = useRoute();
const router = useRouter();

// 배팅 카드 목록을 담을 배열
const bettingList = ref([]);

// 💡 상태별 우선순위 딕셔너리 (숫자가 작을수록 우선순위가 높음)
const statusPriority = {
  "진행중": 1,
  "진행전": 2,
  "완료": 3
};

// 백엔드에서 데이터를 불러오는 전용 함수
const fetchBettingList = async () => {
  try {
    const response = await api.get('/betting');
    
    // 💡 1. 백엔드에서 데이터가 어떻게 넘어오는지 눈으로 확인해봅니다! (F12 콘솔창 확인)
    console.log("백엔드 응답 원본:", response.data); 

    // 💡 2. 백엔드가 알려준 정확한 이름(listBettingResponseDto)으로 배열을 꺼냅니다!
    let rawData = response.data.listBettingResponseDto;

    // 💡 3. 안전 장치: rawData가 배열이 아니면 에러를 띄우고 멈춤
    if (!Array.isArray(rawData)) {
      console.error("오류: rawData가 배열이 아닙니다. 백엔드 응답 구조를 확인하세요!", rawData);
      return; // 여기서 멈춤
    }

    // 1. 상태(status) 우선순위에 따라 배열 정렬
    rawData.sort((a, b) => {
      const priorityA = statusPriority[a.status] || 4;
      const priorityB = statusPriority[b.status] || 4;
      return priorityA - priorityB;
    });

    // 2. 정렬된 데이터 중 최대 4개까지만 자르기
    const top4Cards = rawData.slice(0, 4);

    // 3. 화면 규격에 맞게 데이터 가공 및 실시간 배율/퍼센트 알고리즘 적용
    bettingList.value = top4Cards.map(card => {
      const blueCost = card.blueBettingCost || 0;
      const redCost = card.redBettingCost || 0;
      const totalCost = blueCost + redCost;

      // 💡 배당률 계산 알고리즘 (총 배팅금 / 해당 팀 배팅금)
      // 아무도 배팅하지 않아 금액이 0원일 경우 기본값 1:1.0 부여
      const calculatedBlueOdds = blueCost === 0 ? '1:1.0' : `1:${(totalCost / blueCost).toFixed(1)}`;
      const calculatedRedOdds = redCost === 0 ? '1:1.0' : `1:${(totalCost / redCost).toFixed(1)}`;

      // 💡 게이지 바 퍼센트 계산 알고리즘
      // 총 금액이 0원이면 50:50으로 표시
      const calculatedBluePercent = totalCost === 0 ? 50 : Math.round((blueCost / totalCost) * 100);
      const calculatedRedPercent = totalCost === 0 ? 50 : 100 - calculatedBluePercent;

      return {
        id: card.id, 
        title: card.title,
        blueTeam: card.blue,
        redTeam: card.red,
        blueCost: blueCost, 
        redCost: redCost,
        blueUsers: card.blueBettingCount || 0,
        redUsers: card.redBettingCount || 0,
        blueOdds: calculatedBlueOdds,       // 👈 계산된 블루팀 배당률
        redOdds: calculatedRedOdds,         // 👈 계산된 레드팀 배당률
        bluePercent: calculatedBluePercent, // 👈 계산된 블루팀 퍼센트
        redPercent: calculatedRedPercent,   // 👈 계산된 레드팀 퍼센트
        status: card.status,
        timeLeft: card.status === '진행전' ? '진행 대기중' : (card.status === '완료' ? '마감됨' : '진행중')
      };
    });

  } catch (error) {
    console.error("배팅 목록을 가져오는데 실패했습니다:", error);
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      alert("로그인이 필요하거나 인증이 만료되었습니다. 다시 로그인해 주세요.");
    }
  }
};

// 화면이 켜지자마자 실행되는 로직
onMounted(() => {
  // 1. 소셜 로그인 직후, 백엔드가 URL에 달아준 토큰(?token=...)을 낚아챕니다.
  const urlToken = route.query.token;

  if (urlToken) {
    // 2. 토큰을 브라우저 금고(로컬 스토리지)에 안전하게 저장합니다.
    localStorage.setItem('accessToken', urlToken);
    
    // 3. 보안과 깔끔한 화면을 위해 주소창의 토큰 꼬리표를 지워버립니다! (새로고침 없이 주소만 변경)
    router.replace('/');
  }

  // 4. 금고에 토큰이 있는지 확인하고, 있으면 백엔드에 카드 데이터를 달라고 요청합니다.
  const savedToken = localStorage.getItem('accessToken');
  
  if (savedToken) {
    fetchBettingList();
  } else {
    console.warn("저장된 로그인 토큰이 없습니다.");
    // 로그인이 필수인 화면이라면 여기서 강제로 로그인 페이지로 보낼 수 있습니다.
  }
});

// 카드를 클릭했을 때 실행할 함수 (상세 페이지로 이동)
const goToDetail = (bettingId) => {
  if (!bettingId) {
    alert("게시글 ID 정보가 없습니다. 백엔드 응답(DTO)에 id 필드가 있는지 확인해 주세요!");
    return;
  }
  // 실제 백엔드 DB의 id 값을 넣어서 주소를 바꿉니다. (예: /betting/1)
  router.push(`/betting/${bettingId}`); 
};
</script>

<style scoped>
.main-content {
  flex: 1;
  padding: 40px 60px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  min-width: 0;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #ffffff;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
</style>