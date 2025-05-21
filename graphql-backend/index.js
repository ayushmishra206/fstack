const { ApolloServer, gql } = require('apollo-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.JWT_SECRET;

// Sample data (password will be hashed below)
let users = [
  { id: '1', name: 'Ayush', email: 'ayush@example.com', password: 'password' },
];

// Type definitions
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    users: [User]
    me: User
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): User
    login(email: String!, password: String!): AuthPayload
    addUser(name: String!, email: String!): User
  }
`;

// Resolvers
const resolvers = {
  Query: {
    users: () => users.map(({ password, ...rest }) => rest),
    me: (_, __, { user }) => user || null,
  },
  Mutation: {
    register: async (_, { name, email, password }) => {
      if (users.find(u => u.email === email)) throw new Error('Email already exists');
      const hashed = await bcrypt.hash(password, 10);
      const newUser = { id: `${users.length + 1}`, name, email, password: hashed };
      users.push(newUser);
      const { password: _pw, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    },
    login: async (_, { email, password }) => {
      const user = users.find(u => u.email === email);
      if (!user) throw new Error('User not found');
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error('Invalid password');
      const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1d' });
      const { password: _pw2, ...userWithoutPassword } = user;
      return { token, user: userWithoutPassword };
    },
    addUser: (_, { name, email }) => {
      const newUser = { id: `${users.length + 1}`, name, email, password: '' };
      users.push(newUser);
      const { password, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    },
  },
};

// Context for authentication
const getUser = (token) => {
  try {
    if (token) {
      const decoded = jwt.verify(token.replace('Bearer ', ''), SECRET);
      const user = users.find(u => u.id === decoded.userId);
      if (user) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
    }
    return null;
  } catch {
    return null;
  }
};

(async () => {
  // Hash the initial user's password before starting the server
  users[0].password = await bcrypt.hash(users[0].password, 10);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization || '';
      const user = getUser(token);
      return { user };
    },
  });

  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
})();
