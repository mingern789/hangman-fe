<template>
<div>   
  <form @submit.prevent="register">     
    <h2>Register</h2>     
    <input       
      type="email"       
      placeholder="Email address..."       
      v-model="email"  
      required   
    />   
    <input       
      type="text"       
      placeholder="Display name"       
      v-model="name"  
      required   
    />  
    <input       
      type="password"       
      placeholder="password..."       
      v-model="password"   
      required   
    />     
    <button type="submit">
       Register
    </button>   
  </form> 
</div>
</template>

<script>
export default {
  name: 'RegisterPage',
  middleware({ $fire, redirect }) {
    if ($fire.auth.currentUser) {
      return redirect("/");
    } 

//     $fire.auth.onAuthStateChanged(function(user) {
//   if (user) {
//     // User is signed in.
//     return redirect("/");
//   }
// });
  },
  data() {
      return {
          email: null,
          password: null,
          name:""
      }
  },
  methods: {
    register() {
    this.$fire
      .auth
      .createUserWithEmailAndPassword(this.email, this.password)
      .then(data => {
          data.user
            .updateProfile({
              displayName: this.name
            })
        })
      .then(() => {
        this.$fire.auth.onAuthStateChanged((user) => {
            user.displayName = this.name;
            this.$store.dispatch("fetchUser", user);
          })
      })
      .then(() => {
          alert('Successfully registered!');
        this.$router.push('/login');
        })
      .catch(error => {
        alert(error.message);
      });
  },
  }
}
</script>