const app = require("../app")
const { sequelize } = require("../config/sequelize");
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe("Auth Routes", () => {
    it("POST /auth/login - should reject invalid credentials", async () => {
        const res = await requestWithSupertest.post("/api/auth/login").send({ email: "fake@test.com", password: "wronger" })
        expect(res.statusCode).toBe(401)
    })
})

afterEach(async () => {
    await sequelize.close();
});