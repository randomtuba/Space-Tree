addLayer("s", {
    name: "space", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		    points: new Decimal(0),
        space: new Decimal(0),
        totalSpace: new Decimal(0),
        allocated: new Decimal(0),
    }},
    tabFormat: [
      "main-display",
      "prestige-button",
      "blank",
      ["display-text", () => `You have ${format(player.points)} points`],
      "blank",
      ["display-text", () => `You have ${format(player.s.space)} space<br>You have collected ${format(player.s.totalSpace)} space in total`],
      "blank",
      "milestones",
      "buyables",
      "blank",
      "clickables",
      "blank",
      ["bar","spacebar"],
      "blank",
      () => hasMilestone("s",0) ? ["display-text", `<span style="color: lime;">Your allocated space is multiplying gain of all dust types by ${format(spacebarEffect(1))}x and multiplying point gain by ${format(spacebarEffect(2))}x.<br>(Note: Point multiplier is unaffected by Space Condensing)</span><br><span style="color: red;">Based on the amount of Space Buildings you've bought, those effects are raised ^${format(spacebarEffect(3))}.</span>`] : '',
      "blank",
      "blank",
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
        mult = mult.div(player.d.points.pow(0.5).add(1))
        mult = mult.div(buyableEffect("d",32))
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
        player.s.space = player.s.space.add(Decimal.mul(2,tmp.s.resetGain))
        player.s.totalSpace = player.s.totalSpace.add(Decimal.mul(2,tmp.s.resetGain))
      }
    },
    buyables: {
      11: {
        title: "Primary Space Building",
        cost(x) {return new Decimal(20).mul(new Decimal(5).pow(x)).mul(new Decimal(1.05).pow(x.pow(2)))},
        display() {return `${getBuyableAmount("s",21).gte(1) ? `Multiply point gain by ${format(new Decimal(2).add(buyableEffect("s",21)))}x` : "Double point generation"} per level.<br>Level: ${format(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} points<br>Effect: ${format(this.effect())}x point gain`},
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
        sellOne() {
          let amount = getBuyableAmount(this.layer, this.id)
          if (amount.lte(0)) return // Only sell one if there is at least one
          setBuyableAmount(this.layer, this.id, amount.sub(1))
          player[this.layer].space = player[this.layer].space.add(1)
        },
        sellAll() {
          let amount = getBuyableAmount(this.layer, this.id)
          if (amount.lte(0)) return
          player[this.layer].space = player[this.layer].space.add(amount)
          setBuyableAmount(this.layer, this.id, new Decimal(0))
        },
        canSellOne() {return hasMilestone("s",0)},
        canSellAll() {return hasMilestone("s",0)},
      },
      12: {
        title: "Secondary Space Building",
        cost(x) {return new Decimal(40).mul(new Decimal(7.5).pow(x)).mul(new Decimal(1.075).pow(x.pow(2)))},
        display() {return `Multiply point gain based on points.<br>(Current Base: ${format(player.points.add(10).log10().log2().add(1).add(buyableEffect("s",21).div(2)))}x)<br>Level: ${format(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} points<br>Effect: ${format(this.effect())}x point gain`},
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
        sellOne() {
          let amount = getBuyableAmount(this.layer, this.id)
          if (amount.lte(0)) return // Only sell one if there is at least one
          setBuyableAmount(this.layer, this.id, amount.sub(1))
          player[this.layer].space = player[this.layer].space.add(1)
        },
        sellAll() {
          let amount = getBuyableAmount(this.layer, this.id)
          if (amount.lte(0)) return
          player[this.layer].space = player[this.layer].space.add(amount)
          setBuyableAmount(this.layer, this.id, new Decimal(0))
        },
        canSellOne() {return hasMilestone("s",0)},
        canSellAll() {return hasMilestone("s",0)},
      },
      13: {
        title: "Ternary Space Building",
        cost(x) {return new Decimal(80).mul(new Decimal(15).pow(x)).mul(new Decimal(1.15).pow(x.pow(2)))},
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
        sellOne() {
          let amount = getBuyableAmount(this.layer, this.id)
          if (amount.lte(0)) return // Only sell one if there is at least one
          setBuyableAmount(this.layer, this.id, amount.sub(1))
          player[this.layer].space = player[this.layer].space.add(1)
        },
        sellAll() {
          let amount = getBuyableAmount(this.layer, this.id)
          if (amount.lte(0)) return
          player[this.layer].space = player[this.layer].space.add(amount)
          setBuyableAmount(this.layer, this.id, new Decimal(0))
        },
        canSellOne() {return hasMilestone("s",0)},
        canSellAll() {return hasMilestone("s",0)},
      },
      21: {
        title: "Quaternary Space Building",
        cost(x) {return new Decimal(120).mul(new Decimal(50).pow(x)).mul(new Decimal(1.5).pow(x.pow(2)))},
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
        sellOne() {
          let amount = getBuyableAmount(this.layer, this.id)
          if (amount.lte(0)) return // Only sell one if there is at least one
          setBuyableAmount(this.layer, this.id, amount.sub(1))
          player[this.layer].space = player[this.layer].space.add(1)
        },
        sellAll() {
          let amount = getBuyableAmount(this.layer, this.id)
          if (amount.lte(0)) return
          player[this.layer].space = player[this.layer].space.add(amount)
          setBuyableAmount(this.layer, this.id, new Decimal(0))
        },
        canSellOne() {return hasMilestone("s",0)},
        canSellAll() {return hasMilestone("s",0)},
      },
      22: {
        title: "Quinary Space Building",
        cost(x) {return new Decimal(10).mul(new Decimal(1000).pow(x)).mul(new Decimal(10).pow(x.pow(2)))},
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
        sellOne() {
          let amount = getBuyableAmount(this.layer, this.id)
          if (amount.lte(0)) return // Only sell one if there is at least one
          setBuyableAmount(this.layer, this.id, amount.sub(1))
          player[this.layer].space = player[this.layer].space.add(1)
        },
        sellAll() {
          let amount = getBuyableAmount(this.layer, this.id)
          if (amount.lte(0)) return
          player[this.layer].space = player[this.layer].space.add(amount)
          setBuyableAmount(this.layer, this.id, new Decimal(0))
        },
        canSellOne() {return hasMilestone("s",0)},
        canSellAll() {return hasMilestone("s",0)},
      },
    },
    clickables: {
      11: {
        display() {return `Respec Space Buildings`},
        onClick() {
          if(confirm("Are you sure you want to respec? This will cause a Space reset and you will not get points back!")){
            doReset("s")
            player.s.buyables[11] = new Decimal(0)
            player.s.buyables[12] = new Decimal(0)
            player.s.buyables[13] = new Decimal(0)
            player.s.buyables[21] = new Decimal(0)
            player.s.buyables[22] = new Decimal(0)
            player.points = new Decimal(0)
            player.s.space = player.s.totalSpace.sub(player.s.allocated)
          }
        },
        canClick() {return true},
        style: {
          width: "100px",
          minHeight: "50px",
        },
      },
      12: {
        display() {return `Add 1 to Spacebar`},
        onClick() {
          player.s.space = player.s.space.sub(1)
          player.s.allocated = player.s.allocated.add(1)
        },
        canClick() {return player.s.space.gt(0) && player.s.allocated.lt(player.s.totalSpace)},
        unlocked() {return hasMilestone("s",0)},
        style: {
          width: "60px",
          minHeight: "50px",
        },
      },
      13: {
        display() {return `Remove 1 from Spacebar`},
        onClick() {
          player.s.space = player.s.space.add(1)
          player.s.allocated = player.s.allocated.sub(1)
        },
        canClick() {return player.s.allocated.gt(0)},
        unlocked() {return hasMilestone("s",0)},
        style: {
          width: "60px",
          minHeight: "50px",
        },
      },
      14: {
        display() {return `Add all to Spacebar`},
        onClick() {
          player.s.allocated = player.s.allocated.add(player.s.space).min(player.s.totalSpace)
          player.s.space = new Decimal(0)
        },
        canClick() {return player.s.space.gt(0) && player.s.allocated.lt(player.s.totalSpace)},
        unlocked() {return hasMilestone("s",0)},
        style: {
          width: "60px",
          minHeight: "50px",
        },
      },
      15: {
        display() {return `Remove all from Spacebar`},
        onClick() {
          player.s.space = player.s.space.add(player.s.allocated)
          player.s.allocated = new Decimal(0)
        },
        canClick() {return player.s.allocated.gt(0)},
        unlocked() {return hasMilestone("s",0)},
        style: {
          width: "60px",
          minHeight: "50px",
        },
      },
    },
    milestones: {
      0: {
        requirementDescription: "85 space energy",
        effectDescription: "Unlock the Spacebar and Sell buttons for Space Buildings.",
        done() {return player.s.points.gte(85)},
        unlocked() {return player.s.points.gte(75)},
      },
      1: {
        requirementDescription: "95 space energy",
        effectDescription() {return `Gain a multiplier to Points based on space energy.<br>Currently: ${format(Decimal.pow(1.5,player.s.points))}x`},
        done() {return player.s.points.gte(95)},
        unlocked() {return player.s.points.gte(85)},
      },
      2: {
        requirementDescription: "103 space energy",
        effectDescription: "The formulas for dust gain and point gain from the Spacebar are more effective.",
        done() {return player.s.points.gte(103)},
        unlocked() {return player.s.points.gte(95)},
      },
    },
    bars: {
      spacebar: {
        direction: 3,
        width: 500,
        height: 75,
        progress() {return player.s.allocated.div(player.s.totalSpace)},
        display() {return `${format(player.s.allocated.div(player.s.totalSpace).mul(100))}% space allocated`},
        fillStyle() { return {"background-color": "white"} },
        textStyle() { return {"color": "gray"} },
        unlocked() {return hasMilestone("s",0)}
      },
    },
})

