# Build stage
FROM golang:1.24-alpine AS builder

# Enable automatic toolchain download for Go 1.25+ compatibility
ENV GOTOOLCHAIN=auto
ENV CGO_ENABLED=0
ENV GOOS=linux

WORKDIR /app

# Leverage Docker cache for dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source and build with optimization flags (-s -w to strip debug info)
COPY . .
RUN go build -ldflags="-s -w" -o main .

# Final stage - Minimal image
FROM alpine:latest
RUN apk --no-cache add ca-certificates tzdata

WORKDIR /app

# Copy binary from builder
COPY --from=builder /app/main .
COPY .env .

EXPOSE 3000
CMD ["./main"]
