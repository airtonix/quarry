var _ = require("lodash");
var persistence;
var logger = require('../../lib/logger');


module.exports = {

    initialize: function(options){
        var name = _.first(options._);
        persistence = require([__dirname, "..", "..", "persistence", name].join("/"));
    },

    get: function(req, res, next){
        logger.log('info', ['api.record.get', req.params.record]);

        persistence.get_configuration(function(err, configuration){
            if(_.has(configuration.records, req.params.record))
                res.stash.body = configuration.records[req.params.record];

            return next();
        });
    },

    create: function(req, res, next){
        logger.log('info', ['api.record.create', req.params.record]);
        if(_.has(req, "body") && _.has(req.body, "type")){
            persistence.create_record(req.params.record, req.body, function(err){
                if(err)
                    res.stash = err;
                else
                    res.stash.code = 201;

                return next();
            });
        }
        else{
            res.stash.code = 400;
            return next();
        }
    },

    update: function(req, res, next){
        logger.log('info', ['api.record.update', req.params.record]);
        if(_.has(req, "body") && _.has(req.body, "type")){
            persistence.update_record(req.params.record, req.body, function(err){
                if(err)
                    res.stash = err;
                else
                    res.stash.code = 200;

                return next();
            });
        }
        else{
            res.stash.code = 400;
            return next();
        }
    },

    delete: function(req, res, next){
        logger.log('info', ['api.record.delete', req.params.record]);
        persistence.delete_record(req.params.record, function(err){
            if(err)
                res.stash = err;
            else
                res.stash.code = 204;

            return next();
        });
    }

}
