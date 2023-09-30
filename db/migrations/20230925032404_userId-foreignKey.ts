import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('lunchs', (table) => {
    table.foreign('userId').references('userId').inTable('user')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('lunchs', (table) => {
    table.dropForeign('userId')
  })
}
