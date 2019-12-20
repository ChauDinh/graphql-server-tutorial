"use strict";

var _express = _interopRequireDefault(require("express"));

var _apolloServerExpress = require("apollo-server-express");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  type Query {\n    me: User\n  }\n\n  type User {\n    username: String!\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var app = (0, _express["default"])();
var schema = (0, _apolloServerExpress.gql)(_templateObject());
var resolvers = {
  Query: {
    me: function me() {
      return {
        username: "Chau Dinh"
      };
    }
  }
};
var server = new _apolloServerExpress.ApolloServer({
  typeDefs: schema,
  resolvers: resolvers
});
server.applyMiddleware({
  app: app,
  path: "/graphql"
});
app.listen({
  port: 8000
}, function () {
  return console.log("The Apollo server is listening on http://localhost:8000/graphql");
});