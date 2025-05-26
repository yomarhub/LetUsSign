const app = require("../app")
const { sequelize } = require("../config/sequelize")
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe("Courses Routes", () => {
    it("GET /courses - should require authentication", async () => {
        const res = await requestWithSupertest.get("/api/courses")
        expect(res.statusCode).toBe(401)
    })
})

afterEach(async () => {
    await sequelize.close();
});