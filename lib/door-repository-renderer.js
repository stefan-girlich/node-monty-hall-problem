'use strict'

/**
 * This class is responsible for rendering properties of
 * a given door repository.
 */
class DoorRepositoryRenderer {

    /**
     * Creates a new instance.
     * @param {DoorRepository} doorsRepo   data source
     */
    constructor(doorsRepo) {
        this.doorsRepo = doorsRepo
    }

    /**
     * Creates a string representation of the valid range
     * of door names, e. g. "1..3", "A..F".
     * @return {string}    valid range in human-readable syntax
     */
    createValidRangeString() {
        const doorCount = this.doorsRepo.getDoorsCount()
        const validRange = this.doorsRepo.getDoorNameFromIndex(0)
            + '..'
            + this.doorsRepo.getDoorNameFromIndex(doorCount - 1)

        return validRange
    }
}

module.exports = DoorRepositoryRenderer
