module.exports = {
  mutation: {
    CreateInExchange: `
  mutation CreateInExchange(
    $input: CreateINExchangeInput!
    $condition: ModelINExchangeConditionInput
  ) {
    createINExchange(input: $input, condition: $condition) {
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
`,
    UpdateInExchange: `
  mutation UpdateInExchange(
    $input: UpdateINExchangeInput!
    $condition: ModelINExchangeConditionInput
  ) {
    updateINExchange(input: $input, condition: $condition) {
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
`,
    DeleteInExchange: `
  mutation DeleteInExchange(
    $input: DeleteINExchangeInput!
    $condition: ModelINExchangeConditionInput
  ) {
    deleteINExchange(input: $input, condition: $condition) {
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
`,
    CreateInBond: `
  mutation CreateInBond(
    $input: CreateINBondInput!
    $condition: ModelINBondConditionInput
  ) {
    createINBond(input: $input, condition: $condition) {
      id
      sid
      tid
      name
      subt
      price
      sm
      sy
      mm
      my
      rate
      fr
      tf
      fv
      cr
      createdAt
      updatedAt
    }
  }
`,
    UpdateInBond: `
  mutation UpdateInBond(
    $input: UpdateINBondInput!
    $condition: ModelINBondConditionInput
  ) {
    updateINBond(input: $input, condition: $condition) {
      id
      sid
      tid
      name
      subt
      price
      sm
      sy
      mm
      my
      rate
      fr
      tf
      fv
      cr
      createdAt
      updatedAt
    }
  }
`,
    DeleteInBond: `
  mutation DeleteInBond(
    $input: DeleteINBondInput!
    $condition: ModelINBondConditionInput
  ) {
    deleteINBond(input: $input, condition: $condition) {
      id
      sid
      tid
      name
      subt
      price
      sm
      sy
      mm
      my
      rate
      fr
      tf
      fv
      cr
      createdAt
      updatedAt
    }
  }
`,
    ListInExchanges: `
  query ListInExchanges(
    $id: String
    $filter: ModelINExchangeFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listINExchanges(
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
`,
    ListInBonds: `
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
        tid
        name
        subt
        price
        sm
        sy
        mm
        my
        rate
        fr
        tf
        fv
        cr
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`,
  },
};
