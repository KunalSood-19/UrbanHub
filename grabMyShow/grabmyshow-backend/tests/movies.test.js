const request = require("supertest");

const app = require("../server");

describe("Movies API", () => {

test(
"GET /api/movies",
async () => {

const res = await request(app)
.get("/api/movies");

expect(res.statusCode).toBe(200);

},
15000
);

});