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
export const getRegMob = /* GraphQL */ `
  query GetRegMob($mob: Int!) {
    getRegMob(mob: $mob) {
      mob
      notify
      createdAt
      updatedAt
    }
  }
`;
export const listRegMobs = /* GraphQL */ `
  query ListRegMobs(
    $mob: Int
    $filter: ModelRegMobFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listRegMobs(
      mob: $mob
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        mob
        notify
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getRegEmail = /* GraphQL */ `
  query GetRegEmail($email: String!) {
    getRegEmail(email: $email) {
      email
      notify
      createdAt
      updatedAt
    }
  }
`;
export const listRegEmails = /* GraphQL */ `
  query ListRegEmails(
    $email: String
    $filter: ModelRegEmailFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listRegEmails(
      email: $email
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        email
        notify
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getFeeds = /* GraphQL */ `
  query GetFeeds($id: String!) {
    getFeeds(id: $id) {
      id
      tname
      exchg
      url
      count
      createdAt
      updatedAt
    }
  }
`;
export const listFeedss = /* GraphQL */ `
  query ListFeedss(
    $id: String
    $filter: ModelFeedsFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listFeedss(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        tname
        exchg
        url
        count
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
      meta {
        id
        mcap
        ind
        createdAt
        updatedAt
      }
      fv
      under
      yhigh
      ylow
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
        meta {
          id
          mcap
          ind
          createdAt
          updatedAt
        }
        fv
        under
        yhigh
        ylow
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getInExchgMeta = /* GraphQL */ `
  query GetInExchgMeta($id: String!) {
    getINExchgMeta(id: $id) {
      id
      mcap
      ind
      createdAt
      updatedAt
    }
  }
`;
export const listInExchgMetas = /* GraphQL */ `
  query ListInExchgMetas(
    $id: String
    $filter: ModelINExchgMetaFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listINExchgMetas(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        mcap
        ind
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getIndices = /* GraphQL */ `
  query GetIndices($id: String!) {
    getIndices(id: $id) {
      id
      name
      exchg
      price
      prev
      ylow
      yhigh
      pe
      pb
      type
      subt
      curr
      ind
      createdAt
      updatedAt
    }
  }
`;
export const listIndicess = /* GraphQL */ `
  query ListIndicess(
    $id: String
    $filter: ModelIndicesFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listIndicess(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        name
        exchg
        price
        prev
        ylow
        yhigh
        pe
        pb
        type
        subt
        curr
        ind
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
export const getNps = /* GraphQL */ `
  query GetNps($id: String!) {
    getNPS(id: $id) {
      id
      pfm
      st
      name
      type
      subt
      price
      createdAt
      updatedAt
    }
  }
`;
export const listNpSs = /* GraphQL */ `
  query ListNpSs(
    $id: String
    $filter: ModelNPSFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listNPSs(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        pfm
        st
        name
        type
        subt
        price
        createdAt
        updatedAt
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
          day
          month
          year
          qty
        }
        name
        fIds
        curr
        chg
        chgF
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
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fIds
        curr
        chg
        chgF
        type
        subt
      }
      property {
        type
        pin
        purchase {
          amt
          day
          month
          year
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
          day
          month
          year
          qty
        }
        name
        fIds
        curr
        chg
        chgF
        type
        subt
      }
      pm {
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fIds
        curr
        chg
        chgF
        type
        subt
      }
      ppf {
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fIds
        curr
        chg
        chgF
        type
        subt
      }
      epf {
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fIds
        curr
        chg
        chgF
        type
        subt
      }
      vpf {
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fIds
        curr
        chg
        chgF
        type
        subt
      }
      nps {
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fIds
        curr
        chg
        chgF
        type
        subt
      }
      crypto {
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fIds
        curr
        chg
        chgF
        type
        subt
      }
      ins {
        premium
        sy
        ey
        yearly
        fIds
        curr
      }
      other {
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fIds
        curr
        chg
        chgF
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
          chgF
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
          id
          qty
          name
          fIds
          curr
          chg
          chgF
          type
          subt
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
          chgF
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
          chgF
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
          chgF
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
          chgF
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
          chgF
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
          chgF
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
          chgF
          type
          subt
        }
        ins {
          premium
          sy
          ey
          yearly
          fIds
          curr
        }
        other {
          id
          qty
          name
          fIds
          curr
          chg
          chgF
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
