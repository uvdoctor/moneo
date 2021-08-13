module.exports = {
    mutation: {
    createEodPrices : `
    "mutation CreateEodPrices(
      $input: CreateEODPricesInput!
      $condition: ModelEODPricesConditionInput) {
    createEODPrices(input: $input, condition: $condition) {
      id
      price
      name
      createdAt
      updatedAt
    }
  }`,
    updateEodPrices : `
    mutation UpdateEodPrices(
      $input: UpdateEODPricesInput!
      $condition: ModelEODPricesConditionInput) {
    updateEODPrices(input: $input, condition: $condition) {
      id
      price
      name
      createdAt
      updatedAt
    }
  }`,
    deleteEodPrices : `
    mutation DeleteEodPrices(
      $input: DeleteEODPricesInput!
      $condition: ModelEODPricesConditionInput) {
    deleteEODPrices(input: $input, condition: $condition) {
      id
      price
      name
      createdAt
      updatedAt
    }
  }`
}
}