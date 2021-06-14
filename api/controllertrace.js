'use strict';

//const opentelemetry = require('@opentelemetry/api');

const opentelemetry = require('@opentelemetry/api');
const { BasicTracerProvider, ConsoleSpanExporter, SimpleSpanProcessor } = require('@opentelemetry/tracing');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');

const provider = new BasicTracerProvider();

const exporter = new JaegerExporter({
serviceName: 'nodejs-service',
endpoint: 'http://192.168.20.34:14268/api/traces',
});
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

provider.register();
const tracer = opentelemetry.trace.getTracer('nodejs-microservice');

var properties = require('../package.json');
var distance = require('../service/distance');

var controllers = {
  about: function(req, res) {
    var aboutInfo = {
      name: properties.name,
      version: properties.version
    }
    res.json(aboutInfo);
  },

  getDistance: function(req, res) {
    distance.find(req, res, function(err, dist) {
    if (err)
      res.send(err);
    res.json(dist); 
    });
  },

  getSpan: function getSpan() {
  // Method to pass parameter into Controller. Not used in this scenario.
  // getSpan: function getSpan(parentSpan,tracer,exporter
    return function(req, res, next) {
        // do something with the role variable
        // send a response using res.status(...).json(...)

        const parentSpan = tracer.startSpan('main');
        console.log("-------------------- Start of Span --------------------");
        console.log("\nRetrieving the main span structure - \n", parentSpan);
        console.log("--------------------- End of Span ---------------------");

        console.log("\nThe parent span information is \n", parentSpan);

        const ctx = opentelemetry.trace.setSpan(opentelemetry.context.active(), parentSpan);
 
        const currentSpan = opentelemetry.trace.getSpan(ctx);
 
        console.log("\n\nRetrieving the current span context - \n\n", currentSpan.spanContext());
        console.log("\nCreating new span \n");

        const span = tracer.startSpan('doWork', undefined, ctx);
        const latency = 300
          // multipe attributes can be set at the same time
          // with setAttributes
          span.setAttributes({
            timeout: true,
            sleep: latency,
          });
          span.addEvent('currentSpan.spanContext()', currentSpan.spanContext());

        distance.find(req, res, function(err, dist) {
          if (err)
            res.send(err);
          res.json(dist); 
          });
        // Be sure to end the span.
        span.end();
        // Be sure to end the span.
        currentSpan.end();
        //parentSpan.end();

        // flush and close the connection.
        exporter.shutdown();

        // flush and close the connection.
        //exporter.shutdown();
    };
  }
};

module.exports = controllers;
