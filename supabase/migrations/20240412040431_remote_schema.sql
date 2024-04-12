
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

ALTER SCHEMA "public" OWNER TO "postgres";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."WatchStatus" AS ENUM (
    'NOT_WATCHING',
    'WATCHING',
    'PLAN_TO_WATCH',
    'COMPLETED',
    'ON_HOLD',
    'DROPPED'
);

ALTER TYPE "public"."WatchStatus" OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."Account" (
    "id" "text" NOT NULL,
    "user_id" "text" NOT NULL,
    "type" "text" NOT NULL,
    "provider" "text" NOT NULL,
    "provider_account_id" "text" NOT NULL,
    "refresh_token" "text",
    "access_token" "text",
    "expires_at" integer,
    "token_type" "text",
    "scope" "text",
    "id_token" "text",
    "session_state" "text"
);

ALTER TABLE "public"."Account" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."Movies" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "status" "public"."WatchStatus" NOT NULL,
    "rating" integer,
    "user_id" "text" NOT NULL
);

ALTER TABLE "public"."Movies" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."Session" (
    "id" "text" NOT NULL,
    "session_token" "text" NOT NULL,
    "user_id" "text" NOT NULL,
    "expires" timestamp(3) without time zone NOT NULL
);

ALTER TABLE "public"."Session" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."Shows" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "current_episode" integer DEFAULT 0 NOT NULL,
    "status" "public"."WatchStatus" NOT NULL,
    "rating" integer,
    "user_id" "text" NOT NULL
);

ALTER TABLE "public"."Shows" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."User" (
    "id" "text" NOT NULL,
    "name" "text",
    "email" "text",
    "email_verified" timestamp(3) without time zone,
    "image" "text",
    "password" "text",
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

ALTER TABLE "public"."User" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."VerificationToken" (
    "identifier" "text" NOT NULL,
    "token" "text" NOT NULL,
    "expires" timestamp(3) without time zone NOT NULL
);

ALTER TABLE "public"."VerificationToken" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."_prisma_migrations" (
    "id" character varying(36) NOT NULL,
    "checksum" character varying(64) NOT NULL,
    "finished_at" timestamp with time zone,
    "migration_name" character varying(255) NOT NULL,
    "logs" "text",
    "rolled_back_at" timestamp with time zone,
    "started_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "applied_steps_count" integer DEFAULT 0 NOT NULL
);

ALTER TABLE "public"."_prisma_migrations" OWNER TO "postgres";

ALTER TABLE ONLY "public"."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."Movies"
    ADD CONSTRAINT "Movies_pkey" PRIMARY KEY ("id", "user_id");

ALTER TABLE ONLY "public"."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."Shows"
    ADD CONSTRAINT "Shows_pkey" PRIMARY KEY ("id", "user_id");

ALTER TABLE ONLY "public"."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."_prisma_migrations"
    ADD CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id");

CREATE UNIQUE INDEX "Account_provider_provider_account_id_key" ON "public"."Account" USING "btree" ("provider", "provider_account_id");

CREATE INDEX "Account_user_id_idx" ON "public"."Account" USING "btree" ("user_id");

CREATE INDEX "Movie_user_id_idx" ON "public"."Movies" USING "btree" ("user_id");

CREATE UNIQUE INDEX "Session_session_token_key" ON "public"."Session" USING "btree" ("session_token");

CREATE INDEX "Session_user_id_idx" ON "public"."Session" USING "btree" ("user_id");

CREATE INDEX "Show_user_id_idx" ON "public"."Shows" USING "btree" ("user_id");

CREATE UNIQUE INDEX "User_email_key" ON "public"."User" USING "btree" ("email");

CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "public"."VerificationToken" USING "btree" ("identifier", "token");

CREATE UNIQUE INDEX "VerificationToken_token_key" ON "public"."VerificationToken" USING "btree" ("token");

ALTER TABLE ONLY "public"."Account"
    ADD CONSTRAINT "Account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."Movies"
    ADD CONSTRAINT "Movies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."Session"
    ADD CONSTRAINT "Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."Shows"
    ADD CONSTRAINT "Shows_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;

RESET ALL;
