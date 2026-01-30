# ----  Build Maven ----
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

# Copier  le pom.xml 
COPY pom.xml .
RUN mvn -q -e -B dependency:go-offline


COPY src ./src

# Compiler le projet
RUN mvn clean package -DskipTests


# ---- Runtime ----
FROM eclipse-temurin:21

WORKDIR /app


COPY --from=build /app/target/shop-app-0.0.1-SNAPSHOT.jar shop-app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "shop-app.jar"]
