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
# Description
Sometimes you just need to slow things down. The intent of this container is to help monitor when servers are actually ready in a docker-compose environment. In my case, a test database had to be created before a service could connect to it.  Docker compose provides a dependencies stanza to try make sure required containers start up, but sometimes *ready* isn't really ready. Gatekeeper can help manage this situation.

# Instructions
Gatekeeper is a small docker container you can start up in your compose infrastructure to register and indicate ready status for other containers. The container is a small nodejs Restify server. The source contains some scripts that can be used as examples to manage server status.

1. Include jneyer/gatekeeper in your Docker compose.yml
2. Register your service for status.
3. Wait for a change in status in your dependent container.
4. Register ready state when the service is ready.

Scripts:
* register - register a service for status.
* ckready - check the service status on the gatekeeper.
* ready - send the ready status for the service.
* stop - send a remote control signal to stop the gatekeeper.

If you don't need gatekeeper to continue running, you can send it a stop signal to shut it down.

**For security purposes, this container is intended for local network access only.**
