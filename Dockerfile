FROM python:3.11-slim

WORKDIR /app

# Copy the requirements file from the backend folder
COPY ai-ecommerce/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend files
COPY ai-ecommerce/ .

# Run the FastAPI server using the port provided by Railway
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT}"]
