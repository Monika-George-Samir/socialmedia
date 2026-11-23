import { IUser } from "../../common/interface/user.interface"
import { userModel } from "../../database/model/user.model"
import { DatabaseReposatory } from "../../database/reposatory/database.reposatory"
import { LoginDTO } from "./dto/auth.dto"


export class AuthService {
    private authReposatory: DatabaseReposatory<IUser>
    constructor(){
        this.authReposatory = new DatabaseReposatory<IUser>(userModel)
    }

    async signup(data: IUser):Promise<any>{
        let signupData = await this.authReposatory.findOne({filter: {email: "monika@gmail.com"}})
        return signupData
    }
}

export default new AuthService()