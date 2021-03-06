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

const house = new BTNode(25, null, null);
house.insert(100)
house.insert(10)
house.insert(15)
house.insert(25)
house.insert(12)
house.insert(25)

class Q {
  constructor() {
    this.data = [];
  }
  enQ(v) {
    if (v) this.data.push(v);
  }
  deQ() {
    if (this.notMt()) return this.data.shift();
    throw new Error('Cannot deQ from an empty Q');
  }
  notMt() {
    return !!this.data.length;
  }
}

module.exports = {
  house,
  Q
}
