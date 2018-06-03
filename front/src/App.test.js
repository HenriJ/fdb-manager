import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

let dataset;

beforeEach(() => {
  global.fetch = jest.fn().mockImplementation(() => {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(dataset)
    });
  });
});

it("renders without crashing", () => {
  dataset = [];

  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
