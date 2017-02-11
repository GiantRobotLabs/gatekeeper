var restify = require('restify');

const serverPort = 8080;
const serverName = "Gatekeeper"
const defaultStatus = "unknown";
const readyStatus = "ready";

var services = {};
var server = restify.createServer({ name: serverName });

// Get all status records
function getAll(req, res, next) {
  res.send(services);
  return next();
};

// Get one status record
function getOne(req, res, next) {

  if (services[req.params.name] == null) {
    return next(new restify.NotFoundError("Service [" + req.params.name + "] is not registered."));
  }

  var response = {};
  response[req.params.name] = services[req.params.name];
  res.send(response);
  return next();
};

// Generate the status response for the resource
// Get the status
// 503 error = not ready
// 404 error = not registered
// 200 = success
function status(req, res, next) {

  if (services[req.params.name] == defaultStatus) {
    return next(new restify.ServiceUnavailableError("Service [" + req.params.name + "] is not ready yet."));
  }

  if (services[req.params.name] == null) {
    return next(new restify.NotFoundError("Service [" + req.params.name + "] is not registered."));
  }

  getOne(req, res, next);
};

// Register a service for status tracking
function register(req, res, next) {
  services[req.params.name] = defaultStatus;
  getOne(req, res, next);
};

// Switch the status from defult to ready
function updateStatus(req, res, next) {
  if (services[req.params.name] == defaultStatus) {
    services[req.params.name] = readyStatus;
  }
  getOne(req, res, next);
};

// Send control to the server
// quit - exit the server
function sendControl(req, res, next) {
  if (req.params.name == "quit") {
    res.send("Stopping server");
    next();
    process.exit(1);
  }
  return next(new restify.NotImplementedError("Operation [" + req.params.name + "] is not supported."));
};

// Usage documentation
function showUsage(req, res, next) {

  var usage = {
    "Supported operations": {
      "GET": {
        "/": "Show usage.",
        "/services": "Get all registered services.",
        "/services/\{service\}": "Get the service status record.",
        "/services/\{service\}/status": "Return the HTTP response for the status."
      },
      "PUT": {
        "/services/\{service\}/ready": "Set the ready status for a service.",
        "/controls/\{control\}": "Send a server control. quit = Exit server."
      },
      "POST": {
        "/services/\{service\}": "Register a service to track status."
      },
      "Responses": {
        "GET /services/\{service\}": {
          "200": "Service registered.",
          "400": "Service not registered."
        },
        "GET /services/\{service\}/status": {
          "200": "Service ready",
          "503": "Service not ready.",
          "404": "Service not registered."
        },
        "PUT /controls/\{control\}": {
          "200": "Success",
          "501": "Control operation not implemented."
        }
      }
    }
  };

  res.send(usage);
  return next();
}

// Return all registered services
server.get('/services', getAll);

// Return the status record
server.get('/services/:name', getOne);

// Return the status response
server.get('/services/:name/status', status);

// Register service for status
server.post('/services/:name', register);

// Set status
server.put('/services/:name/ready', updateStatus);

// Send server control
server.put('/controls/:name', sendControl);

// Return server instructions
server.get('/', showUsage);

server.listen(serverPort, function () {
  console.log('%s listening on port %s', server.name, serverPort);
});
