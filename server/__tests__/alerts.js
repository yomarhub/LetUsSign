const app = require("../app")
const { sequelize } = require("../config/sequelize")
const supertest = require('supertest');
const request = supertest(app);

describe("Alerts Routes", () => {
    it("GET /alerts - should require authentication", async () => {
        const res = await request.get("/api/alerts")
        expect(res.statusCode).toBe(401)
    })
})

afterEach(async () => {
    await sequelize.close();
});