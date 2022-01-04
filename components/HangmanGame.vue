<!-- Please remove this file from your project -->
<template>
  <div class="container">
    <p id="quote" :class="{ strike: strikeout, highlight: puzzleComplete }">
      <span v-for="word in splitQuote">
        <template v-for="letter in word">{{ isRevealed(letter) }}</template>
      </span>
      <small v-if="gameOver"> —{{ quoteAuthor }} </small>
    </p>

    <div class="status">
      <h2>Strikes:</h2>
      <ul class="status">
        <li v-for="strike in strikes">{{ strike.icon }}</li>
      </ul>
    </div>

    <div id="button-board">
      <button
        v-for="letter in letters"
        @click="guess(letter)"
        :class="{
          strike: badGuesses.includes(letter),
          highlight: guesses.includes(letter),
        }"
        :disabled="guesses.includes(letter) || gameOver"
      >
        <span class="letter" :class="{ riser: guesses.includes(letter) }">{{
          letter
        }}</span>
        <span class="background"></span>
      </button>
    </div>

    <div class="status">
      <p>{{ message }}</p>
      <p>Player: {{ user.displayName }}</p>
    </div>

    <button id="new-game" @click="newGame" :class="{ highlight: gameOver }">
      New game
    </button>
    <button id="leaderboard" @click='toLeaderBoard' >
      Leaderboards
    </button>
    <button id="log-out" @click="logout">Log Out</button>
  </div>
</template>

<script>
// Change this if you want the possibility of longer or shorter puzzles.
const maxLength = 40; // (Typically, the lower this number, the harder the puzzle.)

//Change this if you want more or fewer strikes allowed
const allowedStrikes = 3; //If you set this and maxLength both too high, the puzzle will be impossible to lose.

const defaultStrikes = new Array(allowedStrikes).fill({
  icon: "⚪",
  guess: "",
});

