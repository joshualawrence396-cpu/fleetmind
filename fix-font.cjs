const fs = require("fs");
const file = "app/page.tsx";
let c = fs.readFileSync(file, "utf8");
c = c.split("'Inter',sans-serif").join("-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif");
c = c.split("'Inter', sans-serif").join("-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif");
c = c.split("'Inter',\\ sans-serif").join("-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif");
fs.writeFileSync(file, c, "utf8");
console.log("Font references fixed!");
