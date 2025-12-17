# ---------- build ----------
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Cache de dependências
COPY pom.xml .
RUN mvn -B dependency:go-offline

# Build da aplicação
COPY src ./src
RUN mvn -B package -DskipTests

# ---------- extract ----------
FROM eclipse-temurin:21-jre AS extract
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

# Extrai as layers do Spring Boot
RUN java -Djarmode=layertools -jar app.jar extract

# ---------- runner ----------
FROM eclipse-temurin:21-jre
WORKDIR /app

# Usuário não-root
RUN addgroup --system spring \
 && adduser --system spring --ingroup spring

# Copiar layers separadas (melhor cache)
COPY --from=extract /app/dependencies/ ./
COPY --from=extract /app/snapshot-dependencies/ ./
COPY --from=extract /app/spring-boot-loader/ ./
COPY --from=extract /app/application/ ./

USER spring

EXPOSE 8080
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]