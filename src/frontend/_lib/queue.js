class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

export class Queue {
  constructor(item) {
    this.frontNode = null;
    this.rearNode = null;
    this.size = 0;

    if (item) {
      this.enqueue(item);
    }
  }

  enqueue(item) {
    const newNode = new Node(item);
    if (!this.frontNode) {
      this.frontNode = newNode;
      this.rearNode = newNode;
    } else {
      this.rearNode.next = newNode;
      this.rearNode = newNode;
    }
    this.size++;
  }

  dequeue() {
    if (!this.frontNode) {
      return null;
    }

    const frontValue = this.frontNode.value;
    this.frontNode = this.frontNode.next;
    this.size--;

    if (!this.frontNode) {
      this.rearNode = null;
    }

    return frontValue;
  }

  isEmpty() {
    return this.size === 0;
  }
}
