# Imagem do backend para o Render (plano Starter: 512 MB de memória e 0,5 de CPU).
# No Render: Root Directory = src/backend, Runtime = Docker.

FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q dependency:go-offline
COPY src ./src
RUN mvn -q package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/backend-*.jar app.jar
# Java pequeno para caber nos 512 MB. O servidor do Render roda em UTC: o fuso de Brasília deixa
# as horas gravadas (previsão, avisos, mensagens) iguais às do ambiente local.
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=70 -XX:+UseSerialGC -Xss512k -Duser.timezone=America/Sao_Paulo"
# O Render diz a porta na variável PORT; o application.properties lê ela.
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
