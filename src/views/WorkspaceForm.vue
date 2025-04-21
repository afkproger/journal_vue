<template>
  <div class="workspace">
    <HeaderForm/>
  </div>
</template>

<script setup>
import HeaderForm from "@/components/HeaderForm.vue";
import {onMounted} from "vue";
import urls from '@/URL'
import makeFetch from '@/functions/checkPermission'


onMounted(async () => {
  const response = await makeFetch(urls.WORKSPACE);
  const data = await response.json();
  console.log(data)
  localStorage.setItem("username" , data.username);
  localStorage.setItem("email", data.email);
  localStorage.setItem("middle_name" , data.middle_name);
});
</script>

<style scoped>
.workspace {
  display: flex;
  background-image: url('@/assets/main.jpg');
  background-size: cover;
  height: 100%;
  width: 100%;
}
</style>