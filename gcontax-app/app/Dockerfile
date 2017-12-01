FROM alpine:latest

COPY . /app
WORKDIR /app

RUN apk update && apk add python3
RUN pip3 install -r requirements.txt

CMD ["python3", "/app/controller.py"]
