'use strict'

/**
 * Instances of this class create and expose information about
 * the available doors.
 * Door states ("open"/"closed") are not stored.
 */
class DoorRepository {
    /**
     * Creates a new repository containing the given number of doors.
     * @param {number} count    how many doors to create
     */
    constructor(count) {
        this.doorNamesToIndices = {}
        for (let i = 0; i < count; i++) {
            // for letters
            // const key = String.fromCharCode(97 + i).toUpperCase()
            const key = '' + (i + 1)
            this.doorNamesToIndices[key] = i
        }
    }

    /**
     * Provides the door index for the given door name through reverse look-up.
     * An error if thrown if no door by the given name exists.
     * @param {string} name     the door name to resolve
     * @return {number}         the index of the corresponding door
     */
    getDoorIndexFromName(name) {
        if (!(name in this.doorNamesToIndices)) {
            throw new Error('Door not known with name: ' + name)
        }
        return this.doorNamesToIndices[name]
    }

    /**
     * Provides the name of the door with the given index.
     * An error if thrown if no door exists for the given index.
     * @param {number} index    the index of the door to be found
     * @return {string}         the name of the corresponding door
     */
    getDoorNameFromIndex(index) {
        const singleDoorName = Object.keys(this.doorNamesToIndices)
            .filter((key) => this.doorNamesToIndices[key] === index)
        if (singleDoorName.length === 0) {
            throw new Error('No door name found for index ' + index)
        }

        return singleDoorName[0]
    }
}

module.exports = DoorRepository
