module.exports = {
  mutation: {
    CreateInstrument: `mutation CreateInstrument(
      $input: CreateInstrumentInput!
      $condition: ModelInstrumentConditionInput
    ) {
      createInstrument(input: $input, condition: $condition) {
        id
        sid
        tid
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
        mftype
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
      tid
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
      mftype
      createdAt
      updatedAt
    }
  }
`,
ListInstruments: `query ListInstruments(
  $filter: ModelInstrumentFilterInput
  $limit: Int
  $nextToken: String
) {
  listInstruments(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      sid
      tid
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
      mftype
      createdAt
      updatedAt
    }
    nextToken
    }
    }`
  }
};
