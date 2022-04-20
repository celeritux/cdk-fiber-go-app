FROM golang:alpine AS builder

# Move to working directory (/build).
WORKDIR /build

# Copy and download dependency using go mod
COPY go.mod go.sum ./
RUN go mod download

# Copy all into the container
COPY . .

# Set necessary environment variables needed for our image and build the API server.
ENV CGO_ENABLED=0 GOOS=linux GOARCH=arm64
RUN go build -ldflags="-s -w" -o apiserver .


FROM arm64v8/busybox

# Copy binary from /build to /dist folder of scratch container
COPY --from=builder ["/build/apiserver", "/"]
COPY --from=builder ["/build/public/", "/public"]

# Command to run when starting the container
EXPOSE 8080
ENTRYPOINT ["/apiserver"]