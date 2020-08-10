import React from 'react';
import { render, cleanup } from "@testing-library/react";
import Index from '../src/pages/index';

afterEach(cleanup)

describe("IndexPage", () => {
    describe("when index page loaded", () => {
      it("has login button", async () => {
        const container = await render(<Index />);
        expect(container).toMatchSnapshot()
      });
    });
  });