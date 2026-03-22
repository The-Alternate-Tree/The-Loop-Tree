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
  num: "1.0",
  name: "Start Of A Game",
};

let changelog = `<h1>Changelog:</h1><br>
	<h3>v1.0 - Start Of A Game - 3/22/2026</h3><br>
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

  if (inChallenge("p", 11)) gain = gain.div(20);
  return gain;
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() {
  return {};
}

// Display extra things at the top of the page
var displayThings = [
  function () {
    if (!player.points.eq(-69))
      return "Current endgame: loop 3, 1 rebirth point";
  },
];

// Determines when the game "ends"
function isEndgame() {
  return player.r.points.gte(new Decimal("1"));
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
