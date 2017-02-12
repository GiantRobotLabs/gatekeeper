# docker-gatekeeper
A container for a docker-compose environment to help orchestrate startup.

`docker run -p 8080:8080  --rm jneyer/gatekeeper`

```
{
  "Supported operations": {
    "GET": {
      "/": "Show usage.",
      "/services": "Get all registered services.",
      "/services/{service}": "Get the service status record.",
      "/services/{service}/status": "Return the HTTP response for the status."
    },
    "PUT": {
      "/services/{service}/ready": "Set the ready status for a service.",
      "/controls/{control}": "Send a server control. quit = Exit server."
    },
    "POST": {
      "/services/{service}": "Register a service to track status."
    },
    "Responses": {
      "GET /services/{service}": {
        "200": "Service registered.",
        "400": "Service not registered."
      },
      "GET /services/{service}/status": {
        "200": "Service ready",
        "404": "Service not registered.",
        "503": "Service not ready."
      },
      "PUT /controls/{control}": {
        "200": "Success",
        "501": "Control operation not implemented."
      }
    }
  }
}

```