export default {
  name: "NuxtTutorial",
  data: () => ({
    letters: Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ"),
    quotes: [], //Filled by the mounted hook
    currentQuote: "", //Filled by the mounted hook
    quoteAuthor: "",
    guesses: [],
    strikes: [...defaultStrikes],
    gameOver: false,
    playerData: null,
    allData: null,
  }),
  mounted() {
    fetch("https://type.fit/api/quotes")
      .then((response) => response.json())
      .then((fetchedQuotes) => {
        fetchedQuotes = fetchedQuotes.filter(
          (quote) => quote.text.length <= maxLength
        ); // Get rid of any quotes that are too long
        this.quotes = fetchedQuotes;
        this.pickAQuote();
      });
    if (this.$store.state.user.playerId) {
      this.$axios
        .get(
          `https://hangman-backend.mingern789.repl.co/players/${this.$store.state.user.playerId}`
        )
        .then((response) => {
          this.playerData = response.data;
        })
        .catch(function (err) {
          console.log("stw");
        });
    } else {
      this.$axios
        .get(`https://hangman-backend.mingern789.repl.co/players`)
        .then((response) => {
          this.allData = response.data;
          const filteredData = this.allData.filter(
            (x) => x.email == this.user.email
          );
          this.$store.commit('SET_ID', filteredData[0]._id)
          this.playerData = filteredData[0];
          // console.log(this.playerData)
        })
        .catch(function (err) {
          console.log("stw");
        });
    }
  },
  methods: {
    toLeaderBoard() {
      this.$confetti.stop();
      this.$router.push('/leaderboard')
    },
    //Can enter guesses with a keyboard, but it doesn't work super great because you need to be focusing a non-disabled element to use it currently. Needs some refinement.
    handleKeyPress(e) {
      const key = e.key.toUpperCase();
      if (
        key.length === 1 &&
        key.match(/[a-zA-Z]/) &&
        !this.guesses.includes(key)
      ) {
        // console.log(key);
        this.guess(key);
      }
    },
    pickAQuote() {
      // console.log(this.quotes);
      const random = Math.floor(Math.random() * this.quotes.length);
      this.currentQuote = this.quotes[random].text.toUpperCase();
      this.quoteAuthor = this.quotes[random].author;
    },
    //The function that turns unguessed letters into blank spots
    isRevealed(letter) {
      if (!letter.match(/[a-zA-Z\s]/)) {
        return letter;
      }
      return this.guesses.includes(letter) || this.gameOver ? letter : "_";
    },
    //Handles the guess and all possible results
    guess(letter) {
      console.log(letter);
      this.guesses.push(letter);
      if (!this.currentQuote.includes(letter)) {
        this.strikes.pop();
        this.strikes = [{ icon: "🚫", guess: letter }, ...this.strikes];
      }
      if (this.strikeout || this.puzzleComplete) {
        this.gameOver = true;

        if (this.puzzleComplete) {
          this.fireEmAll();
          let tempPlayData = this.playerData;
          tempPlayData.playHistory.push({ result: "win", strikes: 0 });
          this.$axios
            .post(
              `https://hangman-backend.mingern789.repl.co/players/${this.$store.state.user.playerId}`,
              {
                mmr: tempPlayData.mmr + 5,
                playHistory: tempPlayData.playHistory,
              }
            )
            .then((response) => {
              console.log(response);
            })
            .catch(function (error) {
              alert(error);
              return;
            });
        } else {
          let tempPlayData = this.playerData;
          tempPlayData.playHistory.push({ result: "loss", strikes: 4 });
          this.$axios
            .post(
              `https://hangman-backend.mingern789.repl.co/players/${this.$store.state.user.playerId}`,
              {
                mmr: tempPlayData.mmr - 5,
                playHistory: tempPlayData.playHistory,
              }
            )
            .then((response) => {
              console.log(response);
            })
            .catch(function (error) {
              alert(error);
              return;
            });
        }
      }
    },
    newGame() {
      const confirmation = confirm("End this game and start a new one?");
      if (!confirmation) return;
      this.pickAQuote();
      this.guesses = [];
      this.strikes = [...defaultStrikes];
      this.gameOver = false;
      this.$confetti.stop();
    },
    fireEmAll() {
      this.$confetti.start();
    },
    logout() {
      this.$fire.auth
        .signOut()
        .then(() => {
          alert("Successfully logged out");
          this.$router.push("/login");
        })
        .catch((error) => {
          alert(error.message);
          this.$router.push("/");
        });
    },
  },

  computed: {
    splitQuote() {
      return this.currentQuote.split(" ");
    },
    badGuesses() {
      return this.strikes.filter((s) => s.guess).map((s) => s.guess);
    },
    strikeout() {
      return this.badGuesses.length >= allowedStrikes;
    },
    puzzleComplete() {
      return this.unrevealed === 0;
    },
    unrevealed() {
      return [...this.currentQuote].filter((letter) => {
        return letter.match(/[a-zA-Z]/) && !this.guesses.includes(letter);
      }).length;
    },
    message() {
      if (!this.gameOver) {
        return "☝️ Pick a letter";
      } else if (this.strikeout) {
        return "❌ You lost this round. Try again?";
      } else if (this.puzzleComplete) {
        return "🎉 You win!";
      }
      //You can never be too safe ¯\_(ツ)_/¯
      return "😬 Unforeseen error state, maybe try a new game?";
    },
    user() {
      return this.$fire.auth.currentUser;
    },
  },
};
</script>

<style scoped>
*,
*:before,
*:after {
  box-sizing: border-box;
}

*:focus {
  outline: none;
  box-shadow: 0 0 0 4px #ffd100;
}

html {
  font-size: 1.125em;
  line-height: 1.5;
}
@media (min-width: 1200px) {
  html {
    font-size: 1.375em;
  }
}

body {
  margin: 0;
  min-height: 100vh;
  font-size: 1.5em;
  font-family: "Rubik Mono One", "Pathway Gothic One";
  color: #53565a;
  background: #f1f6f8;
}

.container {
  width: 100%;
  max-width: 36rem;
  margin: auto;
  padding: 1rem;
}
@media (min-width: 600px) {
  .container {
    padding: 2rem;
  }
}

