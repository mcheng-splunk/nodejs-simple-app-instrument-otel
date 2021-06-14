# Open Telemetry Auto and Manual Instrumentation

This repository is used to show how we can both add both auto OR manual instrumentation to the application. The simple nodejs application will be sending making a remote call to an external API. The traces will be recorded in the Jaeger endpoint.

## Pre-Requisite

We need to configure the following 2 variable.

**{{API_KEY}}**
This variable is inside /service/distance.js file. The API_KEY can be allocated when we registered an account in [zipcode](http://www.zipcodeapi.com)

**{{JAEGER_ENDPOINT}}**
This variable is inside tracer.js file. This is the IP address or host of the Jaeger endpoint.

---

## Auto Instrumentation

In this mode, we will add a tracer.js file to the application. Details of the tracer.js is similar to the examples found in [Otel-telemetry example](https://github.com/open-telemetry/opentelemetry-js/tree/main/examples/http).



To invoke the tracing.  
`npm -r ./tracer.js server.js`

![image](https://user-images.githubusercontent.com/84762890/121833454-f76ff080-ccfe-11eb-9f18-0deaebdaf252.png)


## Manual Instrumentation

In this mode, we will be modifying the application node to append additional tags and events to the span. All the modified files are suffix with `<filename>trace`.

To invoke the tracing.
`node servertrace.js`

The additional tags and events are highlighted in RED.

![image](https://user-images.githubusercontent.com/84762890/121833737-8c72e980-ccff-11eb-88dc-5d7119c63353.png)
