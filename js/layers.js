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
    return mult;
  },
  gainExp() {
    // Calculate the exponent on main currency from bonuses
    exp = new Decimal(1);
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
    return false ? 1 : 0;
  },
  doReset(resettingLayer) {
    let keep = [];

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
        return player[this.layer].best.gte(1);
      }, // Used to determine when to give the milestone
      effectDescription: "Unlock prestige",
    },
    2: {
      requirementDescription: "Loop II",
      done() {
        return player[this.layer].best.gte(2);
      }, // Used to determine when to give the milestone
      effectDescription: "Double points and unlock a prestige challenge",
    },
    3: {
      requirementDescription: "Loop III",
      done() {
        return player[this.layer].best.gte(3);
      }, // Used to determine when to give the milestone
      effectDescription: "Unlock rebirth and double prestige points and points",
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
