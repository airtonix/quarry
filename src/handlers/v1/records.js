var _ = require("lodash");
var logger = require('../../lib/logger');
var persistence;

module.exports = {

    initialize: function(options){
        persistence = require([__dirname, "..", "..", "persistence", _.first(options._)].join("/"));
    },

    get: function(req, res, next){
        logger.log('info', ['api.record.get.all']);
        persistence.get_configuration(function(err, configuration){
            res.stash.body = configuration.records;
            return next();
        });
    }

}
