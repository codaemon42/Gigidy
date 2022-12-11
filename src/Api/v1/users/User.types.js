class SignUpReq{
    #default = {
        firstName: null,
        lastName: null,
        authType: "",
        username: "",
        password: ""
    }
    constructor(data=null){
        if(!data) this.#default = data;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.authType = data.authType;
        this.username = data.username;
        this.password = data.password;
    }
}

module.exports = {
    SignUpReq
}