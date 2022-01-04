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

    // $fire.auth.onAuthStateChanged(function (user) {
    //   if (!user) {
    //     // User is not signed in.
    //     console.log("You must be logged in to see this page");
    //     return redirect("/login");
    //   }
    //   else {
    //     console.log(user)
    //   }
    // });
  },
};
</script>
