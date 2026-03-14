using PlanningCenterScheduleManager.Backend.Endpoints;
using PlanningCenterScheduleManager.Backend.Services.Ocr;
using PlanningCenterScheduleManager.Backend.Services.Parsing;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<OcrOptions>(builder.Configuration.GetSection(OcrOptions.SectionName));

builder.Services.AddHttpClient<OcrSpaceClient>();
builder.Services.AddSingleton<PlanningCenterServiceParser>();

var allowedOrigins = builder.Configuration["Cors:AllowedOrigins"]?
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
    ?? ["http://localhost:5173"];

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod());
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors();

app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "Backend API v1");
    options.RoutePrefix = "swagger";
});

app.MapScheduleEndpoints();

app.Run();
