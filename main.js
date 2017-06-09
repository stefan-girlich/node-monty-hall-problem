'use strict'

const config = require('./config.json')
const symbols = config.symbols
const texts = config.texts
const switchDoorInputOpts = require('./lib/input-options-format')
	.createInputOptionsString(
	config.allowedInput.positive, config.allowedInput.negative)
const TextIo = require('./lib/text-io-util')
const Game = require('./lib/game')
const GameStateRenderer = require('./lib/game-state-renderer')
const GameResultsTracker = require('./lib/game-results-tracker')
const GameResultsRenderer = require('./lib/game-results-renderer')
const DoorRepository = require('./lib/door-repository')
const DoorRepositoryRenderer = require('./lib/door-repository-renderer')


const doorCount = config.game.defaultDoorCount
if (doorCount < 3) {
	throw Error('Please provide a number of doors which is at least 3.')
}

const doorsRepo = new DoorRepository(doorCount)
const firstOpts = new DoorRepositoryRenderer(doorsRepo).createValidRangeString()
const game = new Game.Game(doorCount, () => renderer.render())
const renderer = new GameStateRenderer(game, doorsRepo, symbols, texts)
const resultTracker = new GameResultsTracker(game)
const resultRenderer = new GameResultsRenderer(resultTracker)

const showStatsIfRequested = (userInput) => {
	const areStatsRequested = config.allowedInput.results.includes(userInput)
	if (areStatsRequested) {
		TextIo.nl()
		resultRenderer.render()
		renderer.render()
	}

	return areStatsRequested
}

const askForInitialDoor = () => {
	let initialDoorIndex = null
	while (initialDoorIndex === null) {
		const question = texts.pickFirstDoorQuestion
		const initialDoorName =
			TextIo.askForInput(question, firstOpts).toUpperCase()

		showStatsIfRequested(initialDoorName)

		try {
			initialDoorIndex = doorsRepo.getDoorIndexFromName(initialDoorName)
		} catch (e) { }
	}

	TextIo.nl()

	return initialDoorIndex
}

const askToSwitch = (freeDoorIndex) => {
	const freeDoorName = doorsRepo.getDoorNameFromIndex(freeDoorIndex)

	let shouldSwitch = null
	while (shouldSwitch === null) {
		const question = texts.switchDoorQuestion
		const formattedQuestion = TextIo.formatText(question, freeDoorName)
		const switchInput =
			TextIo.askForInput(formattedQuestion, switchDoorInputOpts)
				.toLowerCase()

		showStatsIfRequested(switchInput)

		if (config.allowedInput.positive.includes(switchInput)) {
			shouldSwitch = true
		} else if (config.allowedInput.negative.includes(switchInput)) {
			shouldSwitch = false
		}
	}

	TextIo.nl()

	return shouldSwitch
}


while (true) {
	renderer.render()

	const initialDoorIndex = askForInitialDoor()
	const freeDoorIndex = game.selectInitialDoor(initialDoorIndex)

	const shouldSwitch = askToSwitch(freeDoorIndex)
	game.selectSwitchOrNot(shouldSwitch)

	resultTracker.trackResult(shouldSwitch)
	game.reset()
}
