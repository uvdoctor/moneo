module.exports = {
  mutation: {
    CreateInBond: `
  mutation CreateInBond(
    $input: CreateINBondInput!
    $condition: ModelINBondConditionInput
  ) {
    createINBond(input: $input, condition: $condition) {
      id
      sid
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
      crstr
      ytm
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
      crstr
      ytm
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
      crstr
      ytm
      createdAt
      updatedAt
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
          crstr
          ytm
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  `,
  },
};
