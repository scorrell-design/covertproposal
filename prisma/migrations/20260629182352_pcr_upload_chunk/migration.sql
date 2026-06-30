-- CreateTable
CREATE TABLE "PcrUploadChunk" (
    "id" TEXT NOT NULL,
    "uploadId" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "data" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PcrUploadChunk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PcrUploadChunk_uploadId_idx" ON "PcrUploadChunk"("uploadId");

-- CreateIndex
CREATE UNIQUE INDEX "PcrUploadChunk_uploadId_index_key" ON "PcrUploadChunk"("uploadId", "index");
