FROM golang:1.22

# RUN apt-get update && \
#     apt-get install -y certbot && \
#     apt-get clean

WORKDIR /social-network

COPY go.mod .

RUN go mod download

COPY . .

RUN go build -o ./output .

EXPOSE 8080

CMD ["./output"]