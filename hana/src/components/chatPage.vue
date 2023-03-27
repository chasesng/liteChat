<template>
  <div v-for="(chat, index) in chats.filter(chat => chat.id === chatID)" :key="index"
    style="position:fixed;top:0;z-index:0">
    <div style="height:7vh;width:100vw;opacity:1;background-color:rgba(42,48,109,255)">
      <div v-for="(participant, participantId) in chat.participants.filter(participant => participant != usID)"
        :key="participantId" class="f">
        <router-link
          style="float:left;width:30%;height:inherit;margin-top:2.2vh;text-align:left;margin-left:3vw;opacity:.7" to="/"
          class="ft p7 wt b">
          <p>Back</p>
        </router-link>

        <p v-for="(p, pID) in users.filter(p => p.userID === participant)" :key="pID" class="wt ft p7 b"
          style="margin-top:2vh;text-align:center;width:30%;opacity:.8"><span><router-link
              style="color:white;padding:10px" :to="'/userProfile/' + p.userID">{{ p.username }}</router-link> </span></p>
        <div style="width:33%;float:right;text-align:right;height:inherit">
          <p style="color:white;font-size:4vh" @click="toggleDropdown()">≡</p>
        </div>
        <div id="confirmAlert" :style="{ display: alertVisible }"
          style="opacity:.9;position:absolute;top:30vh;left:25vw;width:50vw;height:16vh;background-color:rgba(42,48,109,255);overflow:hidden">
          <p class="wt ft p8 pd5">Delete Chat</p>
          <hr style="background-color:white;margin-top:-2.5vh;opacity:.3" />
          <p class="wt ft p8 l">You cannot undo this!</p>
          <div class="f" style="justify-content:space-evenly;background-color:white">

            <button class="confirmOptions" @click="clearChat(chat.id)">Confirm </button>
            <button class="confirmOptions" @click="toggleAlert()">Cancel</button>

          </div>
        </div>
      </div>
    </div>
  </div>
  <div id="hamburgerDropdown" :style="{ display: dropdownVisible }">
    <p class="animate__animated animate__slideInDown" style="color:red;animation-duration:.2s;padding-top:.7vh"
      @click="toggleAlert()">Delete Chat</p>
  </div>
  
  <div class="animate__animated animate__slideInRight"
  style="animation-duration:0.2s;position:fixed;top:8.5vh;width:100vw;height:100vh;z-index:-1;overflow:hidden;background-color:rgba(33,33,45,255)">
    <input v-model="usID" ref="userID" style="display:none">




    <div v-for="(chat, index) in chats.filter(chat => chat.id === chatID)" :key="index">

      <div style="height:70vh;overflow-y:scroll;overflow-x:hidden;" ref="container">
        <br />
        <br />
        <div v-for="(msg, msgId) in chat.chatArea" :key="msgId">

          <div v-if="msg.senderID === usID" style="width:100vw;min-height:3vh;text-align:right;margin-bottom:-4vh">
            <p class="ft p8 l pd5 br10 from-me ib"
              style="max-width: 60vw;height:max-content; word-wrap: break-word; word-break: break-word; line-height:1em;margin-right:.5vw;">
              <span style="float:left;width:fit-content;padding:0px 5px 0px 5px">{{ msg.chatMsg }}</span></p>
              <p style="font-size:.6em;color:lightgray;margin-top:-2.5vh;margin-right:1vw">{{ timestampChatFormat(msg.timeSent) }}</p>
            
          </div>
          <div v-if="msg.senderID != usID" style="width:100vw;min-height:3vh;text-align:left;margin-bottom:-4vh">
            <p class="ft p8 l pd5 br10 from-them ib"
              style="max-width: 60vw;height:max-content; word-wrap: break-word; word-break: break-word; line-height:1em;margin-left:.5vw;">
              <span style="float:right;width:fit-content;padding:0px 5px 0px 5px">{{ msg.chatMsg }}</span></p>
              <p style="font-size:.6em;color:lightgray;margin-top:-2.5vh;margin-left:1vw">{{ timestampChatFormat(msg.timeSent) }}</p>
            
          </div>
          <br />

        </div>


      </div>
    </div>


  </div>
  <div style="position:fixed;bottom:0px;width:100vw;height:8.5vh;background-color:#2B2B3C;z-index:2">
    <div style="display:flex;justify-content: center;">
      <input id="sendField" type="text" class="inpClear wt" placeholder="Enter a message..."
        style="overflow-y:scroll;width:60vw;border-bottom:1px solid gray;height:50px;margin-top:1vh;margin-left:10vw;"
        ref="sendField" @keyup.enter="sendMessage(chatID)">
      <div style="width:10%;height:100%;align-content: center;" @click="sendMessage(chatID)">
        <i class="fa-solid fa-paper-plane" style="color:white;font-size:16px;margin-top:3.6vh ;"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { onSnapshot, getFirestore, doc, updateDoc, arrayUnion, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged, getAuth } from '@firebase/auth';
