/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getGoal = /* GraphQL */ `
  query GetGoal($id: ID!) {
    getGoal(id: $id) {
      id
      sy
      ey
      by
      btr
      tdr
      tdl
      tbi
      tdli
      tbr
      name
      type
      ccy
      cp
      chg
      achg
      tgts {
        year
        val
      }
      emi {
        per
        rate
        dur
        ry
      }
      imp
      met
      prob
      manual
      amper
      amsy
      aiper
      aisy
      dr
      sa
      pg {
        year
        val
      }
      pl {
        year
        val
      }
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
        by
        btr
        tdr
        tdl
        tbi
        tdli
        tbr
        name
        type
        ccy
        cp
        chg
        achg
        tgts {
          year
          val
        }
        emi {
          per
          rate
          dur
          ry
        }
        imp
        met
        prob
        manual
        amper
        amsy
        aiper
        aisy
        dr
        sa
        pg {
          year
          val
        }
        pl {
          year
          val
        }
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
        year
        val
      }
      attr
      goals {
        id
        sy
        ey
        by
        btr
        tdr
        tdl
        tbi
        tdli
        tbr
        name
        type
        ccy
        cp
        chg
        achg
        tgts {
          year
          val
        }
        emi {
          per
          rate
          dur
          ry
        }
        imp
        met
        prob
        manual
        amper
        amsy
        aiper
        aisy
        dr
        sa
        pg {
          year
          val
        }
        pl {
          year
          val
        }
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
          year
          val
        }
        attr
        goals {
          id
          sy
          ey
          by
          btr
          tdr
          tdl
          tbi
          tdli
          tbr
          name
          type
          ccy
          cp
          chg
          achg
          imp
          met
          prob
          manual
          amper
          amsy
          aiper
          aisy
          dr
          sa
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
export const getItem = /* GraphQL */ `
  query GetItem($id: ID!) {
    getItem(id: $id) {
      id
      p_at
      p_id
      p_instid
      instname
      status
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listItems = /* GraphQL */ `
  query ListItems(
    $filter: ModelItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        p_at
        p_id
        p_instid
        instname
        status
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
export const getAccount = /* GraphQL */ `
  query GetAccount($id: ID!) {
    getAccount(id: $id) {
      id
      item {
        id
        p_at
        p_id
        p_instid
        instname
        status
        createdAt
        updatedAt
        owner
      }
      p_id
      name
      mask
      offname
      currbal
      availbal
      curr
      uncurr
      type
      subtype
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listAccounts = /* GraphQL */ `
  query ListAccounts(
    $filter: ModelAccountFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAccounts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        item {
          id
          p_at
          p_id
          p_instid
          instname
          status
          createdAt
          updatedAt
          owner
        }
        p_id
        name
        mask
        offname
        currbal
        availbal
        curr
        uncurr
        type
        subtype
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
