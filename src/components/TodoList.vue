<template>
    <div class="tasks-section">
      <h4>Tarefas</h4>
      <div class="tasks-container">
        <!-- Input para adicionar tarefa -->
        <div class="task-input-container">
          <input 
            v-model="newTask" 
            type="text" 
            placeholder="Adicionar nova tarefa..." 
            class="task-input"
            @keyup.enter="addTask"
          >
          <button class="add-task-button" @click="addTask">
            <i class="bi bi-plus"></i>
          </button>
        </div>
        
        <!-- Lista de tarefas -->
        <div class="tasks-list" v-if="tasks.length > 0">
          <div 
            v-for="(task, index) in tasks" 
            :key="index"
            class="task-item"
            :class="{ completed: task.completed }"
          >
            <div class="task-checkbox" @click="toggleTaskComplete(index)">
              <i v-if="task.completed" class="bi bi-check-circle-fill"></i>
              <i v-else class="bi bi-circle"></i>
            </div>
            <div class="task-content" @click="toggleTaskComplete(index)">{{ task.text }}</div>
            <button class="task-delete" @click="deleteTask(index)">
              <i class="bi bi-x"></i>
            </button>
          </div>
        </div>
        
        <!-- Mensagem quando não há tarefas -->
        <div class="no-tasks" v-else>
          <i class="bi bi-journal-check"></i>
          <p>Sua lista de tarefas está vazia</p>
          <span>Adicione tarefas para organizar seus estudos</span>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TodoList',
    data() {
      return {
        newTask: '',
        tasks: []
      }
    },
    methods: {
      // Métodos para gerenciar tarefas
      addTask() {
        if (this.newTask.trim()) {
          this.tasks.push({
            text: this.newTask.trim(),
            completed: false
          });
          this.newTask = '';
          this.saveTasks();
        }
      },
      toggleTaskComplete(index) {
        this.tasks[index].completed = !this.tasks[index].completed;
        this.saveTasks();
      },
      deleteTask(index) {
        this.tasks.splice(index, 1);
        this.saveTasks();
      },
      saveTasks() {
        localStorage.setItem('yutasks-tasks', JSON.stringify(this.tasks));
      },
      loadTasks() {
        const savedTasks = localStorage.getItem('yutasks-tasks');
        if (savedTasks) {
          try {
            this.tasks = JSON.parse(savedTasks);
          } catch (e) {
            console.error('Erro ao carregar tarefas:', e);
            this.tasks = [];
          }
        }
      }
    },
    mounted() {
      this.loadTasks();
    }
  }
  </script>
  
  <style scoped>
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
  
  /* Estilos da seção de tarefas */
  .tasks-section {
    display: flex;
    flex-direction: column;
  }
  
  .tasks-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .task-input-container {
    display: flex;
    gap: 0.5rem;
  }
  
  .task-input {
    flex: 1;
    padding: 0.8rem 1rem;
    background-color: #333333;
    border: none;
    border-radius: 8px;
    color: #e0e0e0;
    font-size: 0.95rem;
  }
  
  .task-input::placeholder {
    color: #777777;
  }
  
  .task-input:focus {
    outline: 1px solid rgba(138, 133, 255, 0.4);
  }
  
  .add-task-button {
    padding: 0 1rem;
    background-color: #8a85ff;
    border: none;
    border-radius: 8px;
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .add-task-button:hover {
    background-color: #7a75ef;
  }
  
  .add-task-button i {
    font-size: 1.3rem;
  }
  
  .tasks-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-height: 280px;
    overflow-y: auto;
    padding-right: 0.5rem;
  }
  
  /* Estilização da barra de rolagem */
  .tasks-list::-webkit-scrollbar {
    width: 4px;
  }
  
  .tasks-list::-webkit-scrollbar-track {
    background: #333333;
    border-radius: 10px;
  }
  
  .tasks-list::-webkit-scrollbar-thumb {
    background-color: #555555;
    border-radius: 10px;
  }
  
  .task-item {
    display: flex;
    align-items: center;
    padding: 0.8rem;
    background-color: #333333;
    border-radius: 8px;
    gap: 0.8rem;
    transition: all 0.2s ease;
  }
  
  .task-item:hover {
    background-color: #3a3a3a;
  }
  
  .task-checkbox {
    cursor: pointer;
    color: #777777;
    display: flex;
    align-items: center;
  }
  
  .task-checkbox i {
    font-size: 1.2rem;
  }
  
  .task-content {
    flex: 1;
    color: #e0e0e0;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .task-delete {
    background: none;
    border: none;
    color: #777777;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0.2rem;
    border-radius: 4px;
    transition: all 0.2s ease;
  }
  
  .task-delete:hover {
    color: #ff7e7e;
    background-color: rgba(255, 126, 126, 0.1);
  }
  
  .task-item.completed .task-content {
    color: #777777;
    text-decoration: line-through;
  }
  
  .task-item.completed .task-checkbox {
    color: #8a85ff;
  }
  
  .no-tasks {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    background-color: #333333;
    border-radius: 8px;
    gap: 0.5rem;
    text-align: center;
  }
  
  .no-tasks i {
    font-size: 2rem;
    color: #555555;
    margin-bottom: 0.5rem;
  }
  
  .no-tasks p {
    color: #e0e0e0;
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
  }
  
  .no-tasks span {
    color: #777777;
    font-size: 0.85rem;
  }
  </style>