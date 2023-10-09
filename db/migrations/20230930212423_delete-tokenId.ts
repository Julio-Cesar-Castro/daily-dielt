import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('lunchs', (table) => {
    table.dropColumn('token_Id')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('lunchs', (table) => {
    table.uuid('token_Id').after('id').index()
  })
}
