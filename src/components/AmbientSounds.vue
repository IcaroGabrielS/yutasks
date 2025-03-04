<template>
  <div class="ambient-sounds-container">
    <h4>{{ $t('ambientSounds.title') }}</h4>
    <div class="sound-buttons">
      <button 
        v-for="sound in ambientSounds" 
        :key="sound.id"
        class="sound-button"
        :class="{ active: sound.isPlaying }"
        @click="toggleSound(sound.id)">
        <i :class="sound.icon"></i>
        <span>{{ $t(`ambientSounds.sounds.${sound.id}`) }}</span>
      </button>
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

export default {
  name: 'AmbientSounds',
  data() {
    return {
      audioPlayers: {},
      ambientSounds: [
        { id: 'brownNoise', icon: 'bi bi-hypnotize', isPlaying: false, url: brownNoiseSound },
        { id: 'rain', icon: 'bi bi-cloud-drizzle', isPlaying: false, url: rainSound },
        { id: 'underWater', icon: 'bi bi-water', isPlaying: false, url: underWaterSound },
        { id: 'clock', icon: 'bi bi-clock', isPlaying: false, url: clockSound },
        { id: 'fan', icon: 'bi bi-fan', isPlaying: false, url: fanSound },
        { id: 'birds', icon: 'bi bi-feather', isPlaying: false, url: birdsSound },
      ]
    }
  },
  methods: {
    /**
     * Alterna entre tocar e pausar o som selecionado
     * @param {string} id - Identificador do som
     */
    toggleSound(id) {
      const sound = this.ambientSounds.find(s => s.id === id);
      
      if (sound.isPlaying) {
        this.stopSound(id);
      } else {
        this.playSound(id, sound);
      }
      
      // Atualiza o estado
      sound.isPlaying = !sound.isPlaying;
    },

    /**
     * Inicia a reprodução do som
     * @param {string} id - Identificador do som
     * @param {Object} sound - Objeto do som
     */
    playSound(id, sound) {
      try {
        // Verifica se já existe um player
        if (!this.audioPlayers[id]) {
          const soundName = this.$t(`ambientSounds.sounds.${sound.id}`);
          console.log(`Criando player para ${soundName} com URL: ${sound.url}`);
          this.audioPlayers[id] = new Audio(sound.url);
          this.audioPlayers[id].loop = true;
          this.audioPlayers[id].volume = 1;
          
          // Adicionar listener para debug
          this.audioPlayers[id].addEventListener('error', (e) => {
            console.error(`Erro ao carregar áudio ${soundName}:`, e);
          });
        }
        
        // Tenta reproduzir o áudio e loga qualquer erro que ocorra
        const playPromise = this.audioPlayers[id].play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              const soundName = this.$t(`ambientSounds.sounds.${sound.id}`);
              console.log(`${soundName} está tocando`);
            })
            .catch(error => {
              const soundName = this.$t(`ambientSounds.sounds.${sound.id}`);
              console.error(`Erro ao reproduzir ${soundName}:`, error);
              // Exibir uma mensagem para o usuário seria útil aqui
              alert(`Não foi possível reproduzir o som: ${error.message}`);
            });
        }
      } catch (error) {
        const soundName = this.$t(`ambientSounds.sounds.${sound.id}`);
        console.error(`Erro inesperado ao tentar reproduzir ${soundName}:`, error);
        alert(`Erro ao iniciar a reprodução do áudio: ${error.message}`);
      }
    },

    /**
     * Para a reprodução do som
     * @param {string} id - Identificador do som
     */
    stopSound(id) {
      if (this.audioPlayers[id]) {
        this.audioPlayers[id].pause();
        this.audioPlayers[id].currentTime = 0;
        console.log(`${id} foi pausado`);
      }
    },

    /**
     * Para todos os sons ativos
     */
    stopAllSounds() {
      this.ambientSounds.forEach(sound => {
        if (sound.isPlaying) {
          this.toggleSound(sound.id);
        }
      });
    },
    
    /**
     * Verifica e loga se o arquivo de som existe
     */
    verifyAudioFiles() {
      console.log('Verificando arquivos de áudio:');
      this.ambientSounds.forEach(sound => {
        const soundName = this.$t(`ambientSounds.sounds.${sound.id}`);
        console.log(`${soundName}: ${sound.url}`);
        const testAudio = new Audio(sound.url);
        testAudio.addEventListener('canplaythrough', () => {
          console.log(`${soundName}: áudio carregado com sucesso`);
        });
        testAudio.addEventListener('error', () => {
          console.error(`${soundName}: erro ao carregar áudio`);
        });
      });
    },
    
    /**
     * Atualiza os nomes dos sons com base no idioma atual
     */
    updateSoundNames() {
      // Atualize os nomes dos sons com base no idioma atual
      this.ambientSounds.forEach(sound => {
        // Use o id do som para buscar a tradução correspondente
        const translationKey = `ambientSounds.sounds.${sound.id}`;
        // Logue a tradução para depuração
        console.log(`Atualizando ${sound.id} para: ${this.$t(translationKey)}`);
      });
    }
  },
  mounted() {
    // Cleanup when component unmounts
    window.addEventListener('beforeunload', this.stopAllSounds);
    
    // Verifica e loga informações sobre os arquivos de áudio
    this.verifyAudioFiles();
    
    // Adicionar listener para a mudança de idioma
    this.$root.$on('language-changed', () => {
      this.updateSoundNames();
    });
    
    console.log('AmbientSounds componente montado');
  },
  beforeUnmount() {
    this.stopAllSounds();
    this.$root.$off('language-changed');
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