import { collection, query } from 'firebase/firestore';
import { ref, onMounted, onUnmounted } from 'vue';
import { app, timestampChatFormat } from '@/configs';

const db = getFirestore(app);
const isLoggedin = ref(false)

export default {
  data() {
    return {
      chat: [],
      chats: ref([]),
      users: ref([]),
      observer: null,
      dropdownVisible: 'none',
      alertVisible: 'none'
    }
  }, methods: {
    clearChat(val) {
      deleteDoc(doc(db, 'chats', val))
      this.$router.push({ path: '/' })
    },
    toggleDropdown() {
      this.dropdownVisible = this.dropdownVisible === 'none' ? 'block' : 'none';
    },

    toggleAlert() {
      this.alertVisible = this.alertVisible === 'none' ? 'block' : 'none';
    },
    visitProfile(toProfileID) {
      this.$router.push({ name: 'userProfile', params: { toProfileID } })
    },
    updateReadStatus(msgId) {
      const chatIndex = this.chats.findIndex((chat) => chat.id === this.chatID);
      if (chatIndex >= 0) {
        const msgIndex = this.chats[chatIndex].chatArea.findIndex((msg) => msgId === msg.id);
        if (msgIndex >= 0) {
          this.$set(this.chats[chatIndex].chatArea[msgIndex], "read", true);
          // Update msg.read in Firestore database here
        }
      }
    },
    sendMessage: function (id) {
      const getsendField = document.getElementById('sendField');

      //validation here
      if (this.$refs.sendField.value) {
        updateDoc(doc(db, 'chats', id), {
          chatArea: arrayUnion(
            {
              chatMsg: this.$refs.sendField.value,
              senderID: this.$refs.userID.value,
              timeSent: Date.now(),
              read: false
            }

          ),
          latestMessage: this.$refs.sendField.value,
          timeUpdated: Date.now()
        },
          getsendField.value = ''
        )
      }

    }



  },
  mounted() {



    const latestQuery = query(collection(db, "chats"));
    const liveChats = onSnapshot(latestQuery, (snapshot) => {
      this.chats = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          chatArea: doc.data().chatArea,
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
          userType: doc.data().userType,
          status: doc.data().status,
          friends: doc.data().friends,


        }
      });
    })
    onUnmounted(liveChats, liveUsers)
  },
  props: ['chatID']

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


<style scoped>
div::-webkit-scrollbar {
  width: 0 !important;
}


p.from-me {
  background-color: #248bf5;
  color: #fff;

}

p.from-me::before {
  border-bottom-left-radius: 0.8rem 0.7rem;
  border-right: 1rem solid #248bf5;
  right: -0.35rem;
  transform: translate(0, -0.1rem);

}

p.from-me::after {
  background-color: #fff;
  border-bottom-left-radius: 0.5rem;
  right: -40px;
  transform: translate(-30px, -2px);
  width: 10px;
}

p.from-them {
  align-items: flex-start;
  background-color: #e5e5ea;
  color: #000;
}

p.from-them:before {
  border-bottom-right-radius: 0.8rem 0.7rem;
  border-left: 1rem solid #e5e5ea;
  left: -0.35rem;
  transform: translate(0, -0.1rem);
}

p.from-them::after {
  background-color: #fff;
  border-bottom-right-radius: 0.5rem;
  left: 20px;
  transform: translate(-30px, -2px);
  width: 10px;
}

.confirmOptions {
  background: transparent;
  color: rgba(33, 33, 45, 255);
  border: none;
  font-size: 1.1em
}</style>