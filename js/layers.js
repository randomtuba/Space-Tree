addLayer("s", {
    name: "space", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		    points: new Decimal(0),
        space: new Decimal(0),
        totalSpace: new Decimal(0),
    }},
    tabFormat: [
      "main-display",
      "prestige-button",
      "blank",
      ["display-text", () => `You have ${format(player.s.space)} space<br>You have collected ${format(player.s.totalSpace)} space in total`],
      "blank",
      "buyables",
      "blank",
      "clickables",
    ],
    color: "#FFFFFF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "space energy", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    base: 5,
    exponent: 1.25, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        mult = mult.div(buyableEffect("s",13))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "s", description: "S: Reset for space energy", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    onPrestige() {
      if(player.s.points.eq(player.s.best)){
        player.s.space = player.s.space.add(2)
        player.s.totalSpace = player.s.totalSpace.add(2)
      }
    },
    buyables: {
      11: {
        title: "Primary Space Building",
        cost(x) {return new Decimal(25).mul(new Decimal(5).pow(x)).mul(new Decimal(1.05).pow(x).pow(2))},
        display() {return `Double point generation per level.<br>Level: ${format(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} points<br>Effect: ${format(this.effect())}x point gain`},
        canAfford() {return player.points.gte(this.cost()) && player.s.space.gt(0)},
        buy() {
          player.points = player.points.sub(this.cost())
          setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
          player.s.space = player.s.space.sub(1)
        },
        effect(x) {
          let eff = Decimal.pow(new Decimal(2).add(buyableEffect("s",21)),x.add(buyableEffect("s",22)))
          return eff
        },
        style: {
          width: "175px",
          height: "120px",
        },
      },
      12: {
        title: "Secondary Space Building",
        cost(x) {return new Decimal(50).mul(new Decimal(7.5).pow(x)).mul(new Decimal(1.075).pow(x).pow(2))},
        display() {return `Multiply point gain based on points.<br>Level: ${format(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} points<br>Effect: ${format(this.effect())}x point gain`},
        canAfford() {return player.points.gte(this.cost()) && player.s.space.gt(0)},
        buy() {
          player.points = player.points.sub(this.cost())
          setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
          player.s.space = player.s.space.sub(1)
        },
        unlocked() {return player.s.points.gte(2)},
        effect(x) {
          let eff = Decimal.pow(player.points.add(10).log10().log2().add(1).add(buyableEffect("s",21).div(2)),x.add(buyableEffect("s",22)))
          return eff
        },
        style: {
          width: "175px",
          height: "120px",
        },
      },
      13: {
        title: "Ternary Space Building",
        cost(x) {return new Decimal(1000).mul(new Decimal(15).pow(x)).mul(new Decimal(1.15).pow(x).pow(2))},
        display() {return `Make space energy 4x cheaper per level.<br>Level: ${format(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} points<br>Effect: /${format(this.effect())} space energy cost`},
        canAfford() {return player.points.gte(this.cost()) && player.s.space.gt(0)},
        buy() {
          player.points = player.points.sub(this.cost())
          setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
          player.s.space = player.s.space.sub(1)
        },
        unlocked() {return player.s.points.gte(4)},
        effect(x) {
          let eff = Decimal.pow(4,x.add(buyableEffect("s",22)))
          return eff
        },
        style: {
          width: "175px",
          height: "120px",
        },
      },
      21: {
        title: "Quaternary Space Building",
        cost(x) {return new Decimal(1e6).mul(new Decimal(50).pow(x)).mul(new Decimal(1.5).pow(x).pow(2))},
        display() {return `<span style="font-size: 8px;">Add 1 to the <b>Primary Space Building</b> base and 0.5 to the <b>Secondary Space Building</b> base per level. <br>Level: ${format(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} points<br>Effect: +${format(this.effect())} Primary base, +${format(this.effect().div(2))} Secondary base</span>`},
        canAfford() {return player.points.gte(this.cost()) && player.s.space.gt(0)},
        buy() {
          player.points = player.points.sub(this.cost())
          setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
          player.s.space = player.s.space.sub(1)
        },
        unlocked() {return player.s.points.gte(8)},
        effect(x) {
          let eff = x.add(buyableEffect("s",22))
          return eff
        },
        style: {
          width: "175px",
          height: "120px",
        },
      },
      22: {
        title: "Quinary Space Building",
        cost(x) {return new Decimal(10).mul(new Decimal(1000).pow(x)).mul(new Decimal(10).pow(x).pow(2))},
        display() {return `Add 0.5 free levels to the previous Space Buildings.<br>Level: ${format(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} points<br>Effect: +${format(this.effect())} free levels`},
        canAfford() {return player.points.gte(this.cost()) && player.s.space.gt(0)},
        buy() {
          player.points = player.points.sub(this.cost())
          setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
          player.s.space = player.s.space.sub(1)
        },
        unlocked() {return player.s.points.gte(16)},
        effect(x) {
          let eff = x.div(2)
          return eff
        },
        style: {
          width: "175px",
          height: "120px",
        },
      },
    },
    clickables: {
      11: {
        display() {return `Respec Space Buildings`},
        onClick() {
          if(confirm("Are you sure you want to respec? This will cause a Space reset and you will not get points back!")){
            doReset("s")
            player.points = new Decimal(0)
            player.s.buyables[11] = new Decimal(0)
            player.s.buyables[12] = new Decimal(0)
            player.s.buyables[13] = new Decimal(0)
            player.s.buyables[21] = new Decimal(0)
            player.s.buyables[22] = new Decimal(0)
            player.s.space = player.s.totalSpace
          }
        },
        canClick() {return true},
        style: {
          width: "100px",
          minHeight: "50px",
        },
      },
    },
})
