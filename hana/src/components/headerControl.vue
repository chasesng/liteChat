<template>
  <div class="f" style="height:28.7px;opacity:.2;background-color:black;position:absolute;top:60px;width:100vw">

  </div>
  <div class="header f" style="position:absolute;top:0px;height:28.7px;width:100vw">

  </div>
  <div style="width:100vw;height:8.5vh;position:fixed;top:0;background-color:rgba(42,48,109,255)"></div>
  <div style="width:100vw;height:8.5vh;position:fixed;bottom:0;background-color:rgba(42,48,109,255)"></div>

  <div style="width:100vw;background-color:rgba(42,48,109,255); height:8vh;position:fixed;bottom:0;z-index:200;opacity:1" v-show="$route.name !== 'chat'">
        <div class="f" justify-content:space-evenly>
            <div v-if="isLoggedin" style="width:33%;height:7vh;" @click="go('/Search')" class="mobileNav">
                <i class="fa-solid fa-magnifying-glass"
                    style="color:white;font-size:3.5vh;vertical-align: middle;margin-top:2vh"></i>
            </div>
            <div v-if="isLoggedin" style="width:33%;height:7vh;filter:brightness(.9)" @click="go('/')" class="mobileNav">
                <i class="fa-solid fa-house" style="color:white;font-size:3.5vh;vertical-align: middle;margin-top:2vh"></i>
            </div>
            <div v-if="!isLoggedin" style="width:33%;height:7vh;" @click="go('/Login')" class="mobileNav">
                <i class="fa-solid fa-gear" style="color:white;font-size:3.5vh;vertical-align: middle;margin-top:2vh"></i>
            </div>
            <div v-if="isLoggedin" style="width:33%;height:7vh;" @click="go('/Profile')" class="mobileNav">
                <i class="fa-solid fa-user" style="color:white;font-size:3.5vh;vertical-align: middle;margin-top:2vh"></i>
            </div>

        </div>
    </div>
  <router-view />
</template>


<script setup>


import { onMounted, ref } from 'vue'
// import { useRouter } from 'vue-router';
import { getAuth, onAuthStateChanged } from '@firebase/auth';


const isLoggedin = ref(false);
// const router = useRouter();
var usname = ref('');

let auth;


onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedin.value = true;
      usname = user.email;


    }
    else {
      isLoggedin.value = false;
    }
    return {
      usname
    }
  })
})



</script>

<script>
export default {
  methods: {
    go(val) {
      this.$router.push({ path: val })
    }
  }
}
</script>

<style scoped>
#authenticationNavs {
  float: right;
  margin-right: 3%;
  margin-top: -90px;
  display: flex;
  list-style: none;

}

.headNavs {
  padding: .5% 5%;
  text-decoration: none;
}

.sideNav {
  font-size: 26pt;
  transition: font-size .2s;

}

.sideNav:hover {
  font-size: 2.5em;
}

.fa {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif
}

.eaControl:hover {
  background-color: lightgray;
  transition: background-color .3s;
}


</style>
