const app = require("../app")
const { sequelize } = require("../config/sequelize")
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe("Admin Routes", () => {
    it("GET /admin/stats - should require authentication", async () => {
        const res = await requestWithSupertest.get("/api/admin/stats")
        expect(res.statusCode).toBe(401)
    })
})

afterEach(async () => {
    await sequelize.close();
});