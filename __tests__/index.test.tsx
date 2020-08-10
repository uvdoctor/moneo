import React from 'react';
import { render } from "@testing-library/react";
import Index from '../src/pages/index';

describe("IndexPage", () => {
    describe("when index page loaded", () => {
      it("has login button", async () => {
        const container = await render(<Index />);
        expect(container).toMatchSnapshot()
      });
    });
  });