<!-- Please remove this file from your project -->
<template>
  <!-- <div class="container">
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
  </div> -->
  <div>
    <div id="outerContainer">
      <div id="contentContainer">
        <div id="content">
          <h1></h1>
          <!-- <h2 id="leaderboard_type">Top Players by Core MMR</h2> -->
          <div id="regionSelect">
            <!-- <span
            ><a class="unselected_division" href="#americas-0"
              >Americas</a
            ></span
          >
          <span
            ><a class="unselected_division" href="#europe-0">Europe</a></span
          >
          <span
            ><a class="unselected_division" href="#se_asia-0">SE Asia</a></span
          >
          <span><a class="selected_division" href="#china-0">China</a></span> -->
          </div>
          <div style="position: relative; z-index: 2;padding: 10px 50px;">
            <p
              id="quote"
              :class="{ strike: strikeout, highlight: puzzleComplete }"
            >
              <span v-for="word in splitQuote">
                <template v-for="letter in word">{{
                  isRevealed(letter)
                }}</template>
              </span>
              <small v-if="gameOver"> —{{ quoteAuthor }} </small>
            </p>
          </div>
          <div id="faqArea">
            <div class="status">
              <h2>Strikes:</h2>
              <ul class="status">
                <li v-for="strike in strikes">
                <!-- {{ strike.icon }} -->
                <img :src="strike.imgUrl" height="25">
                </li>
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
                <span
                  class="letter"
                  :class="{ riser: guesses.includes(letter) }"
                  >{{ letter }}</span
                >
                <span class="background"></span>
              </button>
            </div>

            <div class="status">
              <p><img v-if="strikeout" src="/don-no.webp" height="22" alt="don-chan grieving">
              <img v-else-if="puzzleComplete" src="/don-win.webp" alt="don-chan hyped up" height="22">
              {{ message }}</p>
              <br><br>
              <p>Player: {{ user.displayName }}</p>
            </div>

            <button
              id="new-game"
              @click="newGame"
              :class="{ highlight: gameOver }"
            >
              New game
            </button>
            <button id="leaderboard" @click="toLeaderBoard">
              Leaderboards
            </button>
            <button id="log-out" @click="logout">Log Out</button>
          </div>
        </div>
      </div>
    </div>
    <div id="bottomContainer_1">
      <div id="bottomContainer_2">
        <div id="logoValve"></div>
        <div id="legal">© PuchyPochy</div>
      </div>
    </div>
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
  imgUrl:"/don-icon.webp"
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
          this.$store.commit("SET_ID", filteredData[0]._id);
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
      this.$router.push("/leaderboard");
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
        this.strikes = [{ icon: "🚫", guess: letter, imgUrl:"/kat-icon.webp" }, ...this.strikes];
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
          this.$confetti.stop();
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
        return " You lost this round. Try again?";
      } else if (this.puzzleComplete) {
        return " You win!";
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
  /* box-shadow: 0 0 0 4px #ffd100; */
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
  background: #202020;
  border: 2px solid rgb(59, 58, 56);
  padding: 1rem 1rem 2rem;
  box-shadow: 4px 4px 0 0 #181818;
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
  background-color: grey;
}
#quote span {
  color:#d0d0d0;
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
  border: 2px solid #ffffff50;
  color: white;
  background: transparent;
  font-size: 0.75em;
  /* box-shadow: 4px 4px 0 0 #7ba7bc; */
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
  background: #286323;
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
  border-color: #ff6046;
  transform: translateY(-2px);
  cursor: pointer;
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
  color:#eee;
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

.submit-div {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.homepage_StandardButton_1W4Sc:hover {
  border: 3px solid #ff6046;
  transform: translateY(-2px);
  color: #ff6046;
}
.homepage_StandardButton_1W4Sc {
  border: 3px solid #ffffff50;
  padding: 15px 25px;
  border-radius: 5px;
  cursor: pointer;
  background-color: transparent;
  width: fit-content;
  transition-duration: 0.2s;
}

.homepage_StandardButton_1W4Sc .homepage_ButtonText_1YB3f {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #fff;
}

.input_title {
  font-size: 14px;
  color: #b8b6b4;
  margin-bottom: 5px;
}

input {
  max-width: 300px;
  background: #32353c;
  border-radius: 3px;
  color: #e9e9e9;
  padding: 8px 6px;
  /* display: block; */
  box-shadow: none;
  width: 100%;
  transition: border ease-in-out 0.5s;
  border: 1px solid #26282d;
  outline: none;
  font-weight: normal;
  margin-bottom: 18px;
}
a:link,
visited,
active {
  /* unvisited link */
  color: #969aa1;
  text-decoration: underline;
}

a:hover {
  /* mouse over link */
  color: #cfcfcf;
  text-decoration: underline;
}

body {
  background-color: #0a1010;
  padding: 0;
  margin: 0;
  font-family: georgia, serif;
  text-align: left;
  font-size: 14px;
  line-height: 24px;
  color: #5e5e5e;
  background-position: top center;
}

#bottomContainer_1 {
  background-image: url("https://cdn.cloudflare.steamstatic.com/apps/dota2/images//leaderboards/bg_bottom.jpg");
  background-position: top center;
  background-repeat: no-repeat;
  margin-right: auto;
  margin-left: auto;
  position: relative;
  height: 524px;
  background-color: #0a1010;
}

