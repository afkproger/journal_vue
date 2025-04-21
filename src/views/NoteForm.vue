<template>
  <HeaderForm/>
  <div class="note-form">
    <div class="notes-page">
      <div class="notes-sidebar">
        <h2>Мои записи</h2>
        <div class="notes-list">
          <div v-for="note in notes" :key="note.id" class="note-item" @click="openNote(note.id)">
            <h3>{{ note.title }}</h3>
            <p class="note-date">{{ note.date }}</p>
            <p class="note-description">{{ note.description }}</p>
          </div>
        </div>
        <button class="button" @click="addNote">Добавить запись</button>
      </div>

      <div class="notes-editor">
        <div class="toolbar">
          <input
              v-model="currentNote.title"
              type="text"
              class="toolbar-button"
              placeholder="Название записи"
          />
          <input
              v-model="currentNote.description"
              type="text"
              class="toolbar-button"
              placeholder="Название записи"
          />
          <button class="toolbar-button" @click="formatText('bold')"><b>B</b></button>
          <button class="toolbar-button" @click="formatText('italic')"><i>I</i></button>
          <button class="toolbar-button" @click="formatText('underline')"><u>U</u></button>
          <button class="toolbar-button" @click="insertLink">🔗</button>
          <button class="toolbar-button" @click="clearFormatting">❌</button>
        </div>
        <div
            class="drop-zone"
            @dragover.prevent="handleDragOver"
            @dragleave="handleDragLeave"
            @drop.prevent="handleDrop"
            @click="handleDropZoneClick"
        >
          Перетащите сюда изображения или нажмите, чтобы выбрать файлы.
        </div>
        <div
            ref="noteContent"
            contenteditable="true"
            class="note-content"
            @input="updateContent"
            aria-placeholder="true"
        ></div>
        <div class="editor-buttons">
          <button class="button" @click="saveNote">Сохранить</button>
          <button class="button delete-button" @click="deleteNote">Удалить запись</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import HeaderForm from "@/components/HeaderForm.vue";
import makeFetch from "@/functions/checkPermission";
import urls from "@/URL";
import Swal from "sweetalert2";
import getMessage from "@/functions/message";
import '@/assets/button.css'


const notes = ref([])

const currentNoteId = ref(null)
const noteContent = ref(null)

const currentNote = reactive({
  id: null,
  title: '',
  content: '',
  description: ''
})

const isDragging = ref(false)

const openNote = (id) => {
  const note = notes.value.find((n) => n.id === id)
  if (note) {
    currentNoteId.value = id
    currentNote.id = note.id
    currentNote.title = note.title
    currentNote.content = note.content
    currentNote.description = note.description
  }
}

const addNote = async () => {
  const newNote = {
    title: `Новая запись ${notes.value.length + 1}`,
    date: new Date().toISOString().split('T')[0],
    description: 'Описание новой записи.',
    content: '  '
  }
  const response = await makeFetch(urls.NOTE , 'POST', newNote);
  if (response.ok){
    const data = await response.json();
    await Swal.fire(getMessage("", "Новая запись добавлена", 'success'));
    notes.value.push(data)
    openNote(newNote.id)
  }else {
    await Swal.fire(getMessage("", "Ошибка при создании новой записи", 'error'));
  }
}

const saveNote = async () => {
  if (currentNoteId.value !== null) {
    const note = notes.value.find((n) => n.id === currentNoteId.value)
    if (note) {
      note.title = currentNote.title
      note.content = noteContent.value.innerHTML
      note.description = currentNote.description

      const response = await makeFetch(urls.NOTE,'POST', note);
      if (response.ok){
        await Swal.fire(getMessage("Успешно", "Запись успешно сохранена", 'success'));
      }else {
        await Swal.fire(getMessage("", "Ошибка при сохранении записи, повторите позже", 'error'));
      }
    }
  } else {
    await Swal.fire(getMessage("", "Нет активной записи для сохранения", 'error'));
  }
}

const deleteNote = async () => {
  if (currentNoteId.value !== null) {
    const data = { note_id: currentNoteId.value };
    const response = await makeFetch(urls.NOTE,'DELETE', data);
    if (response.ok){
      await Swal.fire(getMessage("", "Запись удалена", 'success'));
      notes.value = notes.value.filter((n) => n.id !== currentNoteId.value)
      currentNoteId.value = null
      currentNote.title = ''
      currentNote.content = ''
      if (noteContent.value) {
        noteContent.value.innerHTML = ''
      }
    }else {
      await Swal.fire(getMessage("", "Ошибка при удалении записи", 'error'));
    }
  } else {
    await Swal.fire(getMessage("", "Нет активной записи для удаления.", 'error'));
  }
}

const formatText = (command) => {
  document.execCommand(command, false, null)
}

const insertLink = () => {
  const url = prompt('Введите URL ссылки:')
  if (url) {
    document.execCommand('createLink', false, url)
  }
}

