class GameResultsRenderer {

    constructor(gameResultsTracker) {
        this.gameResultsTracker = gameResultsTracker
    }

    render() {
        const results = this.gameResultsTracker.getAllResults()
        console.log('-------------------------------------')
        Object.keys(results).forEach((key) => {
            console.log(key + '\t\t' + results[key])
        })
        console.log('-------------------------------------\n\n')
    }
}

module.exports = GameResultsRenderer
