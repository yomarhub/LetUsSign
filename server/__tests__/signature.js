const app = require("../app")
const { sequelize } = require("../config/sequelize")
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe("Signatures Routes", () => {
    it("GET /signatures - should require authentication", async () => {
        const res = await requestWithSupertest.get("/api/signatures")
        expect(res.statusCode).toBe(401)
    })
})

afterEach(async () => {
    await sequelize.close();
});