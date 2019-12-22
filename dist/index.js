"use strict";

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _apolloServerExpress = require("apollo-server-express");

var _v = _interopRequireDefault(require("uuid/v4"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }

function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  type Query {\n    me: User\n    user(id: ID!): User\n    users: [User!]\n\n    message(id: ID!): Message!\n    messages: [Message!]!\n\n    onlineUsers: [User!]!\n  }\n\n  type User {\n    id: ID!\n    username: String!\n    messages: [Message!]\n  }\n\n  type Message {\n    id: ID!\n    text: String!\n    user: User!\n  }\n\n  type Mutation {\n    createMessage(text: String!): Message!\n    deleteMessage(id: ID!): Boolean!\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _users = {
  1: {
    id: "1",
    username: "Jascha Heifetz",
    messageIds: [1]
  },
  2: {
    id: "2",
    username: "David Oistrakh",
    messageIds: [2]
  }
};
var _messages = {
  1: {
    id: "1",
    text: "Hello, world!",
    userId: "1"
  },
  2: {
    id: "2",
    text: "Bye world!",
    userId: "2"
  }
};
var onlineUsers = {
  1: {
    id: "1",
    username: "A"
  },
  2: {
    id: "2",
    username: "B"
  },
  3: {
    id: "3",
    username: "C"
  }
};
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
    me: function me(parent, args, _ref) {
      var _me = _ref.me;
      return _me;
    },
    user: function user(parent, _ref2) {
      var id = _ref2.id;
      return _users[id];
    },
    users: function users() {
      return Object.values(_users);
    },
    message: function message(parent, _ref3) {
      var id = _ref3.id;
      return _messages[id];
    },
    messages: function messages() {
      return Object.values(_messages);
    },
    onlineUsers: function onlineUsers(parent, args, _ref4) {
      var _onlineUsers = _ref4.onlineUsers;
      return Object.values(_onlineUsers);
    }
  },
  Message: {
    user: function user(message) {
      return _users[message.userId];
    }
  },
  User: {
    messages: function messages(user) {
      return Object.values(_messages).filter(function (m) {
        return m.userId === user.id;
      });
    }
  },
  Mutation: {
    createMessage: function createMessage(parent, _ref5, _ref6) {
      var text = _ref5.text;
      var me = _ref6.me;
      var id = (0, _v["default"])();
      var message = {
        id: id,
        text: text,
        userId: me.id
      };
      _messages[id] = message;

      _users[me.id].messageIds.push(id);

      return message;
    },
    deleteMessage: function deleteMessage(parent, _ref7) {
      var id = _ref7.id;

      // Destructoring to find message by id from the messages object.
      var _messages2 = _messages,
          message = _messages2[id],
          otherMessages = _objectWithoutProperties(_messages2, [id].map(_toPropertyKey));

      if (!message) {
        return false;
      }

      _messages = otherMessages;
      return true;
    }
  }
};
var server = new _apolloServerExpress.ApolloServer({
  typeDefs: schema,
  resolvers: resolvers,
  context: {
    me: _users[1],
    onlineUsers: onlineUsers
  }
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