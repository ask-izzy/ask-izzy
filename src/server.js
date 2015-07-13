/* @flow */

require("babel/register");
var express = require('express');
var React = require('React');
var Index = require("./index");
var routes = require("./config/routes");

var port = process.env.PORT || "8080";
var app = express();

// TODO: I haven't figured out how to bless an
// exported function as callable without `new`
new require('./config/development')(app);
app.use(function handleRequest(req, res, next) {
    var html = React.renderToString(<Index routeParams={routes(req.path)} />)
    res.set('Content-Type', 'text/html');
    res.send(html);
});

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Listening at http://%s:%s', host, port);
});
