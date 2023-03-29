<template>
    <div class="f" style="justify-content:space-between;position:fixed;top:0;z-index:0">
        <div onclick="history.back()"
            style="float:left;width:10%;height:inherit;margin-top:2.2vh;text-align:left;opacity:.7;margin-left:3vw" to="/"
            class="ft p7 wt b">
            <p>Back</p>
        </div>
    </div>

    <div style="width:100vw;height:84vh">
        <div v-for="(chat, index) in chats.filter(chat => chat.id === groupID)" :key="index" class="wt l p6 ib"
            style="width:100vw;display:grid;justify-content:center;line-height:1;padding-top:7vh">
            <p>{{ chat.groupName }}<br /><span class="wt l p9" style="opacity:.7">Date Created {{
                timestampDateOnly(chat.dateCreated) }}</span></p>

            <div style="width:96vw;height:35vh;overflow:hidden">
                <div class="f" style="justify-content:space-between">
                    <p class="wt l p7 pd5" style="width:100%;height:1vh;backdrop-filter:blur(10px);text-align:left;padding-bottom:2vh;opacity:.6">Members</p>
                    <p class="wt l p7 pd5" style="width:100%;height:1vh;backdrop-filter:blur(10px);text-align:right;padding-bottom:2vh;opacity:.6">{{ chat.participants.length }}/50</p>
                </div>
                <div style="overflow-y:scroll;width:100%;height:30vh">
                    <div v-for="(participant, index) in chat.participants" :key="index" class="wt l p8" style="text-align:left">
                        <router-link :to="'/userProfile/' + getusID(participant)" v-if="admin(groupID, participant)">
                            <div style="display:flex;justify-content:space-between;border-bottom:1px solid green;color:white;width:inherit;height:fit-content;background-color:rgba(10,10,10,0.6);opacity:.8;margin-bottom:2vh">
                            <p class="pd5 p7">{{ returnChatParticipants(participant) }}</p>
                            <p class="pd5 p9 l" style="opacity:.6">Admin</p>
                            </div>
                        </router-link>
                        <router-link :to="'/userProfile/' + getusID(participant)" v-if="!admin(groupID, participant)">
                            <div style="display:flex;justify-content: space-between;border-bottom:1px solid white;color:white;width:inherit;height:fit-content;background-color:rgba(10,10,10,0.6);opacity:.8;margin-bottom:2vh">
                            <p class="pd5 p7">{{ returnChatParticipants(participant) }}</p>
                            <p class="pd5 p9 l" style="opacity:.6">Member</p>

                            </div>
                        </router-link>
                     </div>
                </div>
            </div>
            <button v-if="admin(groupID, getID(usID))" class="brButton" style="height:5vh;width:100%;opacity:.9;font-size:.8em" @click="togglelistVisible()">Add / Remove Users</button>

            <div style="width:96vw;height:50vh;overflow:hidden;margin-top:2vh">
            <p class="wt l p7 pd5" style="width:100%;height:1vh;backdrop-filter:blur(10px);text-align:center;padding-bottom:3vh;opacity:.6">Settings</p>
            <div class="f" style="justify-content:center;gap:5%">
            <button v-if="admin(groupID, getID(usID))" class="brButton" style="height:5vh;width:40vw;opacity:.9;font-size:.8em" @click="toggleCAdminDisplay()">Change Admin</button>
            <button v-if="admin(groupID, getID(usID))" class="brButton" style="height:5vh;width:40vw;background-color:crimson;opacity:.9;font-size:.8em" @click="toggledelAlert()">Delete Group</button>
            <button v-if="!admin(groupID, getID(usID))" class="brButton" style="height:5vh;width:40vw;background-color:crimson;opacity:.9;font-size:.8em">Leave Group</button>

            </div>
            
            </div>

            <div :style="{display: toggleCAVisible}" style="position:absolute;width:100vw;height:70vh;top:10vh;background-color:rgba(33,33,45,255);overflow:hidden;animation-duration:.2s" class="animate__animated animate__fadeIn">
                <div class="f" style="justify-content:space-between">
                <div class="ib">
                    <p class="wt l p7 pd5" style="width:100%;height:1vh;backdrop-filter:blur(10px);text-align:left;padding-top:1vh;opacity:.6">Change Admin</p>
                <p class="wt l p9 pd5" style="width:100%;height:1vh;backdrop-filter:blur(10px);text-align:left;padding-bottom:3vh;opacity:.6">You will lose your admin privileges</p>
                </div>
                <p class="wt l p7 pd5" @click=toggleCAdminDisplay()>Close</p>
                </div>

                <div style="overflow-x:hidden;overflow-y:scroll;width:100vw;height:40vh">
                <div v-for="(participant, index) in chat.participants.filter(participant => participant != getID(usID))" :key="index">
                    <div v-bind:class="{ 'selected-message': selectedAdmin === participant }" class="ib" style="width:100%;height:8vh;background-color:rgba(42,48,109,255);opacity:.8;margin-bottom:2vh;border-bottom:1px solid white" @click="adminSelection(participant)">
                        <p class="pd5 p7" style="text-align:left;width:100%">{{ returnChatParticipants(participant) }}</p>
                        <p class="pd5 p9 wt" style="text-align:left;opacity:.6;width:100%;margin-top:-2vh">Select</p>
                    </div>
                </div>
                </div>
                <!-- <div style="width:100%;height:6vh;background-color:gray;">
                    <p class="wt l p8 pd5" style="text-align:left" v-if="selectedAdmin">You are going to assign {{ returnChatParticipants(selectedAdmin) }} the role of Admin.</p>
                </div> -->

                <div style="width:100vw;height:10vh;margin-top:2vh">
                    <button v-if="admin(groupID, getID(usID))" class="brButton" style="height:5vh;width:40vw;opacity:.9;font-size:.8em" @click="assignAdmin(groupID, getID(usID), selectedAdmin)">Handover</button>
                </div>


            </div>

            <div :style="{display: listVisible}" style="position:absolute;width:100vw;height:70vh;top:10vh;background-color:rgba(33,33,45,255);overflow:hidden;animation-duration:.2s" class="animate__animated animate__fadeIn">
                <div class="f" style="justify-content:space-between">
                <div class="ib">
                    <p class="wt l p7 pd5" style="width:100%;height:1vh;backdrop-filter:blur(10px);text-align:left;padding-top:1vh;opacity:.6">Add & Remove Friends from Group</p>
                <p class="wt l p9 pd5" style="width:100%;height:1vh;backdrop-filter:blur(10px);text-align:left;padding-bottom:3vh;opacity:.6"></p>
                </div>
                <p class="wt l p7 pd5" @click=togglelistVisible()>Close</p>
                </div>

                <div style="overflow-x:hidden;overflow-y:scroll;width:100vw;height:40vh">
                <!-- <div v-for="(participant, index) in chat.participants.filter(participant => participant != getID(usID))" :key="index">
                    <div class="ib" style="width:100%;height:8vh;background-color:rgba(42,48,109,255);opacity:.8;margin-bottom:2vh;border-bottom:1px solid white" @click="adminSelection(participant)">
                        <p class="pd5 p7" style="text-align:left;width:100%">{{ returnChatParticipants(participant) }}</p>
                        <p class="pd5 p9 wt" style="text-align:left;opacity:.6;width:100%;margin-top:-2vh">Select</p>
                    </div>
                </div> -->
                <div v-for="(user, index) in users.filter(user => user.userID === usID)" :key="index">
                    <div v-for="(friend, index) in user.friends" :key="index">
                        <label class="f" style="width:95vw;justify-content:space-between;border-bottom:1px solid gray">
                        <p class="wt pd5">{{ returnChatParticipants(friend)}}</p>
                        <input type="checkbox" style="width:3vh" :checked="checkUser(groupID,friend)" @click="updateList()" :value="friend">
                    </label>
                    </div>
                   
                </div>
               
                </div>
                <!-- <div style="width:100%;height:6vh;background-color:gray;">
                    <p class="wt l p8 pd5" style="text-align:left" v-if="selectedAdmin">You are going to assign {{ returnChatParticipants(selectedAdmin) }} the role of Admin.</p>
                </div> -->

                <div style="width:100vw;height:10vh;margin-top:2vh">
                    <button v-if="admin(groupID, getID(usID))" class="brButton" style="height:5vh;width:40vw;opacity:.9;font-size:.8em" @click="updateGroup(groupID, getID(usID))">Confirm</button>
                </div>


            </div>

        </div>
      
    </div>
    <div :style="{ display: delAlertVisible }"
            style="opacity:.9;position:absolute;top:30vh;left:25vw;width:50vw;height:16vh;background-color:rgba(42,48,109,255);overflow:hidden">
            <p class="wt ft p8 pd5">Delete Group</p>
            <hr style="background-color:white;margin-top:-2.5vh;opacity:.3" />
            <p class="wt ft p8 l">You cannot undo this!</p>
            <div class="f" style="justify-content:space-evenly;background-color:white">

              <button class="confirmOptions" @click="deleteGroup(groupID)">Confirm </button>
              <button class="confirmOptions" @click="toggledelAlert()">Cancel</button>

            </div>
          </div>
