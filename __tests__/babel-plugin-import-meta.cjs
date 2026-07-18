module.exports = function ({ types: t }) {
  return {
    visitor: {
      MemberExpression(path) {
        if (path.node.object.type === "MetaProperty") {
          path.node.object = t.identifier("process")
        }
      },
    },
  }
}
