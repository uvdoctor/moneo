/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
export const getUserInfo = /* GraphQL */ `
  query GetUserInfo($uname: String!) {
    getUserInfo(uname: $uname) {
      uname
      email
      im
      mob
      notify
      createdAt
      updatedAt
    }
  }
`;
export const listUserInfos = /* GraphQL */ `
  query ListUserInfos(
    $uname: String
    $filter: ModelUserInfoFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUserInfos(
      uname: $uname
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        uname
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
    $filter: ModelUserInfoFilterInput
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
        uname
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
    $filter: ModelUserInfoFilterInput
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
        uname
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
export const regByEmail = /* GraphQL */ `
  query RegByEmail(
    $email: String
    $sortDirection: ModelSortDirection
    $filter: ModelUserInfoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    regByEmail(
      email: $email
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        uname
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
export const getUniverse = /* GraphQL */ `
  query GetUniverse($id: String!) {
    getUniverse(id: $id) {
      id
      sid
      exchg
      createdAt
      updatedAt
    }
  }
`;
export const listUniverses = /* GraphQL */ `
  query ListUniverses(
    $id: String
    $filter: ModelUniverseFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUniverses(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        sid
        exchg
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
export const getInExchgPrice = /* GraphQL */ `
  query GetInExchgPrice($id: String!) {
    getINExchgPrice(id: $id) {
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
export const listInExchgPrices = /* GraphQL */ `
  query ListInExchgPrices(
    $id: String
    $filter: ModelINExchgPriceFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listINExchgPrices(
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
export const getInsMeta = /* GraphQL */ `
  query GetInsMeta($id: String!) {
    getInsMeta(id: $id) {
      id
      mcap
      ind
      createdAt
      updatedAt
    }
  }
`;
export const listInsMetas = /* GraphQL */ `
  query ListInsMetas(
    $id: String
    $filter: ModelInsMetaFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listInsMetas(
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
export const getAllIndices = /* GraphQL */ `
  query GetAllIndices($id: String!) {
    getAllIndices(id: $id) {
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
export const listAllIndicess = /* GraphQL */ `
  query ListAllIndicess(
    $id: String
    $filter: ModelAllIndicesFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listAllIndicess(
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
export const getInBondPrice = /* GraphQL */ `
  query GetInBondPrice($id: String!) {
    getINBondPrice(id: $id) {
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
export const listInBondPrices = /* GraphQL */ `
  query ListInBondPrices(
    $id: String
    $filter: ModelINBondPriceFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listINBondPrices(
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
export const getInmfPrice = /* GraphQL */ `
  query GetInmfPrice($id: String!) {
    getINMFPrice(id: $id) {
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
export const listInmfPrices = /* GraphQL */ `
  query ListInmfPrices(
    $id: String
    $filter: ModelINMFPriceFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listINMFPrices(
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
export const getNpsPrice = /* GraphQL */ `
  query GetNpsPrice($id: String!) {
    getNPSPrice(id: $id) {
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
export const listNpsPrices = /* GraphQL */ `
  query ListNpsPrices(
    $id: String
    $filter: ModelNPSPriceFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listNPSPrices(
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
      pf {
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
        pf {
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
