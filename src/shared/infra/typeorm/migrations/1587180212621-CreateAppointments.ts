import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateAppointments1587180212621
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Fix error: function uuid_generate_v4() does not exist
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.createTable(
      new Table({
        columns: [
          {
            default: 'uuid_generate_v4()',
            generationStrategy: 'uuid',
            isPrimary: true,
            name: 'id',
            type: 'uuid',
          },
          {
            name: 'provider',
            type: 'varchar',
          },
          {
            name: 'date',
            type: 'timestamp with time zone',
          },
          {
            default: 'now()',
            name: 'created_at',
            type: 'timestamp',
          },
          {
            default: 'now()',
            name: 'updated_at',
            type: 'timestamp',
          },
        ],
        name: 'appointments',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('appointments');
  }
}
