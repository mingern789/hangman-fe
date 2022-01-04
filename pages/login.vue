<template>
  <div>
    <form @submit.prevent="login">
      <h2>Login</h2>
      <input type="email" placeholder="Email address..." v-model="email" />
      <input type="password" placeholder="password..." v-model="password" />
      <button type="submit">
        {{ btnText }}
      </button>
    </form>
    <p>Don't have an account? Register <NuxtLink to="/register">here.</NuxtLink></p>
    <p>Or if you haven't logged out but accidentally refreshed click <NuxtLink to="/">here</NuxtLink>
    to get back in the game. </p>
    <br>
    <p>PS: Sorry if the pages look like trash, the developer already spent most of his sanity getting the programming logic right.</p>
  </div>
</template>

<script>
export default {
  name: "LoginPage",
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
      btnText: "Login",
    };
  },
  methods: {
    login() {
        this.$fire.auth
          .signInWithEmailAndPassword(this.email, this.password)
          .then(() => {
            this.$fire.auth.onAuthStateChanged((user) => {
              this.$store.dispatch("fetchUser", user);
            });
            this.btnText = "Logging in...";
            this.$router.push("/");
          })
          .catch((error) => {
            alert("Are you sure those credentials are legit?");
          });
    },
  },
};
</script>
