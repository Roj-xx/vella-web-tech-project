const request = require("supertest");
const app = require("../src/app");

describe("Full Route Sweep", () => {
  // ---------------- BASIC ----------------
  test("GET / should return 200", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("VELLA API is running");
  });

  test("GET /api/v1/test should return 200", async () => {
    const res = await request(app).get("/api/v1/test");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
  });

  // ---------------- AUTH ----------------
  test("POST /api/v1/auth/register should return 400 with missing fields", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  test("POST /api/v1/auth/login should return 400 with missing fields", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message");
  });


  // ---------------- PROTECTED TEST ROUTES ----------------
  test("GET /api/v1/protected should return 401 without token", async () => {
    const res = await request(app).get("/api/v1/protected");
    expect(res.statusCode).toBe(401);
  });

  test("GET /api/v1/admin should return 401 without token", async () => {
    const res = await request(app).get("/api/v1/admin");
    expect(res.statusCode).toBe(401);
  });

  // ---------------- DONORS ----------------
  test("POST /api/v1/donors should return 401 without token", async () => {
    const res = await request(app).post("/api/v1/donors").send({});
    expect(res.statusCode).toBe(401);
  });

  test("POST /api/v1/donors/manual should return 401 without token", async () => {
    const res = await request(app).post("/api/v1/donors/manual").send({});
    expect(res.statusCode).toBe(401);
  });

  test("GET /api/v1/donors/me should return 401 without token", async () => {
    const res = await request(app).get("/api/v1/donors/me");
    expect(res.statusCode).toBe(401);
  });

  test("PUT /api/v1/donors/me should return 401 without token", async () => {
    const res = await request(app).put("/api/v1/donors/me").send({});
    expect(res.statusCode).toBe(401);
  });

  test("GET /api/v1/donors should return 401 without token", async () => {
    const res = await request(app).get("/api/v1/donors");
    expect(res.statusCode).toBe(401);
  });

  test("PUT /api/v1/donors/:id should return 401 without token", async () => {
    const res = await request(app).put("/api/v1/donors/123").send({});
    expect(res.statusCode).toBe(401);
  });

  test("DELETE /api/v1/donors/:id should return 401 without token", async () => {
    const res = await request(app).delete("/api/v1/donors/123");
    expect(res.statusCode).toBe(401);
  });

  // ---------------- REQUESTS ----------------
  test("GET /api/v1/requests should return 401 without token", async () => {
    const res = await request(app).get("/api/v1/requests");
    expect(res.statusCode).toBe(401);
  });

  test("POST /api/v1/requests/:id/join should return 401 without token", async () => {
    const res = await request(app).post("/api/v1/requests/123/join").send({});
    expect(res.statusCode).toBe(401);
  });

  test("PUT /api/v1/requests/:id/cancel should return 401 without token", async () => {
    const res = await request(app).put("/api/v1/requests/123/cancel").send({});
    expect(res.statusCode).toBe(401);
  });

  test("GET /api/v1/requests/:id/participants should return 401 without token", async () => {
    const res = await request(app).get("/api/v1/requests/123/participants");
    expect(res.statusCode).toBe(401);
  });

  test("POST /api/v1/requests/:id/participants/manual should return 401 without token", async () => {
    const res = await request(app)
      .post("/api/v1/requests/123/participants/manual")
      .send({});
    expect(res.statusCode).toBe(401);
  });

  test("PUT /api/v1/requests/participants/:id should return 401 without token", async () => {
    const res = await request(app)
      .put("/api/v1/requests/participants/123")
      .send({ status: "attended" });
    expect(res.statusCode).toBe(401);
  });

  test("POST /api/v1/requests should return 401 without token", async () => {
    const res = await request(app).post("/api/v1/requests").send({});
    expect(res.statusCode).toBe(401);
  });

  test("PUT /api/v1/requests/:id should return 401 without token", async () => {
    const res = await request(app).put("/api/v1/requests/123").send({});
    expect(res.statusCode).toBe(401);
  });

  test("DELETE /api/v1/requests/:id should return 401 without token", async () => {
    const res = await request(app).delete("/api/v1/requests/123");
    expect(res.statusCode).toBe(401);
  });

  // ---------------- DRIVES ----------------
  test("GET /api/v1/drives should return 401 without token", async () => {
    const res = await request(app).get("/api/v1/drives");
    expect(res.statusCode).toBe(401);
  });

  test("POST /api/v1/drives/:id/join should return 401 without token", async () => {
    const res = await request(app).post("/api/v1/drives/123/join").send({});
    expect(res.statusCode).toBe(401);
  });

  test("PUT /api/v1/drives/:id/cancel should return 401 without token", async () => {
    const res = await request(app).put("/api/v1/drives/123/cancel").send({});
    expect(res.statusCode).toBe(401);
  });

  test("GET /api/v1/drives/:id/participants should return 401 without token", async () => {
    const res = await request(app).get("/api/v1/drives/123/participants");
    expect(res.statusCode).toBe(401);
  });

  test("POST /api/v1/drives/:id/participants/manual should return 401 without token", async () => {
    const res = await request(app)
      .post("/api/v1/drives/123/participants/manual")
      .send({});
    expect(res.statusCode).toBe(401);
  });

  test("PUT /api/v1/drives/participants/:id should return 401 without token", async () => {
    const res = await request(app)
      .put("/api/v1/drives/participants/123")
      .send({ status: "attended" });
    expect(res.statusCode).toBe(401);
  });

  test("POST /api/v1/drives should return 401 without token", async () => {
    const res = await request(app).post("/api/v1/drives").send({});
    expect(res.statusCode).toBe(401);
  });

  test("PUT /api/v1/drives/:id should return 401 without token", async () => {
    const res = await request(app).put("/api/v1/drives/123").send({});
    expect(res.statusCode).toBe(401);
  });

  test("DELETE /api/v1/drives/:id should return 401 without token", async () => {
    const res = await request(app).delete("/api/v1/drives/123");
    expect(res.statusCode).toBe(401);
  });

  // ---------------- INVENTORY / DASHBOARD ----------------
  test("GET /api/v1/inventory/summary should return 401 without token", async () => {
    const res = await request(app).get("/api/v1/inventory/summary");
    expect(res.statusCode).toBe(401);
  });

  test("GET /api/v1/dashboard/summary should return 401 without token", async () => {
    const res = await request(app).get("/api/v1/dashboard/summary");
    expect(res.statusCode).toBe(401);
  });
});

afterAll(async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));
});