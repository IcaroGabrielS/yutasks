<template>
  <div class="ambient-sounds-container">
    <h4>Sons Ambientessss</h4>
    <div class="sound-buttons">
      <button 
        v-for="sound in ambientSounds" 
        :key="sound.id"
        class="sound-button"
        :class="{ active: sound.isPlaying }"
        @click="toggleSound(sound.id)">
        <i :class="sound.icon"></i>
        <span>{{ sound.name }}</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AmbientSounds',
  data() {
    return {
      audioPlayers: {},
      ambientSounds: [
        { id: 'rain', name: 'Chuva', icon: 'bi bi-cloud-rain', isPlaying: false, url: 'assets/sounds/brown-noise.mp3' },
        { id: 'forest', name: 'Floresta', icon: 'bi bi-tree', isPlaying: false, url: '/sounds/forest.mp3' },
        { id: 'cafe', name: 'Cafeteria', icon: 'bi bi-cup-hot', isPlaying: false, url: '/sounds/cafe.mp3' },
        { id: 'waves', name: 'Ondas', icon: 'bi bi-water', isPlaying: false, url: '/sounds/waves.mp3' },
        { id: 'fire', name: 'Lareira', icon: 'bi bi-fire', isPlaying: false, url: '/sounds/fire.mp3' },
        { id: 'wind', name: 'Vento', icon: 'bi bi-wind', isPlaying: false, url: '/sounds/wind.mp3' },
      ]
    }
  },
  methods: {
    // Métodos para gerenciar sons ambientais
    toggleSound(id) {
      const sound = this.ambientSounds.find(s => s.id === id);
      
      if (sound.isPlaying) {
        // Parar o som
        if (this.audioPlayers[id]) {
          this.audioPlayers[id].pause();
          this.audioPlayers[id].currentTime = 0;
        }
      } else {
        // Iniciar o som
        if (!this.audioPlayers[id]) {
          this.audioPlayers[id] = new Audio(sound.url);
          this.audioPlayers[id].loop = true;
          this.audioPlayers[id].volume = 0.5;
        }
        this.audioPlayers[id].play();
      }
      
      // Atualizar o estado
      sound.isPlaying = !sound.isPlaying;
    },
    stopAllSounds() {
      this.ambientSounds.forEach(sound => {
        if (sound.isPlaying) {
          this.toggleSound(sound.id);
        }
      });
    }
  },
  mounted() {
    // Cleanup when component unmounts
    window.addEventListener('beforeunload', this.stopAllSounds);
  },
  beforeUnmount() {
    this.stopAllSounds();
    window.removeEventListener('beforeunload', this.stopAllSounds);
  }
}
</script>

<style scoped>
.ambient-sounds-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

h4 {
  font-size: 1.1rem;
  color: var(--text-color);
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

h4:before {
  content: '';
  display: block;
  width: 3px;
  height: 16px;
  background-color: var(--primary-color);
  border-radius: 2px;
}

/* Estilos da seção de sons ambientais */
.sound-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.8rem;
}

.sound-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border: none;
  border-radius: 12px;
  background-color: #333333;
  color: #a0a0a0;
  transition: all 0.25s ease;
  cursor: pointer;
  gap: 0.5rem;
}

.sound-button i {
  font-size: 1.5rem;
}

.sound-button span {
  font-size: 0.9rem;
  font-weight: 500;
}

.sound-button:hover {
  background-color: #444444;
  color: #e0e0e0;
}

.sound-button.active {
  background-color: rgba(138, 133, 255, 0.15);
  color: #8a85ff;
}

/* Responsividade */
@media (max-width: 768px) {
  .sound-buttons {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .sound-buttons {
    grid-template-columns: 1fr;
  }
}
</style>