#bottomContainer_2 {
  background-image: url("https://cdn.cloudflare.steamstatic.com/apps/dota2/images//leaderboards/bg_bottom.jpg");
  background-position: top center;
  background-repeat: no-repeat;
  margin-right: auto;
  margin-left: auto;
  position: relative;
  height: 524px;
  width: 938px;
}

@media screen and (max-width: 1023px) {
  #bottomContainer_2 {
    width: 100%;
  }

  #content {
    width: 100% !important;
  }
}

#outerContainer {
  background-image: url("https://cdn.cloudflare.steamstatic.com/apps/dota2/images//leaderboards/bg_repeat.jpg");
  background-repeat: repeat-y;
  background-position: top center;
  background-color: #0a1010;
}
#contentContainer {
  background-image: url("https://cdn.cloudflare.steamstatic.com/apps/dota2/images//leaderboards/bg_top.jpg");
  background-position: top center;
  background-repeat: no-repeat;
}
#content {
  background-image: url("https://cdn.cloudflare.steamstatic.com/apps/dota2/images//leaderboards/bg_top.jpg");
  background-position: top center;
  background-repeat: no-repeat;
  position: relative;
  width: 938px;
  min-height: 700px;
  margin-right: auto;
  margin-left: auto;
  text-align: center;
}

#globe {
  position: absolute;
  top: 230px;
  right: 30px;
  z-index: 1;
}

#faqArea {
  text-align: left;
  padding: 10px 50px;
}
#faqArea ul {
  margin-top: 0px;
  margin-bottom: 0px;
}

.question {
  padding: 0px 90px;
  font-size: 16px;
  color: #b7b7b4;
}

.answer {
  padding: 0px 90px 20px 120px;
  font-size: 14px;
  line-height: 20px;
}

#logoValve {
  position: absolute;
  left: 20px;
  top: 320px;
  width: 110px;
  height: 36px;
}

#legal {
  position: absolute;
  left: 140px;
  top: 320px;
  color: #525050;
  font-size: 12px;
  line-height: 16px;
}

#content h1 {
  font-weight: normal;
  font-size: 36px;
  color: #b7b7b4;
  margin: 0;
  padding: 48px 0px 16px 0px;
}

#content h2 {
  font-weight: normal;
  font-size: 24px;
  color: #555555;
  margin: 0;
  padding: 0px 0px 0px 0px;
}

#regionSelect {
  position: relative;
  padding: 100px 0px 20px 0px;
  z-index: 2;
  font-size: 24px;
}
#regionSelect span {
  display: inline-block;
  padding: 0px 24px;
  color: #ffffff;
  text-decoration: underline;
}
#regionSelect a {
  display: inline-block;
}
#regionSelect a.unselected_division {
  text-decoration: none;
}
#regionSelect a.selected_division {
  color: #e0e0e0;
  text-decoration: underline;
}

th {
  background-color: #000000;
  color: #b7b7b4;
  line-height: 16px;
  font-size: 14px;
}

td {
  color: #a4a4a4;
}

.player_name {
  color: #d0d0d0;
  font-weight: 700;
}

.no_official_data {
  color: #404040;
}

* {
  font-family: "Radiance";
  line-height: normal;
}

#navBarBGRepeat {
  width: 100%;
  height: 64px;
  position: relative;
  z-index: 10001;
  background-image: url("https://cdn.cloudflare.steamstatic.com/apps/dota2/images/header/header_bg.png");
  font-family: "Radiance";
}

#navBarBG {
  width: 100%;
  height: 64px;
  text-align: center;
}

#navBar {
  width: 950px;
  height: 64px;
  padding: 0;
  margin: 0 auto;
  text-align: left;
  font-family: "Radiance";
}

