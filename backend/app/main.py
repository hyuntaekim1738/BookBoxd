from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.endpoints import bookshelves, ratings, reviews, recommendations

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(bookshelves.router, prefix=f"{settings.API_V1_STR}/bookshelves", tags=["bookshelves"])
app.include_router(ratings.router, prefix=f"{settings.API_V1_STR}/ratings", tags=["ratings"]) 
app.include_router(reviews.router, prefix=f"{settings.API_V1_STR}/reviews", tags=["reviews"])
app.include_router(recommendations.router, prefix=f"{settings.API_V1_STR}", tags=["recommendations"])

@app.get("/")
def read_root():
    return {"message": "Welcome to BookBoxd API"} 