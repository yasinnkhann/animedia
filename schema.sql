CREATE TYPE "public"."WatchStatus" AS ENUM (
    'NOT_WATCHING',
    'WATCHING',
    'PLAN_TO_WATCH',
    'COMPLETED',
    'ON_HOLD',
    'DROPPED'
);

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

CREATE TABLE IF NOT EXISTS "public"."Movies" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "status" "public"."WatchStatus" NOT NULL,
    "rating" integer,
    "user_id" "text" NOT NULL
);

CREATE TABLE IF NOT EXISTS "public"."Session" (
    "id" "text" NOT NULL,
    "session_token" "text" NOT NULL,
    "user_id" "text" NOT NULL,
    "expires" timestamp(3) without time zone NOT NULL
);

CREATE TABLE IF NOT EXISTS "public"."Shows" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "current_episode" integer DEFAULT 0 NOT NULL,
    "status" "public"."WatchStatus" NOT NULL,
    "rating" integer,
    "user_id" "text" NOT NULL
);

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