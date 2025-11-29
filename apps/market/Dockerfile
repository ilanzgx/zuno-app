# Use Python 3.13 slim image
FROM python:3.13-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency files
COPY pyproject.toml ./

# Install uv for faster dependency management
RUN pip install --no-cache-dir uv

# Install dependencies using uv
RUN uv pip install --system --no-cache -r pyproject.toml

# Copy application source code
COPY src ./src

# Expose port
EXPOSE 8000

# Run the application with uvicorn
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