#navBar .navBarItem {
  position: relative;
  display: inline-block;
  line-height: 18px;
}

#navBar a.navBarItem {
  text-transform: uppercase;
  letter-spacing: 4px;
  font-size: 14px;
  color: #cecece;
}

#navBar a.navBarItem:hover {
  color: #ffffff;
}

#navBar img.dn_arrow {
  position: relative;
  width: 10px;
  height: 6px;
  border: 0;
  top: -1px;
}


a.navBarItem:link,
a.navBarItem:active,
a.navBarItem:visited {
  text-decoration: none;
  color: #908d8b;
}

a.navBarItem:hover {
  color: #ffffff;
}

#navLoginAndLanguage {
  position: absolute;
  width: 750px;
  text-align: right;
  top: 22px;
  padding-right: 10px;
  font-size: 10px;
  text-transform: uppercase;
  color: #626263;
  letter-spacing: 1px;
  line-height: 18px;
  font-family: "Radiance";
}

#navLoginAndLanguage a,
#navLoginAndLanguage a:hover,
#navLoginAndLanguage a:visited,
#navLoginAndLanguage a:active {
  color: #626263;
  text-decoration: none;
  font-size: 10px;
  font-family: "Radiance";
}

#navLoginAndLanguage a:hover {
  color: #ffffff;
}

#languageSelector {
  display: inline-block;
}

#languageList {
  padding: 3px 2px;
  border: solid #777777 1px;
  background-color: #333333;
  text-align: left;
  z-index: 999999;
  position: absolute;
  right: 10px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
  -moz-box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
  -webkit-box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
  font-family: "Radiance";
}

#languageList a {
  display: block;
  padding: 3px 6px;
}

#languageList a:hover {
  background-color: #555555;
}

#adminSelector {
  position: absolute;
  margin-left: 600px;
  margin-top: 40px;
}

#adminList {
  width: 130px;
  padding: 3px 2px;
  border: solid #777777 1px;
  background-color: #333333;
  text-align: left;
  z-index: 100;
  position: absolute;
  right: 20px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
  -moz-box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
  -webkit-box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
}

#adminList a {
  display: block;
  padding: 3px 6px;
}

#adminList a:hover {
  background-color: #555555;
}

#supportSelector {
  position: absolute;
  margin-left: 670px;
  margin-top: 40px;
}

#supportList {
  padding: 3px 2px;
  border: solid #777777 1px;
  background-color: #333333;
  text-align: left;
  z-index: 100;
  position: absolute;
  right: 20px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
  -moz-box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
  -webkit-box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
}

#supportList a {
  display: block;
  padding: 3px 6px;
}

#supportList a:hover {
  background-color: #555555;
}

.menuSubItemList {
  min-width: 200px;
  padding: 3px 2px;
  border: solid #555 1px;
  background-color: #111;
  text-align: left;
  z-index: 999999;
  position: absolute;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
  -moz-box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
  -webkit-box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
}

.menuSubItemList a {
  display: block;
  padding: 6px 8px;
  color: #aaa !important;
  font-size: small;
  text-decoration: none;
}

.menuSubItemList a:hover {
  color: white !important;
  background-color: #555;
  text-decoration: none;
}

.navItem {
  height: 24px;
  margin-top: 21px;
  display: inline-block;
}

.navItem sup {
  color: #a83b28;
  font-size: 0.7em;
  vertical-align: top;
  position: relative;
  top: -8px;
}

.navItemDotaLogo {
  width: 180px;
}

.navItem .DotaLogo {
  position: absolute;
  margin-top: -21px;
  top: 0;
  opacity: 0.8;
}

.navItem .DotaLogo:hover {
  opacity: 1;
}

