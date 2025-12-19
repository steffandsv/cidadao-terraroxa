import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Running pre-migration integrity check...')

  try {
    // 1. Disable FK checks to allow inserting reference data even if schema is drifting or partial
    // We use executeRawUnsafe because strict typing might fail if schema doesn't match DB
    await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS=0;')

    // 2. Attempt to ensure AssetType 1 exists.
    // We escape `schema` because it is a reserved keyword in MySQL.
    try {
      await prisma.$executeRawUnsafe(`
        INSERT INTO asset_types (id, name, \`schema\`)
        VALUES (1, 'Patrimônio', '{}')
        ON DUPLICATE KEY UPDATE id=id;
      `)
      console.log(' - Ensured AssetType(id=1) exists.')
    } catch (e: any) {
      if (e.message.includes("doesn't exist")) {
        console.log(" - Table 'asset_types' does not exist yet. Skipping insert.")
      } else {
        console.warn(" - Warning during AssetType insert:", e.message)
      }
    }

    // 3. Ensure all assets have a valid type.
    // If 'assets' table has rows with NULL or invalid asset_type_id, we fix them to 1.
    try {
      await prisma.$executeRawUnsafe(`
        UPDATE assets SET asset_type_id = 1 WHERE asset_type_id IS NULL OR asset_type_id = 0;
      `)
      console.log(' - Updated orphan Assets to use AssetType(id=1).')
    } catch (e: any) {
      if (e.message.includes("doesn't exist")) {
        console.log(" - Table 'assets' does not exist yet. Skipping update.")
      } else {
        console.warn(" - Warning during Assets update:", e.message)
      }
    }

  } catch (e: any) {
    console.warn("Integrity fix critical warning:", e.message)
  } finally {
    // 4. Always re-enable FK checks
    try {
      await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS=1;')
    } catch (e) {
      // ignore
    }
    await prisma.$disconnect()
  }
}

main()
