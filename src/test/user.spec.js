import { expect } from "chai";

import * as userApi from "./api";

describe("user", () => {
  describe("user(id: String!): User", () => {
    it("return a user when user can be found", async () => {
      const expectedResult = {
        data: {
          user: {
            id: "1",
            username: "admin",
            email: "hello@robin.com",
            role: "ADMIN"
          }
        }
      };

      const result = await userApi.user({ id: "1" });

      expect(result.data).to.eql(expectedResult);
    });

    it("return null when user cannot be found", async () => {
      const expectedResult = {
        data: {
          user: null
        }
      };

      const result = await userApi.user({ id: "1000" });

      expect(result.data).to.eql(expectedResult);
    });
  });

  describe("deleteUser(id: String!): Boolean!", () => {
    it("return an error because only admin role can delete a user", async () => {
      const {
        data: {
          data: {
            signIn: { token }
          }
        }
      } = await userApi.signIn({
        login: "guess",
        password: "321321"
      });

      const {
        data: { errors }
      } = await userApi.deleteUser({ id: "1" }, token);

      expect(errors[0].message).to.eql("Not authorized as admin.");
    });
  });
});
