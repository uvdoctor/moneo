module.exports = {
  mutation: `mutation createInstrument(
        $input: CreateInstrumentInput!
      ) {
        createInstrument(input: $input) {
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
};