const clearFormatting = () => {
  console.log(notes.value)
  document.execCommand('removeFormat', false, null)
}

const handleDragOver = () => {
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

const handleDrop = (e) => {
  isDragging.value = false
  const files = e.dataTransfer.files
  handleFiles(files)
}

const handleDropZoneClick = () => {
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = 'image/*'
  fileInput.multiple = true
  fileInput.onchange = (e) => handleFiles(e.target.files)
  fileInput.click()
}

const handleFiles = (files) => {
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = document.createElement('img')
        img.src = e.target.result
        noteContent.value.appendChild(img)
        currentNote.content = noteContent.value.innerHTML
      }
      reader.readAsDataURL(file)
    }
  }
}

const updateContent = () => {
  if (noteContent.value) {
    currentNote.content = noteContent.value.innerHTML
  }
}

watch(() => currentNote.content, (newContent) => {
  if (noteContent.value && noteContent.value.innerHTML !== newContent) {
    noteContent.value.innerHTML = newContent
  }
})

async function getNotes() {
  const response = await makeFetch(urls.NOTE);
  if (!response.ok) {
    await Swal.fire(getMessage("Ошибка", "Ошибка при загрузке записей, повторите попытку позже", 'error'));
  } else {
    const data = await response.json();

    notes.value = data || [];
    console.log(notes.value)

    if (notes.value.length > 0) {
      openNote(notes.value[0].id);
    }
  }
}

onMounted(() => {
  getNotes();
})
</script>

<style scoped>
header {
  background-color: #776d63;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
.note-form {
  display: flex;
  background-color: #5c524f;
  color: white;
  background-size: cover;
  height: 100%;
  width: 100%;
}

#file-input {
  display: none;
}

.drop-zone {
  border: 2px dashed #ccc;
  padding: 20px;
  text-align: center;
  margin-top: 10px;
  cursor: pointer;
}

.drop-zone.dragover {
  border-color: #000;
  background-color: #f0f0f0;
}

.note-content img {
  max-width: 100%;
  height: auto;
  margin: 10px 0;
}

header {
  background-color: #776d63;
}

.notes-page {
  display: flex;
  width: 100%;
  height: calc(100vh - 100px);
  margin-top: 20px;
}

.notes-sidebar {
  width: 250px;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-right: 2px solid rgba(255, 255, 255, 0.2);
}

.notes-sidebar h2 {
  margin: 0 0 20px;
  font-size: 24px;
  color: white;
}

.notes-list {
  height: calc(100vh - 240px);
  overflow-y: auto;
}

.note-item {
  padding: 10px;
  margin: 10px 0;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.note-item:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.note-item h3 {
  margin: 0;
  font-size: 1.1em;
  color: white;
}

.note-date {
  font-size: 0.8em;
  color: rgba(255, 255, 255, 0.7);
  margin: 5px 0;
}

.note-description {
  font-size: 0.9em;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.notes-editor {
  flex: calc(100% - 100px);
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  margin-left: 20px;
  display: flex;
  flex-direction: column;
}

#editor-title {
  margin: 0 0 20px;
  font-size: 24px;
  color: white;
}

.toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.toolbar-button {
  background-color: transparent;
  color: white;
  border: 2px solid white;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toolbar-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.note-content {
  flex: 1;
  min-height: 200px;
  max-height: calc(100vh - 350px);
  overflow-y: auto;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: white;
  line-height: 1.5;
  text-align: left;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.note-content:empty::before {
  content: '';
  display: block;
}

.editor-buttons {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.delete-button {
  background-color: transparent;
  border-color: #ff4d4d;
  color: #ff4d4d;
}

.delete-button:hover {
  background-color: rgba(255, 77, 77, 0.3);
}

@media (max-width: 800px) {
  .note-form {
    overflow: scroll;
  }
  .notes-page {
    display: flex;
    margin: 10px auto 0 auto;
    gap: 10px;
    flex-direction: column;
    height: auto;
    width: calc(100% - 40px);
  }

  .notes-sidebar {
    width: calc(100% - 40px);
    height: auto;
    border-right: none;
    border-bottom: 2px solid rgba(255, 255, 255, 0.2);
    padding-bottom: 80px;
  }

  .notes-sidebar h2 {
    margin-bottom: 10px;
  }

  .notes-list {
    height: 300px;
    margin-bottom: 10px;
  }

  .notes-editor {
    margin-left: 0;
    margin-top: 20px;
    height: auto;
    padding: 15px;
  }

  .note-content {
    flex: 1;
    min-height: 200px;
    max-height: calc(100vh - 350px);
    overflow-y: auto;
    padding: 10px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    color: white;
    line-height: 1.5;
    text-align: left;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .toolbar-button {
    font-size: 0.8em;
    padding: 5px 10px;
  }

  .button {
    width: 100%;
    margin: 0 auto 0 auto;
  }
}
</style>