const { hasCycle } = require('./cycleDetector');

/**
 * Calculates maximum depth of a hierarchy tree object.
 * The tree is expected in nested object form like { A: { B: { C: {} } } }.
 *
 * @param {Record<string, Record<string, unknown>>} tree - Hierarchy tree object.
 * @returns {number} Maximum depth where a single root node has depth 1.
 */
function calculateDepth(tree) {
  const roots = Object.values(tree || {});

  function depthFromSubtree(subtree) {
    const children = Object.values(subtree || {});
    if (children.length === 0) {
      return 1;
    }

    let maxChildDepth = 0;
    for (const child of children) {
      maxChildDepth = Math.max(maxChildDepth, depthFromSubtree(child));
    }

    return 1 + maxChildDepth;
  }

  if (roots.length === 0) {
    return 0;
  }

  let maxDepth = 0;
  for (const rootSubtree of roots) {
    maxDepth = Math.max(maxDepth, depthFromSubtree(rootSubtree));
  }

  return maxDepth;
}

/**
 * Builds hierarchy metadata for a graph group.
 * Returns an empty tree with has_cycle when the group forms a cycle.
 *
 * @param {{ nodes: Set<string>, edges: { parent: string, child: string }[] }} group - Group to convert.
 * @returns {{ root: string, tree: Record<string, unknown>, has_cycle: true } | { root: string, tree: Record<string, unknown>, depth: number }}
 * Hierarchy object containing either cycle marker or depth for valid trees.
 */
function buildHierarchy(group) {
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

  const rootCandidates = [];
  for (const node of group.nodes) {
    if (!childToParent.has(node)) {
      rootCandidates.push(node);
    }
  }

  rootCandidates.sort();
  const sortedNodes = Array.from(group.nodes).sort();
  const root = rootCandidates.length > 0 ? rootCandidates[0] : sortedNodes[0];

  if (hasCycle(group)) {
    return {
      root,
      tree: {},
      has_cycle: true,
    };
  }

  function buildNodeSubtree(node) {
    const subtree = {};
    for (const child of childrenByParent.get(node) || []) {
      subtree[child] = buildNodeSubtree(child);
    }
    return subtree;
  }

  const tree = {
    [root]: buildNodeSubtree(root),
  };

  return {
    root,
    tree,
    depth: calculateDepth(tree),
  };
}

module.exports = {
  buildHierarchy,
  calculateDepth,
};
