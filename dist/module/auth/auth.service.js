"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const user_model_1 = require("../../database/model/user.model");
const database_reposatory_1 = require("../../database/reposatory/database.reposatory");
class AuthService {
    authReposatory;
    constructor() {
        this.authReposatory = new database_reposatory_1.DatabaseReposatory(user_model_1.userModel);
    }
    async signup(data) {
        let signupData = await this.authReposatory.findOne({ filter: { email: "monika@gmail.com" } });
        return signupData;
    }
}
exports.AuthService = AuthService;
exports.default = new AuthService();
