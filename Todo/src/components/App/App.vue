<template>
  <div class="container">
    <router-view></router-view>
  </div>
</template>
<script>
  import Auth from '../Auth/Auth';
  import MainPage from '../MainPage/MainPage';
  import setAuthorizationToken from '../../util/authorizationToken';

  export default {
    components: {
      AppAuth: Auth,
      AppMainPage: MainPage
    },
    beforeMount() {
      const token = localStorage.getItem('token');
      setAuthorizationToken(token);
    }
  }
</script>


