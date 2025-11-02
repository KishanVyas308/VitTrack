from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import logging
from routes import expense
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

app = FastAPI(title="VitTrack Expense Tracker API", version="1.0.0")

# Add CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(expense.router)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc):
    # More detailed error diagnostics
    error_details = []
    for error in exc.errors():
        if error["type"] == "value_error":
            error_details.append(f"{error['loc'][0]}: {error['msg']}")
        else:
            error_details.append(error["msg"])
    
    return JSONResponse(
        status_code=422,
        content={"detail": "Validation error", "errors": error_details},
    )

@app.get("/")
def read_root():
    return {"message": "Expense Tracker API"}

if __name__ == "__main__":
    import uvicorn
    import os
    
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    
    print(f"🚀 Starting server at http://{host}:{port}")
    uvicorn.run("main:app", host=host, port=port, reload=True)
