import { initializeApp } from "firebase/app";
// import { onAuthStateChanged,getAuth } from "firebase/auth";
// import { onSnapshot, collection, query, getFirestore } from 'firebase/firestore';
// import { onMounted, onUnmounted, ref} from 'vue';


export const firebaseConfig = {
  apiKey: "AIzaSyD8kn26Sj-wvYhB6h-vALgxWoZ2UyujHyI",
  authDomain: "hana-firebase-auth.firebaseapp.com",
  projectId: "hana-firebase-auth",
  storageBucket: "hana-firebase-auth.appspot.com",
  messagingSenderId: "257456893215",
  appId: "1:257456893215:web:7da412256ffcbfeb62142a",
  measurementId: "G-VNEDYMGDTL"
}

export const app = initializeApp(firebaseConfig);

export function checkEmail(input) {
  const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!regex.test(input) === true) {
    return false;
  }
  else {
    return true;

  }

}



export function checkNRIC(input) {
  const regex = /^[STFG]\d{7}[A-Z]$/;
  if (!regex.test(input) === true) {
    return false
  }
  else {
    return true
  }
}
export function checkPassword(input) {
  const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,31}$/;
  if (!regex.test(input) === true) {
    return false;
  }
  else {
    return true;

  }
}


export function checkMatch(input, confirmInput) {
  if (input.trim() != confirmInput.trim()) {
    return false;
  }
  else {
    return true
  }
}

export function rQuotes(input) {
  // regex will read string with the quotes, use this to remove them, works for ref const specifically... to alter for others, remove .value
  return input.value.replace(/['"]+/g, '')
}

//both functions below are for converting epoch time to readable human datetime format
export function timestampFormat(timestamp) { //returns yyyy-mm-dd hh:mm:ss
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function timestampDateOnly(timestamp) { //returns yyyy-mm-dd
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}-${month}-${day}`;
}


export function timestampChatFormat(timestamp) {
  const date = new Date(timestamp);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${month}-${day} ${hours}:${minutes}`;
}
export function getAge (timestamp) { //receive epoch time as parameter, return difference in years

  const timeDifference = Date.now() - timestamp;
  const seconds = timeDifference / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;

  return days/365
}

export function timeDifference (timestamp) { //customized for mobile chat app

  const timeDifference = Date.now() - timestamp;
  const seconds = timeDifference / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;

  if (minutes < 60) {
    return Math.round(minutes) + ' m';
  } else if (hours < 24) {
    return Math.round(hours) + ' h';
  } else {
    return Math.round(days) + ' d';
  }
}

export function truncateString (str) {
  if (str.length > 30) {
    return str.substring(0, 20) + "...";
  }
  else {
    return str;
  }
}

export function go (val) {
  this.$router.push({ path: val})
}

export function getEachUSName(val) { //takes in id of friends
  var arr = [];
  for (let i = 0 ; i < this.users.length; i++) {
      if (this.users[i].id === val) {      
          arr.push(this.users[i].username, this.users[i].userID)                                
      }
      
  }
  return arr;
}

export function getEachNameid(val) { //takes in id of friends
  var arr = [];
  for (let i = 0 ; i < this.users.length; i++) {
      if (this.users[i].userID === val) {      
          arr.push(this.users[i].username, this.users[i].userID)                                
      }
      
  }
  return arr;
}