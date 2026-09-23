FROM eclipse-temurin:25-jre

RUN groupadd -r appuser && useradd -r -g appuser appuser

WORKDIR /app

COPY target/*.jar app.jar

RUN chown -R appuser:appuser /app

USER appuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java","-jar", "app.jar"]