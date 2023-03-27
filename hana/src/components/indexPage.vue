
<template style="width:100vw;">
  <br />

  <p class="wt p5" style="margin-top:5vh">Lite Chat</p>
  <p class="wt p8" style="float:left;margin-left:2%;opacity:.5">Viewing All Chats</p>
 
  <div v-for="(chat, index) in chats.filter(chat => String(chat.participants).split(',').includes(usID)).sort((a, b) => b.timeUpdated - a.timeUpdated)" :key="index">
    <router-link :to="'/chatPage/' + chat.id"  class="wtbg f animate__animated animate__slideInDown"
      style="width:100vw;height:11vh;margin-bottom:2%;background-color:rgba(33, 33, 45, 0.8);border-bottom:.5px solid gray;animation-duration:0.3s;background-color:rgba(128,128,128,.05);border-radius:5px">
        <div class="ib" style="width:70vw;height:100%">
            <div v-for="(participant, participantId) in chat.participants.filter(participant => participant != usID)" :key="participantId" class="f">
            <p v-for="(p, pID) in users.filter(p => p.userID === participant)" :key="pID" class="wt ft l" style="float:left;padding:6px;margin-left:2%;margin-bottom:-3%">
            {{ p.username }}
            </p> 
          </div>
        <div style="width:50vw;height:30%;overflow:hidden">
          <p class="ft p8 l" style="float:left;text-align:left;margin-left:1.5vw;padding:6px;color:whitesmoke;filter:opacity(.5)">{{ truncateString(chat.latestMessage) }}</p>
        </div>

      </div>
      <div style="width:30vw;height:100%;color:white;opacity:.5;float:right" class="ib">
        <p class="pd5" style="font-size:.7em;margin-top:1vh">Last Updated</p>
        <p style="margin-top:-2vh;font-size:.7em">{{ timeDifference(chat.timeUpdated) }}</p>

      </div>
    </router-link>
  </div>
  <div style="width:100vw;height:25vh"></div>


  <div class="fade-on-scroll cntr br10 ibn p6 ib" :style="{ opacity: 1 - (scrollPosition / fadeThreshold) }"
    style="width:100vw;margin-bottom:10vh;margin-top:5%;overflow: hidden;background: linear-gradient(0deg, rgba(0,0,0,1) 18%, rgba(181,181,181,1) 89%);">

    <p class="wt ft cntr" style="font-size:80px;height:1vh;margin-top:15%;color:black"> <span
        style="color:whitesmoke;font-size:60px;"></span></p>

    <div class="custom-shape-divider-bottom-1678547880">
      <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path
          d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
          opacity=".25" class="shape-fill"></path>
        <path
          d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
          opacity=".5" class="shape-fill"></path>
        <path
          d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
          class="shape-fill"></path>
      </svg>
    </div>

    <p class="wt p6" style="opacity:.5;margin-top:3%"> - Chase</p>
    <a href="https://github.com/chasesng">My github</a>
    <p class="wt p8 mt10">This is part of my 'app a day for a week' personal project. Contact me for features you want
      added to this site if any.</p>
  </div>
  <br />
  

</template>

<script>
// import { getFirestore, collection, query, onSnapshot } from 'firebase/firestore';
import { onSnapshot, getFirestore } from 'firebase/firestore';
import { onAuthStateChanged, getAuth } from '@firebase/auth';
import { collection, query } from 'firebase/firestore';
// import { ref, onUnmounted,onMounted } from 'vue';
import { ref, onMounted, onUnmounted } from 'vue';
import { app, timeDifference, truncateString} from '@/configs'

const db = getFirestore(app);
const isLoggedin = ref(false);

export default {


  data() {


    return {
      scrollPosition: -300,
      fadeThreshold: 700,
      chats: [],
      users: ref([]),
      previewCulture: 'All',
      currentDate: new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    }
  }, methods: {
    go(val) {
      this.$router.push({ path: val })
    },
    redirectToAdd() {
      this.$router.push({ path: '/Add_Recommendation' })
    },
    viewChat(id) {
      this.$router.push({ name: 'chatPage', params: { id }})
    },
    handleScroll() {
      this.scrollPosition = window.scrollY;
      const div = document.querySelector('.fade-on-scroll');
      if (div) {
        if (this.scrollPosition > this.fadeThreshold) {
          div.classList.add('fade-out');
        } else {
          div.classList.remove('fade-out');
        }

      }
    },
   
    getImgUrl(it) {
      return require('../assets/places/' + String(it))
    },

    changePreview(id) {
      this.previewType = id;
    },
    redirectCredentials() {
      this.$router.push({ path: '/Omnium_Credentials' })

    },
    redirectSignUp() {
      this.$router.push({ path: '/Register' })

    },
    redirectHelp() {
      this.$router.push({ path: '/InsuranceAssessmentGuide' })
    },

    goToGeneralAssessment() {
      this.$router.push({ path: '/Insurance_Assessment' })
    },
    gotoAllPlans() {
      this.$router.push({ path: '/Plans' })
    },
    gotoSupport() {
      this.$router.push({ path: '/Support' })
    },
    goToPreviewPage() {
      this.$router.push({ path: '/Omnium_Credentials' })
    },

  },
  mounted() {
    document.body.classList.add('index-page');
    const latestQuery = query(collection(db, "chats"));
    const liveChats = onSnapshot(latestQuery, (snapshot) => {
      this.chats = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          chat: doc.data().chat,
          chatType: doc.data().chatType,
          dateCreated: doc.data().dateCreated,
          participants: doc.data().participants,
          latestMessage: doc.data().latestMessage,
          timeUpdated: doc.data().timeUpdated
        }
      });
    });
    
    const userQuery = query(collection(db, "users"));
    const liveUsers = onSnapshot(userQuery, (snapshot) => {
      this.users = snapshot.docs.map((doc) => {
        return {
          userID: doc.data().userID,
          username: doc.data().username,
          gender: doc.data().gender,
          age: doc.data().age,
          assignmentArray: doc.data().assignmentArray,
          from: doc.data().from,
          occupation: doc.data().occupation,
          email: doc.data().emailRef,
          userType: doc.data().userType


        }
      });
    })
    onUnmounted(liveChats,liveUsers)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll),
    document.body.classList.remove('index-page')
  },
  watch: {

  }

}
</script>

