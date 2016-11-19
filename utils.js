class BTNode {
  constructor(val, l, r) {
    this.val = val;
    this.l = l;
    this.r = r;
    this.lastDir = 'l'
  }

  nextDir() {
    this.lastDir = this.lastDir === 'l' ? 'r' : 'l';
    return this.lastDir;
  }

  insert(val) {
    let node = this;
    if (!node.l) node.l = new BTNode(val, null, null);
    else if (!node.r) node.r = new BTNode(val, null, null);
    else this[this.nextDir()].insert(val)
  }
}

const houses = new BTNode(5, null, null);
houses.insert(10)
houses.insert(1)
houses.insert(100)
houses.insert(3)
houses.insert(8)
houses.insert(5)

module.exports = { houses }
