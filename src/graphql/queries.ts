/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getGoal = /* GraphQL */ `
  query GetGoal($id: ID!) {
    getGoal(id: $id) {
      id
      sy
      sm
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
        num
        val
      }
      loan {
        type
        per
        rate
        dur
        ry
        pp {
          num
          val
        }
        ira {
          num
          val
        }
        emi
        pmi
        peper
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
        num
        val
      }
      pl {
        num
        val
      }
      ra
      rachg
      img
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
        sm
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
          num
          val
        }
        loan {
          type
          per
          rate
          dur
          ry
          emi
          pmi
          peper
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
          num
          val
        }
        pl {
          num
          val
        }
        ra
        rachg
        img
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
export const getFamily = /* GraphQL */ `
  query GetFamily($id: ID!) {
    getFamily(id: $id) {
      id
      tid
      name
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listFamilys = /* GraphQL */ `
  query ListFamilys(
    $filter: ModelFamilyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFamilys(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        tid
        name
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
export const getHoldings = /* GraphQL */ `
  query GetHoldings($id: ID!) {
    getHoldings(id: $id) {
      id
      instruments {
        id
        qty
        pur {
          amt
          date
          qty
        }
        name
        fIds
        curr
        chg
        type
        subt
      }
      deposits {
        amt
        sm
        sy
        months
        rate
        fIds
        curr
      }
      lendings {
        amt
        sm
        sy
        months
        rate
        fIds
        curr
      }
      loans {
        loan {
          type
          per
          rate
          dur
          ry
          emi
          pmi
          peper
        }
        fIds
        curr
      }
      savings {
        amt
        curr
        name
        fIds
      }
      property {
        type
        pin
        purchase {
          amt
          date
          qty
        }
        address
        fIds
        curr
        country
        own {
          fId
          per
        }
      }
      vehicles {
        id
        qty
        pur {
          amt
          date
          qty
        }
        name
        fIds
        curr
        chg
        type
        subt
      }
      pm {
        id
        qty
        pur {
          amt
          date
          qty
        }
        name
        fIds
        curr
        chg
        type
        subt
      }
      ppf {
        id
        qty
        pur {
          amt
          date
          qty
        }
        name
        fIds
        curr
        chg
        type
        subt
      }
      epf {
        id
        qty
        pur {
          amt
          date
          qty
        }
        name
        fIds
        curr
        chg
        type
        subt
      }
      vpf {
        id
        qty
        pur {
          amt
          date
          qty
        }
        name
        fIds
        curr
        chg
        type
        subt
      }
      nps {
        id
        qty
        pur {
          amt
          date
          qty
        }
        name
        fIds
        curr
        chg
        type
        subt
      }
      crypto {
        id
        qty
        pur {
          amt
          date
          qty
        }
        name
        fIds
        curr
        chg
        type
        subt
      }
      ins {
        premium
        years
        fIds
        curr
      }
      mem {
        id
        qty
        pur {
          amt
          date
          qty
        }
        name
        fIds
        curr
        chg
        type
        subt
      }
      angel {
        id
        qty
        pur {
          amt
          date
          qty
        }
        name
        fIds
        curr
        chg
        type
        subt
      }
      other {
        id
        qty
        pur {
          amt
          date
          qty
        }
        name
        fIds
        curr
        chg
        type
        subt
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listHoldingss = /* GraphQL */ `
  query ListHoldingss(
    $filter: ModelHoldingsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listHoldingss(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        instruments {
          id
          qty
          name
          fIds
          curr
          chg
          type
          subt
        }
        deposits {
          amt
          sm
          sy
          months
          rate
          fIds
          curr
        }
        lendings {
          amt
          sm
          sy
          months
          rate
          fIds
          curr
        }
        loans {
          fIds
          curr
        }
        savings {
          amt
          curr
          name
          fIds
        }
        property {
          type
          pin
          address
          fIds
          curr
          country
        }
        vehicles {
          id
          qty
          name
          fIds
          curr
          chg
          type
          subt
        }
        pm {
          id
          qty
          name
          fIds
          curr
          chg
          type
          subt
        }
        ppf {
          id
          qty
          name
          fIds
          curr
          chg
          type
          subt
        }
        epf {
          id
          qty
          name
          fIds
          curr
          chg
          type
          subt
        }
        vpf {
          id
          qty
          name
          fIds
          curr
          chg
          type
          subt
        }
        nps {
          id
          qty
          name
          fIds
          curr
          chg
          type
          subt
        }
        crypto {
          id
          qty
          name
          fIds
          curr
          chg
          type
          subt
        }
        ins {
          premium
          years
          fIds
          curr
        }
        mem {
          id
          qty
          name
          fIds
          curr
          chg
          type
          subt
        }
        angel {
          id
          qty
          name
          fIds
          curr
          chg
          type
          subt
        }
        other {
          id
          qty
          name
          fIds
          curr
          chg
          type
          subt
        }
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
export const getFeedback = /* GraphQL */ `
  query GetFeedback($id: ID!) {
    getFeedback(id: $id) {
      id
      type
      email
      name {
        fn
        ln
      }
      feedback
      createdAt
      updatedAt
    }
  }
`;
export const listFeedbacks = /* GraphQL */ `
  query ListFeedbacks(
    $filter: ModelFeedbackFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFeedbacks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        type
        email
        name {
          fn
          ln
        }
        feedback
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getRating = /* GraphQL */ `
  query GetRating($id: ID!) {
    getRating(id: $id) {
      id
      type
      rating
      feedbackId
      createdAt
      updatedAt
    }
  }
`;
export const listRatings = /* GraphQL */ `
  query ListRatings(
    $filter: ModelRatingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRatings(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        type
        rating
        feedbackId
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getRegistration = /* GraphQL */ `
  query GetRegistration($email: String!) {
    getRegistration(email: $email) {
      email
      status
      code
      country
      lat
      long
      createdAt
      updatedAt
    }
  }
`;
export const listRegistrations = /* GraphQL */ `
  query ListRegistrations(
    $email: String
    $filter: ModelRegistrationFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listRegistrations(
      email: $email
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        email
        status
        code
        country
        lat
        long
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getInExchg = /* GraphQL */ `
  query GetInExchg($id: String!) {
    getINExchg(id: $id) {
      id
      sid
      name
      exchg
      type
      subt
      itype
      price
      prev
      mcap
      createdAt
      updatedAt
    }
  }
`;
export const listInExchgs = /* GraphQL */ `
  query ListInExchgs(
    $id: String
    $filter: ModelINExchgFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listINExchgs(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        sid
        name
        exchg
        type
        subt
        itype
        price
        prev
        mcap
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getInBond = /* GraphQL */ `
  query GetInBond($id: String!) {
    getINBond(id: $id) {
      id
      sid
      name
      subt
      price
      exchg
      sm
      sy
      mm
      my
      rate
      fr
      tf
      fv
      cr
      crstr
      ytm
      createdAt
      updatedAt
    }
  }
`;
export const listInBonds = /* GraphQL */ `
  query ListInBonds(
    $id: String
    $filter: ModelINBondFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listINBonds(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        sid
        name
        subt
        price
        exchg
        sm
        sy
        mm
        my
        rate
        fr
        tf
        fv
        cr
        crstr
        ytm
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getInMutual = /* GraphQL */ `
  query GetInMutual($id: String!) {
    getINMutual(id: $id) {
      id
      sid
      tid
      dir
      name
      type
      subt
      price
      mftype
      mcap
      tf
      createdAt
      updatedAt
    }
  }
`;
export const listInMutuals = /* GraphQL */ `
  query ListInMutuals(
    $id: String
    $filter: ModelINMutualFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listINMutuals(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        sid
        tid
        dir
        name
        type
        subt
        price
        mftype
        mcap
        tf
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getEodPrices = /* GraphQL */ `
  query GetEodPrices($id: String!) {
    getEODPrices(id: $id) {
      id
      price
      name
      createdAt
      updatedAt
    }
  }
`;
export const listEodPricess = /* GraphQL */ `
  query ListEodPricess(
    $id: String
    $filter: ModelEODPricesFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listEODPricess(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        price
        name
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
