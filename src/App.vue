<template>
  <div id="app" :style="{ backgroundImage: `url(${require('@/assets/background.jpg')})` }">
    <div class="overlay"></div>
    
    <main class="main-container">
      <!-- Bloco maior que envolve os subblocos -->
      <div class="main-block">
        <div class="blocks-container">
          <!-- Primeira coluna -->
          <div class="sub-block pomodoro-block">
            <pomodoro-timer></pomodoro-timer>
          </div>
          
          <!-- Segunda coluna (com duas seções) -->
          <div class="sub-block sounds-tasks-block">
            <!-- Seção de Sons Ambiente -->
            <div class="sounds-section">
              <ambient-sounds></ambient-sounds>
            </div>
            
            <!-- Seção de Lista de Tarefas -->
            <div class="tasks-section">
              <todo-list></todo-list>
            </div>
          </div>
          
          <!-- Terceira coluna (com duas seções) -->
          <div class="sub-block lofi-block">
            <!-- Seção de Player do YouTube -->
            <youtube-player></youtube-player>
            
            <!-- Seção de Anúncio -->
            <ad-space></ad-space>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import PomodoroTimer from './components/PomodoroTimer.vue';
import AmbientSounds from './components/AmbientSounds.vue';
import TodoList from './components/TodoList.vue';
import YoutubePlayer from './components/YoutubePlayer.vue';
import AdSpace from './components/AdSpace.vue';

export default {
  name: 'App',
  components: {
    PomodoroTimer,
    AmbientSounds,
    TodoList,
    YoutubePlayer,
    AdSpace
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&display=swap');
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css');

:root {
  --primary-color: #8a85ff;
  --primary-dark: #6c63ff;
  --secondary-color: #ff7e5f;
  --text-color: #e0e0e0;
  --text-muted: #a0a0a0;
  --main-block-bg: #000000;
  --sub-block-bg: #222222;
  --shadow-sm: 0 4px 6px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 8px 16px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 12px 24px rgba(0, 0, 0, 0.5);
  --border-radius: 16px;
  --border-light: 1px solid rgba(255, 255, 255, 0.1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Nunito', sans-serif;
  color: var(--text-color);
  line-height: 1.6;
  background-color: #121212;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  position: relative;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 0;
}

.main-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem 2rem;
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
}

.main-block {
  width: 100%;
  background-color: var(--main-block-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
  padding: 2.5rem;
  border: var(--border-light);
}

.blocks-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
}

.sub-block {
  background-color: var(--sub-block-bg);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  padding: 1.8rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: var(--border-light);
}

.sub-block:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.sounds-section, .tasks-section {
  margin-bottom: 2.5rem;
}

.sounds-section:last-child, .tasks-section:last-child {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .blocks-container {
    grid-template-columns: 1fr;
  }
  
  .main-container {
    padding: 2rem 1rem;
    align-items: flex-start;
    overflow-y: auto;
  }
  
  .main-block {
    padding: 1.8rem 1.2rem;
  }
}
</style>