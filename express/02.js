// Middleware
// function that has access to (req, res, next)

// it can 
// - modify the request and response objects
// - end the request-response cycle
// - call next() to move middleware

// structure

function myMiddleware(req, res, next){
    console.log('Middleware Triggered');
    next();
}