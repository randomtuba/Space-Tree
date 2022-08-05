addLayer("a", {
    name: "achievements", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    color: "#FFAA00",
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    tooltip:"Achievements",
    resource: "achievements", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: "side", // Row the layer is in on the tree (0 is the first row)
tabFormat: [
    ["display-text", () => `<h2>You have completed ${player.a.achievements.length}/195 achievements (${format(new Decimal(player.a.achievements.length).div(195).mul(100))}%)</h2><br><i>You have completed ${player.a.achievements.length}/6 implemented achievements (${format(new Decimal(player.a.achievements.length).div(6).mul(100))}%)</i><br>Note: Achievements do not give any rewards to the main game.`],
    "blank",
    "achievements"
],
    layerShown(){return true},
  achievements: {
    11: {
      name: "Give Me Some Space",
      done(){return player.s.points.gte(5)},
      tooltip:"Reach 5 space energy.",
      style: {
        height: "65px",
        width: "65px",
      }
    },
    12: {
      name: "That's a lot!",
      done(){return player.s.totalSpace.gte(100)},
      tooltip:"Have 100 total space.",
      style: {
        height: "65px",
        width: "65px",
      }
    },
    13: {
      name: "Spacebar",
      done(){return hasMilestone("s",0)},
      tooltip:"Unlock Spacebar.",
      style: {
        height: "65px",
        width: "65px",
      }
    },
    21: {
      name: "Space Dust",
      done(){return player.d.points.gte(1000)},
      tooltip:"Have 1,000 unspent dust.",
      style: {
        height: "65px",
        width: "65px",
      }
    },
    22: {
      name: "Magma Chamber",
      done(){return player.d.dustTypes[3].gte(1)},
      tooltip:"Have 1 or more volcanic dust.",
      style: {
        height: "65px",
        width: "65px",
      }
    },
    23: {
      name: "Achoo!",
      done(){return player.d.points.gte(1e35)},
      tooltip:"Have 1e35 unspent dust.",
      style: {
        height: "65px",
        width: "65px",
      }
    },
  },
})