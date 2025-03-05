<template>
  <div class="ambient-sounds-container">
    <h4>{{ $t('ambientSounds.title') }}</h4>
    <div class="sound-buttons">
      <button 
        v-for="sound in ambientSounds" 
        :key="sound.id"
        class="sound-button"
        :class="{ active: sound.isPlaying }"
        @click="toggleSound(sound)">
        <i :class="sound.icon"></i>
        <span>{{ $t(`ambientSounds.sounds.${sound.id}`) }}</span>
      </button>
    </div>
    <!-- Barra de volume única (sempre visível) -->
    <div class="volume-control">
      <input 
        type="range" 
        min="0" 
        max="1" 
        step="0.1" 
        v-model="globalVolume"
        @input="setGlobalVolume"
        class="volume-slider"
      />
    </div>
  </div>
</template>

<script>
import brownNoiseSound from '@/assets/sounds/brown-noise.mp3';
import underWaterSound from '@/assets/sounds/underwater.mp3';
import rainSound from '@/assets/sounds/rain.mp3';
import clockSound from '@/assets/sounds/clock.mp3';
import fanSound from '@/assets/sounds/fan.mp3';
import birdsSound from '@/assets/sounds/birds.mp3';
import { eventBus } from '@/eventBus'; // Importe o eventBus

export default {
  name: 'AmbientSounds',
  data() {
    return {
      audioPlayers: {},
      ambientSounds: [
        { id: 'brownNoise', icon: 'bi bi-hypnotize', isPlaying: false, url: brownNoiseSound, volume: 1 },
        { id: 'rain', icon: 'bi bi-cloud-drizzle', isPlaying: false, url: rainSound, volume: 1 },
        { id: 'underWater', icon: 'bi bi-water', isPlaying: false, url: underWaterSound, volume: 1 },
        { id: 'clock', icon: 'bi bi-clock', isPlaying: false, url: clockSound, volume: 1 },
        { id: 'fan', icon: 'bi bi-fan', isPlaying: false, url: fanSound, volume: 1 },
        { id: 'birds', icon: 'bi bi-feather', isPlaying: false, url: birdsSound, volume: 1 },
      ],
      globalVolume: 1, // Volume global inicial
    };
  },
  methods: {
    toggleSound(sound) {
      if (sound.isPlaying) {
        this.stopSound(sound);
      } else {
        this.playSound(sound);
      }
      sound.isPlaying = !sound.isPlaying;
    },
    playSound(sound) {
      try {
        if (!this.audioPlayers[sound.id]) {
          this.audioPlayers[sound.id] = new Audio(sound.url);
          this.audioPlayers[sound.id].loop = true;
          this.audioPlayers[sound.id].volume = this.globalVolume; // Usa o volume global
          
          this.audioPlayers[sound.id].addEventListener('error', (e) => {
            console.error(`Erro ao carregar áudio ${sound.id}:`, e);
          });
        }
        
        const playPromise = this.audioPlayers[sound.id].play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log(`${sound.id} está tocando`);
            })
            .catch(error => {
              console.error(`Erro ao reproduzir ${sound.id}:`, error);
              alert(`Não foi possível reproduzir o som: ${error.message}`);
            });
        }
      } catch (error) {
        console.error(`Erro inesperado ao tentar reproduzir ${sound.id}:`, error);
        alert(`Erro ao iniciar a reprodução do áudio: ${error.message}`);
      }
    },
    stopSound(sound) {
      if (this.audioPlayers[sound.id]) {
        this.audioPlayers[sound.id].pause();
        this.audioPlayers[sound.id].currentTime = 0;
        console.log(`${sound.id} foi pausado`);
      }
    },
    stopAllSounds() {
      this.ambientSounds.forEach(sound => {
        if (sound.isPlaying) {
          this.stopSound(sound);
          sound.isPlaying = false;
        }
      });
    },
    // Ajusta o volume global de todos os sons ativos
    setGlobalVolume() {
      this.ambientSounds.forEach(sound => {
        if (sound.isPlaying && this.audioPlayers[sound.id]) {
          this.audioPlayers[sound.id].volume = this.globalVolume;
        }
      });
    },
    verifyAudioFiles() {
      console.log('Verificando arquivos de áudio:');
      this.ambientSounds.forEach(sound => {
        const testAudio = new Audio(sound.url);
        testAudio.addEventListener('canplaythrough', () => {
          console.log(`${sound.id}: áudio carregado com sucesso`);
        });
        testAudio.addEventListener('error', () => {
          console.error(`${sound.id}: erro ao carregar áudio`);
        });
      });
    },
    updateSoundNames() {
      this.ambientSounds.forEach(sound => {
        const translationKey = `ambientSounds.sounds.${sound.id}`;
        console.log(`Atualizando ${sound.id} para: ${this.$t(translationKey)}`);
      });
    }
  },
  mounted() {
    window.addEventListener('beforeunload', this.stopAllSounds);
    this.verifyAudioFiles();

    // Use eventBus para ouvir eventos
    eventBus.on('language-changed', this.updateSoundNames);

    console.log('AmbientSounds componente montado');
  },
  beforeUnmount() {
    this.stopAllSounds();
    eventBus.off('language-changed', this.updateSoundNames);
    window.removeEventListener('beforeunload', this.stopAllSounds);
  }
};
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

.volume-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.volume-slider {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: #444444;
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.volume-slider:hover {
  opacity: 1;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #8a85ff;
  cursor: pointer;
}

.volume-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #8a85ff;
  cursor: pointer;
}

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