<template>
    <div style="width:100vw;height:85vh;background-color:transparent;overflow:hidden">
        <div class="f animate__animated animate__slideInRight" style="width:100vw;padding-top:6vh;animation-duration:.2s">
            <label style="width:40vw;padding-right:2%;padding-left:3vw;padding-top:2%" class="wt ft p8 l">Search Username</label>
            <input type="text" ref="inpUsername" class="inpClear" style="width:50vw;color:white;font-weight:light"
                placeholder="Find a user here..." v-model="searchArea">

        </div>
        <div class="divider"
            style="width:100vw;height:1vh;background-color:gray;opacity:.3;margin-top:3vh;border-bottom:1px solid white;margin-bottom:2vh">
        </div>
        <router-link to="/Group" style="width:inherit;height:4vh;background-color:gray;opacity:.8;text-align:center;color:white;margin-top:-1vh;margin-bottom:2vh"><p style="color:white">Create a Group</p></router-link>
        <div style="width:100vw;height:67vh;overflow-x:hidden;overflow-y:scroll;color:white;background-color:#2B2B3C">
            <p style="width:100vw;height:3vh;overflow:hidden;display:none" v-if="searchArea">{{ searchArea }}</p>
            <div style="width:100vw;height:60vh" v-if="String(searchArea).length >= 4">
                <div v-if="users.filter(user => user.username.toLowerCase().includes(String(searchArea).toLowerCase())).length === 0">
                    <p class="wt ft p8 l" style="margin-top:10%">No users with that username found</p>
                </div>
                <div v-for="(user, index) in users.filter(user => user.username.toLowerCase().includes(String(searchArea).toLowerCase()))" :key="index" style="margin-bottom:5%">
                    <router-link class="ib animate__animated animate__slideInLeft"
                        style="width:100vw;height:10vh;border-bottom:1px solid gray;animation-duration: .3s;;margin-top:2%"
                        :to="'/userProfile/' + user.userID" >
                        <p class="wt ft l" style="text-align:left;padding-left:2vw;width:inherit">@{{ user.username }}</p>
                        <p class="ft l p8" style="text-align:left;padding-left:3vw;width:inherit;color:gray">{{ user.status
                        }}</p>

                    </router-link>


                </div>
            </div>


        </div>

    </div>
   
</template>

<script>
import { app } from '@/configs';
import { ref, onUnmounted, onMounted } from 'vue';
import { getFirestore, collection, query, onSnapshot, addDoc } from '@firebase/firestore';
import { onAuthStateChanged, getAuth } from '@firebase/auth';

const db = getFirestore(app);
const isLoggedin = ref(false);

export default {
    methods: {
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
        },


        go(val) {
            this.$router.push({ path: val })
        }
    },
    data: () => {
        return {
            searchArea: ref(''),
            users: ref([]),
            chats: []
        }
    },
    mounted() {
        const chatQuery = query(collection(db, 'chats'));
        const liveChats = onSnapshot(chatQuery, (snapshot) => {
            this.chats = snapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    chatArea: doc.data().chatArea,
                    chatType: doc.data().chatType,
                    dateCreated: doc.data().dateCreated,
                    latestMessage: doc.data().latestMessage,
                    participants: doc.data().participants,
                    timeUpdated: doc.data().timeUpdated
                }
            })
        })

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
                    status: doc.data().status


                }
            });
        }); onUnmounted(liveChats, liveUsers)
    }

}

</script>


<script setup>
var usID = ref('');
var usEmail = ref('');
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
            usID
        }
    })
})

</script>

<style scoped></style>