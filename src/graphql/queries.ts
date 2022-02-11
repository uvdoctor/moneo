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
      uname
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
        uname
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
      pp {
        cash
        ltdep
        mtb
        imtb
        hyb
        ihyb
        teb
        reit
        ireit
        reitETF
        ireitETF
        re
        gold
        goldb
        lcs
        lcetf
        ilcs
        ilcetf
        mscs
        imscs
        dgs
        uc
        crypto
        p2p
      }
      rp
      bt
      rc
      rcchg
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
        pp {
          cash
          ltdep
          mtb
          imtb
          hyb
          ihyb
          teb
          reit
          ireit
          reitETF
          ireitETF
          re
          gold
          goldb
          lcs
          lcetf
          ilcs
          ilcetf
          mscs
          imscs
          dgs
          uc
          crypto
          p2p
        }
        rp
        bt
        rc
        rcchg
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
      tax
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
        tax
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
      dob
      im
      mob
      notify
      tax
      rp
      dr
      tc
      le
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
        dob
        im
        mob
        notify
        tax
        rp
        dr
        tc
        le
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
        dob
        im
        mob
        notify
        tax
        rp
        dr
        tc
        le
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
        dob
        im
        mob
        notify
        tax
        rp
        dr
        tc
        le
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
        dob
        im
        mob
        notify
        tax
        rp
        dr
        tc
        le
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const regByDob = /* GraphQL */ `
  query RegByDob(
    $dob: AWSDate
    $sortDirection: ModelSortDirection
    $filter: ModelUserInfoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    regByDOB(
      dob: $dob
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        uname
        email
        dob
        im
        mob
        notify
        tax
        rp
        dr
        tc
        le
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getInsAnalytics = /* GraphQL */ `
  query GetInsAnalytics($id: String!) {
    getInsAnalytics(id: $id) {
      id
      analytics
      createdAt
      updatedAt
    }
  }
`;
export const listInsAnalyticss = /* GraphQL */ `
  query ListInsAnalyticss(
    $id: String
    $filter: ModelInsAnalyticsFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listInsAnalyticss(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        analytics
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
      whigh
      wlow
      split
      div
      splitd
      divdd
      divrd
      divpd
      beta
      mcap
      mcapt
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
        whigh
        wlow
        split
        div
        splitd
        divdd
        divrd
        divpd
        beta
        mcap
        mcapt
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
export const getInsBhs = /* GraphQL */ `
  query GetInsBhs($id: String!) {
    getInsBHS(id: $id) {
      id
      rec
      fun
      tech
      ca
      createdAt
      updatedAt
    }
  }
`;
export const listInsBhSs = /* GraphQL */ `
  query ListInsBhSs(
    $id: String
    $filter: ModelInsBHSFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listInsBHSs(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        rec
        fun
        tech
        ca
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getInsUni = /* GraphQL */ `
  query GetInsUni($id: String!) {
    getInsUni(id: $id) {
      id
      sid
      curr
      createdAt
      updatedAt
    }
  }
`;
export const listInsUnis = /* GraphQL */ `
  query ListInsUnis(
    $id: String
    $filter: ModelInsUniFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listInsUnis(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        sid
        curr
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
      type
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
        type
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
      dep {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
      }
      ltdep {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
      }
      p2p {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
      }
      loans {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
      }
      credit {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
      }
      savings {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
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
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
      }
      pm {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
      }
      pf {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
      }
      nps {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
      }
      crypto {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
      }
      ins {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
      }
      other {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
      }
      angel {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
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
        dep {
          id
          qty
          name
          fId
          curr
          chg
          chgF
          payF
          type
          subt
          sm
          sy
          em
          ey
          amt
        }
        ltdep {
          id
          qty
          name
          fId
          curr
          chg
          chgF
          payF
          type
          subt
          sm
          sy
          em
          ey
          amt
        }
        p2p {
          id
          qty
          name
          fId
          curr
          chg
          chgF
          payF
          type
          subt
          sm
          sy
          em
          ey
          amt
        }
        loans {
          id
          qty
          name
          fId
          curr
          chg
          chgF
          payF
          type
          subt
          sm
          sy
          em
          ey
          amt
        }
        credit {
          id
          qty
          name
          fId
          curr
          chg
          chgF
          payF
          type
          subt
          sm
          sy
          em
          ey
          amt
        }
        savings {
          id
          qty
          name
          fId
          curr
          chg
          chgF
          payF
          type
          subt
          sm
          sy
          em
          ey
          amt
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
          payF
          type
          subt
          sm
          sy
          em
          ey
          amt
        }
        pm {
          id
          qty
          name
          fId
          curr
          chg
          chgF
          payF
          type
          subt
          sm
          sy
          em
          ey
          amt
        }
        pf {
          id
          qty
          name
          fId
          curr
          chg
          chgF
          payF
          type
          subt
          sm
          sy
          em
          ey
          amt
        }
        nps {
          id
          qty
          name
          fId
          curr
          chg
          chgF
          payF
          type
          subt
          sm
          sy
          em
          ey
          amt
        }
        crypto {
          id
          qty
          name
          fId
          curr
          chg
          chgF
          payF
          type
          subt
          sm
          sy
          em
          ey
          amt
        }
        ins {
          id
          qty
          name
          fId
          curr
          chg
          chgF
          payF
          type
          subt
          sm
          sy
          em
          ey
          amt
        }
        other {
          id
          qty
          name
          fId
          curr
          chg
          chgF
          payF
          type
          subt
          sm
          sy
          em
          ey
          amt
        }
        angel {
          id
          qty
          name
          fId
          curr
          chg
          chgF
          payF
          type
          subt
          sm
          sy
          em
          ey
          amt
        }
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
export const getUserIns = /* GraphQL */ `
  query GetUserIns($uname: String!) {
    getUserIns(uname: $uname) {
      uname
      ins {
        id
        sid
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        fId
        curr
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listUserInss = /* GraphQL */ `
  query ListUserInss(
    $uname: String
    $filter: ModelUserInsFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUserInss(
      uname: $uname
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        uname
        ins {
          id
          sid
          qty
          fId
          curr
        }
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
export const getAa = /* GraphQL */ `
  query GetAa($uname: String!) {
    getAA(uname: $uname) {
      uname
      curr
      tgt
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listAAs = /* GraphQL */ `
  query ListAAs(
    $uname: String
    $filter: ModelAAFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listAAs(
      uname: $uname
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        uname
        curr
        tgt
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
