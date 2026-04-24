/**
 * Detects whether a graph group contains a cycle.
 * Uses first-parent-wins assignment to mirror hierarchy construction semantics.
 *
 * @param {{ nodes: Set<string>, edges: { parent: string, child: string }[] }} group - Group to analyze.
 * @returns {boolean} True when a cycle is present; otherwise false.
 */
function hasCycle(group) {
  const childToParent = new Map();
  const childrenByParent = new Map();

  for (const node of group.nodes) {
    childrenByParent.set(node, []);
  }

  for (const edge of group.edges) {
    if (childToParent.has(edge.child)) {
      continue;
    }

    childToParent.set(edge.child, edge.parent);
    childrenByParent.get(edge.parent).push(edge.child);
  }

  const sortedNodes = Array.from(group.nodes).sort();
  const visited = new Set();
  const recursionStack = new Set();

  function visit(node) {
    if (recursionStack.has(node)) {
      return true;
    }
    if (visited.has(node)) {
      return false;
    }

    visited.add(node);
    recursionStack.add(node);

    for (const child of childrenByParent.get(node) || []) {
      if (visit(child)) {
        return true;
      }
    }

    recursionStack.delete(node);
    return false;
  }

  for (const node of sortedNodes) {
    if (!visited.has(node) && visit(node)) {
      return true;
    }
  }

  return false;
}

module.exports = {
  hasCycle,
};
