FROM python:3.11-slim

WORKDIR /app

COPY apps/routing-service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY apps/routing-service/src/ ./src/

EXPOSE 8001

CMD ["python", "-m", "src.main"]