@font-face {
  font-family: "Radiance";
  src: url("https://cdn.cloudflare.steamstatic.com/apps/dota2/fonts/radiance.eot");
  src: url("https://cdn.cloudflare.steamstatic.com/apps/dota2/fonts/radiance.eot?#iefix")
      format("embedded-opentype"),
    url("https://cdn.cloudflare.steamstatic.com/apps/dota2/fonts/radiance.woff")
      format("woff"),
    url("https://cdn.cloudflare.steamstatic.com/apps/dota2/fonts/radiance.ttf")
      format("truetype"),
    url("https://cdn.cloudflare.steamstatic.com/apps/dota2/fonts/radiance.svg#ywftsvg")
      format("svg");
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: "Radiance-Bold";
  src: url("https://cdn.cloudflare.steamstatic.com/apps/dota2/fonts/radiance-bold.eot");
  src: url("https://cdn.cloudflare.steamstatic.com/apps/dota2/fonts/radiance-bold.eot?#iefix")
      format("embedded-opentype"),
    url("https://cdn.cloudflare.steamstatic.com/apps/dota2/fonts/radiance-bold.woff")
      format("woff"),
    url("https://cdn.cloudflare.steamstatic.com/apps/dota2/fonts/radiance-bold.ttf")
      format("truetype"),
    url("https://cdn.cloudflare.steamstatic.com/apps/dota2/fonts/radiance-bold.svg#ywftsvg")
      format("svg");
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: "Radiance-SemiBold";
  src: url("https://cdn.cloudflare.steamstatic.com/apps/dota2/fonts/radiance-semibold.eot");
  src: url("https://cdn.cloudflare.steamstatic.com/apps/dota2/fonts/radiance-semibold.eot?#iefix")
      format("embedded-opentype"),
    url("https://cdn.cloudflare.steamstatic.com/apps/dota2/fonts/radiance-semibold.woff")
      format("woff"),
    url("https://cdn.cloudflare.steamstatic.com/apps/dota2/fonts/radiance-semibold.ttf")
      format("truetype"),
    url("https://cdn.cloudflare.steamstatic.com/apps/dota2/fonts/radiance-semibold.svg#ywftsvg")
      format("svg");
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: "goudy_trajan_boldbold";
  src: url("https://cdn.cloudflare.steamstatic.com/apps/dota2/fonts/goudytrajan-bold-pro-webfont.eot");
  src: url("https://cdn.cloudflare.steamstatic.com/apps/dota2/fonts/goudytrajan-bold-pro-webfont.eot?#iefix")
      format("embedded-opentype"),
    url("https://cdn.cloudflare.steamstatic.com/apps/dota2/fonts/goudytrajan-bold-pro-webfont.woff")
      format("woff"),
    url("https://cdn.cloudflare.steamstatic.com/apps/dota2/fonts/goudytrajan-bold-pro-webfont.ttf")
      format("truetype"),
    url("https://cdn.cloudflare.steamstatic.com/apps/dota2/fonts/goudytrajan-bold-pro-webfont.svg#goudy_trajan_boldbold")
      format("svg");
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: "goudy_trajan_mediummedium";
  src: url("https://cdn.cloudflare.steamstatic.com/apps/dota2/fonts/goudytrajan-medium-pro-webfont.eot");
  src: url("https://cdn.cloudflare.steamstatic.com/apps/dota2/fonts/goudytrajan-medium-pro-webfont.eot?#iefix")
      format("embedded-opentype"),
    url("https://cdn.cloudflare.steamstatic.com/apps/dota2/fonts/goudytrajan-medium-pro-webfont.woff")
      format("woff"),
    url("https://cdn.cloudflare.steamstatic.com/apps/dota2/fonts/goudytrajan-medium-pro-webfont.ttf")
      format("truetype"),
    url("https://cdn.cloudflare.steamstatic.com/apps/dota2/fonts/goudytrajan-medium-pro-webfont.svg#goudy_trajan_mediummedium")
      format("svg");
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: "goudy_trajan_regularregular";
  src: url("https://cdn.cloudflare.steamstatic.com/apps/dota2/fonts/goudytrajan-regular-pro-webfont.eot");
  src: url("https://cdn.cloudflare.steamstatic.com/apps/dota2/fonts/goudytrajan-regular-pro-webfont.eot?#iefix")
      format("embedded-opentype"),
    url("https://cdn.cloudflare.steamstatic.com/apps/dota2/fonts/goudytrajan-regular-pro-webfont.woff")
      format("woff"),
    url("https://cdn.cloudflare.steamstatic.com/apps/dota2/fonts/goudytrajan-regular-pro-webfont.ttf")
      format("truetype"),
    url("https://cdn.cloudflare.steamstatic.com/apps/dota2/fonts/goudytrajan-regular-pro-webfont.svg#goudy_trajan_regularregular")
      format("svg");
  font-weight: normal;
  font-style: normal;
}

#mcgcflushresponse li .Language {
  padding-right: 10px;
}

#mcgcflushresponse .Done {
  color: rgb(100, 100, 100);
}

#mcgcflushresponse .Title {
  padding-bottom: 10px;
}

#HeaderSeperator {
  color: #4f4c49;
  display: inline-block;
  margin-right: 15px;
  margin-left: 15px;
}

