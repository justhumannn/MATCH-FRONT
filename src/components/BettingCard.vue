<template>
  <div class="dark-card">
    <div class="dark-card-header">
      <h4>{{ cardData.title }}</h4>
      <p class="time-left">{{ cardData.timeLeft }}</p>
    </div>
    
    <div class="dark-card-body">
      <div class="team-names">
        <span class="team-blue">{{ cardData.blueTeam }}</span>
        <span class="divider">|</span>
        <span class="team-red">{{ cardData.redTeam }}</span>
      </div>

      <div class="stats-container">
        <div class="stats-left">
          <div class="stat-row"><span>🪙</span> {{ formatCost(cardData.blueCost) }}</div>
          <div class="stat-row"><span>🏆</span> {{ cardData.blueOdds }}</div>
          <div class="stat-row"><span>👥</span> {{ cardData.blueUsers }}</div>
        </div>
        <div class="stats-right">
          <div class="stat-row">{{ formatCost(cardData.redCost) }} <span>🪙</span></div>
          <div class="stat-row">{{ cardData.redOdds }} <span>🏆</span></div>
          <div class="stat-row">{{ cardData.redUsers }} <span>👥</span></div>
        </div>
      </div>

      <div class="percentage-container">
        <div class="percent-blue">{{ bluePercent }}%</div>
        <div class="percent-red">{{ redPercent }}%</div>
      </div>

      <div class="progress-bar-container">
        <div class="progress-blue" :style="{ width: bluePercent + '%' }"></div>
        <div class="progress-red" :style="{ width: redPercent + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// 부모(App.vue)로부터 데이터를 받아옵니다.
const props = defineProps({
  cardData: Object
});

// 금액 포맷 (만 단위)
const formatCost = (cost) => {
  return cost >= 10000 ? (cost / 10000).toFixed(1) + '만' : cost.toLocaleString();
};

// 퍼센트 자동 계산
const bluePercent = computed(() => {
  const total = props.cardData.blueCost + props.cardData.redCost;
  return total === 0 ? 50 : Math.round((props.cardData.blueCost / total) * 100);
});

const redPercent = computed(() => 100 - bluePercent.value);
</script>

<style scoped>
/* 이전 단계에서 만들었던 다크카드 CSS 완벽 적용 */
.dark-card {
  background-color: #1f2028; /* 배경과 잘 어울리는 카드색 */
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.2s;
  border: 1px solid #2a2b33;
}

.dark-card:hover { transform: translateY(-5px); border-color: #5c8aff;}

.dark-card-header {
  background-color: #272934;
  padding: 20px;
  text-align: center;
}

.dark-card-header h4 { margin: 0 0 8px 0; font-size: 16px; color: #fff;}
.time-left { margin: 0; color: #8b92a5; font-size: 12px; }

.dark-card-body { padding: 20px; }

.team-names {
  display: flex; justify-content: center; align-items: center; gap: 15px;
  margin-bottom: 25px; font-size: 15px; font-weight: bold;
}
.team-blue { color: #5c8aff; }
.team-red { color: #ff6b81; }
.divider { color: #4b505c; font-weight: normal; }

.stats-container { display: flex; justify-content: space-between; margin-bottom: 20px; }
.stat-row { color: #a0a5b1; font-size: 13px; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
.stats-left .stat-row { justify-content: flex-start; }
.stats-right .stat-row { justify-content: flex-end; }

.percentage-container {
  display: flex; justify-content: space-between; font-size: 26px; font-weight: 900; margin-bottom: 10px;
}
.percent-blue { color: #5c8aff; }
.percent-red { color: #ff6b81; }

.progress-bar-container { display: flex; height: 8px; gap: 8px; }
.progress-blue { background-color: #5c8aff; border-radius: 4px; transition: width 0.5s; }
.progress-red { background-color: #ff6b81; border-radius: 4px; transition: width 0.5s; }
</style>