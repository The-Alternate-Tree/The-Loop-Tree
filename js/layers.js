addLayer("p", {
  name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
  symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
  position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
  startData() {
    return {
      unlocked: true,
      points: new Decimal(0),
    };
  },
  color: "#4BDC13",
  requires: new Decimal(10), // Can be a function that takes requirement increases into account
  resource: "prestige points", // Name of prestige currency
  baseResource: "points", // Name of resource prestige is based on
  baseAmount() {
    return player.points;
  }, // Get the current amount of baseResource
  type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
  exponent: 0.5, // Prestige currency exponent
  gainMult() {
    // Calculate the multiplier for main currency from bonuses
    mult = new Decimal(1);
    if (hasChallenge("p", 11)) mult = mult.times(3);
    if (hasMilestone("l", 3)) mult = mult.times(2);
    if (hasUpgrade("r", 11)) mult = mult.times(upgradeEffect("r", 11));
    if (hasUpgrade("r", 13)) mult = mult.times(upgradeEffect("r", 13));
    if (hasChallenge("r", 11)) mult = mult.times(5);
    if (hasChallenge("r", 12)) mult = mult.times(15);
    if (hasUpgrade("u", 21)) mult = mult.times(upgradeEffect("u", 21));

    return mult;
  },
  gainExp() {
    // Calculate the exponent on main currency from bonuses
    exp = new Decimal(1);
    if (inChallenge("r", 12)) exp = exp.times(0.6);

    return exp;
  },
  row: 1, // Row the layer is in on the tree (0 is the first row)
  hotkeys: [
    {
      key: "p",
      description: "P: Reset for prestige points",
      onPress() {
        if (canReset(this.layer)) doReset(this.layer);
      },
    },
  ],
  layerShown() {
    return hasMilestone("l", 1);
  },
  passiveGeneration() {
    return hasMilestone("l", 5) ? 2 : 0;
  },
  doReset(resettingLayer) {
    let keep = [];
    if (hasMilestone("l", 4) && resettingLayer == "r") keep.push("challenges");
    if (hasChallenge("r", 11) && resettingLayer == "r") keep.push("upgrades");

    if (layers[resettingLayer].row > this.row) layerDataReset("p", keep);
  },
  upgrades: {
    11: {
      title: "Base Increase",
      description: "Increase base point gain based on prestige points.",
      cost: new Decimal(1),
      unlocked() {
        return player[this.layer].unlocked;
      }, // The upgrade is only visible when this is true
      effect() {
        // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
        let ret = player.p.points.add(1).pow(0.5);
        if (hasUpgrade("r", 14)) ret = player.p.points.add(1).pow(0.64);
        return ret;
      },
      effectDisplay() {
        return "+" + format(this.effect()) + "";
      }, // Add formatting to the effect
    },
    12: {
      title: "Mult Increase",
      description: "Multiply point gain based on prestige points.",
      cost: new Decimal(5),
      unlocked() {
        return player[this.layer].unlocked;
      }, // The upgrade is only visible when this is true
      effect() {
        // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
        let ret = player.p.points.add(1).pow(0.32);
        return ret;
      },
      effectDisplay() {
        return "*" + format(this.effect()) + "";
      }, // Add formatting to the effect
    },
    13: {
      title: "Static Increase",
      description: "Multiply points.",
      cost: new Decimal(600),
      unlocked() {
        return hasChallenge("p", 11);
      }, // The upgrade is only visible when this is true
      effect() {
        // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
        let ret = 5;
        return ret;
      },
      effectDisplay() {
        return "*" + format(this.effect()) + "";
      }, // Add formatting to the effect
    },
    14: {
      title: "Genericity",
      description: "Double points per loop.",
      cost: new Decimal(4000),
      unlocked() {
        return hasChallenge("p", 11);
      }, // The upgrade is only visible when this is true
      effect() {
        // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
        let ret = new Decimal.pow(2, player.l.points);
        return ret;
      },
      effectDisplay() {
        return "*" + format(this.effect()) + "";
      }, // Add formatting to the effect
    },
  },
  challenges: {
    11: {
      unlocked() {
        return hasMilestone("l", 2);
      },
      name: "Divided Points",
      challengeDescription: "Point gain is divided by 20",
      goalDescription: "Reach 100 points",
      rewardDescription: "Triple prestige points and unlock new upgrades",
      canComplete: function () {
        return player.points.gte(100);
      },
    },
  },
});
addLayer("r", {
  name: "rebirth", // This is optional, only used in a few places, If absent it just uses the layer id.
  symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
  position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
  branches: ["p"],
  startData() {
    return {
      unlocked: false,
      points: new Decimal(0),
      best: new Decimal(0),
    };
  },
  color: "Purple",
  requires: new Decimal(1e5), // Can be a function that takes requirement increases into account
  resource: "rebirth points", // Name of prestige currency
  baseResource: "prestige points", // Name of resource prestige is based on
  baseAmount() {
    return player.p.points;
  }, // Get the current amount of baseResource
  type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
  exponent: 0.35, // Prestige currency exponent
  gainMult() {
    // Calculate the multiplier for main currency from bonuses
    mult = new Decimal(1);
    if (hasMilestone("l", 4)) mult = mult.times(3);
    if (hasMilestone("l", 5)) mult = mult.times(4);

    return mult;
  },
  gainExp() {
    // Calculate the exponent on main currency from bonuses
    exp = new Decimal(1);
    return exp;
  },
  row: 2, // Row the layer is in on the tree (0 is the first row)
  hotkeys: [
    {
      key: "r",
      description: "R: Reset for rebirth points",
      onPress() {
        if (canReset(this.layer)) doReset(this.layer);
      },
    },
  ],
  layerShown() {
    return hasMilestone("l", 3);
  },
  passiveGeneration() {
    return false ? 1 : 0;
  },
  doReset(resettingLayer) {
    let keep = [];

    if (layers[resettingLayer].row > this.row) layerDataReset("r", keep);
  },
  upgrades: {
    11: {
      title: "More Prestige",
      description: "Gain more prestige points.",
      cost: new Decimal(1),
      unlocked() {
        return player[this.layer].unlocked;
      }, // The upgrade is only visible when this is true
      effect() {
        // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
        let ret = 2.75;
        return ret;
      },
      effectDisplay() {
        return "*" + format(this.effect()) + "";
      }, // Add formatting to the effect
    },
    12: {
      title: "More Points",
      description: "Gain more points.",
      cost: new Decimal(1),
      unlocked() {
        return player[this.layer].unlocked;
      }, // The upgrade is only visible when this is true
      effect() {
        // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
        let ret = 3.25;
        return ret;
      },
      effectDisplay() {
        return "*" + format(this.effect()) + "";
      }, // Add formatting to the effect
    },
    13: {
      title: "Smaller Boosts",
      description: "Gain more points and prestige points.",
      cost: new Decimal(1),
      unlocked() {
        return player[this.layer].unlocked;
      }, // The upgrade is only visible when this is true
      effect() {
        // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
        let ret = 1.75;
        return ret;
      },
      effectDisplay() {
        return "*" + format(this.effect()) + "";
      }, // Add formatting to the effect
    },
    14: {
      title: "Better Effect",
      description: "Base increase uses a better formula.",
      cost: new Decimal(3),
      unlocked() {
        return player[this.layer].unlocked;
      }, // The upgrade is only visible when this is true
      effect() {
        // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
        let ret = 0.16;
        return ret;
      },
      effectDisplay() {
        return "+" + format(this.effect()) + " exp";
      }, // Add formatting to the effect
    },
    21: {
      title: "Lucky Number",
      description: "X7.77 points.",
      cost: new Decimal(150),
      unlocked() {
        return hasMilestone("l", 4);
      }, // The upgrade is only visible when this is true
      effect() {
        // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
        let ret = 7.77;
        return ret;
      },
      effectDisplay() {
        return "*" + format(this.effect()) + "";
      }, // Add formatting to the effect
    },
    22: {
      title: "Small Boost",
      description: "X3.75 points.",
      cost: new Decimal(2500),
      unlocked() {
        return hasMilestone("l", 4);
      }, // The upgrade is only visible when this is true
      effect() {
        // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
        let ret = 3.75;
        return ret;
      },
      effectDisplay() {
        return "*" + format(this.effect()) + "";
      }, // Add formatting to the effect
    },
  },
  challenges: {
    11: {
      unlocked() {
        return hasMilestone("l", 4);
      },
      name: "Rooted Points",
      challengeDescription: "Point gain is square rooted",
      goalDescription: "Reach 100,000 prestige points",
      rewardDescription:
        "Keep prestige upgrades on rebirth and X5 prestige points",
      canComplete: function () {
        return player.p.points.gte(1e5);
      },
    },
    12: {
      unlocked() {
        return hasMilestone("l", 4);
      },
      name: "Prestige Decrease",
      challengeDescription: "Prestige points are ^0.6",
      goalDescription: "Reach 100,000 prestige points",
      rewardDescription: "X15 prestige points",
      canComplete: function () {
        return player.p.points.gte(1e5);
      },
    },
  },
});
addLayer("u", {
  name: "upgrade points", // This is optional, only used in a few places, If absent it just uses the layer id.
  symbol: "U", // This appears on the layer's node. Default is the id with the first letter capitalized
  position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
  branches: ["p"],
  startData() {
    return {
      unlocked: false,
      points: new Decimal(0),
      best: new Decimal(0),
    };
  },
  color: "Yellow",
  requires: new Decimal(1e18), // Can be a function that takes requirement increases into account
  resource: "upgrade points", // Name of prestige currency
  baseResource: "points", // Name of resource prestige is based on
  baseAmount() {
    return player.points;
  }, // Get the current amount of baseResource
  type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
  exponent: 0.2, // Prestige currency exponent
  gainMult() {
    // Calculate the multiplier for main currency from bonuses
    mult = new Decimal(1);
    if (hasUpgrade("u", 41)) mult = mult.times(3);
    return mult;
  },
  gainExp() {
    // Calculate the exponent on main currency from bonuses
    exp = new Decimal(1);
    return exp;
  },
  row: 2, // Row the layer is in on the tree (0 is the first row)
  hotkeys: [
    {
      key: "u",
      description: "U: Reset for upgrade points",
      onPress() {
        if (canReset(this.layer)) doReset(this.layer);
      },
    },
  ],
  layerShown() {
    return hasMilestone("l", 5);
  },
  passiveGeneration() {
    return false ? 1 : 0;
  },
  doReset(resettingLayer) {
    let keep = [];

    if (layers[resettingLayer].row > this.row) layerDataReset("u", keep);
  },
  upgrades: {
    11: {
      title: "Increased Exponent",
      description: "Points are ^1.04.",
      cost: new Decimal(1),
      unlocked() {
        return player[this.layer].unlocked;
      }, // The upgrade is only visible when this is true
      effect() {
        // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
        let ret = 2.75;
        return ret;
      },
    },
    21: {
      title: "Prestige Increase",
      description: "X4 prestige points.",
      cost() {
        return new Decimal(2).pow(player.u.upgrades.length);
      },
      branches: [11],
      unlocked() {
        return hasUpgrade("u", 11);
      }, // The upgrade is only visible when this is true
      effect() {
        // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
        let ret = 4;
        return ret;
      },
    },
    22: {
      title: "Point Increase",
      description: "X3 points.",
      cost() {
        return new Decimal(2).pow(player.u.upgrades.length);
      },
      branches: [11],

      unlocked() {
        return hasUpgrade("u", 11);
      }, // The upgrade is only visible when this is true
      effect() {
        // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
        let ret = 3;
        return ret;
      },
    },
    31: {
      branches: [21],

      title: "Rebirth Based",
      description: "Rebirth points boost points.",
      cost() {
        return new Decimal(5).times(player.u.upgrades.length - 2);
      },
      unlocked() {
        return hasUpgrade("u", 21) && hasUpgrade("u", 22);
      }, // The upgrade is only visible when this is true
      effect() {
        // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
        let ret = player.r.points.add(1).pow(0.13);
        return ret;
      },
      effectDisplay() {
        return "*" + format(this.effect()) + "";
      }, // Add formatting to the effect
    },
    32: {
      branches: [21, 22],

      title: "Upgrade Based",
      description: "Upgrade points boost points.",
      cost() {
        return new Decimal(5).times(player.u.upgrades.length - 2);
      },
      unlocked() {
        return hasUpgrade("u", 21) && hasUpgrade("u", 22);
      }, // The upgrade is only visible when this is true
      effect() {
        // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
        let ret = player.u.points.add(1).pow(0.46);
        return ret;
      },
      effectDisplay() {
        return "*" + format(this.effect()) + "";
      }, // Add formatting to the effect
    },
    33: {
      branches: [22],

      title: "Looped Based",
      description: "Loops boost points.",
      cost() {
        return new Decimal(5).times(player.u.upgrades.length - 2);
      },
      unlocked() {
        return hasUpgrade("u", 21) && hasUpgrade("u", 22);
      }, // The upgrade is only visible when this is true
      effect() {
        // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
        let ret = player.l.points.add(1).pow(0.76);
        return ret;
      },
      effectDisplay() {
        return "*" + format(this.effect()) + "";
      }, // Add formatting to the effect
    },
    41: {
      branches: [31],

      title: "More Upgrade Points",
      description: "Triple upgrade points.",
      cost() {
        return new Decimal(40).times(player.u.upgrades.length - 5);
      },
      unlocked() {
        return hasUpgrade("u", 21) && hasUpgrade("u", 22);
      }, // The upgrade is only visible when this is true
      effect() {
        // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
        let ret = 3;
        return ret;
      },
    },
  },
  tabFormat: {
    "upgrade points": {
      content: [
        "main-display",
        "prestige-button",
        "resource-display",
        ["blank", "5px"], // Height

        [
          "display-text",
          function () {
            return "Be careful! Upgrade costs increase based on the amount of upgrade point upgrades you've bought and you can't respect them.";
          },
          { "font-size": "17px" },
        ],
        ["upgrade-tree", [[11], [21, 22], [31, 32, 33], [41]]],
      ],
    },
  },
});
addLayer("l", {
  name: "loop", // This is optional, only used in a few places, If absent it just uses the layer id.
  symbol: "L", // This appears on the layer's node. Default is the id with the first letter capitalized
  position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
  startData() {
    return {
      unlocked: true,
      points: new Decimal(0),
    };
  },
  color: "Grey",
  requires: new Decimal(10), // Can be a function that takes requirement increases into account
  resource: "loops", // Name of prestige currency
  baseResource: "points", // Name of resource prestige is based on
  baseAmount() {
    return player.points;
  }, // Get the current amount of baseResource
  type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
  base: 50,
  exponent: 1.5, // Prestige currency exponent
  gainMult() {
    // Calculate the multiplier for main currency from bonuses
    mult = new Decimal(1);
    return mult;
  },
  gainExp() {
    // Calculate the exponent on main currency from bonuses
    scaling = new Decimal(1);
    if (player.l.points.gte(4)) scaling = scaling.div(1.2);
    if (player.l.points.gte(6)) scaling = scaling.div(1.6);

    return scaling;
  },
  row: 100, // Row the layer is in on the tree (0 is the first row)
  hotkeys: [
    {
      key: "l",
      description: "L: Get the next loop",
      onPress() {
        if (canReset(this.layer)) doReset(this.layer);
      },
    },
  ],
  layerShown() {
    return true;
  },
  bars: {
    progressToNext: {
      fillStyle: { "background-color": "Blue" },
      baseStyle: { "background-color": "grey" },
      borderStyle() {
        return {};
      },
      direction: RIGHT,
      width: 600,
      height: 35,
      progress() {
        return player.points.log(getNextAt("l"));
      },
      display() {
        return (
          "Progress to next: " +
          format(player.points.log(getNextAt("l")).times(100)) +
          "% (requires " +
          format(getNextAt("l")) +
          " points)"
        );
      },
      unlocked: true,
    },
  },
  tabFormat: {
    loops: {
      content: [
        [
          "display-text",
          function () {
            return "You are at loop " + formatWhole(player.l.points);
          },
          { "font-size": "32px" },
        ],
        "blank",
        "prestige-button",
        ["blank", "5px"], // Height
        [
          "display-text",
          function () {
            return "Loops reset everything but unlock new content";
          },
          { "font-size": "20px" },
        ],
        ["bar", "progressToNext"],
        "milestones",
      ],
    },
  },
  milestones: {
    1: {
      requirementDescription: "Loop I",
      done() {
        return player[this.layer].points.gte(1);
      }, // Used to determine when to give the milestone
      effectDescription: "Unlock prestige.",
    },
    2: {
      requirementDescription: "Loop II",
      done() {
        return player[this.layer].points.gte(2);
      }, // Used to determine when to give the milestone
      effectDescription: "Double points and unlock a prestige challenge.",
    },
    3: {
      requirementDescription: "Loop III",
      done() {
        return player[this.layer].points.gte(3);
      }, // Used to determine when to give the milestone
      effectDescription:
        "Unlock rebirth and double prestige points and points.",
    },
    4: {
      requirementDescription: "Loop IV",
      done() {
        return player[this.layer].points.gte(4);
      }, // Used to determine when to give the milestone
      effectDescription:
        "Keep prestige challenges on rebirth. Unlock rebirth challenges, you don't have to do them in any order i guess. Triple rebirth points. Also unlock more rebirth upgrades.",
    },
    5: {
      requirementDescription: "Loop V",
      done() {
        return player[this.layer].points.gte(5);
      }, // Used to determine when to give the milestone
      effectDescription:
        "Unlock upgrade points and autogain prestige points. Also X4 rebirth points.",
    },
  },
  tooltip() {
    return (
      "Loop #" +
      formatWhole(player.l.points) +
      "<br> (" +
      format(player.points.log(getNextAt("l")).times(100)) +
      "%)"
    );
  },
});
addLayer("ach", {
  name: "achievements", // This is optional, only used in a few places, If absent it just uses the layer id.
  symbol: "🥇", // This appears on the layer's node. Default is the id with the first letter capitalized
  position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
  startData() {
    return {
      unlocked: true,
    };
  },
  color: "Yellow",
  tooltip: "achievements",
  type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have

  row: "side", // Row the layer is in on the tree (0 is the first row)

  layerShown() {
    return true;
  },
  achievements: {
    11: {
      name: "Looped",
      done() {
        return player.l.points.gte(1);
      },
      tooltip: "Reach loop I.",
    },
    12: {
      name: "Half Way",
      done() {
        return player.points.gte(250);
      },
      tooltip: "Get 250 points.",
    },
    13: {
      name: "Challenges? On Row I?",
      done() {
        return player.l.points.gte(2);
      },
      tooltip: "Reach loop II.",
    },
    14: {
      name: "OH THANK GOD!",
      done() {
        return hasChallenge("p", 11);
      },
      tooltip: "Complete 'Divided Points'.",
    },
    15: {
      name: "Prestiged",
      done() {
        return hasUpgrade("p", 14);
      },
      tooltip: "Get the last prestige upgrade.",
    },
    21: {
      name: "New Layer, Yay",
      done() {
        return player.l.points.gte(3);
      },
      tooltip: "Reach loop III.",
    },
    22: {
      name: "An Upgraded Upgrade?",
      done() {
        return hasUpgrade("r", 14);
      },
      tooltip: "Buy the fourth rebirth upgrade.",
    },
    23: {
      name: "Quad-Loop",
      done() {
        return player.l.points.gte(4);
      },
      tooltip: "Reach loop IV.",
    },
    24: {
      name: "Challenger",
      done() {
        return hasChallenge("r", 11) && hasChallenge("r", 12);
      },
      tooltip: "Complete 2 rebirth challenges.",
    },
    25: {
      name: "Upgrader",
      done() {
        return hasUpgrade("r", 22);
      },
      tooltip: "Buy 6 rebirth upgrades.",
    },
    31: {
      name: "Yet Another Layer",
      done() {
        return player.l.points.gte(5);
      },
      tooltip: "Reach loop V.",
    },
    32: {
      name: "Double-Digits",
      done() {
        return player.u.points.gte(10);
      },
      tooltip: "Have 10 upgrade points.",
    },
    33: {
      name: "Now It Looks Like TPT",
      done() {
        return player.u.upgrades.length > 5;
      },
      tooltip: "Buy 3 rows of the upgrade point tree.",
    },
  },
});
