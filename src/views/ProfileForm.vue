<template>
  <HeaderForm/>
  <div class="profile-form">
    <div class="profile-page">
      <div class="profile-info">
        <h2>Личный кабинет</h2>
        <div class="user-details">
          <p><strong>Почта:</strong> {{ email }}</p>
          <p><strong>Фамилия:</strong> {{ middle_name }}</p>
          <p><strong>Никнейм:</strong> {{ username }}</p>
        </div>
      </div>

      <div class="add-friend">
        <h3>Добавить в друзья</h3>
        <div class="friend-input">
          <input type="text" v-model="friend_username" placeholder="Введите никнейм">
          <button class="button" @click="addFriend">Добавить</button>
        </div>
      </div>

      <div class="logout-section">
        <button class="button delete-button"  @click="logout()">Выйти из аккаунта</button>
      </div>
    </div>
  </div>

</template>


<script setup>
import HeaderForm from "@/components/HeaderForm.vue";
import {onMounted , ref} from "vue";
import Swal from 'sweetalert2';
import urls from '@/URL'

import { useRouter } from "vue-router";
import makeFetch from "@/functions/checkPermission";
import getMessage from '@/functions/message'

const router = useRouter();

const username = ref("");
const email = ref("");
const middle_name = ref("");
const friend_username = ref("");


async function addFriend () {
  const data = { friend: friend_username.value };
  const response = await makeFetch(urls.FRIENDSHIP , 'POST' , data);
  let title = '';
  let text = '';
  let icon = ''
  if (response.ok) {
    title = 'Успешно';
    text = `Пользователь ${friend_username.value} добавлен в ваш список друзей`;
    icon = 'success'
  }else {
    title = "Ошибка";
    text = "Пользователя с таким никнеймом не существует, повторите попытку";
    icon = 'error';
  }
  await Swal.fire(getMessage(title, text, icon))
}

const logout = () => {
  localStorage.clear();
  router.push("/login");
}


const showAlert = () => {
  let title = 'Ошибка авторизации';
  let text = 'Ошибка при получении данных авторизации, обратитесь в поддержку';
  let icon = 'error'
  Swal.fire(getMessage(title, text, icon))
}

const init = () => {
  try {
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");
    const storedMiddleName = localStorage.getItem("middle_name");

    if (!storedUsername || !storedEmail || !storedMiddleName) {
      throw new Error("Данные авторизации не найдены");
    }

    username.value = storedUsername;
    email.value = storedEmail;
    middle_name.value = storedMiddleName;

    console.log(username.value, email.value, middle_name.value);
  } catch (e) {
    showAlert();
    router.push("/login");
  }
};

onMounted(()=>{
  init();
})

</script>

<style scoped>
.profile-form {
  display: flex;
  background-color: #5c524f;
  color: white;
  background-size: cover;
  height: 100%;
  width: 100%;
}
header {
  background-color: #776d63;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
.profile-page {
  width: 90%;
  max-width: 600px;
  max-height: 70%;
  margin: 20px auto;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.profile-info h2 {
  margin: 0 0 20px;
  font-size: 24px;
  color: white;
}

.user-details {
  margin-bottom: 20px;
}

.user-details p {
  margin: 10px 0;
  font-size: 1.1em;
  color: white;
}

.user-details strong {
  color: rgba(255, 255, 255, 0.8);
}

/* Блок добавления в друзья */
.add-friend {
  margin-bottom: 20px;
}

.add-friend h3 {
  margin: 0 0 10px;
  font-size: 20px;
  color: white;
}

.friend-input {
  display: flex;
  gap: 10px;
}

.friend-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 15px;
  font-size: 16px;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.friend-input input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

/* Кнопка выхода из аккаунта */
.logout-section {
  text-align: center;
}

.delete-button {
  background-color: transparent;
  border-color: #ff4d4d;
  color: #ff4d4d;
}

.delete-button:hover {
  background-color: rgba(255, 77, 77, 0.3);
}

/* Адаптация для мобильных устройств */
@media (max-width: 800px) {
  .profile-page {
    width: 100%;
    margin: 20px auto;
    padding: 20px;
  }

  .friend-input {
    flex-direction: column;
  }

  .friend-input input {
    width: 70%;
  }

  .button {
    width: 100%;
    font-size: 0.8em;
    padding: 10px;
  }
}
</style>