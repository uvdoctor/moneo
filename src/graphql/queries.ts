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
export const getContacts = /* GraphQL */ `
  query GetContacts($email: String!) {
    getContacts(email: $email) {
      email
      im
      mob
      notify
      createdAt
      updatedAt
    }
  }
`;
export const listContactss = /* GraphQL */ `
  query ListContactss(
    $email: String
    $filter: ModelContactsFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listContactss(
      email: $email
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        email
        im
        mob
        notify
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const regByIm = /* GraphQL */ `
  query RegByIm(
    $im: Float
    $sortDirection: ModelSortDirection
    $filter: ModelContactsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    regByIM(
      im: $im
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        email
        im
        mob
        notify
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const regByMob = /* GraphQL */ `
  query RegByMob(
    $mob: Float
    $sortDirection: ModelSortDirection
    $filter: ModelContactsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    regByMob(
      mob: $mob
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        email
        im
        mob
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
export const getUserHoldings = /* GraphQL */ `
  query GetUserHoldings($uname: String!) {
    getUserHoldings(uname: $uname) {
      uname
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
        fId
        curr
        chg
        chgF
        type
        subt
      }
      deposits {
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
        fId
        curr
        chg
        chgF
        type
        subt
      }
      lendings {
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
        fId
        curr
        chg
        chgF
        type
        subt
      }
      loans {
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
        fId
        curr
        chg
        chgF
        type
        subt
      }
      credit {
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
        fId
        curr
        chg
        chgF
        type
        subt
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
        fId
        curr
        chg
        chgF
        type
        subt
      }
      property {
        type
        name
        pin
        purchase {
          amt
          day
          month
          year
          qty
        }
        address
        curr
        city
        country
        state
        own {
          fId
          per
        }
        rate
        mv
        mvy
        mvm
        res
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
        fId
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
        fId
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
        fId
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
        fId
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
        fId
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
        fId
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
        fId
        curr
        chg
        chgF
        type
        subt
      }
      ins {
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
        fId
        curr
        chg
        chgF
        type
        subt
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
        fId
        curr
        chg
        chgF
        type
        subt
      }
      angel {
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
        fId
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
export const listUserHoldingss = /* GraphQL */ `
  query ListUserHoldingss(
    $uname: String
    $filter: ModelUserHoldingsFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUserHoldingss(
      uname: $uname
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        uname
        instruments {
          id
          qty
          name
          fId
          curr
          chg
          chgF
          type
          subt
        }
        deposits {
          id
          qty
          name
          fId
          curr
          chg
          chgF
          type
          subt
        }
        lendings {
          id
          qty
          name
          fId
          curr
          chg
          chgF
          type
          subt
        }
        loans {
          id
          qty
          name
          fId
          curr
          chg
          chgF
          type
          subt
        }
        credit {
          id
          qty
          name
          fId
          curr
          chg
          chgF
          type
          subt
        }
        savings {
          id
          qty
          name
          fId
          curr
          chg
          chgF
          type
          subt
        }
        property {
          type
          name
          pin
          address
          curr
          city
          country
          state
          rate
          mv
          mvy
          mvm
          res
        }
        vehicles {
          id
          qty
          name
          fId
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
          fId
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
          fId
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
          fId
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
          fId
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
          fId
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
          fId
          curr
          chg
          chgF
          type
          subt
        }
        ins {
          id
          qty
          name
          fId
          curr
          chg
          chgF
          type
          subt
        }
        other {
          id
          qty
          name
          fId
          curr
          chg
          chgF
          type
          subt
        }
        angel {
          id
          qty
          name
          fId
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
