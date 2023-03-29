<template>
    <div>
        <div class="animate__animated animate__slideInUp" style="overflow:hidden;animation-duration:.2s;width:100vw;height:84vh;top:7.5vh;">
            <p class="wt ft l p7" style="margin-top:7vh">Create a Group (Friends Invite)</p>
            <p class="ft l p9" style="text-transform: capitalize;margin-top:-2.5vh;color:gray;opacity:.7">group name must have at least 5 characters</p>
            <input type="text" class="inpClear wt ft l" ref="groupName" v-model="groupName" placeholder="Group Name Here" style="width:70vw">
            <hr style="background-color:gray" />
            
            <div v-for="(user, index) in users.filter(user => user.userID === usID)" :key="index" style="height:35vh;overflow-x:hidden;overflow-y:scroll">
                <div v-for="(friend, index) in user.friends" :key="index"
                    style="height:7vh;width:100vw;background-color:rgba(128,128,128,.1);text-align:left;padding-left:3vw;border-bottom:1px solid black;margin-bottom:2%">
                    <!-- <div style="line-height:.3;display:flex;justify-content:space-between">
                        <label for="" class="wt b p8" style="padding-top:4%">{{ getEachUSName(friend)[0] }}</label>
                    </div> -->
                    <label class="f" style="width:95vw;justify-content:space-between">
                        <p class="wt pd5">{{ getEachUSName(friend)[0] }}</p>
                        <input type="checkbox" style="width:3vh;margin-top:-2vh" :value="friend" @click="updatelist()" >
                    </label>


                </div>
            </div>
            <div class="pd5">
                <button v-if="listOfAdded.length >=1 && groupName.trim() != '' && groupName.trim().length >=5" class="brButton" style="float:right;margin-top:5vh;" @click="createGroup(usID)">Create</button>
                <button v-else class="brButton" style="float:right;margin-top:5vh;background-color:gray" :disabled="true">Create</button>

            </div>
            <div>
                
            </div>


        </div>

    </div>
</template>
<script>
import { onSnapshot, getFirestore, addDoc } from 'firebase/firestore';
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
            listOfAdded: [],
            groupName: ref('')

        }
    },
    methods: {
        getEachUSName(val) { //takes in id of friends
            var arr = [];
            for (let i = 0; i < this.users.length; i++) {
                if (this.users[i].id === val) {
                    arr.push(this.users[i].username, this.users[i].userID)
                }

            }
            return arr;
        },
        updatelist() {
            this.listOfAdded = []
            const check = document.querySelectorAll('input[type="checkbox"]:checked');
            check.forEach((button) => {
                this.listOfAdded.push( button.value)
            });

        },
      
        createGroup: function (curUserID) {
            for (let i = 0 ; i < this.users.length; i++) {
                if (this.users[i].userID === curUserID) {
                    var idFUSId = this.users[i].id
                }
            }
            const participants = [idFUSId, this.listOfAdded].join(',');
           
            addDoc(collection(db, 'chats'), {
                chat: [],
                chatType: "Group",
                groupName: this.$refs.groupName.value,
                dateCreated: Date.now(),
                latestMessage: "",
                participants: participants.split(','),
                timeUpdated: Date.now(),
                admins: [idFUSId]
            })
            this.$router.push({ path: '/' })
        }
    },

    mounted() {

        const userQuery = query(collection(db, "users"));
        const liveUsers = onSnapshot(userQuery, (snapshot) => {
            this.users = snapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    userID: doc.data().userID,
                    username: doc.data().username,
                    gender: doc.data().gender,
                    dateOfBirth: doc.data().dateOfBirth,
                    assignmentArray: doc.data().assignmentArray,
                    from: doc.data().from,
                    occupation: doc.data().occupation,
                    emailRef: doc.data().emailRef,
                    userType: doc.data().userType,
                    nric: doc.data().nric,
                    status: doc.data().status,
                    friends: doc.data().friends,
                    requestSent: doc.data().requestSent


                }
            });
        })
        onUnmounted(liveUsers)
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

<style></style>