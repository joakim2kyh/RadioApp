export default class CommonDataManager {

    static myInstance = null;

    _favIDs = [];

    /**
     * @returns {CommonDataManager}
     */
    static getInstance() {
        if (CommonDataManager.myInstance == null) {
            CommonDataManager.myInstance = new CommonDataManager();
        }

        return this.myInstance;
    }
    getFavIDs() {
        return this._favIDs;
    }
    setFavIds(idArray) {
        this._favIDs = idArray;
    }
}
