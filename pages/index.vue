<template>
  <HangmanGame />
</template>

<script>
export default {
  name: "IndexPage",
  middleware({ $fire, redirect }) {
    if ($fire.auth.currentUser) {
      console.log("You legit");
    } else {
      console.log("You must be logged in to see this page");
      return redirect("/login");
    }
  
  },
  
  // mounted() {
  //   if (this.$fire.auth.currentUser) {
  //     console.log("You legit");
  //   } else {
  //     console.log("You must be logged in to see this page");
  //     this.$router.push("/login");
  //   }
  // }
};
</script>

