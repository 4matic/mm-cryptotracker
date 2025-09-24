import { Migration } from '@mikro-orm/migrations';

export class Migration20250924062335 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "asset" ("id" serial primary key, "symbol" varchar(255) not null, "name" varchar(255) not null, "description" text null, "logo_url" varchar(255) null, "website" varchar(255) null, "is_active" boolean not null default true, "is_fiat" boolean not null default false, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);
    this.addSql(`alter table "asset" add constraint "asset_symbol_unique" unique ("symbol");`);

    this.addSql(`create table "data_provider" ("id" serial primary key, "slug" varchar(255) not null, "name" varchar(255) not null, "description" text null, "api_url" varchar(255) null, "website" varchar(255) null, "api_config" jsonb null, "is_active" boolean not null default true, "rate_limit_per_minute" int not null default 30, "priority" int not null default 1, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);
    this.addSql(`alter table "data_provider" add constraint "data_provider_slug_unique" unique ("slug");`);
    this.addSql(`alter table "data_provider" add constraint "data_provider_name_unique" unique ("name");`);

    this.addSql(`create table "trading_pair" ("id" serial primary key, "base_asset_id" int not null, "quote_asset_id" int not null, "symbol" varchar(255) not null, "is_active" boolean not null default true, "is_visible" boolean not null default false, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);
    this.addSql(`alter table "trading_pair" add constraint "trading_pair_base_asset_id_quote_asset_id_unique" unique ("base_asset_id", "quote_asset_id");`);

    this.addSql(`create table "price_history" ("id" serial primary key, "trading_pair_id" int not null, "data_provider_id" int not null, "timestamp" timestamptz not null, "price" numeric(20,8) not null, "last_updated" timestamptz null, "metadata" jsonb null, "created_at" timestamptz not null);`);
    this.addSql(`create index "price_history_timestamp_index" on "price_history" ("timestamp");`);
    this.addSql(`create index "price_history_data_provider_id_timestamp_index" on "price_history" ("data_provider_id", "timestamp");`);
    this.addSql(`create index "price_history_trading_pair_id_timestamp_index" on "price_history" ("trading_pair_id", "timestamp");`);
    this.addSql(`alter table "price_history" add constraint "price_history_trading_pair_id_data_provider_id_timestamp_unique" unique ("trading_pair_id", "data_provider_id", "timestamp");`);

    this.addSql(`alter table "trading_pair" add constraint "trading_pair_base_asset_id_foreign" foreign key ("base_asset_id") references "asset" ("id") on update cascade;`);
    this.addSql(`alter table "trading_pair" add constraint "trading_pair_quote_asset_id_foreign" foreign key ("quote_asset_id") references "asset" ("id") on update cascade;`);

    this.addSql(`alter table "price_history" add constraint "price_history_trading_pair_id_foreign" foreign key ("trading_pair_id") references "trading_pair" ("id") on update cascade;`);
    this.addSql(`alter table "price_history" add constraint "price_history_data_provider_id_foreign" foreign key ("data_provider_id") references "data_provider" ("id") on update cascade;`);
  }

}
