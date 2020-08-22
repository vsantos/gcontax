FROM alpine:3.12

COPY . /app
WORKDIR /app

RUN apk update && apk add python3 && apk add py3-pip
RUN pip3 install -r requirements.txt

CMD ["python3", "/app/controller.py"]
