<template>
  <div class="animate__animated animate__fadeIn" style="width:100vw">
    <div style="text-align:left;padding-left:3%;width:90vw">
      <div class="sign-up-container ft l" style="overflow-x:hidden;overflow-y:scroll;height:74vh">
        <br />
        <Br />
        <p class="signUpLabel ft primary l p3">Sign Up</p>

        <div>
          <form @submit.prevent="submitForm" style="width:100vw">

            <div class="ib">
              <label for="fullname" style="color:gray;width:100vw">Username * <br /><span
                  style="width:100vw;font-size:.8em"> You cannot change this later</span></label>
              <input id="fullname" class="inpClear inp wt" style="width:100vw" type="text" @focus="changeLabelColor(4)"
                @blur="resetLabelColor(4)" placeholder="Username" v-model="username" />
              <div v-if="validateUsername(username) && username.length >=4" class="l p9" style="color:green;margin-left:1%;">Username is available</div>
                <div v-else-if="validateUsername(username) != true && username.length >= 4" class="l p9" style="color:red;font-size:.7em;line-height:1;margin-top:2%">Username cannot have spaces / special characters<br/>/<br/>Username in use</div>
            </div>

            <div class="ib" style="margin-top:3vh">
              <label for="email" style="width:100vw;color:gray;">Email *</label>
              <input id="email" class="inpClear inp wt" style="width:100vw" type="email" @focus="changeLabelColor(0)"
                @blur="resetLabelColor(0)" placeholder="name@example.com" v-model="email" />
              <div v-if="checkEmail(email)" class="l p9" style="color:green;margin-left:1%;">Email is valid</div>
              <div v-else-if="checkEmail(email) != true && email.length >= 1" class="l p9" style="color:red">✖ This is not
                a valid email</div>
            </div>



            <div class="ib" style="margin-top:3vh">
              <label for="password" style="color:gray;">Password *</label>
              <div class="passwordStatement" style="display:inline-block">

                <input id="password" class="inpClear inp wt" style="width:100vw" type="password"
                  @focus="changeLabelColor(1)" @blur="resetLabelColor(1)" placeholder="Password" v-model="password" />
                <div v-if="checkPassword(password) === true" class="l2 p9" style="color:green;margin-left:1%;">Password is
                  valid</div>
                <div v-else-if="checkPassword(password) === false && password.length >= 8" class="l2 p9"
                  style="color:red">✖ This is not a valid password</div>
                <div class="l" style="color:gray;font-weight:lighter;margin-left:1%;font-size:.7em">Password must contain
                  at least 8 characters,<br /> with 1 uppercase & 1 lowercase.</div>
              </div>
            </div>





            <div class="ib" style="margin-top:3vh">
              <label for="confirmPassword" style="width:100vw;color:gray;">Confirm Password *</label>


              <input id="confirmPassword" class="inpClear inp wt" style="width:100vw" type="password"
                @focus="changeLabelColor(2)" @blur="resetLabelColor(2)" placeholder="Confirm Password"
                v-model="confirmPassword" />
              <div v-if="checkMatch(password, confirmPassword) === true && password != '' && confirmPassword != ''"
                class="l p9" style="color:green;font-weight:lighter;margin-left:1%;">Passwords match</div>
              <div v-if="checkMatch(password, confirmPassword) === false && password != '' && confirmPassword != ''"
                class="l p9" style="color:red;font-weight:lighter;margin-left:1%;">Passwords do not match</div>
            </div>

            <div class="errMsg ft l" style="height:33px;font-size:.7em">{{ errMsg }}</div>


            <br />
            <br />
            <div class="haveAnaccount" style="margin-top:-5vh;text-align:left">
              <router-link class="ft l" to="/Login">Have an account? log in <span
                  style="font-weight:bold">here</span></router-link>
              <hr />
            </div>
            <!-- <button class="brButton primarybg hv" @click="checkInput">Check Input</button> -->
            <p v-if="errMsg">{{ errMsg }}</p>
            <button class="brButton primarybg hv" style="margin-bottom:50px;margin-left:1%" @click="register()"
              type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>


<script setup>
import { ref } from 'vue'
import { createUserWithEmailAndPassword, getAuth } from '@firebase/auth'
import { useRouter } from 'vue-router';
import { getFirestore, addDoc, collection } from '@firebase/firestore';
import { app } from '@/configs'

const email = ref('')
const password = ref('')
const router = useRouter();
const confirmPassword = ref('')
var errMsg = ref('');
const username = ref('');

// function checkUsername(input) {
//   const regex = /^(?=[a-zA-Z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
//   if (!regex.test(input) === true) {
//     return false
//   }
//   else {
//     return true
//   }

// }

function checkPassword(input) {
  const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,31}$/;
  if (!regex.test(input) === true) {
    return false;
  }
  else {
    return true;

  }
}

function checkEmail(input) {
  const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!regex.test(input) === true) {
    return false;
  }
  else {
    return true;

  }
}

