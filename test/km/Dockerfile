FROM alpine
COPY test.sh /test/test.sh
RUN chmod 755 /test/test.sh
RUN apk --no-cache add curl bash
WORKDIR /test
ENTRYPOINT ["./test.sh"]
