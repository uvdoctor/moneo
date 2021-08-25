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
  },
};
