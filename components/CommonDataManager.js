/**  
 * Singleton for getting and setting current favorite channel ids. 
 * Used for faster updating of favorite ids. Updates every time 
 * local storage is updated. Loads local storage contents on app start.
 * */

export default class CommonDataManager {

    static myInstance = null;

    _favIDs = [];

    /**
     * @returns {CommonDataManager}
     */

    // Create new instance if there is not already an instance
    static getInstance() {
        if (CommonDataManager.myInstance == null) {
            CommonDataManager.myInstance = new CommonDataManager();
        }

        return this.myInstance;
    }
    // Getter
    getFavIDs() {
        return this._favIDs;
    }

    // Setter
    setFavIds(idArray) {
        this._favIDs = idArray;
    }
}
