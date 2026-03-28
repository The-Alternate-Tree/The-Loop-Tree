let modInfo = {
  name: "The Loop Tree",
  id: "mymod",
  author: "liam",
  pointsName: "points",
  modFiles: ["layers.js", "tree.js"],

  discordName: "",
  discordLink: "https://discord.gg/GrMEPW7JZT",
  initialStartPoints: new Decimal(0), // Used for hard resets and new players
  offlineLimit: 0, // In hours
};

// Set your version in num and name
let VERSION = {
  num: "1.2",
  name: "Ascending From Heaven",
};

let changelog = `<h1>Changelog:</h1><br>
<h3><br>v1.2 - Ascending From Heaven - 3/28/2026</h3><br>
		- Added loop VI<br>
		- Added a new layer, ascension<br>
    - Added 2 buyables<br>
		- Added 2 achievements<br>
		- Significantly increased loop cost scalling from 6 loops onwards (^2.26 scalling) <br>

<h3><br>v1.12 - Negative Fix - 3/24/2026</h3><br>
		- Fixed upgrade point upgrade 41's cost<br>
		- Changed 41's cost (40 > 45)<br>


<h3><br>v1.11 - Achievements - 3/23/2026</h3><br>
		- Added achievements<br>
		- Changed the first upgrade point upgrade's name<br>


<h3><br>v1.1 - Upgrade Tree - 3/22/2026</h3><br>
	
		- Added upgrade points<br>
		- Added an upgrade tree after spending an hour trying to find out how<br>
		- Added some rebirth upgrades and challenges<br>
		- Implemented loop V<br>


	<h3><br>v1.0 - Start Of A Game - 3/22/2026</h3><br>
		- Added prestige, rebirth, and the main gimick, loop<br>
		- Added a few upgrades<br>
		- Added a few milestones<br>
		- Added a bar that shows progress to next loop<br>
		- Added a challenge<br>
		<h3><br>v0.0</h3><br>
	
		- Added things.<br>
		- Added stuff.<br>




		`;

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`;

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"];

function getStartPoints() {
  return new Decimal(modInfo.initialStartPoints);
}

// Determines if it should show points/sec
function canGenPoints() {
  return true;
}

// Calculate points/sec!
function getPointGen() {
  if (!canGenPoints()) return new Decimal(0);

  let gain = new Decimal(1);
  if (hasUpgrade("p", 11)) gain = gain.add(upgradeEffect("p", 11));

  if (hasUpgrade("p", 12)) gain = gain.times(upgradeEffect("p", 12));
  if (hasMilestone("l", 2)) gain = gain.times(2);
  if (hasUpgrade("p", 13)) gain = gain.times(upgradeEffect("p", 13));
  if (hasUpgrade("p", 14)) gain = gain.times(upgradeEffect("p", 14));
  if (hasMilestone("l", 3)) gain = gain.times(2);
  if (hasUpgrade("r", 12)) gain = gain.times(upgradeEffect("r", 12));
  if (hasUpgrade("r", 13)) gain = gain.times(upgradeEffect("r", 13));
  if (hasUpgrade("r", 21)) gain = gain.times(upgradeEffect("r", 21));
  if (hasUpgrade("r", 22)) gain = gain.times(upgradeEffect("r", 22));
  if (hasUpgrade("u", 22)) gain = gain.times(upgradeEffect("u", 22));
  if (hasUpgrade("u", 31)) gain = gain.times(upgradeEffect("u", 31));
  if (hasUpgrade("u", 32)) gain = gain.times(upgradeEffect("u", 32));
  if (hasUpgrade("u", 33)) gain = gain.times(upgradeEffect("u", 33));
  if (hasUpgrade("a", 11)) gain = gain.times(upgradeEffect("a", 11));
  if (hasUpgrade("a", 12)) gain = gain.times(upgradeEffect("a", 12));
  gain = gain.times(buyableEffect("a", 11));
  if (inChallenge("p", 11)) gain = gain.div(20);
  if (inChallenge("r", 11)) gain = gain.sqrt();

  exp = new Decimal(1);

  if (hasUpgrade("u", 11)) exp = exp.times(1.04);
  return gain.pow(exp);
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() {
  return {};
}

// Display extra things at the top of the page
var displayThings = [
  function () {
    if (!player.points.eq(-69)) return "Current endgame: reach loop 6";
  },
];

// Determines when the game "ends"
function isEndgame() {
  return hasMilestone("l", 7);
}

// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {};

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
  return 3600; // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion) {}
