module.exports = {
  mutation: {
    BatchAddInstrument: `mutation BatchCreateInstrument(
      $input: CreateBatchInstruments
    ) {
      batchAddInstruments(input: $input) {
        id
        sid
        name
        exchg
        country
        curr
        type
        subt
        price
        prev
        sm
        sy
        mm
        my
        rate
        createdAt
        updatedAt
      }
    }`,
    CreateInstrument: `mutation CreateInstrument(
      $input: CreateInstrumentInput!
      $condition: ModelInstrumentConditionInput
    ) {
      createInstrument(input: $input, condition: $condition) {
        id
        sid
        name
        exchg
        country
        curr
        type
        subt
        price
        prev
        sm
        sy
        mm
        my
        rate
        createdAt
        updatedAt
      }
    }
  `,
  UpdateInstrument: `mutation UpdateInstrument(
    $input: UpdateInstrumentInput!
    $condition: ModelInstrumentConditionInput
  ) {
    updateInstrument(input: $input, condition: $condition) {
      id
      sid
      name
      exchg
      country
      curr
      type
      subt
      price
      prev
      sm
      sy
      mm
      my
      rate
      createdAt
      updatedAt
    }
  }
`,
ListInstruments: `query ListInstruments(
  $filter: ModelInstrumentFilterInput
  $nextToken: String
) {
  listInstruments(
    filter: $filter
    limit: 10000
    nextToken: $nextToken
  ) {
    items {
      id
      sid
      name
      exchg
      country
      curr
      type
      subt
      price
      prev
      sm
      sy
      mm
      my
      rate
      createdAt
      updatedAt
    }
    nextToken
    }
    }`
  }
};
