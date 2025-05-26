const app = require("../app")
const { sequelize } = require("../config/sequelize")
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe("QRCodes Routes", () => {
    it("GET /qrcodes/active - should require authentication", async () => {
        const res = await requestWithSupertest.get("/api/qrcodes/active")
        expect(res.statusCode).toBe(401)
    })
})

afterEach(async () => {
    await sequelize.close();
});