/**
 * Builds connected graph groups from valid directed edges.
 * Grouping is based on undirected connectivity; group edges remain directed.
 *
 * @param {string[]} validEdges - Valid edge list in "A->B" format.
 * @returns {{ nodes: Set<string>, edges: { parent: string, child: string }[] }[]}
 * Connected components with node and directed-edge collections.
 */
function buildGroups(validEdges) {
  const adjacency = new Map();
  const directedEdges = [];

  for (const edge of validEdges) {
    const [parent, child] = edge.split('->');
    directedEdges.push({ parent, child });

    if (!adjacency.has(parent)) {
      adjacency.set(parent, new Set());
    }
    if (!adjacency.has(child)) {
      adjacency.set(child, new Set());
    }

    adjacency.get(parent).add(child);
    adjacency.get(child).add(parent);
  }

  const visited = new Set();
  const groups = [];

  for (const startNode of adjacency.keys()) {
    if (visited.has(startNode)) {
      continue;
    }

    const queue = [startNode];
    const nodes = new Set([startNode]);
    visited.add(startNode);

    while (queue.length > 0) {
      const current = queue.shift();
      for (const neighbor of adjacency.get(current)) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          nodes.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    const edges = directedEdges.filter(
      (edgeObj) => nodes.has(edgeObj.parent) && nodes.has(edgeObj.child)
    );

    groups.push({ nodes, edges });
  }

  return groups;
}

module.exports = {
  buildGroups,
};
