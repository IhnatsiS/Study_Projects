<template>
  <div>
    <div class="row justify-content-end mt-2">
      <button class="btn btn-primary flex-end" v-on:click="logOut">Log out</button>
    </div>
    <div class="row justify-content-md-center mt-5">
      <h1>{{ this.username }}`s tasks</h1>
    </div>
    <div v-if="tasks.length" class="row justify-content-md-center">
      <table class="table col-md-12">
        <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Task</th>
          <th scope="col">Date</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(task, index) in tasks" :key="task.id">
          <th scope="row">{{index + 1}}</th>
          <td>{{task.text}}</td>
          <td
            v-bind:class="{'overdue-date': checkDate(task.finishDate)}"
          >
            {{task.finishDate}}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-else="!tasks.length" class="row justify-content-center">
      <h4>No active tasks</h4>
    </div>
    <div class="row justify-content-center mt-4">
      <form class="form-inline">
        <div class="form-group">
          <input v-model="taskText" type="text" class="form-control mr-1" id="task-text-input" placeholder="New task">
          <input v-model="taskFinishDate" type="date" class="form-control mr-1" id="date-complete"
                 placeholder="New task">
        </div>
        <button :disabled="!taskText || !taskFinishDate" v-on:click="addTask" type="button" class="btn btn-primary">
          Add
        </button>
      </form>
    </div>
    <div class="row" v-if="isAdmin">
      <div class="admin-panel-container jumbotron col-md-12">
        <h1 class="display-4 admin-panel-title">Admin panel</h1>
        <div class="row admin-panel-content-container">
          <div class="col-md-4 users-list-container">
            <h2 class="text-center">Users</h2>
            <ul class="list-group">
              <li
                class="list-group-item user-name-container"
                v-for="user in usersList"
                :key="user._id"
                :data-id="user._id"
                v-on:click="selectUser"
              >
                {{user.username}}
              </li>
            </ul>
          </div>
          <div class="col-md-8 user-tasks-container">
            <div v-if="selectedUser">
              <div class="btn-group task-status-buttons" role="group" aria-label="Basic example">
                <button type="button" class="btn btn-secondary" v-on:click="showAllTasks">All</button>
                <button type="button" class="btn btn-secondary" v-on:click="showActiveTasks">Active</button>
                <button type="button" class="btn btn-secondary" v-on:click="showOverdueTasks">Overdue</button>
              </div>
              <h1 class="text-center">{{ selectedUser.username }}</h1>
              <h4 v-if="!displayingTasks.length" class="text-center">No tasks of this category</h4>
              <table v-else="displayingTasks.length" class="table col-md-12">
                <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Task</th>
                  <th scope="col">Date</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(task, index) in displayingTasks" :key="task.id">
                  <th scope="row">{{index + 1}}</th>
                  <td>{{task.text}}</td>
                  <td
                    v-bind:class="{'overdue-date': checkDate(task.finishDate)}"
                  >
                    {{task.finishDate}}
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <div class="select-user-message-container" v-else="!selectedUser">Select User</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import TasksService from '../../services/TasksService';
  import isDateOverdue from '../../util/checkDateOnOverdue';

  export default {
    name: "MainPage",
    data() {
      return {
        tasks: [],
        username: '',
        taskText: '',
        taskFinishDate: '',
        isAdmin: false,
        selectedUser: null,
        displayingTasks: null
      }
    },
    methods: {
      getUserData() {
        TasksService.fetchUserData()
          .then(res => {
            const {username, tasks, isAdmin, usersList} = res.data;
            this.tasks = tasks;
            this.username = username;
            this.isAdmin = isAdmin;
            this.usersList = usersList;
          }).catch(err => {
          console.log(err);
          this.$router.replace('/login');
        });
      },
      checkDate(date) {
        return isDateOverdue(date);
      },
      logOut() {
        this.$router.replace('/login');
        localStorage.clear();
      },
      addTask() {
        TasksService.addTask({taskText: this.taskText, taskFinishDate: this.taskFinishDate})
          .then(res => {
            this.taskText = '';
            this.taskFinishDate = '';
            this.getUserData();
          });
      },
      selectUser(e) {
        const usersId = e.target.getAttribute('data-id');
        TasksService.fetchExactUserData(usersId)
          .then(res => {
            this.selectedUser = res.data;
            this.displayingTasks = this.selectedUser.tasks;
          })
          .catch(err => {
            this.selectedUser = null;
          })
      },
      showAllTasks() {
        this.displayingTasks = this.selectedUser.tasks;
      },
      showActiveTasks() {
        const {tasks} = this.selectedUser;
        this.displayingTasks = tasks.filter(task => !isDateOverdue(task.finishDate));
      },
      showOverdueTasks() {
        const {tasks} = this.selectedUser;
        this.displayingTasks = tasks.filter(task => isDateOverdue(task.finishDate));
      }
    },
    mounted: function () {
      this.getUserData()
    }
  }
</script>

<style scoped>
  .overdue-date {
    color: #ff0f07;
  }

  .admin-panel-container {
    margin-top: 100px;
  }

  .admin-panel-title {
    text-align: center;
    margin-bottom: 20px;
  }

  .admin-panel-content-container {
    margin-top: 50px;
  }

  .task-status-buttons {
    display: flex;
    margin: 10px auto;
    width: 90%;
  }

  .user-tasks-container {
    background: white;
  }

  .user-name-container {
    text-align: center;
    cursor: pointer;
    font-size: 22px;
  }

  .user-name-container:hover {
    background: #e9ecef;
  }


  .select-user-message-container {
    height: 100%;
    font-size: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
