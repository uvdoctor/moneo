import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api-graphql";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";
import { API, graphqlOperation } from "aws-amplify";
import { RegByImQuery, RegByMobQuery, RegByEmailQuery, RegByTaxIdQuery } from "../api/goals";
import * as APIt from "../api/goals";

export const doesEmailExist = async (email: string, authMode?: string) => {
  let nextToken = null;
  try {
    do {
      let variables: any = { limit: 20000, email: email };
      if (nextToken) variables.nextToken = nextToken;
      const {
        data: { regByEmail },
      } = (await API.graphql({
        query: queries.regByEmail,
        variables: variables,
        authMode:
          authMode === "AWS_IAM"
            ? GRAPHQL_AUTH_MODE.AWS_IAM
            : GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
      })) as { data: RegByEmailQuery };
      if (regByEmail?.items?.length) return true;
      nextToken = regByEmail?.nextToken;
    } while (nextToken);
    return false;
  } catch (e) {
    console.log("Error while checking if email is unique: ", e);
  }
};

export const doesTaxIdExist = async (tid: string, authMode?: string) => {
  let nextToken = null;
  try {
    do {
      let variables: any = { limit: 20000, tid: tid };
      if (nextToken) variables.nextToken = nextToken;
      const {
        data: { regByTaxId },
      } = (await API.graphql({
        query: queries.regByTaxId,
        variables: variables,
        authMode:
          authMode === "AWS_IAM"
            ? GRAPHQL_AUTH_MODE.AWS_IAM
            : GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
      })) as { data: RegByTaxIdQuery };
      if (regByTaxId?.items?.length) return true;
      nextToken = regByTaxId?.nextToken;
    } while (nextToken);
    return false;
  } catch (e) {
    console.log("Error while checking if email is unique: ", e);
  }
};

export const doesMobExist = async (mob: Number, authMode?: string) => {
  let nextToken = null;
  try {
    do {
      let variables: any = { limit: 20000, mob: mob };
      if (nextToken) variables.nextToken = nextToken;
      const {
        data: { regByMob },
      } = (await API.graphql({
        query: queries.regByMob,
        variables: variables,
        authMode:
          authMode === "AWS_IAM"
            ? GRAPHQL_AUTH_MODE.AWS_IAM
            : GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
      })) as { data: RegByMobQuery };
      if (regByMob?.items?.length) return true;
      nextToken = regByMob?.nextToken;
    } while (nextToken);
    return false;
  } catch (e) {
    console.log("Error while checking if mobile number is unique: ", e);
  }
};

export const doesImExist = async (im: Number) => {
  let nextToken = null;
  try {
    do {
      let variables: any = { limit: 20000, im: im };
      if (nextToken) variables.nextToken = nextToken;
      const {
        data: { regByIM },
      } = (await API.graphql({
        query: queries.regByIm,
        variables: variables,
      })) as { data: RegByImQuery };
      if (regByIM?.items?.length) return true;
      nextToken = regByIM?.nextToken;
    } while (nextToken);
    return false;
  } catch (e) {
    console.log("Error while checking if whatsapp number is unique: ", e);
  }
};

export const updateUserDetails = async (input: APIt.UpdateUserInfoInput) => {
  try {
    const { data } =  (await API.graphql(
      graphqlOperation(mutations.updateUserInfo, { input: input })
    )) as {
      data: APIt.UpdateUserInfoMutation;
    };
    return data.updateUserInfo as APIt.UpdateUserInfoInput;
  } catch (e) {
    console.log("Error while updating table", e);
  }
};

export const deleteContact = async (uname: string) => {
  try {
    await API.graphql({
      query: mutations.deleteUserInfo,
      variables: { input: { uname } },
    });
  } catch (e) {
    console.log("Error while deleting contacts in table", e);
  }
};

export const createUserinfo = async (input: APIt.CreateUserInfoInput) => {
  try {
    const { data } = (await API.graphql({
      query: mutations.createUserInfo,
      variables: { input: input },
    })) as {
      data: APIt.CreateUserInfoInput;
    };
    return data;
  } catch (e) {
    console.log("Error while creating contacts in table", e);
    return null;
  }
};

export const getUserDetails = async (uname: string) => {
  const {
    data: { getUserInfo },
  } = (await API.graphql(
    graphqlOperation(queries.getUserInfo, { uname: uname })
  )) as {
    data: APIt.GetUserInfoQuery;
  };
  return getUserInfo ? getUserInfo : null;
};
