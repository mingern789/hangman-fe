<template>
  <div>
    <div id="outerContainer">
      <div id="contentContainer">
        <div id="content">
          <img
            id="globe"
            src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/leaderboards/globe.png"
            width="339"
            height="339"
            border="0"
          />
          <h1>Leaderboard</h1>
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
          <div style="position: relative; z-index: 2">
            <table
              style="position: relative; z-index: 2; margin: 0 auto"
              border="2"
              bordercolor="#3b3a38"
              cellspacing="0"
              cellpadding="2"
            >
              <thead>
                <tr>
                  <th align="center">Rank</th>
                  <th valign="middle" width="400" align="left">
                    &nbsp;&nbsp;Player
                  </th>
                  <th valign="right" width="400" align="left">
                    &nbsp;&nbsp;MMR
                  </th>
                </tr>
              </thead>
              <tbody id="leaderboard_body">
                <tr
                  v-for="(player, index) in allData"
                  :bgcolor="index % 2 ? '#181818' : '#202020'"
                >
                  <td align="center">{{ index + 1 }}</td>
                  <td
                    align="left"
                    style="overflow: hidden; max-width: 300px"
                    width="300"
                  >
                    &nbsp;&nbsp;<span class="player_name">{{
                      player.displayName
                    }}</span>
                  </td>
                  <td align="left">&nbsp;&nbsp;{{ player.mmr }}</td>
                </tr>
                <!-- <tr bgcolor="#202020">
                <td align="center">2</td>
                <td
                  align="left"
                  style="overflow: hidden; max-width: 300px"
                  width="300"
                >
                  &nbsp;&nbsp;<span class="team_tag">VG.</span
                  ><span class="player_name">Xm</span>
                </td>
                <td align="left">&nbsp;&nbsp;9998</td>
              </tr> -->
              </tbody>
            </table>
          </div>
          <div id="faqArea">
            <p><br /></p>
          </div>
        </div>
      </div>
    </div>
    <div id="bottomContainer_1">
      <div id="bottomContainer_2">
        <div id="logoValve"></div>
        <div id="legal">© Team Maji Taiko</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LeaderboardPage",
  data() {
    return {
      allData: null,
    };
  },
  mounted() {
    document.getElementsByTagName("BODY")[0].style.margin = 0;
    this.$axios
      .get(`https://hangman-backend.mingern789.repl.co/players`)
      .then((response) => {
        this.allData = response.data.sort(
          (a, b) => parseFloat(b.mmr) - parseFloat(a.mmr)
        );
      })
      .catch(function (err) {
        console.log("stw");
      });
  },
};
</script>

<style scoped>
a:link,
visited,
active {
  /* unvisited link */
  color: #969aa1;
  text-decoration: none;
}

a:hover {
  /* mouse over link */
  color: #cfcfcf;
  text-decoration: none;
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

#navBar div.external_img {
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
  text-stroke: 0.2px;
  font-size: 15px;
  padding-top: 8px;
  text-stroke: 0.2px;
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

.perf_timing_link {
}

.perf_timing_data {
  text-align: left;
  background-color: #000000;
  padding: 8px;
}
</style>
