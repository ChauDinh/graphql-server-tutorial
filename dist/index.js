"use strict";

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _apolloServerExpress = require("apollo-server-express");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  type Query {\n    me: User\n    user(id: ID!): User\n    users: [User!]\n  }\n\n  type User {\n    id: ID!\n    username: String!\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _users = {
  1: {
    id: "1",
    username: "Jascha Heifetz"
  },
  2: {
    id: "2",
    username: "David Oistrakh"
  }
};
var _me = _users[1];
var app = (0, _express["default"])();
app.use((0, _cors["default"])());
/**
 * GraphQL Schema provides to the Apollo server all data for reading and writing via graphql.
 * The schema consists type definitions
 */

var schema = (0, _apolloServerExpress.gql)(_templateObject());
/**
 * Resolvers are used to return data for fields from the schema.
 * Resolver is a function that resolves data for graphql fields in the schema.
 */

var resolvers = {
  Query: {
    me: function me() {
      return _me;
    },
    user: function user(parent, _ref) {
      var id = _ref.id;
      return _users[id];
    },
    users: function users() {
      return Object.values(_users);
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