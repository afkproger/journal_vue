<template>
<div class="welcome-form">

  <header>
    <div class="header-container">
      <button class="button" @click="goToRegister" >Зарегистрироваться</button>
      <button class="button" @click = "goToLogin">Войти</button>
    </div>
  </header>

  <main>
    <div>
      <p class="journal-text">journal</p>
    </div>
  </main>

  <footer>
    <p class="text">Регулярное ведение личного дневника способствует: развитию осознанности; лучшему пониманию себя и окружающих; исцелению от внутренней боли и пережитых травм; структурированию мыслей; улучшению памяти; развитию навыка выделять важное и второстепенное; повышению самооценки; экспрессивности; развитию креативности и творческого потенциала; возможности полного самовыражения. Не стесняться быть самим собой</p>
  </footer>

</div>


</template>

<script setup>
import '@/assets/button.css'
import { useRouter } from "vue-router";  // Используем useRouter

const router = useRouter();  // Получаем доступ к роутеру

const goToLogin = () => {
  router.push('/login');  // Переход на страницу логина
};

const goToRegister = () => {
  router.push('/register');

}

</script>

<style scoped>
.welcome-form {
  display: flex;
  flex-direction: column;
  background-image: url('@/assets/main.jpg');
  background-size: cover;
  height: 100%;
  width: 100%;
}
header {
  padding: 10px;
}

.header-container {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.button:nth-child(1) {
  animation-delay: 0.2s;
}

.button:nth-child(2) {
  animation-delay: 0.4s;
}

main {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
}

.journal-text {
  font-family: "Bauhaus 93", cursive;
  font-size: 220px;
  color: white;
  text-decoration: overline;
  text-decoration-thickness: 2px;
  opacity: 0;
  padding-left: 20px;
  margin: 10px;
  transform: translateX(-60px);
  animation: slideIn 0.8s ease-out 0.8s forwards;
  position: absolute;
  transform: translateY(-60px);
}

footer {
  background-color: black;
  color: white;
  padding: 10px;
  text-align: left;
  width: 100%;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.5s ease-out 0.6s forwards;
}

.text {
  padding: 10px;
}

@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 800px) {
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .journal-text {
    font-size: 90px;
  }

  .button{
    height: 40px;
    width: 150px;
  }

  .header-container {
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }

  .text {
    padding: 2px;
    font-size: 14px;
  }
}


</style>