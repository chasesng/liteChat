<template>
    <div style="width:100vw;height:83.5vh;background:transparent;overflow:hidden">
        <div style="width:inherit;height:7vh;opacity:.5;margin-top:2vh">
            <p class="wt ft p6"></p>
        </div>
        <div style="overflow-x:hidden;overflow-y:scroll;width:90vw" class="cntr">
            <div v-for="(user, index) in users.filter(user => user.userID === usID)" :key="index" class="wt animate__animated animate__slideInLeft" style="animation-duration: .2s;">
                <div class="f">
                    <label clas="wt ft l p7" style="padding-right:10vw">Username</label>
                    <input type="text" v-model="user.username" class="inpClear ft wt l" style="width:30vw;opacity:.8">
                </div>
                <div class="f" style="margin-top:2vh">
                    <label clas="wt ft l p7" style="padding-right:10vw">Status</label>
                    <input type="text" v-model="user.status" class="inpClear ft wt l" style="width:30vw;opacity:.8">
                </div>

                <div class="f" style="margin-top:2vh;">
                    <label clas="wt ft l p7" style="padding-right:10vw">Friends</label>
                    <p class="wt ft l p8" @click="toggleFriendsDisplay()">{{ getFriendsCount(usID) }} Connections</p>
                </div>

                <div v-if="isLoggedin" @click="handleSignOut(),go('/Login')" style="color:lightskyblue;text-align:right">Logout</div>
                <div style="text-align:left">
                <p class="wt ft p7 mt25 l">Notifications</p>
                    <div class="divider" style="text-align: left;width:100vw;background-color:gray;filter:opacity:.8;color:white;height:3.5vh;padding-left:1vw">Received Add Requests</div>
                </div>
                <div class="cntr" style="width:inherit;overflow-x:hidden;overflow-y:scroll;height:42vh;padding-right:10vw;text-align:left">
                    
                    <div v-for="(req, index) in displayRequests(usID)" :key="index">
                    <div class="ib" style="background-color:rgba(128,128,128,.05);border-radius:5px;width:100vw;height:fit-content;border-bottom:1px solid gray;margin-bottom:5%">
                    <p class="wt pd5 p7 l" style="width:100%">{{ req.username }}</p>
                    <p class="pd5 p8 l" style="width:100%;margin-top:-3.5vh;color:gainsboro">{{ req.status }}</p>
                    <div class="f" style="padding-bottom:3%">
                        <button class="optionButton ft l" @click="addFriend(usID, req.id)">Accept</button>
                        <button class="optionButton ft l" @click="removeFromID(usID, req.id)">Remove</button>
                    </div>
                    </div>
                    </div>
                </div>


            </div>
        </div>

        <div id="toggleFriends" :style="{ display: toggleFriends}" style="position:absolute;top:10vh;width:100vw;height:60vh;background-color:white;filter:brightness(1);border-radius:5px;animation-duration:.2s;overflow:hidden" class="animate__animated animate__fadeIn">
            <div class="f" style="justify-content: space-between;">
            <p class="p6" style="color:gray;margin-bottom:-3%;padding:5px">Friends</p>
            <p class="p6" style="color:gray;margin-bottom:-3%;padding:5px" @click="toggleFriendsDisplay()">Close</p>
        </div>
            <hr/>
            <div class="ib" style="overflow-y:scroll">
                <div v-for="(user,index) in users.filter(user => user.userID === usID)" :key="index">
                    <div v-for="(friend, index) in user.friends" :key="index" style="height:7vh;width:100vw;background-color:rgba(128,128,128,.1);text-align:left;padding-left:3vw;border-bottom:1px solid black">
                        <router-link :to="'/userProfile/' + getEachUSName(friend)[1]" style="line-height:.3">
                        <p class="b p8" style="padding-top:4%">{{ getEachUSName(friend)[0] }}</p>
                        <p class="p8" style="color:gray">View Profile</p>

                        </router-link>
                    
                    </div>
                </div>

            </div>
        </div>
    </div>

   
</template>


<script setup>


var usName = ref('');
var usEmail = ref('');
const usID = ref('');

