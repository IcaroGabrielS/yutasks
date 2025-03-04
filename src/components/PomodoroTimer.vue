<template>
    <div class="pomodoro-container">
      <h4>Pomodoro Timer</h4>
      <div class="timer-display">
        <div class="timer">{{ formatTime }}</div>
        <div class="timer-state">{{ currentState }}</div>
      </div>
      
      <div class="timer-controls">
        <button 
          class="control-button" 
          :class="{ active: !isRunning }"
          @click="toggleTimer">
          <i :class="isRunning ? 'bi bi-pause-fill' : 'bi bi-play-fill'"></i>
          {{ isRunning ? 'Pausar' : 'Iniciar' }}
        </button>
        
        <button 
          class="control-button reset-button" 
          @click="resetTimer">
          <i class="bi bi-arrow-repeat"></i>
          Reiniciar
        </button>
      </div>
      
      <div class="timer-modes">
        <button 
          v-for="mode in modes" 
          :key="mode.name"
          class="mode-button"
          :class="{ active: currentMode === mode.name }"
          @click="setMode(mode.name)">
          {{ mode.label }}
        </button>
      </div>
      
      <div class="session-counter">
        <div class="counter-label">Sessões concluídas</div>
        <div class="counter-display">
          <span 
            v-for="n in 4" 
            :key="n" 
            class="counter-dot"
            :class="{ completed: completedSessions >= n }">
          </span>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PomodoroTimer',
    data() {
      return {
        timeLeft: 25 * 60, // 25 minutos em segundos
        isRunning: false,
        timerId: null,
        currentMode: 'pomodoro',
        completedSessions: 0,
        modes: [
          { name: 'pomodoro', label: 'Pomodoro', time: 25 * 60 },
          { name: 'shortBreak', label: 'Pausa Curta', time: 5 * 60 },
          { name: 'longBreak', label: 'Pausa Longa', time: 15 * 60 },
        ]
      }
    },
    computed: {
      formatTime() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      },
      currentState() {
        if (this.currentMode === 'pomodoro') {
          return 'Tempo de Foco';
        } else if (this.currentMode === 'shortBreak') {
          return 'Pausa Curta';
        } else {
          return 'Pausa Longa';
        }
      }
    },
    methods: {
      toggleTimer() {
        if (this.isRunning) {
          clearInterval(this.timerId);
        } else {
          this.timerId = setInterval(() => {
            if (this.timeLeft > 0) {
              this.timeLeft--;
            } else {
              this.timerComplete();
            }
          }, 1000);
        }
        this.isRunning = !this.isRunning;
      },
      resetTimer() {
        clearInterval(this.timerId);
        const currentModeObj = this.modes.find(mode => mode.name === this.currentMode);
        this.timeLeft = currentModeObj.time;
        this.isRunning = false;
      },
      setMode(modeName) {
        clearInterval(this.timerId);
        this.isRunning = false;
        this.currentMode = modeName;
        const selectedMode = this.modes.find(mode => mode.name === modeName);
        this.timeLeft = selectedMode.time;
      },
      timerComplete() {
        clearInterval(this.timerId);
        this.isRunning = false;
        
        // Reproduzir som de alerta
        const audio = new Audio('/sounds/bell.mp3');
        audio.play();
        
        // Se foi um pomodoro completo, incrementar contador de sessões
        if (this.currentMode === 'pomodoro') {
          this.completedSessions++;
          
          // Após 4 sessões, sugerir pausa longa
          if (this.completedSessions % 4 === 0) {
            this.setMode('longBreak');
          } else {
            this.setMode('shortBreak');
          }
        } else {
          // Se estava em pausa, voltar para pomodoro
          this.setMode('pomodoro');
        }
        
        // Notificar o usuário
        if (Notification.permission === "granted") {
          new Notification("YuTasks", { 
            body: `${this.currentState} finalizado!`,
            icon: "/img/logo.png" 
          });
        }
      }
    },
    mounted() {
      // Solicitar permissão para notificações
      if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
      }
    },
    beforeUnmount() {
      if (this.timerId) {
        clearInterval(this.timerId);
      }
    }
  }
  </script>
  
  <style scoped>
  .pomodoro-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  h4 {
    font-size: 1.1rem;
    color: var(--text-color);
    font-weight: 600;
    margin-bottom: 0.2rem;
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
  
  .timer-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    background-color: #333333;
    border-radius: 50%;
    width: 180px;
    height: 180px;
    justify-content: center;
    box-shadow: 
      0 6px 12px rgba(0, 0, 0, 0.3),
      inset 0 2px 4px rgba(255, 255, 255, 0.1);
    margin: 0 auto;
  }
  
  .timer {
    font-size: 2.5rem;
    font-weight: 700;
    color: #e0e0e0;
    letter-spacing: 1px;
  }
  
  .timer-state {
    font-size: 0.9rem;
    font-weight: 500;
    color: #a0a0a0;
    margin-top: 0.5rem;
  }
  
  .timer-controls {
    display: flex;
    gap: 1rem;
    width: 100%;
  }
  
  .control-button {
    flex: 1;
    padding: 0.8rem;
    border: none;
    border-radius: 8px;
    background-color: #444444;
    color: #e0e0e0;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  
  .control-button:hover {
    background-color: #555555;
  }
  
  .control-button.active {
    background-color: #8a85ff;
    color: white;
  }
  
  .control-button i {
    font-size: 1.2rem;
  }
  
  .reset-button {
    background-color: #333333;
  }
  
  .reset-button:hover {
    background-color: #444444;
  }
  
  .timer-modes {
    display: flex;
    width: 100%;
    gap: 0.5rem;
  }
  
  .mode-button {
    flex: 1;
    padding: 0.6rem 0;
    border: none;
    border-radius: 6px;
    background-color: #333333;
    color: #a0a0a0;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .mode-button:hover {
    background-color: #444444;
    color: #e0e0e0;
  }
  
  .mode-button.active {
    background-color: rgba(138, 133, 255, 0.15);
    color: #8a85ff;
  }
  
  .session-counter {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  
  .counter-label {
    font-size: 0.9rem;
    color: #a0a0a0;
  }
  
  .counter-display {
    display: flex;
    gap: 0.5rem;
  }
  
  .counter-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #333333;
    transition: all 0.3s ease;
  }
  
  .counter-dot.completed {
    background-color: #8a85ff;
  }
  </style>