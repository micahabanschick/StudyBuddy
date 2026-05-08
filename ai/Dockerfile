FROM python:3.12-slim AS base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    UV_LINK_MODE=copy \
    UV_NO_CACHE=1

RUN pip install --no-cache-dir uv==0.8.17

WORKDIR /app

COPY pyproject.toml ./
COPY uv.lock* ./
RUN uv sync --frozen --no-dev || uv sync --no-dev

COPY app ./app

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
