//singelton for get and set current favorite channels ids. Used for faster updating favorites ids. Updates every time when is updatet local storage and loaded on app start

export default class CommonDataManager {

    static myInstance = null;

    _favIDs = [];

    /**
     * @returns {CommonDataManager}
     */

    //check and create new instance
    static getInstance() {
        if (CommonDataManager.myInstance == null) {
            CommonDataManager.myInstance = new CommonDataManager();
        }

        return this.myInstance;
    }
    //getter
    getFavIDs() {
        return this._favIDs;
    }

    //setter
    setFavIds(idArray) {
        this._favIDs = idArray;
    }
}
