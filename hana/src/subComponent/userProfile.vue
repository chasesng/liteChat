<template>
     <div style="position:fixed;top:0;z-index:1">
    <div style="height:7vh;width:100vw;opacity:1;background-color:rgba(42,48,109,255)">
        <div
          style="float:left;width:30%;height:inherit;margin-top:2.2vh;text-align:left;margin-left:3vw;opacity:.7" onclick="history.back()"
          class="ft p7 wt b">
          <p>Back</p>
        </div>
        
    </div>
  </div>

    <div style="width:100vw;height:84vh;padding-top:7.5vh;background:transparent;overflow:hidden;">
        <p class="wt ft p6" style="margin-top:2vh;font-weight:100">Profile</p>

        <div v-for="(user, index) in users.filter(user => user.userID === ProfileID)" :key="index" style="margin-top:2vh">
            <div class="ib">
                <div class="cntr" style="width:20vw;height:9vh;background-color:transparent;border: 1px solid white;margin-bottom:2%;opacity:.8">
                </div>
                <br />
                <div class="f" style="justify-content:center;width:100vw">
                    <label class="wt" style="width:30%">Username</label>
                    <p class="wt p9" style="width:30%;text-align:left">{{ user.username }}</p>
                </div>
                <div class="f" style="justify-content:center;width:100vw">
                    <label class="wt" style="width:30%">Email</label>
                    <p class="wt p9" style="width:30%;text-align:left">{{ user.email }}</p>
                </div>
                <div class="f" style="justify-content:center;width:100vw">
                    <label class="wt" style="width:30%">Status</label>
                    <p class="wt p9" style="width:30%;text-align:left">{{ user.status }}</p>
                </div>
                <div class="f" style="padding-top:1vh;width:100vw;justify-content:center;gap: 20vw;" v-if="usID != user.userID">
                    <div v-if="checkUserFriendsList(usID, user.id)">
                        <ruby @click="removeFriend(usID, user.id)"><i class="fa-solid fa-user-minus" style="color:gray;font-size:26px"></i> <rt class="wt">Remove</rt></ruby>                       
                    </div>
                    <div v-else-if="!checkUserFriendsList(usID, user.id)">
                        <div v-if="!checkUserRequestSent(usID, user.userID)">
                            <!-- unsent friend request -->
                            <ruby @click="sendRequest(usID, user.userID)"><i class="fa-solid fa-user-plus" style="color:white;font-size:26px"></i><rt class="wt">Add</rt></ruby>
                        </div>
                        <div v-if="checkUserRequestSent(usID, user.userID)"> 
                            <!--  already sent friend request-->
                            <ruby><i class="fa-solid fa-user-tag" style="color:gray;font-size:26px"></i><rt class="wt">Sent</rt></ruby>
                        </div>

                    </div>
                    <div style="margin-top:2%" @click="createChat(usID, user.userID)">
                    <i class="fa-regular fa-message" style="color:white;font-size:26px"></i>
                    </div>

                    
                    
                </div>
            </div>


        </div>


    </div>

</template>

<script>
import { onSnapshot, getFirestore, addDoc, updateDoc, arrayUnion, doc, arrayRemove } from 'firebase/firestore';
import { onAuthStateChanged, getAuth } from '@firebase/auth';
import { collection, query } from 'firebase/firestore';
import { ref, onMounted, onUnmounted } from 'vue';
import { app } from '@/configs';

const db = getFirestore(app);
const isLoggedin = ref(false)

export default {
    data() {
        return {
            users: ref([]),

        }

    },
    methods: {
        displayUID() {
            var arr = []
            for (let i = 0 ; i < this.users.length; i++) {
                arr.push(this.users[i].userID)
            }
            return arr
        },
        checkUserFriendsList(loggedInUser, toCheck) { //loggedInUser is usID, toCheck is the profile owner's userID
            // var isPresent = false;
           
            for (let i = 0 ; i < this.users.length; i++) {
                if (this.users[i].userID === loggedInUser && String(this.users[i].friends).split(',').includes(toCheck)) {
                    return true

                    // isPresent = true;
                }
            }
        },
        checkUserRequestSent(loggedInUser, toCheck) {
            for (let i = 0 ; i < this.users.length; i++) {
                if (this.users[i].userID === loggedInUser && String(this.users[i].requestSent).split(',').includes(toCheck)) {
                    return true

                }
            }
        },
        removeFriend(loggedInUser, toRemoveFrom) {
            for (let i = 0 ; i < this.users.length; i++) {
                if (this.users[i].userID === loggedInUser) {
                    updateDoc(doc(db, 'users', toRemoveFrom), {
                        friends: arrayRemove(this.users[i].id)
                    })
                    updateDoc(doc(db, 'users', this.users[i].id), {
                        friends: arrayRemove(String(toRemoveFrom))
                    })
                }
            }
        },

        sendRequest(loggedInUser, toSend) {
            for (let i = 0 ; i< this.users.length; i++) {
                if (this.users[i].userID === loggedInUser) {
                    updateDoc(doc(db, 'users', this.users[i].id), {
                        requestSent: arrayUnion(String(toSend))
                    })
                }
            }
        },
        createChat: function (curUserID, targetUID) { //target UID
            var holdcID = null;
            //check if chat already exists, if it does, redirect to /chatPage/id
            for (let i = 0; i < this.chats.length; i++) {
                if (this.chats[i].participants.includes(curUserID) && this.chats[i].participants.includes(targetUID) && this.chats[i].chatType === "Private") {
                    //send to chatID
                    holdcID = this.chats[i].id
                }

            }
            if (holdcID) {
                this.$router.push({ path: '/chatPage/' + holdcID })
            }
            else {
                addDoc(collection(db, 'chats'), {
                    chat: [],
                    chatType: "Private",
                    dateCreated: Date.now(),
                    latestMessage: "",
                    participants: [curUserID, targetUID],
                    timeUpdated: Date.now()
                })
                this.$router.push({ path: '/' })



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
                    id: doc.id,
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
                    requestSent: doc.data().requestSent


                }
            });
        })
        onUnmounted(liveUsers, liveChats)

    },
    props: ['ProfileID']
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

<style></style>