#!/bin/bash

echo "===> Descartando mudanÃ§as locais..."
git reset --hard || { echo "Reset falhou"; exit 1; }

echo "===> Atualizando projeto..."
git pull origin main || { echo "Git pull falhou"; exit 1; }

echo "===> Subindo containers..."
docker-compose down --remove-orphans
docker-compose up -d --build

echo "===> Containers ativos:"
docker ps