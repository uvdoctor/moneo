module.exports = {
  // The root of your source code, typically /src
  // `<rootDir>` is a token Jest substitutes
  roots: ["<rootDir>/src", "<rootDir>/__tests__"],

  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],

  // Jest transformations -- this adds support for TypeScript
  // using ts-jest
  preset: "ts-jest",
  // transform: {
  //   '^.+\\.tsx?$': 'babel-jest',
  // },
  transform: {
    "^.+\\.(ts|tsx|js|tsx)?$": "ts-jest",
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
  },

  moduleNameMapper: {
    "\\.(css|less|scss|sss|styl)$": "<rootDir>/node_modules/jest-css-modules",
  },

  // Runs special logic, such as cleaning up components
  // when using React Testing Library and adds special
  // extended assertions to Jest
  // setupFilesAfterEnv: [
  //   "@testing-library/jest-dom/extend-expect"
  // ],

  // Test spec file resolution pattern
  // Matches parent folder `__tests__` and filename
  // should contain `test`.
  testRegex: "(/AccountTab.test.js?$)",
  // Module file extensions for importing
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  globals: {
    // we must specify a custom tsconfig for tests because we need the typescript transform
    // to transform jsx into js rather than leaving it jsx such as the next build requires.  you
    // can see this setting in tsconfig.jest.json -> "jsx": "react"
    "ts-jest": {
      tsconfig: "tsconfig.jest.json",
    },
  },

  // collectCoverage: true,

  // coverageReporters: ["html"],

  // collectCoverageFrom: [
  //   "**/src/components/**",
  //   "!**/node_modules/**"
  // ]
};
