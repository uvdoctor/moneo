module.exports = {
  mutation: {
    CreateEodPrices: `mutation CreateEodPrices(
      $input: CreateEODPricesInput!
      $condition: ModelEODPricesConditionInput
    ) {
      createEODPrices(input: $input, condition: $condition) {
        id
        price
        name
        createdAt
        updatedAt
      }
    }`,
    UpdateEodPrices: `mutation UpdateEodPrices(
      $input: UpdateEODPricesInput!
      $condition: ModelEODPricesConditionInput
    ) {
      updateEODPrices(input: $input, condition: $condition) {
        id
        price
        name
        createdAt
        updatedAt
      }
    }`,
    ListEodPricess: `query ListEodPricess(
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
  `
  }
}
