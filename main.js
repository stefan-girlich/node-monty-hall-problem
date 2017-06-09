const readlineSync = require('readline-sync')
const config = require('./config.json')
const Game = require('./game')
const GameStateRenderer = require('./game-state-renderer')
const DoorRepository = require('./door-repository')

const formatText = (template, params) => {
	params = params.forEach ? params : [params]
	params.forEach((param) => template = template.replace('{}', param))
	return template
}

const askForInput = (question) => readlineSync.question(question)

const renderResults = (data) => {
	console.log('-------------------------------------')
	Object.keys(data).forEach((key) => {
		console.log(key + '\t\t' + data[key])
	})
	console.log('-------------------------------------\n\n')
}


// main

const doorCount = config.game.defaultDoorCount
if (doorCount < 3) {
	throw Error('Please provide a number of doors which is at least 3.')
}

const doorsRepo = new DoorRepository(doorCount)
let renderer
const game = new Game.Game(doorCount, () => renderer.render() )
renderer = new GameStateRenderer(game, doorsRepo, config.symbols, config.texts)


const results = {
	wonByStaying: 0,
	wonBySwitching: 0,
	lostByStaying: 0,
	lostBySwitching: 0,
}

while (true) {

	renderer.render()

	let initialDoorIndex = null
	while (initialDoorIndex === null) {
		const initialDoorName = askForInput(config.texts.pickFirstDoorQuestion + '\n').toUpperCase()
		try {
			initialDoorIndex = doorsRepo.getDoorIndexFromName(initialDoorName)
		} catch (e) { }
	}

	console.log('\n')

	const freeDoorIndex = game.selectInitialDoor(initialDoorIndex)
	const freeDoorName = doorsRepo.getDoorNameFromIndex(freeDoorIndex)


	let shouldSwitch = null
	while (shouldSwitch === null) {
		const switchInput = askForInput(formatText(config.texts.switchDoorQuestion, freeDoorName) +  `\n`).toLowerCase()
		if (switchInput === 'yes' || switchInput === 'y') {
			shouldSwitch = true
		} else if (switchInput === 'no' ||  switchInput === 'n') {
			shouldSwitch = false
		}
	}

	console.log('\n')

	game.selectSwitchOrNot(shouldSwitch)

	let resultKey;
	if (game.state === Game.State.STATE_END_WON) {
		resultKey = shouldSwitch ? 'wonBySwitching' : 'wonByStaying'
	} else {
		resultKey = shouldSwitch ? 'lostBySwitching' : 'lostByStaying'
	}

	results[resultKey]++

	renderResults(results)

	game.reset()
}
