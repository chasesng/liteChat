
<template>

  <!-- <div id="app" class="bgControl" :style="{ backgroundImage: `url(${require('./assets/whitebg.jpg')})`}"> -->
    <!-- <div id="app" class="bgControl" style="background-color:rgba(243,246,251,255)"> -->
      <div id="app" class="bgControl" style="background-color:rgba(33,33,45,255) ">
  
  
    <LoadingScreen v-if="isLoading"></LoadingScreen>
  
    <headerControl v-if="!['chatPage'].includes($route.name)"/>

  </div>
  </template>
  
  <script>
  import LoadingScreen from "@/subComponent/loadingScreen";
  import headerControl from '@/components/headerControl.vue'
  // import footerControl from '@/components/footerControl.vue'
  
  export default {
    computed: {
      
    },
    name: "App",
    state: {
    user: {
      loggedIn: false,
      data: null
    },
  
    getters: {
      user(state){
        return state.user
      }
    },
    mutations: {
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
    },
    SET_USER(state, data) {
      state.user.data = data;
    }
  }
  
  },
    data() {
      return {
        isLoading: true
      }
    },
    methods: {
      
    },
    mounted() {
      setTimeout(() => {
        this.isLoading = false;
      }, 1500);
    },
    
  
    components: {     
      headerControl,
      // footerControl,
      LoadingScreen
      
     },
  
   
  }
  
  </script>
  
  <style>
  /* #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  } */
  /* * {
  padding: 0px;
  margin: 0px;
  box-sizing: border-box;
} */
  
body:not(.index-page) {
  margin: 0;
  height: 100%;
  overflow: hidden;
}
  </style>
  