const {PrismaClient} = require("@prisma/client")
const bcrypt = require("bcryptjs")
const p = new PrismaClient()
async function main() {
  const hash = await bcrypt.hash("admin123", 12)
  await p.user.upsert({
    where:{email:"admin@fleetmind.com"},
    update:{password:hash,role:"admin",plan:"Enterprise",name:"Administrator"},
    create:{email:"admin@fleetmind.com",password:hash,role:"admin",plan:"Enterprise",name:"Administrator",company:"FleetMind SA"}
  })
  console.log("Admin seeded!")
}
main().catch(console.error).finally(()=>p.$disconnect())
