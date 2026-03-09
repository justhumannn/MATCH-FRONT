<template>
  <div class="app-container">
    <Sidebar />

    <main class="main-content" v-if="match.title">
      <section class="header-section">
        <div class="back-btn" @click="goBack">
          <span>&lt; 돌아가기</span>
        </div>
        
        <div class="title-row">
          <h2>{{ match.title }}</h2>
          </div>
        </section>

      <section class="input-section">
        <div class="input-group">
          <label>배팅할 팀을 선택해 주세요</label>
          <div class="team-buttons">
            <button 
              :class="['team-btn', { active: selectedTeam === 'blue' }]"
              @click="selectedTeam = 'blue'"
            >
              {{ match.blueTeam }}
            </button>
            <button 
              :class="['team-btn', { active: selectedTeam === 'red' }]"
              @click="selectedTeam = 'red'"
            >
              {{ match.redTeam }}
            </button>
          </div>
        </div>

        <div class="input-group">
          <label>배팅할 금액을 입력해 주세요</label>
          <input type="number" class="amount-input" v-model="betAmount" placeholder="금액을 입력해 주세요" />
        </div>
      </section>

      <section class="status-section">
        <h3 class="status-title">현황</h3>

        <div class="team-status-block" v-for="team in teamStats" :key="team.id">
          <div class="status-header">
            <h1 class="team-name" :class="team.textColor">{{ team.name }}</h1>
            <h1 class="team-percent" :class="team.textColor">{{ team.percent }}%</h1>
            <div class="bar-wrapper">
              <div class="bar-fill" :class="team.bgColor" :style="{ width: team.percent + '%' }"></div>
            </div>
          </div>
          
          <div class="stats-row">
            <span>🪙 {{ formatCost(team.cost) }}</span>
            <span>🏆 {{ team.odds }}</span>
            <span>👥 {{ team.users }}</span>
          </div>

          <div class="my-bet-info">
            <span>현재 내 배팅 상황 <strong>{{ team.myBet.toLocaleString() }}</strong></span>
            <span>배팅 성공 시 환급량 <strong>{{ team.expectedReturn.toLocaleString() }}</strong></span>
          </div>
        </div>
      </section>
    </main>

    <main class="main-content loading" v-else>
      <h2>데이터를 불러오는 중입니다... 🚀</h2>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Sidebar from './Sidebar.vue';
import api from '../api/axios';

const route = useRoute();
const router = useRouter();

// 주소창에서 id 값 낚아채기
const currentId = route.params.id; 

const selectedTeam = ref(null);
const betAmount = ref(''); // 사용자가 입력한 배팅 금액
const myAsset = ref(100000000); // 임시 내 자산
const match = ref({}); 
const teamStats = ref([]); 

// 💡 금액 포맷팅 함수 (10000 이상이면 '만' 단위로 변환)
const formatCost = (cost) => {
  if (cost === 0) return '0';
  return cost >= 10000 ? (cost / 10000).toFixed(1) + '만' : cost.toLocaleString();
};