<script setup>
var usID = ref('');
var usEmail = ref('')
let auth;

onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedin.value = true;
      usID.value = user.uid;
      usEmail.value = user.email;

    }
    else {
      isLoggedin.value = false;
    }
    return {
      usID,

    }
  })
})


</script>
<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.eaPlace:active {
  background-color: gray;
  transition: background-color .2s
}

.redirectToAddButton:active {
  background-color: gray;
  transition: background-color .2s
}

.custom-shape-divider-bottom-1678547880 {
  width: 100%;
  overflow: hidden;
  line-height: 0;
  transform: rotate(180deg);
}

.custom-shape-divider-bottom-1678547880 svg {
  position: relative;
  display: block;
  width: calc(100% + 1.3px);
  height: 100px;
  transform: rotateY(180deg);
}

.custom-shape-divider-bottom-1678547880 .shape-fill {
  fill: #FFFFFF;
}

.selected {
  background-color: gray;
}


.fade-on-scroll {
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
}

.fade-on-scroll.fade-out {
  opacity: 0;
}

#displayTitle {
  text-align: center;
  color: grey;
  margin-left: 45px;
}


.box {
  border: 1px solid #ccc;
}


.crsImg {
  width: 550px;
  height: 350px;
  margin: auto;
  margin-left: 130px;
}

.txt {
  float: right;
  width: 50%;
  padding-left: 20px;
}


.rdrButton:hover {
  background-color: gray;
}

#viewPlanbtn {
  height: 50px;
  width: 100%;
  font-size: 20px;
  text-align: center;
  /* border: 1px solid grey; */
  cursor: pointer;

  border-radius: 0px;
}


#banner {
  height: 100%;
  font-size: 26px;
  text-align: center;
  vertical-align: middle;
  line-height: 50px;
  border-right: 1px solid gray;
  flex: 1;
  display: inline-block;
  background-color: whitesmoke;

}

.previewPlans {
  -webkit-overflow-scrolling: touch;
}

.containBanners {
  height: 210px;
  display: flex;
  border: 1px solid gray;
  margin: auto;
  overflow: hidden;
  box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.75);
  -webkit-box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.75);
}

.hovertoolTip {
  color: darkgray;
  font-size: 15px;
}

.rationaleImage {
  width: 330px;
  height: 550px;
  border-radius: 20px;
  border: 1px solid grey;
  overflow: hidden;
  box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.75);
  -webkit-box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.75);
}

.rationaleText {
  float: left;
  margin: auto;
  width: 500px;
  margin-left: 80px;
  padding-top: 5px;
}

.icon_container {
  position: relative;
  display: inline-block;
  width: 100px;
  height: 100px;
  line-height: 50px;
  text-align: center;
}


.icon {
  position: relative;
  font-size: 30px;
  color: #fff;
  vertical-align: middle;
  margin-top: 40px;
}

.box:hover {
  background: lightgray
}

.customizationImg {
  width: auto;
  height: 200px;
  border-radius: 20px;
  border: 1px solid grey;
  overflow: hidden;
}

.holdCustomizationText {
  float: left;
  margin: auto;
  width: 50%;
  margin-left: 5%;
  padding-top: 5px;
}

.loader {
  --height-of-loader: 4px;
  --loader-color: #0071e2;
  width: 60%;
  height: var(--height-of-loader);
  border-radius: 30px;
  background-color: rgba(0, 0, 0, 0.2);
  position: relative;
}

.loader::before {
  content: "";
  position: absolute;
  background: var(--loader-color);
  top: 0;
  left: 0;
  width: 0%;
  height: 100%;
  border-radius: 30px;
  animation: moving 1s ease-in-out infinite;
  ;
}

@keyframes moving {
  50% {
    width: 100%;
  }

  100% {
    width: 0;
    right: 0;
    left: unset;
  }
}</style>