function spacebarEffect(x) {
  switch (x) {
    case 1:
      return player.s.allocated.pow(hasMilestone("s",2)?4:2).add(1).pow(spacebarEffect(3))
    break;
    case 2:
      return player.s.allocated.pow(hasMilestone("s",2)?12:8).add(1).pow(spacebarEffect(3))
    break;
    case 3:
      return getBuyableAmount("s",11).add(getBuyableAmount("s",12)).add(getBuyableAmount("s",13)).add(getBuyableAmount("s",21)).add(getBuyableAmount("s",22)).sub(100).div(200).max(0).min(1)
    break;
  }
}

addLayer("d", {
    name: "dust", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "D", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		    points: new Decimal(0),
        dustTypes: [null,new Decimal(0),new Decimal(0),new Decimal(0)],
        time: [new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)],
    }},
    tabFormat: [
      "main-display",
      ["display-text", () => `Your dust is dividing the Space requirement by ${format(player.d.points.pow(0.5).add(1))}`],
      "blank",
      ["bar","regularDust"],
      "blank",
      ["display-text", () => `You have <h2 style="color: #d6d6d6; text-shadow: 0px 0px 10px #d6d6d6">${format(player.d.dustTypes[1])}</h2> moon dust`],
      "blank",
      ["bar","moonDust"],
      "blank",
      ["display-text", () => `You have <h2 style="color: #707070; text-shadow: 0px 0px 10px #707070">${format(player.d.dustTypes[2])}</h2> asteroid dust`],
      "blank",
      ["bar","asteroidDust"],
      "blank",
      ["display-text", () => `You have <h2 style="color: #59002a; text-shadow: 0px 0px 10px #59002a">${format(player.d.dustTypes[3])}</h2> volcanic dust`],
      "blank",
      ["bar","volcanoDust"],
      "blank",
      "buyables",
    ],
    color: "#9e8f67",
    requires: new Decimal(39), // Can be a function that takes requirement increases into account
    resource: "dust", // Name of prestige currency
    baseResource: "space energy", // Name of resource prestige is based on
    baseAmount() {return player.s.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return player.s.best.gte(30)},
    branches: ['s'],
    bars: {
      regularDust: {
        direction: 3,
        width: 500,
        height: 75,
        progress() {return player.d.time[0]},
        display: "Progress to dust production",
        fillStyle() { return {"background-color": "#9e8f67"} }
      },
      moonDust: {
        direction: 3,
        width: 500,
        height: 75,
        progress() {return player.d.time[1]},
        display: "Progress to moon dust production",
        fillStyle() { return {"background-color": "#d6d6d6"} },
        textStyle() { return {"color": "gray"} },
      },
      asteroidDust: {
        direction: 3,
        width: 500,
        height: 75,
        progress() {return player.d.time[2]},
        display: "Progress to asteroid dust production",
        fillStyle() { return {"background-color": "#707070"} }
      },
      volcanoDust: {
        direction: 3,
        width: 500,
        height: 75,
        progress() {return player.d.time[3]},
        display: "Progress to volcanic dust production",
        fillStyle() { return {"background-color": "#59002a"} }
      },
    },
    update(diff) {
      if(player.s.best.gte(39)) player.d.unlocked = true
      if(player.d.unlocked) player.d.time[0] = player.d.time[0].add(new Decimal(diff).mul(buyableEffect("d",11)).mul(buyableEffect("d",21)).mul(Decimal.pow(4,getBuyableAmount("d",31))).mul(buyableEffect("d",41)).mul(spacebarEffect(1)))
      if(player.d.time[0].gte(1)){
        player.d.points = player.d.points.add(player.d.time[0].floor())
        player.d.time[1] = player.d.time[1].add(player.d.time[0].mul(buyableEffect("d",21)).mul(buyableEffect("d",41)).mul(spacebarEffect(1)).floor().div(100))
        player.d.time[0] = decimalZero
      }
      if(player.d.time[1].gte(1)){
        player.d.dustTypes[1] = player.d.dustTypes[1].add(player.d.time[1].floor())
        player.d.time[2] = player.d.time[2].add(player.d.time[1].mul(buyableEffect("d",31)).mul(buyableEffect("d",41)).mul(spacebarEffect(1)).floor().div(10000))
        player.d.time[1] = decimalZero
      }
      if(player.d.time[2].gte(1)){
        player.d.dustTypes[2] = player.d.dustTypes[2].add(player.d.time[2].floor())
        player.d.time[3] = player.d.time[3].add(player.d.time[2].mul(buyableEffect("d",41)).mul(spacebarEffect(1)).floor().div(1e15))
        player.d.time[2] = decimalZero
      }
      if(player.d.time[3].gte(1)){
        player.d.dustTypes[3] = player.d.dustTypes[3].add(player.d.time[3].floor())
        player.d.time[3] = decimalZero
      }
    },
    buyables: {
      11: {
        title: "Dust Bonus",
        cost(x) {return new Decimal(10).mul(new Decimal(8).pow(x)).mul(new Decimal(1.08).pow(x.pow(2)))},
        display() {return `Speed up dust production by 2x per level.<br>Level: ${format(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} dust<br>Effect: ${format(this.effect())}x dust speed`},
        canAfford() {return player.d.points.gte(this.cost())},
        buy() {
          player.d.points = player.d.points.sub(this.cost())
          setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        effect(x) {
          let eff = Decimal.pow(2,x)
          return eff
        },
      },
      12: {
        title: "Point Bonus",
        cost(x) {return new Decimal(100).mul(new Decimal(20).pow(x)).mul(new Decimal(1.2).pow(x.pow(2)))},
        display() {return `Multiply point production by 100x per level.<br>Level: ${format(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} dust<br>Effect: ${format(this.effect())}x point gain`},
        canAfford() {return player.d.points.gte(this.cost())},
        buy() {
          player.d.points = player.d.points.sub(this.cost())
          setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        effect(x) {
          let eff = Decimal.pow(100,x)
          return eff
        },
      },
      21: {
        title: "Dust Bonus II",
        cost(x) {return new Decimal(10).mul(new Decimal(10).pow(x)).mul(new Decimal(1.1).pow(x.pow(2)))},
        display() {return `Speed up dust production and moon dust production by 3x per level.<br>Level: ${format(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} moon dust<br>Effect: ${format(this.effect())}x dust and moon dust speeds`},
        canAfford() {return player.d.dustTypes[1].gte(this.cost())},
        buy() {
          player.d.dustTypes[1] = player.d.dustTypes[1].sub(this.cost())
          setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        effect(x) {
          let eff = Decimal.pow(3,x)
          return eff
        },
      },
      22: {
        title: "Space Bonus",
        cost(x) {return new Decimal(1000).mul(new Decimal(30).pow(x)).mul(new Decimal(1.3).pow(x.pow(2)))},
        display() {return `Obtain 2 extra space per level.<br>Level: ${format(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} moon dust<br>Effect: +${format(this.effect())} space`},
        canAfford() {return player.d.dustTypes[1].gte(this.cost())},
        buy() {
          player.d.dustTypes[1] = player.d.dustTypes[1].sub(this.cost())
          setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
          player.s.space = player.s.space.add(2)
          player.s.totalSpace = player.s.totalSpace.add(2)
        },
        effect(x) {
          let eff = x.mul(2)
          return eff
        },
      },
      31: {
        title: "Dust Bonus III",
        cost(x) {return new Decimal(50).pow(x).mul(new Decimal(1.5).pow(x.pow(2)))},
        display() {return `Speed up dust production by 4x and asteroid dust production by 1.5x per level.<br>Level: ${format(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} asteroid dust<br>Effects: ${format(Decimal.pow(4,getBuyableAmount(this.layer, this.id)))}x dust speed, ${format(this.effect())}x asteroid dust speed`},
        canAfford() {return player.d.dustTypes[2].gte(this.cost())},
        buy() {
          player.d.dustTypes[2] = player.d.dustTypes[2].sub(this.cost())
          setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        effect(x) {
          let eff = Decimal.pow(1.5,x)
          return eff
        },
      },
      32: {
        title: "Energy Division",
        cost(x) {return new Decimal(2500).mul(new Decimal(1000).pow(x)).mul(new Decimal(10).pow(x.pow(2)))},
        display() {return `Make space energy 100x cheaper per level.<br>Level: ${format(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} asteroid dust<br>Effect: /${format(this.effect())} space energy cost`},
        canAfford() {return player.d.dustTypes[2].gte(this.cost())},
        buy() {
          player.d.dustTypes[2] = player.d.dustTypes[2].sub(this.cost())
          setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        effect(x) {
          let eff = Decimal.pow(100,x)
          return eff
        },
      },
      41: {
        title: "Dust Bonus IV",
        cost(x) {return new Decimal(1000).pow(x).mul(new Decimal(10).pow(x.pow(2)))},
        display() {return `Speed up production of all dust types by 4x per level.<br>Level: ${format(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} volcanic dust<br>Effect: ${format(this.effect())}x production of all dust types`},
        canAfford() {return player.d.dustTypes[3].gte(this.cost())},
        buy() {
          player.d.dustTypes[3] = player.d.dustTypes[3].sub(this.cost())
          setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        effect(x) {
          let eff = Decimal.pow(4,x)
          return eff
        },
      },
      42: {
        title: "Point Bonus II",
        cost(x) {return new Decimal(1e16).mul(new Decimal(1e6).pow(x)).mul(new Decimal(1e4).pow(x.pow(2)))},
        display() {return `Multiply point production by 1,000,000x per level.<br>Level: ${format(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} volcanic dust<br>Effect: ${format(this.effect())}x point gain`},
        canAfford() {return player.d.dustTypes[3].gte(this.cost())},
        buy() {
          player.d.dustTypes[3] = player.d.dustTypes[3].sub(this.cost())
          setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        effect(x) {
          let eff = Decimal.pow(1e6,x)
          return eff
        },
      },
    },
})