<template>
    <input type="text" v-model="bettingTitle">배팅 제목</input>
    <input type="text" v-model="team1Name">팀1 이름</input>
    <input type="text" v-model="team2Name">팀2 이름</input>
    <button @click="saveBetting">Save Betting</button>
</template>

<script setup>
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import api from '../api/axios';
    const router = useRouter();

    const bettingTitle = ref('');
    const team1Name = ref('');
    const team2Name = ref('');

    const saveBetting = async () => {
        try {
            const response = await api.post('/betting/save', {
                title: bettingTitle.value,
                blue: team1Name.value,
                red: team2Name.value
            });
            let savedId = response.data; // 백엔드에서 저장된 배팅의 ID를 반환한다고 가정

            router.push('/betting/' + savedId); // 저장 후 해당 배팅 상세 페이지로 이동
        } catch (error) {
            console.error('Error saving betting:', error);
        }
    };


</script>