import { findNode } from "./tree-utils";

it("can find node", () => {
  const tree = [
    { id: ["1"], name: "1", children: null },
    { id: ["_"], name: "_", children: [] },
    {
      id: ["a"],
      name: "a",
      children: [
        {
          id: ["a", "b"],
          name: "b",
          children: []
        },
        {
          id: ["a", "c"],
          name: "c",
          children: []
        }
      ]
    }
  ];

  expect(findNode([], tree)).toBeNull();
  expect(findNode(["a", "d"], tree)).toBeNull();

  expect(findNode(["a", "b"], tree).id).toEqual(["a", "b"]);
});
