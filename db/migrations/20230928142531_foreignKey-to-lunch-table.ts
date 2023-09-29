import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('lunchs', (table) => {
    table.uuid('userId').after('token_Id').index().unique().unsigned()
    table.foreign('userId').references('lunchs.id')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('lunchs', (table) => {
    table.dropColumn('userId')
    table.dropForeign('userId')
  })
}
