import { findBestMove } from "./App";

describe("findBestMove", () => {
  test("finds an immediate winning move for X", () => {
    expect(findBestMove(["X", "X", null, "O", "O", null, null, null, null], "X")).toBe(2);
  });

  test("blocks an immediate win for O", () => {
    expect(findBestMove(["X", "X", null, "O", null, null, null, null, null], "O")).toBe(2);
  });

  test("chooses a move that guarantees at least a draw from an empty board", () => {
    const board = Array(9).fill(null);

    expect(findBestMove(board, "X")).not.toBe(-1);
    expect(board).toEqual(Array(9).fill(null));
  });

  test("returns -1 when the board has no empty cells", () => {
    expect(findBestMove(["X", "O", "X", "X", "O", "O", "O", "X", "X"], "X")).toBe(-1);
  });

  test("rejects a player other than X or O", () => {
    expect(() => findBestMove(Array(9).fill(null), "Y")).toThrow(
      'player must be either "X" or "O"',
    );
  });
});
