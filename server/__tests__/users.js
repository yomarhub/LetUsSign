const app = require("../app")
const { sequelize } = require("../config/sequelize")
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe("Users Routes", () => {
    it("GET /users - should require authentication", async () => {
        const res = await requestWithSupertest.get("/api/users")
        expect(res.statusCode).toBe(401)
    })
})

afterEach(async () => {
    await sequelize.close();
});