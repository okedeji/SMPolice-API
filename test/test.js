let db = require("../configs/db"),
    User = require("../models/User"),
    chai = require("chai"),
    chaiHttp = require("chai-http"),
    server = require("../server");

let should = chai.should();

chai.use(chaiHttp);

describe("Testing User Route and Model", () => {
    before(done => {
        User.destroy({
            where: {},
            truncate: true
        })
        .then(()=> done())
    })

    describe("/GET allUsers", () => {
        it("it should GET empty array of Users", done => {
            chai.request(server)
                .get("/allUsers")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    res.body.length.should.be.eql(0);
                    done();
                })
        })
    })

    describe("/POST AddUser", () => {
        it("It should respond with false ==> notNull violation", done => {
            let user = {
                // There ought be nickname parameter but it's null here
                email: "abc@xyz.com",
                password: "password"
            }
            chai.request(server)
                .post("/addUser")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("status").eql(false)
                    res.body.message.should.be.eql("notNull Violation")
                    done()
                })
        })

        it("It should respond with 200 ==> OK", done => {
            let user = {
                nickname: "terryG",
                email: "abc@xyz.com",
                password: "password"
            }
            chai.request(server)
                .post("/addUser")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    done()
                })
        })
    })

    describe("/POST getUser", () => {
        it("It should respond with false ==> Invalid Email", done => {
            let user = {
                nickname: "terry",
                password: "password"
            }
            chai.request(server)
                .post("/getUser")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.status.should.be.eql(false)
                    res.body.message.should.be.eql("nickname does not exist")
                    done()
                })
        })

        it("It should respond with false ==> Invalid Password", done => {
            let user = {
                nickname: "terryG",
                password: "invalid"
            }
            chai.request(server)
                .post("/getUser")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.status.should.be.eql(false)
                    res.body.message.should.be.eql("Password Incorrect")
                    done()
                })
        })
    })

    describe("/POST blockInfo", () => {
        let info = {
            nickname: "terry", //wrong nickname
            allowedHours: 2,
            activeDays: "everyday",
            markedSites: "facebook, instagram"
        }
        it("It should return null ==> Invalid nickname", done => {
            chai.request(server)
                .post("/blockInfo")
                .send(info)
                .end((err, res) => {
                    res.status.should.be.eql(200)
                    if (res.body === null) done()
                })
        })

        it("It should return 200 ==> OK", done => {
            Object.assign(info, {nickname: "terryG"})
            chai.request(server)
                .post("/blockInfo")
                .send(info)
                .end((err, res) => {
                    res.status.should.be.eql(200)
                    res.body.should.have.property("allowedHours").eql(2)
                    done()
                })
        })
    })
})
    

