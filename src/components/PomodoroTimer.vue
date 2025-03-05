<template>
  <div class="pomodoro-container">
    <h4>{{ $t('pomodoro.title') }}</h4>
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
        {{ isRunning ? $t('pomodoro.controls.pause') : $t('pomodoro.controls.start') }}
      </button>
      
      <button 
        class="control-button reset-button" 
        @click="resetTimer">
        <i class="bi bi-arrow-repeat"></i>
        {{ $t('pomodoro.controls.reset') }}
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
      <div class="counter-label">{{ $t('pomodoro.sessions') }}</div>
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
      timeLeft: 25 * 60, // 25 minutes in seconds
      isRunning: false,
      timerId: null,
      currentMode: 'pomodoro',
      completedSessions: 0,
      totalFocusTime: 0,
      dailyGoal: 8,
      showSettings: false,
      focusTime: 25,
      shortBreakTime: 5,
      longBreakTime: 15,
      autoStartBreaks: true,
      soundEnabled: true,
      canSkip: false,
      skipTimeout: null,
      modes: [
        { 
          name: 'pomodoro', 
          label: this.$t('pomodoro.modes.pomodoro'), 
          time: 25 * 60,
          color: '#8a85ff'
        },
        { 
          name: 'shortBreak', 
          label: this.$t('pomodoro.modes.shortBreak'), 
          time: 5 * 60,
          color: '#38b2ac'
        },
        { 
          name: 'longBreak', 
          label: this.$t('pomodoro.modes.longBreak'), 
          time: 15 * 60,
          color: '#4299e1'
        },
      ],
      startTime: null,
      originalTime: 25 * 60
    }
  },
  computed: {
    formatTime() {
      const minutes = Math.floor(this.timeLeft / 60);
      const seconds = this.timeLeft % 60;
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },
    formatTotalTime() {
      const hours = Math.floor(this.totalFocusTime / 60);
      const minutes = this.totalFocusTime % 60;
      return hours > 0 
        ? `${hours}h ${minutes}m` 
        : `${minutes}m`;
    },
    currentState() {
      if (this.currentMode === 'pomodoro') {
        return this.$t('pomodoro.states.focus');
      } else if (this.currentMode === 'shortBreak') {
        return this.$t('pomodoro.states.shortBreak');
      } else {
        return this.$t('pomodoro.states.longBreak');
      }
    },
    modeColor() {
      const currentModeObj = this.modes.find(mode => mode.name === this.currentMode);
      return currentModeObj ? currentModeObj.color : '#8a85ff';
    },
    progressOffset() {
      const currentModeObj = this.modes.find(mode => mode.name === this.currentMode);
      const totalTime = currentModeObj ? currentModeObj.time : 25 * 60;
      const progress = this.timeLeft / totalTime;
      const circumference = 2 * Math.PI * 110; // 2πr
      return circumference * (1 - progress);
    }
  },
  methods: {
    toggleTimer() {
      if (this.isRunning) {
        clearInterval(this.timerId);
        // Store partial completion time for focus sessions
        if (this.currentMode === 'pomodoro') {
          const timeElapsed = this.originalTime - this.timeLeft;
          this.totalFocusTime += Math.floor(timeElapsed / 60);
        }
        this.saveState();
      } else {
        if (!this.startTime && this.currentMode === 'pomodoro') {
          this.startTime = Date.now();
          this.originalTime = this.timeLeft;
        }
        
        this.timerId = setInterval(() => {
          if (this.timeLeft > 0) {
            this.timeLeft--;
            
            // Enable skip option after 50% of the time has passed
            if (!this.canSkip && this.timeLeft < this.originalTime * 0.5) {
              this.canSkip = true;
            }
            
            // Update document title with the timer
            document.title = `${this.formatTime} - ${this.currentState}`;
            
            // Save state every 15 seconds
            if (this.timeLeft % 15 === 0) {
              this.saveState();
            }
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
      this.startTime = null;
      this.canSkip = false;
      document.title = this.$t('pomodoro.title');
      this.saveState();
    },
    setMode(modeName) {
      clearInterval(this.timerId);
      this.isRunning = false;
      this.currentMode = modeName;
      const selectedMode = this.modes.find(mode => mode.name === modeName);
      this.timeLeft = selectedMode.time;
      this.originalTime = selectedMode.time;
      this.startTime = null;
      this.canSkip = false;
      document.title = this.$t('pomodoro.title');
      this.saveState();
    },
    skipTimer() {
      // Only allow skipping if timer is running and more than 50% completed or if timer is paused
      if ((this.isRunning && this.canSkip) || !this.isRunning) {
        if (this.currentMode === 'pomodoro') {
          // Add partial completion to total focus time
          const timeElapsed = this.originalTime - this.timeLeft;
          this.totalFocusTime += Math.floor(timeElapsed / 60);
        }
        this.timerComplete(true);
      }
    },
    timerComplete(skipped = false) {
      clearInterval(this.timerId);
      this.isRunning = false;
      this.startTime = null;
      this.canSkip = false;
      
      // Play sound only if not skipped and sound enabled
      if (!skipped && this.soundEnabled) {
        this.playSound();
      }
      
      // If pomodoro completed, increment session counter and update total time
      if (this.currentMode === 'pomodoro') {
        this.completedSessions++;
        
        if (!skipped) {
          // Add the full session time to total focus time
          this.totalFocusTime += this.focusTime;
        }
        
        // After 4 sessions, suggest a long break
        if (this.completedSessions % 4 === 0) {
          this.setMode('longBreak');
        } else {
          this.setMode('shortBreak');
        }
      } else {
        // If was in a break, switch back to pomodoro
        this.setMode('pomodoro');
      }
      
      // Show notification
      this.showNotification();
      
      // Auto-start if enabled and coming from a break to pomodoro or from pomodoro to break
      if (this.autoStartBreaks) {
        this.toggleTimer();
      }
      
      this.saveState();
    },
    playSound() {
      try {
        const audio = new Audio('/sounds/bell.mp3');
        audio.volume = 0.7;
        audio.play().catch(err => console.log('Error playing sound:', err));
      } catch (error) {
        console.error('Error playing sound:', error);
      }
    },
    showNotification() {
      if (Notification.permission === "granted") {
        let message = '';
        
        if (this.currentMode === 'pomodoro') {
          message = this.$t('pomodoro.notification.timeToRest');
        } else {
          message = this.$t('pomodoro.notification.timeToFocus');
        }
        
        new Notification("YuTasks", { 
          body: message,
          icon: "/img/logo.png" 
        });
      }
    },
    updateModeLabels() {
      this.modes[0].label = this.$t('pomodoro.modes.pomodoro');
      this.modes[1].label = this.$t('pomodoro.modes.shortBreak');
      this.modes[2].label = this.$t('pomodoro.modes.longBreak');
    },
    adjustTime(mode, change) {
      if (mode === 'pomodoro') {
        this.focusTime = Math.max(1, Math.min(60, this.focusTime + change));
        this.modes[0].time = this.focusTime * 60;
      } else if (mode === 'shortBreak') {
        this.shortBreakTime = Math.max(1, Math.min(30, this.shortBreakTime + change));
        this.modes[1].time = this.shortBreakTime * 60;
      } else if (mode === 'longBreak') {
        this.longBreakTime = Math.max(1, Math.min(60, this.longBreakTime + change));
        this.modes[2].time = this.longBreakTime * 60;
      }
      
      // If currently in this mode, update timeLeft
      if (this.currentMode === mode) {
        this.timeLeft = this.modes.find(m => m.name === mode).time;
        this.originalTime = this.timeLeft;
      }
      
      this.saveState();
    },
    saveState() {
      try {
        const state = {
          currentMode: this.currentMode,
          timeLeft: this.timeLeft,
          completedSessions: this.completedSessions,
          totalFocusTime: this.totalFocusTime,
          focusTime: this.focusTime,
          shortBreakTime: this.shortBreakTime,
          longBreakTime: this.longBreakTime,
          autoStartBreaks: this.autoStartBreaks,
          soundEnabled: this.soundEnabled,
          lastSaved: new Date().toISOString()
        };
        
        localStorage.setItem('pomodoroState', JSON.stringify(state));
      } catch (error) {
        console.error('Error saving state:', error);
      }
    },
    loadState() {
      try {
        const savedState = localStorage.getItem('pomodoroState');
        
        if (savedState) {
          const state = JSON.parse(savedState);
          
          // Load saved settings
          this.focusTime = state.focusTime || 25;
          this.shortBreakTime = state.shortBreakTime || 5;
          this.longBreakTime = state.longBreakTime || 15;
          this.autoStartBreaks = state.autoStartBreaks !== undefined ? state.autoStartBreaks : true;
          this.soundEnabled = state.soundEnabled !== undefined ? state.soundEnabled : true;
          
          // Update mode times
          this.modes[0].time = this.focusTime * 60;
          this.modes[1].time = this.shortBreakTime * 60;
          this.modes[2].time = this.longBreakTime * 60;
          
          // Last session (only restore if saved within the last 24 hours)
          const lastSaved = new Date(state.lastSaved || null);
          const now = new Date();
          const diff = (now - lastSaved) / (1000 * 60 * 60); // hours
          
          if (diff < 24) {
            this.currentMode = state.currentMode || 'pomodoro';
            this.timeLeft = state.timeLeft || this.modes[0].time;
            this.completedSessions = state.completedSessions || 0;
            this.totalFocusTime = state.totalFocusTime || 0;
          } else {
            // If saved state is old, just keep settings but reset session
            this.currentMode = 'pomodoro';
            this.timeLeft = this.modes[0].time;
            this.completedSessions = 0;
            this.totalFocusTime = 0;
          }
          
          this.originalTime = this.timeLeft;
        }
      } catch (error) {
        console.error('Error loading state:', error);
      }
    },
    checkDailyReset() {
      try {
        const lastDate = localStorage.getItem('pomodoroLastDate');
        const today = new Date().toLocaleDateString();
        
        if (lastDate !== today) {
          // Reset daily counters but keep settings
          this.completedSessions = 0;
          this.totalFocusTime = 0;
          localStorage.setItem('pomodoroLastDate', today);
          this.saveState();
        }
      } catch (error) {
        console.error('Error checking daily reset:', error);
      }
    },
    checkTimerSync() {
      if (this.startTime && this.isRunning) {
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const expected = this.originalTime - elapsed;
        
        // If the difference is more than 2 seconds, sync the timer
        if (Math.abs(expected - this.timeLeft) > 2) {
          this.timeLeft = Math.max(0, expected);
          
          // If timer should have completed while page was hidden
          if (this.timeLeft <= 0) {
            this.timerComplete();
          }
        }
      }
    }
  },
  mounted() {
    // Request notification permissions
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
    
    // Update mode labels based on current language
    this.updateModeLabels();
    
    // Add listener for language changes
    this.$root.$on('language-changed', () => {
      this.updateModeLabels();
    });
    
    // Load saved state and check for daily reset
    this.loadState();
    this.checkDailyReset();
    
    // Set window title back to normal when component is loaded
    document.title = this.$t('pomodoro.title');
    
    // Add event listeners for visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && this.isRunning) {
        // Sync timer if page becomes visible and timer is running
        this.checkTimerSync();
      }
    });
    
    // Page unload handler to save state
    window.addEventListener('beforeunload', () => {
      this.saveState();
    });
  },
  beforeUnmount() {
    // Clear any running timers
    if (this.timerId) {
      clearInterval(this.timerId);
    }
    if (this.skipTimeout) {
      clearTimeout(this.skipTimeout);
    }
    
    // Remove event listeners
    this.$root.$off('language-changed');
    document.removeEventListener('visibilitychange', this.checkTimerSync);
    
    // Reset window title
    document.title = 'YuTasks';
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