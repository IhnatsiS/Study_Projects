<template>
  <div>
    <div class="row justify-content-md-center">
      <div class="logo-container">
        <img class="auth-logo"
             src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Vue.js_Logo.svg/2000px-Vue.js_Logo.svg.png"
             alt="Auth form logo">
      </div>
    </div>
    <div class="row justify-content-md-center">
      <form class="col-md-4" @submit.prevent="login">
        <div class="form-group">
          <label for="exampleInputLogin">Login</label>
          <input type="text" class="form-control" id="exampleInputLogin" aria-describedby="emailHelp"
                 placeholder="Enter login" v-model="username">
        </div>
        <div class="form-group ">
          <label for="exampleInputPassword1">Password</label>
          <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password"
                 v-model="password">
        </div>
        <button :disabled="!username || !password" type="submit" class="btn btn-primary col-md-12" v-on:click="login">Log in</button>
        <div class="log-in-link-container">
          <router-link to="/signup">Sign up</router-link>
        </div>
      </form>
    </div>
    <div class="row justify-content-center">
      <div class="alert alert-danger col-md-4 mt-5" role="alert" v-if="isLoginFailed">
        Password or username is incorrect!
      </div>
    </div>
  </div>
</template>

<script>
  import TasksService from '../../services/TasksService';
  import setAuthorizationToken from '../../util/authorizationToken';

  export default {
    name: "Auth",
    data() {
      return {
        username: '',
        password: '',
        isLoginFailed: false
      }
    },
    methods: {
      login(e) {
        e.preventDefault();
        this.isLoginFailed = false;

        TasksService.authUser({username: this.username, password: this.password})
          .then(res => {
            const token = res.data;

            localStorage.setItem('token', token);

            setAuthorizationToken(token);
            this.$router.replace('/main');
          })
          .catch(err => {
            this.isLoginFailed = true;
          });

        this.password = '';
      }
    }
  }
</script>

<style scoped>
  .auth-logo {
    width: 150px;
  }

  .log-in-link-container {
    margin-top: 10px;
    text-align: center;
  }
</style>
