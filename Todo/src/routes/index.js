import Auth from '../components/Auth/Auth'
import MainPage from '../components/MainPage/MainPage'
import RegistrationPage from '../components/RegistrationPage/RegistrationPage'

const routes = [
  {
    path: '/login',
    component: Auth
  },
  {
    path: '/main',
    component: MainPage,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('token');

      if (!token) {
        next('/login')
      }

      next();
    }
  },
  {
    path: '/signup',
    component: RegistrationPage
  },
  {
    path: '*',
    redirect: '/main'
  }
];

export default routes;


