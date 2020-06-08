# simple-condition-assignment-server
A simple server for assigning conditions in an experiment.

## What it does
For now, the server simply provides an endpoint for an HTTP GET request for any number of conditions. Two comma separated values are returned: the condition number, and the condition name.
The server, for now, does not track the identity of the user, therefore, subsequent requests from the same client may result in the same condition being returned.

Each assignment updates the condition count and the condition is returned.

Conditions are assigned by finding the condition with current smallest number of assignments. If there are more than one, one of the conditions is selected at random, among those with the smallest number of assignments. The value for the condition is returned and logged.

## Configuring
Simply edit config.js providing the appropriate details.

## Install and Run
 - Clone this repo
 - To install dependencies
 ``` npm install ```

 - To run the server in development mode using nodemon
 ```npm dev-start```

 - To run the server
 ``` npm start ```

## Testing
```
Use this wget command to test data access via get
```
wget http://127.0.0.1:9666/condition
```
## TODO
Add participant based tracking and other assignment logic. Think about security.
