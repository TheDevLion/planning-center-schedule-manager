FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY api/backend.api.csproj api/
RUN dotnet restore api/backend.api.csproj

COPY api/ api/
RUN dotnet publish api/backend.api.csproj -c Release -o /app --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app .

EXPOSE 8080
ENV ASPNETCORE_ENVIRONMENT=Production

CMD ["sh", "-c", "dotnet backend.api.dll --urls http://+:${PORT:-8080}"]
