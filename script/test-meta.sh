curl --insecure 'https://askizzy-test-3.docker.dev/category/food/' | xmllint --html --dropdtd --xpath '//html/head/meta/@content' -
