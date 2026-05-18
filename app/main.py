from fastapi import FastAPI

# Create the FastAPI application instance.
# `title` and `description` show up in the auto-generated docs.
app = FastAPI(
    title="Cloud File Storage System",
    description="A secure cloud-based file management system using AWS S3.",
    version="0.1.0",
)


@app.get("/health")
def health_check():
    """
    A simple health-check endpoint.
    Used by load balancers and monitoring tools to verify the app is alive.
    """
    return {"status": "ok"}


@app.get("/")
def root():
    return {
        "message": "Welcome to the Cloud File Storage System API",
        "docs": "/docs",
    }