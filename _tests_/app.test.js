const request = require("supertest");

const app = require("../app");

test("should respond with a 200 with no query parameters", () => {
  return request(app)
    .get("/")
    .expect("Content-Type", /html/)
    .expect(200)
    .then(response => {
      expect(response.text).toMatch(/<title>Express<\/title>/);
    });
});