#quote {
  letter-spacing: 0.1em;
  margin: 0 0 2rem;
  font-size: 1.25rem;
  line-height: 1.2em;
  background: #e0ebf0;
  border: 2px solid #53565a;
  padding: 1rem 1rem 2rem;
  box-shadow: 4px 4px 0 0 #7ba7bc;
  position: relative;
}
@media (min-width: 600px) {
  #quote {
    font-size: 2rem;
    margin: 1em 0 4rem;
    padding: 2rem 2rem 3rem;
  }
}
#quote.strike {
  color: #d7dade;
  background-color: #e4002b;
}
#quote.highlight {
  background-color: #ffd100;
}
#quote span {
  margin-right: 0.75em;
  display: inline-block;
}
#quote small {
  font-size: 0.5em;
  position: absolute;
  bottom: 0.5em;
  left: 2em;
}

#button-board {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(1.5em, 1fr));
  grid-gap: 0.5rem;
}
@media (min-width: 600px) {
  #button-board {
    grid-template-columns: repeat(auto-fit, minmax(2em, 1fr));
  }
}

button {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  padding: 0.4em 0.5em 0.3em 0.5em;
  width: auto;
  line-height: 1;
  border: 2px solid #53565a;
  color: inherit;
  background: #e0ebf0;
  font-size: 0.75em;
  box-shadow: 4px 4px 0 0 #7ba7bc;
  position: relative;
  overflow: hidden;
  transform-origin: bottom right;
}
@media (min-width: 600px) {
  button {
    font-size: 1em;
  }
}
button .background {
  content: "";
  height: 100%;
  width: 100%;
  background: #ffd100;
  position: absolute;
  z-index: 0;
  bottom: 0;
  left: 0;
  transform: scaleY(0);
  transform-origin: bottom;
  transition: transform 0.2s cubic-bezier(0.75, 0, 0.25, 1);
}
button:hover:not(:active):not([disabled]),
button:focus:not(:active):not([disabled]) {
  transform: translate(-1px, -1px);
  box-shadow: 6px 6px 0 0 #7ba7bc;
}
button:not([disabled]):active {
  transform: translate(2px, 2px);
  box-shadow: 0 0 0 0 #7ba7bc;
}
button.highlight .background {
  transform: scaleY(1);
}
button.strike {
  color: #d7dade;
}
button.strike .background {
  background-color: #e4002b;
}
button#new-game {
  margin-top: 2rem;
}
@media (min-width: 600px) {
  button#new-game {
    margin-top: 4rem;
  }
}
button .letter {
  position: relative;
  z-index: 2;
  color: inherit;
}
button[disabled]:not(.highlight) {
  border-color: #a7a8aa;
}
button[disabled]:not(.highlight) .letter {
  color: #a7a8aa;
}

.status {
  display: flex;
  flex-wrap: wrap;
  list-style-type: none;
  align-items: center;
  margin: 1rem 0;
}
.status h2 {
  font-size: 1rem;
  margin: 0;
}
.status ul {
  display: flex;
  margin: 0;
  padding: 0;
}
.status ul li {
  margin-left: 0.25em;
}
.status p {
  font-size: 1rem;
  width: 100%;
  margin: 0;
}

.riser {
  -webkit-animation: rise 0.3s cubic-bezier(0.5, 0, 0.5, 1);
  animation: rise 0.3s cubic-bezier(0.5, 0, 0.5, 1);
  display: block;
}

@-webkit-keyframes rise {
  0% {
    transform: translateY(0);
  }
  44.9% {
    transform: translateY(-1.5em);
  }
  45% {
    transform: translateY(1.5em);
  }
  55% {
    transform: translateY(1.5em);
  }
  0% {
    transform: translateY(0);
  }
}

@keyframes rise {
  0% {
    transform: translateY(0);
  }
  44.9% {
    transform: translateY(-1.5em);
  }
  45% {
    transform: translateY(1.5em);
  }
  55% {
    transform: translateY(1.5em);
  }
  0% {
    transform: translateY(0);
  }
}
</style>
