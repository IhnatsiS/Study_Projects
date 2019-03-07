<template>
  <div>
    <div class="row justify-content-center registration-container">
      <div class=" w-100 registration-form-title-container">
        <h1>Sign up</h1>
      </div>
      <form class="registration-form col-md-5" v-on:submit="signUp">
        <div class="form-row">
        </div>
        <div class="form-group">
          <label htmlFor="input-username">Username</label>
          <input
            v-model="username"
            type="text"
            class="form-control"
            id="input-username"
            placeholder="Username"
          />
        </div>
        <div class="form-group">
          <label htmlFor="input-password">Password</label>
          <input
            v-model="password"
            name="password"
            type="password"
            class="form-control"
            id="input-password"
            placeholder="Password"
          />
        </div>
        <div class="registration-button-container">
          <button
            type="submit"
            class="btn btn-primary registration-button col-md-12"
            :disabled="!username || !password"
          >
            Sign up
          </button>
        </div>
        <div class="login-link-container">
          <router-link to="/login" class="log-in-link">Login</router-link>
        </div>
      </form>
    </div>
    <div class="row justify-content-center">
      <div class="alert alert-danger col-md-4 mt-4 alert-container" role="alert" v-if="isSignUpFailed">
        <!--An error occurred during registration-->
        {{errorText}}
      </div>
    </div>
  </div>
</template>

<script>
  import TasksService from '../../services/TasksService';

  export default {
    name: "RegistrationPage",
    data() {
      return {
        username: '',
        password: '',
        isSignUpFailed: false,
        errorText: ''
      }
    },
    methods: {
      signUp(e) {
        e.preventDefault();
        this.isSignUpFailed = false;
        TasksService.signUpUser({username: this.username, password: this.password})
          .then(res => {
            this.$router.replace('/login');
          })
          .catch(err => {
            this.errorText = err.response.data;
            this.isSignUpFailed = true;
          })
      }
    }
  }
</script>

<style scoped>
  .alert-container {
    text-align: center;
  }

  .registration-container {
    margin-top: 10%;
  }

  .registration-form-title-container {
    text-align: center;
  }

  .login-link-container {
    margin-top: 10px;
    text-align: center;
  }
</style>
