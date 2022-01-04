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
      <input type="text" placeholder="Display name" v-model="name" required />
      <input
        type="password"
        placeholder="password..."
        v-model="password"
        required
      />
      <button type="submit">Register</button>
    </form>
    <br>
    <p>PS: Sorry if the pages look like trash, the developer already spent most of his sanity getting the programming logic right.</p>
  </div>
</template>

<script>
export default {
  name: "RegisterPage",
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
      name: "",
    };
  },
  methods: {
    register() {
      this.$fire.auth
        .createUserWithEmailAndPassword(this.email, this.password)
        .then((data) => {
          data.user.updateProfile({
            displayName: this.name,
          });
        })
        .then(() => {
          // var bodyFormData = new FormData();
          // bodyFormData.append("displayName", this.name);
          // bodyFormData.append("mmr", 100);
          // bodyFormData.append("playHistory", []);
          this.$axios
            .post("https://hangman-backend.mingern789.repl.co/players", {
              displayName: this.name,
              mmr: 100,
              playHistory: [],
              email: this.email
            })
            .then((response) => {
              // $store.state.user.playerId = response.data._id
              // console.log(this.$store.state.user.playerId);
              this.setId(response.data._id)
            })
            .catch(function (error) {
              alert(error);
              return;
            })
            .then(() => {
              alert("Successfully registered!");
              this.$router.push("/login");
            })
            .catch(function (response) {
              //handle error
              alert(response);
            });
        })
        .catch((error) => {
          alert(error.message);
        });
    },
    setId(id) {
      this.$store.state.user.playerId = id
    }
  },
};
</script>
