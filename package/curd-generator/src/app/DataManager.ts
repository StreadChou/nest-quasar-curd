export class DataManager {

  private constructor() {
    // 单例
    if (DataManager.instance) throw new Error('DataManager is a singleton class');
  }


  // 单例
  static instance: DataManager;

  static getInstance(): DataManager {
    if (!DataManager.instance) DataManager.instance = new DataManager();
    return DataManager.instance;
  }
}
