let modInfo = {
	name: "The Space Tree",
	id: "waste_of_space",
	author: "randomtuba",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js", "achievements.js"],

	discordName: "tuba's new place",
	discordLink: "https://discord.gg/HhcavwM5rm",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1.2",
	name: "Spacebar",
}

let changelog = `<h1>Changelog:</h1><br>
  <span style="color:red">Warning: SPOILERS!</span><br><br>
  <h3 style="color:lime">v0.1.2: Spacebar</h3><br>
  <span style="color:lime">Endgame for this version: 114 space energy</span><br>
		- Added a new mechanic for the S layer.<br>
    - Added 3 milestones.<br>
		- Added 6 achievements.<br>
    - Primary and Secondary Space Buildings now show their bases in their descriptions.<br>
    - Made changelog look nicer.<br><br>
  <h3 style="color:#9e8f67">v0.1.1: Space Dust</h3><br>
  <span style="color:#9e8f67">Endgame for this version: 85 space energy</span><br>
		- Added the D layer (Dust).<br>
		- Added 4 Dust types.<br>
    - Added 8 buyables.<br>
    - Rebalanced S layer.<br><br>
	<h3 style="color:white">v0.1: Give Me Some Space</h3><br>
  <span style="color:white">Endgame for this version: 39 space energy</span><br>
		- Added the S layer (Space).<br>
		- Added 5 Space Buildings.<br><br>`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = buyableEffect("s",11)
  gain = gain.mul(buyableEffect("s",12))
  gain = gain.mul(buyableEffect("d",12))
  gain = gain.mul(buyableEffect("d",42))
  if(hasMilestone("s",1)) gain = gain.mul(Decimal.pow(1.5,player.s.points))
  if(gain.gte(1e50)) gain = gain.pow(0.5).mul(1e25)
  gain = gain.mul(spacebarEffect(2))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [`<span>Current Endgame: 114 space energy</span>`,
        () => player.points.gte("1e50") ? '<span style="color:gray; font-size:11px;">Your point gain is divided by ' + format(getPointGen().div(1e50)) + ' due to Space Condensing!</span>' : '',
]

// Determines when the game "ends"
function isEndgame() {
	return player.s.points.gte(114)
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}