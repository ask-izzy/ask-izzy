/* $FlowIgnore */
// Sample usage:
// echo '{"q": "housing", "area": "Carnegie, Victoria"}' | ./index.js script/search-iss.js | jq .
import {search} from "../src/iss";

let stdin = process.stdin;
let read = '';

stdin.setEncoding('utf8');

stdin.on('readable', function () {
    var chunk;

    while ((chunk = stdin.read())) {
        read += chunk;
    }
});

stdin.on('end', function () {
    let json
    try {
        json = JSON.parse(read)
    } catch (error) {
        console.trace(error)
    }
    search(json)
    .then((data) => console.log(JSON.stringify(data)))
    .catch((error) => console.error(error))
});