// var usPhone = ref('');
let auth;

onMounted(() => {
    auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            isLoggedin.value = true;
            usID.value = user.uid;

        }
        else {
            isLoggedin.value = false;
            usEmail.value = "User is not logged in!"
        }
        return {
            usName,
            usID
        }
    })
})

const handleSignOut = () => {
    signOut(auth).then(() => {
        this.$router.push({ path: '/Login' })
    });
}

</script>


<script>
import { getFirestore, onSnapshot, collection, query, doc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { onAuthStateChanged, getAuth, signOut } from '@firebase/auth';
import { ref, onUnmounted, onMounted } from 'vue';
import { app } from '@/configs.js'


const isLoggedin = ref(false);
const db = getFirestore(app);

// const errMsg = ref();
export default {
    data: () => {
        return {
            users: ref([]),
            toggleFriends: 'none'
        }
    },
    mounted() {
        const latestQuery = query(collection(db, "users"));
        const liveUsers = onSnapshot(latestQuery, (snapshot) => {
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
        });
        onUnmounted(liveUsers)
    }
    ,

    methods: {
        go(val) {
            this.$router.push({ path: val})
        },
        getFriendsCount(userID) {
            for (let i = 0 ; i < this.users.length; i ++) {
                if (this.users[i].userID === userID) {
                    return this.users[i].friends.length
                }
            }
        },

        toggleFriendsDisplay() {
            this.toggleFriends = this.toggleFriends === 'none' ? 'block' : 'none';
        },
        addFriend(userID, targetID) {
            
            for (let i = 0 ; i < this.users.length; i ++) {
                if (this.users[i].userID === userID) {
                    updateDoc(doc(db, 'users', this.users[i].id), {
                        friends: arrayUnion(String(targetID))
                    }) 

                    updateDoc(doc(db, 'users', targetID), {
                        requestSent: arrayRemove(String(this.users[i].userID)),
                        friends: arrayUnion(String(this.users[i].id))
            })
                }
            }
            
        },

        removeFromID(userID, targetID) {
            updateDoc(doc(db, 'users', targetID), {
                requestSent: arrayRemove(String(userID))
            }) 
        },
       
        updateProf: function (id) {
            updateDoc(doc(db, 'users', id), {
                username: this.$refs.username.value,
                // gender:this.$refs.gender.value,
                // from: this.$refs.from.value,
                // occupation: this.$refs.occupation.value
            })
        },
        displayRequests(currentUserID) {
            var arr = []
            for (let i = 0 ; i < this.users.length; i++) {
                if (this.users[i].userID != currentUserID && String(this.users[i].requestSent).split(',').includes(currentUserID)) {
                    arr.push(this.users[i]) 
                }
            }
            return arr
        },

        getEachUSName(val) { //takes in id of friends
            var arr = [];
            for (let i = 0 ; i < this.users.length; i++) {
                if (this.users[i].id === val) {      
                    arr.push(this.users[i].username, this.users[i].userID)                                
                }
                
            }
            return arr;
        }

    },

}
</script>

<style>
.profilePage .hv {
    transition: background-color .2s
}

div::-webkit-scrollbar {
  width: 0 !important;
}

.profileContainer {
    width: 160px;
    height: 160px;
    position: absolute;
    margin-top: -5%;
    margin-left: 2%;
    background-color: whitesmoke;

}

.profileInfo {
    width: 160px;
    height: 370px;
    margin-left: 3%;

}

.sideInfo {
    width: 700px;
    height: 370px;
    margin-left: 10%;

}

.containChecklist {
    width: 300px;
}

.updateProfButton {
    position: absolute;
}

.updateProfButton:hover {
    cursor: pointer;
    font-weight: bolder;
}

.updateProfButton:active {
    background-color: gray;
    transition: background-color .2s
}

select option {
    color: black
}

.optionButton {
    border-radius:5px;
    color:black;
    margin-right:5vw;
}

.optionButton:active {
    background-color:gray;
    color:white;
    transform:scale(1.05);
    transition: scale .3s
}
</style>
