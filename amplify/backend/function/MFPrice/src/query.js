module.exports = {
  mutation: {
    CreateInmf: `
  mutation CreateInmf(
    $input: CreateINMFInput!
    $condition: ModelINMFConditionInput
  ) {
    createINMF(input: $input, condition: $condition) {
      id
      sid
      tid
      name
      type
      subt
      nav
      mftype
      mcap
      tf
      createdAt
      updatedAt
    }
  }
`,
    UpdateInmf: `
  mutation UpdateInmf(
  $input: UpdateINMFInput!
  $condition: ModelINMFConditionInput
    ) {
  updateINMF(input: $input, condition: $condition) {
    id
    sid
    tid
    name
    type
    subt
    nav
    mftype
    mcap
    tf
    createdAt
    updatedAt
  }
}
`,
    DeleteInmf: `
  mutation DeleteInmf(
    $input: DeleteINMFInput!
    $condition: ModelINMFConditionInput
  ) {
    deleteINMF(input: $input, condition: $condition) {
      id
      sid
      tid
      name
      type
      subt
      nav
      mftype
      mcap
      tf
      createdAt
      updatedAt
    }
  }
`,
  },
};
