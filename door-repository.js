class DoorRepository {

    constructor(count) {
        this.doorNamesToIndices = {}
        for (let i = 0; i < count; i++) {
            //const key = String.fromCharCode(97 + i).toUpperCase() 	// for letters
            const key = '' + (i + 1)
            this.doorNamesToIndices[key] = i
        }
    }

    getDoorIndexFromName(name) {
        if (!(name in this.doorNamesToIndices)) {
            throw new Error('Door not known with name: ' + name)
        }
        return this.doorNamesToIndices[name]
    }

    getDoorNameFromIndex(index) {
        const singleDoorName = Object.keys(this.doorNamesToIndices).filter((key) => this.doorNamesToIndices[key] === index)
        if (singleDoorName.length === 0) {
            throw new Error('No door name found for index ' + index)
        }

        return singleDoorName[0]
    }
}

module.exports = DoorRepository
