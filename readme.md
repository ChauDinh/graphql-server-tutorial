# Database models, schemas, and entities in postgresql

- Database schema: a database schema is close to the implementation and tells the databases how an entity looks like in a database table, whereas every instance of an entity represented by a table row.

Example: The schema (./src/models/user.js) defines fileds (eg. username) and relationships (eg. a user has messages) of an entity (User). Each field represented a column in database. Basically, the schema is the blueprint for an entity.

- Database model: a database model is more abstract perspective on the schema. If offers developers the conceptual framework on what models are available and how to use models as interfaces to connect a database. Often models are implemented by ORMs.

- Database entity: A database entity is an actual instance of a stored item in the database created by database schema. Each entity uses a row in table whereas each fields of the entity is defined by a column.

- Additional methods: We can also add methods on our models. For example:

```js
const user = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    username: {
      type: DataTypes.STRING,
      unique: true
    }
  });

  User.associate = models => {
    User.hasMany(models.Message);
  };

  User.findByLogin = async login => {
    let user = await User.findOne({ where: { username: login } });
    if (!user) {
      user = await User.findOne({ where: { email: login } });
    }

    return user;
  };
};
```

The message model looks like similar. You can check both in the paths `./src/models/user.js` and `./src/models/message.js`.

# Connecting Resolvers and Database

What we will cover?

- Use the new models in GraphQL resolvers
- Seed your database with data when the application start
- Add a user model method for retrieving a user by username
- Learn essentials about psql command line.

# Setting Headers for graphql playground
