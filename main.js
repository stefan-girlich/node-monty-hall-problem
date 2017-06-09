const config = require('./config.json')
const TextIoUtil = require('./lib/text-io-util')
const Game = require('./lib/game')
const GameStateRenderer = require('./lib/game-state-renderer')
const GameResultsTracker = require('./lib/game-results-tracker')
const GameResultsRenderer = require('./lib/game-results-renderer')
const DoorRepository = require('./lib/door-repository')


const doorCount = config.game.defaultDoorCount
if (doorCount < 3) {
	throw Error('Please provide a number of doors which is at least 3.')
}

const doorsRepo = new DoorRepository(doorCount)
const game = new Game.Game(doorCount, () => renderer.render() )
const renderer = new GameStateRenderer(game, doorsRepo, config.symbols, config.texts)
const resultTracker = new GameResultsTracker(game)
const resultRenderer = new GameResultsRenderer(resultTracker)


while (true) {
	renderer.render()

	let initialDoorIndex = null
	while (initialDoorIndex === null) {
		const initialDoorName = TextIoUtil.askForInput(config.texts.pickFirstDoorQuestion + '\n').toUpperCase()
		try {
			initialDoorIndex = doorsRepo.getDoorIndexFromName(initialDoorName)
		} catch (e) { }
	}

	console.log('\n')

	const freeDoorIndex = game.selectInitialDoor(initialDoorIndex)
	const freeDoorName = doorsRepo.getDoorNameFromIndex(freeDoorIndex)

	let shouldSwitch = null
	while (shouldSwitch === null) {
		const switchInput = TextIoUtil.askForInput(TextIoUtil.formatText(config.texts.switchDoorQuestion, freeDoorName) +  `\n`).toLowerCase()
		if (config.allowedInput.positive.includes(switchInput)) {
			shouldSwitch = true
		} else if (config.allowedInput.negative.includes(switchInput)) {
			shouldSwitch = false
		}
	}

	console.log('\n')

	game.selectSwitchOrNot(shouldSwitch)
	resultTracker.trackResult(shouldSwitch)

	resultRenderer.render()

	game.reset()
}
