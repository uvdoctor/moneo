/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getGoal = /* GraphQL */ `
  query GetGoal($id: ID!) {
    getGoal(id: $id) {
      id
      sy
      ey
      btr
      str
      tdr
      tdl
      name
      type
      ccy
      cp
      chg
      tgts {
        month
        year
        val
        curr
        fx
        met
        prob
      }
      emi {
        per
        rate
        dur
        ry
      }
      imp
      ra
      met
      prob
      manual
      amper
      amsy
      dr
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listGoals = /* GraphQL */ `
  query ListGoals(
    $filter: ModelGoalFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGoals(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        sy
        ey
        btr
        str
        tdr
        tdl
        name
        type
        ccy
        cp
        chg
        tgts {
          month
          year
          val
          curr
          fx
          met
          prob
        }
        emi {
          per
          rate
          dur
          ry
        }
        imp
        ra
        met
        prob
        manual
        amper
        amsy
        dr
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
export const getMilestone = /* GraphQL */ `
  query GetMilestone($id: ID!) {
    getMilestone(id: $id) {
      id
      tgt {
        month
        year
        val
        curr
        fx
        met
        prob
      }
      attr
      goals {
        id
        sy
        ey
        btr
        str
        tdr
        tdl
        name
        type
        ccy
        cp
        chg
        tgts {
          month
          year
          val
          curr
          fx
          met
          prob
        }
        emi {
          per
          rate
          dur
          ry
        }
        imp
        ra
        met
        prob
        manual
        amper
        amsy
        dr
        createdAt
        updatedAt
        owner
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listMilestones = /* GraphQL */ `
  query ListMilestones(
    $filter: ModelMilestoneFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMilestones(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        tgt {
          month
          year
          val
          curr
          fx
          met
          prob
        }
        attr
        goals {
          id
          sy
          ey
          btr
          str
          tdr
          tdl
          name
          type
          ccy
          cp
          chg
          imp
          ra
          met
          prob
          manual
          amper
          amsy
          dr
          createdAt
          updatedAt
          owner
        }
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
export const getProfile = /* GraphQL */ `
  query GetProfile($id: ID!) {
    getProfile(id: $id) {
      id
      citizen
      tr
      itr
      cgtr
      curr
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listProfiles = /* GraphQL */ `
  query ListProfiles(
    $filter: ModelProfileFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProfiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        citizen
        tr
        itr
        cgtr
        curr
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
