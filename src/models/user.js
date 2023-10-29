import { FireBaseModel } from "./base";

class User extends FireBaseModel {
  constructor() {
    super("user");
  }

  async getTransactions(id) {
    return await new FireBaseModel(
      `${this.collectionName}/${id}/transactions`
    )._getAll();
  }

  async getNotifications(id) {
    return await new FireBaseModel(
      `${this.collectionName}/${id}/notifications`
    )._getAll();
  }

  getByEmail = async (email) => {
    const users = await this._getFilter({
      _field: "email",
      op: "==",
      value: email,
    });
    return users;
  };
}

export default new User();
