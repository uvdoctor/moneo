module.exports = {
  mutation: {
    CreateInExchg: `
  mutation CreateInExchg(
    $input: CreateINExchgInput!
    $condition: ModelINExchgConditionInput
  ) {
    createINExchg(input: $input, condition: $condition) {
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
    UpdateInExchg: `
  mutation UpdateInExchg(
    $input: UpdateINExchgInput!
    $condition: ModelINExchgConditionInput
  ) {
    updateINExchg(input: $input, condition: $condition) {
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
    DeleteInExchg: `
  mutation DeleteInExchg(
    $input: DeleteINExchgInput!
    $condition: ModelINExchgConditionInput
  ) {
    deleteINExchg(input: $input, condition: $condition) {
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
    ListInExchgs: `
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
`,
  },
};