#HeaderAdminSeperator {
  display: inline-block;
  margin-right: 5px;
  margin-left: 5px;
  font-size: 12px;
}

#PlayForFreeButton {
  display: block;
  border-radius: 3px 3px 3px 3px;
  -moz-border-radius: 3px 3px 3px 3px;
  -webkit-border-radius: 3px 3px 3px 3px;
  background-color: #111c26;
  border: 1px solid #336391;
  height: 38px;
  width: 200px;
  text-shadow: 2px 2px 5px #000000;
  color: #4585c3;
  margin-left: 10px;
  text-align: center;
  float: right;
  margin-top: 13px;
  text-transform: uppercase;
  text-shadow: 2px 2px 5px #000000;
  -webkit-text-stroke: 0.2px;
  font-size: 15px;
  padding-top: 8px;
  letter-spacing: 3px;
  -o-transition: 0.3s;
  -ms-transition: 0.3s;
  -moz-transition: 0.3s;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  -webkit-box-shadow: 0px 3px 12px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 3px 12px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 3px 12px 0px rgba(0, 0, 0, 0.75);
  font-family: "Radiance";
}

#PlayForFreeButton:hover {
  -webkit-transition: none;
  -moz-transition: none;
  -o-transition: none;
  transition: none;
  background-color: #263f56;
  color: #5595d3;
  border: 1px solid #3a73a3;
  -o-transition: 0.3s;
  -ms-transition: 0.3s;
  -moz-transition: 0.3s;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  -webkit-transition: none;
  -moz-transition: none;
  -o-transition: none;
  transition: none;
  background-color: #263f56;
  color: #5595d3;
  border: 1px solid #3a73a3;
  -o-transition: 0.3s;
  -ms-transition: 0.3s;
  -moz-transition: 0.3s;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  font-family: "Radiance";
}

body {
  margin: 0;
  padding: 0;
  background-color: #2d2d2b;
  color: #939393;
}

.NoSelect {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

#liveFeedHeader {
  width: 700px;
  background-color: #000000;
  padding: 10px;
}

.watchLiveLink,
.watchLiveLink:hover,
.watchLiveLink:active,
.watchLiveLink:visited {
  font-size: 16px;
  font-weight: bold;
  color: #ffa800;
}

.teamNameLink,
.teamNameLink:hover,
.teamNameLink:active,
.teamNameLink:visited {
  text-decoration: none;
}

#userInfo {
  position: absolute;
  top: 0px;
  right: 0px;
  width: auto;
  background-color: black;
  padding: 4px 10px;
  font-size: 11px;
  color: #ffffff;
  line-height: 16px;
  text-align: left;
}

.menu {
  list-style-type: none;
  padding: 0px;
  margin: 0px;
  border: 0;
  margin-left: 73px;
}
.menu li {
  float: left;
  padding-left: 6px;
  padding-right: 6px;
  padding-top: 21px;
  margin-right: 8px;
  color: #cccccc;
  font-size: 14px;
  color: #b8b6b4;
  text-transform: uppercase;
}

.menu a,
.menu a:active,
.menu a:visited,
.menu a:link,
.menu a:focus {
  color: #959595;
  text-decoration: none;
}

a,
a:active,
a:visited,
a:focus {
  color: #959595;
  text-decoration: none;
}

a:hover {
  color: #ffffff;
  text-decoration: none;
  -webkit-transition: color 0.15s ease-in-out;
  -moz-transition: color 0.15s ease-in-out;
  -o-transition: color 0.15s ease-in-out;
  transition: color 0.15s ease-in-out;
}

a.intmenu,
a.intmenu:link,
a.intmenu:visited,
a.intmenu:active,
a.intmenu:hover {
  display: inline-block;
  padding: 21px 6px 0px 6px;
  margin-right: 8px;
  font-size: 14px;
  color: #b8b6b4;
  text-transform: uppercase;
}
a.intmenu:hover {
  color: #ffffff;
}

#centerContent {
  width: 958px;
  margin: 0;
  padding: 0;
  text-align: left;
  font-size: 12px;
  line-height: 18px;
}

.centered {
  text-align: center;
}

form {
  margin: 0;
  padding: 0;
}

.perf_timing_area {
  position: relative;
  width: 936px;
  max-width: 100%;
  margin: 0px auto 48px auto;
  text-align: center;
  color: #b0aeac;
}

.perf_timing_data {
  text-align: left;
  background-color: #000000;
  padding: 8px;
}
</style>
