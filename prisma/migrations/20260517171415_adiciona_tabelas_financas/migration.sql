/*
  Warnings:

  - You are about to drop the column `atualizado_em` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `criado_em` on the `Usuario` table. All the data in the column will be lost.
  - Added the required column `atualizadoEm` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Usuario` DROP COLUMN `atualizado_em`,
    DROP COLUMN `criado_em`,
    ADD COLUMN `atualizadoEm` DATETIME(3) NOT NULL,
    ADD COLUMN `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
