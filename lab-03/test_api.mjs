// test_api.mjs
import http from "node:http";
import { spawn } from "node:child_process";

const child = spawn("node", ["app.js"], {
  cwd: process.cwd(),
  env: { ...process.env, PORT: "3001" },
  stdio: "pipe"
});

child.stdout.on("data", (data) => {
  // console.log("SERVER:", data.toString().trim());
});
child.stderr.on("data", (data) => {
  console.error("SERVER ERR:", data.toString().trim());
});

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "127.0.0.1",
      port: 3001,
      path,
      method,
      headers: {}
    };

    let bodyStr = null;
    if (body) {
      bodyStr = JSON.stringify(body);
      options.headers["Content-Type"] = "application/json";
      options.headers["Content-Length"] = Buffer.byteLength(bodyStr);
    }

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on("error", reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

async function runTests() {
  await wait(1500); // Wait for server to boot and DB to initialize
  console.log("=== STARTING API TESTS ===");

  const r1 = await request("GET", "/");
  console.log("GET / : status =", r1.status, "| msg =", r1.data.message);

  const r2 = await request("GET", "/books");
  console.log("GET /books : status =", r2.status, "| count =", r2.data.count);

  const r3 = await request("GET", "/books?search_q=atomic");
  console.log("GET /books?search_q=atomic : status =", r3.status, "| found =", r3.data.data.map(b => b.title));

  const r4 = await request("GET", "/books?order_by=price&order=DESC&limit=3");
  console.log("GET /books?order_by=price&order=DESC&limit=3 : status =", r4.status, "| top prices =", r4.data.data.map(b => b.price));

  const r5 = await request("GET", "/books?min_price=200&max_price=260");
  console.log("GET /books?min_price=200&max_price=260 : status =", r5.status, "| prices =", r5.data.data.map(b => b.price));

  const r6 = await request("GET", "/books/1");
  console.log("GET /books/1 : status =", r6.status, "| book title =", r6.data.data?.title);

  const r7 = await request("POST", "/books", {
    title: "Testing Clean Code 2",
    author: "Robert C. Martin",
    price: 499,
    pages: 400
  });
  console.log("POST /books (valid) : status =", r7.status, "| id =", r7.data.data?.id, "| msg =", r7.data.message);

  const r8 = await request("POST", "/books", {
    author: "Anonymous",
    price: 100,
    pages: 100
  });
  console.log("POST /books (missing title) : status =", r8.status, "| msg =", r8.data.message);

  const r9 = await request("POST", "/books", {
    title: "Invalid Price Book",
    author: "Tester",
    price: "not_a_number",
    pages: 100
  });
  console.log("POST /books (invalid price) : status =", r9.status, "| msg =", r9.data.message);

  const r10 = await request("PUT", "/books/9999", {
    title: "Ghost",
    author: "Ghost",
    price: 10,
    pages: 10
  });
  console.log("PUT /books/9999 (non-existent) : status =", r10.status, "| msg =", r10.data.message);

  const r11 = await request("DELETE", "/books/9999");
  console.log("DELETE /books/9999 (non-existent) : status =", r11.status, "| msg =", r11.data.message);

  const r12 = await request("GET", "/books?order_by=invalid_field");
  console.log("GET /books?order_by=invalid_field : status =", r12.status, "| msg =", r12.data.message);

  const r13 = await request("GET", "/books?min_price=500&max_price=100");
  console.log("GET /books?min_price=500&max_price=100 : status =", r13.status, "| msg =", r13.data.message);

  console.log("=== ALL TESTS COMPLETED ===");
  child.kill();
  process.exit(0);
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  child.kill();
  process.exit(1);
});

