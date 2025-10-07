from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
import logging
from routes import expense
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

app = FastAPI()

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

@app.post("/")
def read_root():
    return {"message": "Expense Tracker API"}
