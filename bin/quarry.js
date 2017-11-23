#!/usr/bin/env node
var fs = require("fs");
var join = require('path').join;
var resolve = require('path').resolve;
var _ = require("lodash");
var dns = require("native-dns");
var nomnom = require("nomnom");
var pkg = require("../package.json");
var utils = require("../src/lib/utils");
var logger = require("../src/lib/logger");
var statsd = require("../src/lib/statsd");
var Server = require("../src/lib/server");
var API = require("../src/lib/api");

var CONFIG_STORE_PATH = resolve(__dirname, join("..", "src", "config"));

// get configuration options
var configuration = _.reduce(fs.readdirSync(CONFIG_STORE_PATH),
    function(result, configFile){
        result[configFile.split(".")[0]] = require(join(CONFIG_STORE_PATH, configFile));
        return result;
    }, {});

// set options
var disk_options = _.defaults(_.clone(configuration.default), _.clone(configuration.disk));
var memory_options = _.defaults(_.clone(configuration.default), _.clone(configuration.memory));
var mongo_options = _.defaults(_.clone(configuration.default), _.clone(configuration.mongo));
var redis_options = _.defaults(_.clone(configuration.default), _.clone(configuration.redis));
var s3_options = _.defaults(_.clone(configuration.default), _.clone(configuration.s3));

// initialize commands
nomnom.command("disk").options(disk_options);
nomnom.command("memory").options(memory_options);
nomnom.command("mongo").options(mongo_options);
nomnom.command("redis").options(redis_options);
nomnom.command("s3").options(s3_options);

// set script name
nomnom.script("quarry");

// parse options
var options = nomnom.parse(utils.parse_env_vars());

// init logger
logger.initialize(_.pick(options, [
    "log-level",
    "redis-log-host",
    "redis-log-port",
]));

logger.log("info", ["Starting Quarry version", pkg.version].join(" "));

// init statsd
statsd.initialize(_.pick(options, ["statsd-host", "statsd-port"]));

options.cli = true;

// initialize and start server
var server = new Server(options);
server.listen(function(){
    // initialize and start API
    var api = new API(options);
    api.listen();
});