function checkMatch(input, confirmInput) {
  if (input.trim() != confirmInput.trim()) {
    return false;
  }
  else {
    return true;
  }
}
function rQuotes(input) {
  // regex will read string with the quotes, use this to remove them, works for ref const specifically... to alter for others, remove .value
  return input.value.replace(/['"]+/g, '')
}




const checkInput = () => {
  // const checkUsername = checkUsername(rQuotes(username))
  const emailPass = checkEmail(rQuotes(email))
  const passwordPass = checkPassword(rQuotes(password))
  const passwordMatch = checkMatch(rQuotes(password), rQuotes(confirmPassword))


  return emailPass + passwordPass + passwordMatch
}

// const inputCheckResponse = () => {
//   var msg = "";
//   if ( checkNRIC(rQuotes(nric)) != true) {
//     msg += "NRIC is invalid\n"
//   }
//   if ( checkEmail(rQuotes(email)) != true) {
//     msg += "Email is invalid\n"
//   }
//   if ( checkPassword(rQuotes(password)) != true) {
//     msg += "Password is invalid"
//   }
//   if ( checkMatch(rQuotes(password), rQuotes(confirmPassword)) != true) {
//     msg += "Both passwords do not match\n"
//   }
//   if ( checkDOB(rQuotes(dob)) != true) {
//     msg += "DOB is invalid\n"
//   }

//   errMsg.value += msg;
// }
const register = () => {


  if (checkInput() === 3) {
    createUserWithEmailAndPassword(getAuth(), email.value.trim(), password.value.trim())
      .then((userCredentials) => {
        const user = userCredentials.user;
        const userID = user.uid;
        addDoc(collection(db, 'users'), {
          username: username.value,
          dateOfBirth: '',
          assignmentArray: [],
          emailRef: email.value,
          from: "NA",
          gender: "NA",
          occupation: "NA",
          userID: userID,
          userType: "User",
          nric: '',
          friends: [],
          requestSent: [],
          status: "Available",

        });
        console.log("Successful");
        router.push('/');

      })
      .catch((error) => {
        console.log(error.code);
        switch (error.code) {
          case "auth/email-already-exists":
            errMsg.value = "The provided email is already in use by an existing user.";
            break;
          case "auth/invalid-email":
            errMsg.value = "The provided email is invalid";
            break;
          case "auth/missing-email":
            errMsg.value = "You have not entered an email";
            break;
          case "auth/email-already-in-use":
            errMsg.value = "The provided email is already in use by an existing user.";
            break;
          default:
            // errMsg.value = "One or more fields is entered incorrectly";
            errMsg.value = error.code;

            break;
        }
      })
  }
  else {
    errMsg.value = "One or more fields have been entered incorrectly, please confirm again";
  }
};





</script>

<script>
import { onSnapshot } from 'firebase/firestore';
import { query } from 'firebase/firestore';
// import { ref, onUnmounted,onMounted } from 'vue';
import { onUnmounted } from 'vue';
const db = getFirestore(app);


export default {
  data() {


    return {
      nricValid: 'False',
      nric: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      identityTypeLabel: "NRIC",
      labelColors: ["gray", "gray"],
      users: ref([])
    }
  },

  methods: {
    validateUsername(input) {
      var availableUsername = true;
      const regex = /^(?=[a-zA-Z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
      if (!regex.test(input) === true) {
        return false
      }
      else {
        for (let i = 0; i < this.users.length; i++) {
          if (String(input).toLowerCase() === this.users[i].username.toLowerCase()) {
            availableUsername = false;
          }
        }
        return availableUsername
      }
    },

    changeLabelColor(index) {
      this.labelColors[index] = "black";
    },
    resetLabelColor(index) {
      this.labelColors[index] = "gray";
    },

    submitForm() {
      this.isSubmitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      alert("Success" + JSON.stringify(this.userForm));
    },

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
    onUnmounted(liveUsers)
  }
};


</script>



<style>
.signUpLabel {

  text-transform: uppercase;

}


.firstlastFlex {
  display: flex;
}

label {
  width: 150px;
  float: left;
  font-weight: lighter;
  text-align: left;

}

.dispFlex {
  display: flex;
  align-items: center;
  width: 100%;
  height: 45px;
}

::placeholder {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif
}


.form-group {
  width: 100vw
}

.label-column {
  padding: 10px;
}

.input-column {
  width: 70vw;
  padding: 10px
}


input {

  font-size: 10px;
}

.assistSide {
  width: 40%;
  height: fit-content;
  padding-bottom: 1%;
  margin-top: 5%;
  border-radius: 10px;
  margin-left: 1%;
}

ul {
  list-style: none;
}

li {
  padding: 10px;
  border: 1px solid lightgray;
  color: gray;
  font-family: Arial, Helvetica, sans-serif;
}

li:hover {
  color: rgb(25, 17, 11);
}
</style>
