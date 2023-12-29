-- CreateTable
CREATE TABLE "Users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_mame" VARCHAR(255) NOT NULL,
    "username" VARCHAR(255) NOT NULL DEFAULT '',
    "middle_name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Markers" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "is_draft" BOOLEAN DEFAULT false,
    "is_hidden" BOOLEAN DEFAULT false,
    "latitude" DECIMAL NOT NULL,
    "longitude" DECIMAL NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Markers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Groups" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "device" JSON,
    "ip" VARCHAR(255),
    "app_version" VARCHAR(255),
    "location" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupsOnUsers" (
    "user_id" UUID NOT NULL,
    "group_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroupsOnUsers_pkey" PRIMARY KEY ("user_id","group_id")
);

-- CreateTable
CREATE TABLE "PublicFiles" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "marker_id" UUID,
    "key" VARCHAR(255),
    "url" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublicFiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SequelizeMeta" (
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY ("name")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "PublicFiles_user_id_key" ON "PublicFiles"("user_id");

-- AddForeignKey
ALTER TABLE "Markers" ADD CONSTRAINT "Markers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UserSessions" ADD CONSTRAINT "UserSessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GroupsOnUsers" ADD CONSTRAINT "GroupsOnUsers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GroupsOnUsers" ADD CONSTRAINT "GroupsOnUsers_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PublicFiles" ADD CONSTRAINT "PublicFiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PublicFiles" ADD CONSTRAINT "PublicFiles_marker_id_fkey" FOREIGN KEY ("marker_id") REFERENCES "Markers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
