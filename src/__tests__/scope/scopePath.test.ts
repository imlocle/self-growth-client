import { buildScopePrefix, scopedPath } from "@scope/scopePath";

describe("buildScopePrefix", () => {
  it("builds a correct prefix from household and subject IDs", () => {
    expect(buildScopePrefix("hh-1", "sub-2")).toBe(
      "/households/hh-1/subjects/sub-2"
    );
  });

  it("URL-encodes special characters in IDs", () => {
    const result = buildScopePrefix("hh 1", "sub/2");
    expect(result).toBe("/households/hh%201/subjects/sub%2F2");
  });
});

describe("scopedPath", () => {
  it("appends a relative path with leading slash", () => {
    expect(scopedPath("hh-1", "sub-2", "/todos")).toBe(
      "/households/hh-1/subjects/sub-2/todos"
    );
  });

  it("adds a leading slash when missing", () => {
    expect(scopedPath("hh-1", "sub-2", "habits")).toBe(
      "/households/hh-1/subjects/sub-2/habits"
    );
  });

  it("handles nested resource paths", () => {
    expect(scopedPath("hh-1", "sub-2", "/habits/habit-99")).toBe(
      "/households/hh-1/subjects/sub-2/habits/habit-99"
    );
  });
});