const fetchBettingDetail = async () => {
  try {
    const response = await api.get(`/betting/${currentId}`);
    console.log("배팅 상세 응답 원본:", response.data);
    
    // 💡 상세 페이지는 배열이 아니라 '단일 객체'를 반환합니다.
    // 백엔드 응답 구조에 맞게 수정하세요. (바로 객체라면 response.data, DTO로 감싸져있다면 response.data.bettingResponseDto)
    let rawData = response.data.bettingResponseDto || response.data; 

    // 1. 공통 매치 정보 저장
    match.value = {
      title: rawData.title,
      blueTeam: rawData.blue,
      redTeam: rawData.red,
      status: rawData.status
    };

    // 2. 배팅 금액 및 배당률/퍼센트 계산 알고리즘
    const blueCost = rawData.blueBettingCost || 0;
    const redCost = rawData.redBettingCost || 0;
    const totalCost = blueCost + redCost;

    const blueOddsRaw = blueCost === 0 ? 1.0 : (totalCost / blueCost);
    const redOddsRaw = redCost === 0 ? 1.0 : (totalCost / redCost);

    const blueOdds = `1:${blueOddsRaw.toFixed(1)}`;
    const redOdds = `1:${redOddsRaw.toFixed(1)}`;

    const bluePercent = totalCost === 0 ? 50 : Math.round((blueCost / totalCost) * 100);
    const redPercent = totalCost === 0 ? 50 : 100 - bluePercent;

    // 💡 임시 내 배팅 금액 (UI 구현용 - 추후 백엔드 데이터와 연결)
    const mockMyBet = 100000;

    // 3. UI의 v-for 반복문을 위해 블루팀, 레드팀 정보를 배열로 묶어줍니다.
    teamStats.value = [
      {
        id: 'blue',
        name: rawData.blue,
        textColor: 'blue-text',
        bgColor: 'blue-bg',
        cost: blueCost,
        odds: blueOdds,
        users: rawData.blueBettingCount || 0,
        percent: bluePercent,
        myBet: mockMyBet,
        expectedReturn: Math.floor(mockMyBet * blueOddsRaw) // 내가 배팅한 금액 * 배당률
      },
      {
        id: 'red',
        name: rawData.red,
        textColor: 'red-text',
        bgColor: 'red-bg',
        cost: redCost,
        odds: redOdds,
        users: rawData.redBettingCount || 0,
        percent: redPercent,
        myBet: mockMyBet,
        expectedReturn: Math.floor(mockMyBet * redOddsRaw)
      }
    ];

  } catch (error) {
    console.error("배팅 상세 정보를 가져오는데 실패했습니다:", error);
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      alert("로그인이 필요하거나 인증이 만료되었습니다. 다시 로그인해 주세요.");
    }
  }
};

// 화면 진입 시 데이터 호출
onMounted(() => {
  fetchBettingDetail();
});

// 뒤로 가기
const goBack = () => {
  router.push('/'); 
};
</script>

<style scoped>
/* 이전과 동일한 상세 페이지 CSS 유지 */
.main-content { flex: 1; padding: 50px 80px; display: flex; flex-direction: column; min-width: 0; }
.loading { justify-content: center; align-items: center; }
.header-section { margin-bottom: 50px; }
.back-btn { color: #a0a5b1; font-size: 14px; cursor: pointer; margin-bottom: 20px; display: inline-block; }
.back-btn:hover { color: #ffffff; }
.title-row { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 15px; }
.title-row h2 { margin: 0; font-size: 32px; font-weight: bold; }

.input-section { display: flex; gap: 60px; margin-bottom: 60px; }
.input-group { display: flex; flex-direction: column; gap: 15px; }
.input-group label { color: #a0a5b1; font-size: 14px; }
.team-buttons { display: flex; gap: 20px; }
.team-btn { background-color: transparent; border: 1px solid #3a3b42; color: #a0a5b1; padding: 15px 40px; border-radius: 30px; font-size: 16px; cursor: pointer; transition: all 0.2s; }
.team-btn:hover { border-color: #ffffff; color: #ffffff; }
.team-btn.active { border-color: #5c8aff; color: #5c8aff; background-color: rgba(92, 138, 255, 0.1); }
.amount-input { background-color: transparent; border: 1px solid #3a3b42; color: #ffffff; padding: 15px 25px; border-radius: 30px; font-size: 16px; width: 300px; outline: none; }
.amount-input:focus { border-color: #5c8aff; }

.status-section { display: flex; flex-direction: column; gap: 40px; }
.status-title { color: #a0a5b1; font-size: 14px; margin: 0; font-weight: normal; }
.team-status-block { display: flex; flex-direction: column; gap: 20px; }
.status-header { display: flex; align-items: center; gap: 20px; }
.team-name { margin: 0; font-size: 36px; font-weight: 900; }
.team-percent { margin: 0; font-size: 36px; font-weight: 900; width: 80px; }
.blue-text { color: #5c8aff; } .red-text { color: #ff6b81; }
.blue-bg { background-color: #5c8aff; } .red-bg { background-color: #ff6b81; }

.bar-wrapper { flex: 1; max-width: 400px; height: 24px; background-color: #262730; border-radius: 12px; overflow: hidden; }
.bar-fill { height: 100%; border-radius: 12px; transition: width 0.5s ease-in-out; }
.stats-row { display: flex; gap: 30px; color: #ffffff; font-size: 16px; margin-left: 5px; }
.my-bet-info { display: flex; gap: 40px; color: #a0a5b1; font-size: 14px; margin-top: 10px; margin-left: 5px; }
.my-bet-info strong { color: #ffffff; font-size: 16px; }
</style>