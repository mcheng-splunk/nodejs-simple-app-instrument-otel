'use strict';
const controller = require('./controllertrace');

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

const parentSpan = tracer.startSpan('main');
console.log("-------------------- Start of Span --------------------");
console.log("\nRetrieving the main span structure - \n", parentSpan);
console.log("--------------------- End of Span ---------------------");

module.exports = function(app){
  //console.log("parent span is ", parentSpan)
  app.route('/about')
    .get(controller.about);
  app.route('/distance/:zipcode1/:zipcode2')
    .get(controller.getDistance);
  // Method to pass parameter into Controller. Not used in this scenario.
  //app.route('/getspan/:zipcode1/:zipcode2').get(controller.getSpan(parentSpan,tracer,exporter));
  app.route('/getspan/:zipcode1/:zipcode2')
  .get(controller.getSpan());
};