</template>

<script>
import { onSnapshot, getFirestore, updateDoc, arrayRemove, arrayUnion, doc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged, getAuth } from '@firebase/auth';
import { collection, query } from 'firebase/firestore';
import { ref, onMounted, onUnmounted } from 'vue';
import { app, timestampDateOnly } from '@/configs';

const db = getFirestore(app);
const isLoggedin = ref(false)
var selectedAdmin = ref('')

export default {
    data() {
        return {
            users: ref([]),
            chats: ref([]),
            toggleCAVisible: 'none',
            listVisible: 'none',
            tester: true,
            listOfAdded: [],
            originalList: [],
            delAlertVisible: 'none'
        }
    },
    methods: {
        adminSelection(id) {
            for (let i = 0 ; i < this.users.length; i ++) {
                if (this.users[i].id === id) {
                    selectedAdmin.value = this.users[i].id
                }
            }
        },

        checkUser(chatid, id) {
            for (let i = 0 ; i < this.chats.length; i ++) {
                if (this.chats[i].id === chatid && this.chats[i].participants.includes(id)) {
                    return true
                }
            }
        },
        assignAdmin(chatid, curAdminID, selectedAdmin) {
            for (let i = 0 ; i < this.users.length; i ++) {
                if (this.users[i].id === selectedAdmin) {
                    updateDoc(doc(db, 'chats', chatid), {
                        admins: arrayRemove(curAdminID)
                    })
                    updateDoc(doc(db, 'chats', chatid), {
                        admins: arrayUnion(selectedAdmin)
                    })
                    this.toggleCAVisible = this.toggleCAVisible === 'none' ? 'block' : 'none';
                }
            }
        },
        returnChatParticipants(participants) {
            var totalParties = []
            for (let i = 0; i < this.users.length; i++) {
                if (String(participants).split(',').includes(this.users[i].id)) {
                    totalParties.push(this.users[i].username)
                }
            }

            return totalParties.join(', ')

        },
    
        updateList() {
            this.listOfAdded = []
            const check = document.querySelectorAll('input[type="checkbox"]:checked');
            check.forEach((button) => {
                this.listOfAdded.push( button.value)
            });
        },

        toggleCAdminDisplay() {
            this.toggleCAVisible = this.toggleCAVisible === 'none' ? 'block' : 'none';
        },
        toggledelAlert() {
            this.delAlertVisible = this.delAlertVisible === 'none' ? 'block' : 'none';

        },

        togglelistVisible() {
            this.listVisible = this.listVisible === 'none' ? 'block' : 'none';
        },
        getusID(accID) {
            for (let i = 0 ; i < this.users.length; i++) {
                if (this.users[i].id === accID) {
                    return this.users[i].userID
                }
            }
        },
        getID(usid) {
            for (let i = 0 ; i < this.users.length; i++) {
                if (this.users[i].userID === usid) {
                    return this.users[i].id
                }
            }
        },
        updateGroup(chatid, userid) {
            this.listOfAdded = []
            const check = document.querySelectorAll('input[type="checkbox"]:checked');
            check.forEach((button) => {
                this.listOfAdded.push( button.value)
            });
            this.listOfAdded.push(userid)

            const participants = [this.listOfAdded].join(',');
            updateDoc(doc(db, 'chats', chatid), {
                participants: participants.split(','),
            }) 
            this.listVisible = this.listVisible === 'none' ? 'block' : 'none';              
                
        },
        deleteGroup(chatid) {
            deleteDoc(doc(db, 'chats', chatid))
            this.$router.push({ path: '/' })
        },
        admin(chatid, participantID) {
            for (let i = 0 ; i < this.chats.length; i++) {
                if (this.chats[i].id === chatid && this.chats[i].admins.includes(participantID)) 
                    {
                        return true
                    }
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
                    timeUpdated: doc.data().timeUpdated,
                    groupName: doc.data().groupName,
                    admins: doc.data().admins
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
        onUnmounted(liveChats, liveUsers)
    },
    props: ['groupID']

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
.confirmOptions {
  background: transparent;
  color: rgba(33, 33, 45, 255);
  border: none;
  font-size: 1.1em
}
</style>