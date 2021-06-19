var animSpeed = 6

const easing = 0.05 * animSpeed
const boxSize = 30;
const treeHeightDist = 80;
const treeHeightOffset = 30;
const controlsHeight = document.getElementById("controlPanel").offsetHeight 



//COLORS

const YELLOW = [255, 242, 0]
const BASE_BLUE = [41, 89, 126]

function sleep(ms){
  return new Promise(resolve => setTimeout(resolve,ms));
}

class Edge {
  constructor(startnode, endnode){
    this.startnode = startnode
    this.endnode = endnode
  }
  draw() {
    stroke(255)
    line(this.startnode.x + boxSize/2, this.startnode.y + boxSize/2, 
      this.endnode.x + boxSize/2, this.endnode.y + boxSize/2)
  }


}

class Node {
  constructor(value) {
    this.value = value;
    this.children = [null, null]; // [null,null];
    // left child: children[0], right child: children[1] 
    this.traverse = "e";  //TEST
    this.x = null;
    this.y = null;
    this.color = BASE_BLUE;
  }
  draw() {
    stroke(28, 42, 53)
    fill(this.color[0], this.color[1], this.color[2])
    rect(this.x + boxSize/2, this.y + boxSize/2, boxSize, boxSize)
    noStroke()
    fill(255)
    text(this.value, this.x + boxSize/2, this.y + boxSize/2)
  }
  async movePos(newX, newY) {
    console.log("OLD X: " + this.x + ",Y: " + this.y)
    console.log("X: " + newX + ",Y: " + newY)
    for(let i = 0; i <= (150 / animSpeed); i++){
      this.x = this.x + (newX - this.x) * easing
      this.y = this.y + (newY - this.y) * easing
      await sleep(2)
    }
    
    this.x = newX
    this.y = newY
  }
}

class searchNode {
  constructor() {
    this.x = windowWidth/2
    this.y = -50
    this.image = search_icon_base
  }
  draw() {
    image(this.image, this.x, this.y, 50, 50);
  }

  async movePos(newX, newY) {
    // console.log("OLD X: " + this.x + ",Y: " + this.y)
    // console.log("X: " + newX + ",Y: " + newY)
    for(let i = 0; i <= 150; i++){
      this.x = this.x + (newX - this.x) * easing
      this.y = this.y + (newY - this.y) * easing
      await sleep(2)
    }
    
    this.x = newX
    this.y = newY
  }
}

//VARS FOR BINARY SEARCH TREE

class BinarySearchTree {
  constructor(value) {
    this.root = new Node(value);
    treeNodes.push(this.root)
  }

    /* insert */
  async insert(value) {
    
    console.log(this);
    // create node from value
    var node = new Node(value);
    treeNodes.push(node)
    // if the tree's root is null, set the root to the new node
    if (this.root == null || this.root.value == null || this.root.value === "e") {
        //console.log("Root is null");
        this.root = node;
    }
    var curHeight = 0 + treeHeightOffset;
    var curWidth = windowWidth;
    var current = this.root;
    node.x = curWidth/2
    node.y = -30

    console.log("+++++++++++++++++++")
    console.log("value:" + value)
    while (current) {
      curHeight += treeHeightDist
      curWidth /= 2

      // If tree contains value return
      if (current.value == value) {
        await node.movePos(windowWidth/2, -60);
        treeNodes.pop()
        return;
      }
      // value is less than current.value
      else if (value < current.value) {
        console.log("LEFT")
        
        if (current.children[0] == null || current.children[0].value == "e") {
          console.log("NASA LEFT")
          
          current.children[0] = node;
          var newEdge = new Edge(current, current.children[0])
          edges.push(newEdge)
          
          await node.movePos(current.x - curWidth/2, curHeight);
          return;
        }
        await node.movePos(current.x - curWidth/2, curHeight - 40);
        current = current.children[0];
      }
      // value is greater than current.value
      else {
        console.log("RIGHT")
        if (current.children[1] == null || current.children[1].value == "e") {
          current.children[1] = node;
          var newEdge = new Edge(current, current.children[1])
          edges.push(newEdge)
          

          await node.movePos(current.x + curWidth/2, curHeight);
          return;
          }
        await node.movePos(current.x + curWidth/2, curHeight - 40);
        current = current.children[1];
      }
    }
    
  }

  async search(data) 
  { 
    console.log("NANDITO")
    sNode.image = search_icon_base
    await this.searchNode(this.root, data);
    
  } 
  
  // Method to remove node with a  
  // given data 
  // it recur over the tree to find the 
  // data and removes it 


  async searchNode(node, key) 
  { 
    await sNode.movePos(node.x + boxSize/2, node.y + boxSize/2 + 50)
    console.log(node.value);    
    // if the root is null then tree is  
    // empty 
    // if(node === "null") 
    //     return null; 
  
    // if data to be delete is less than  
    // roots data then move to left subtree 
    if(key < node.value) 
    { 
      if(typeof(node.children[0]) == "undefined") {
        sNode.image = search_icon_notFound
        return;
      }
      this.searchNode(node.children[0], key); 
      return; 
    } 
  
    else if(key > node.value) 
    { 
      if(typeof(node.children[1]) == "undefined") {
        sNode.image = search_icon_notFound
        return;
      }
      this.searchNode(node.children[1], key); 
      return; 
    } 

    else
    { 
      sNode.image = search_icon_found
    }
  }

  findMinNode(node) 
  { 
    // if left of a node is null 
    // then it must be minimum node 
    if(node.children[0] == null){
      console.log("ITO YUNG MIN NODE");
      console.log(node);

      return node; 
    }
    else {
      console.log("DITO")

      return this.findMinNode(node.children[0]); 
    }
  } 

  async remove(data) 
  { 
    this.root = await this.removeNode(this.root, data, windowWidth/2, 0 + treeHeightOffset); 
    console.log(this);
    await this.adjustTree(this.root, windowWidth/4, 0 + treeHeightOffset, windowWidth/2);
  } 

  // Method to remove node with a  
  // given data 
  // it recur over the tree to find the 
  // data and removes it 
  async removeNode(node, key, curWidth, curHeight) 
  { 
    // if the root is null then tree is  
    // empty 
    console.log(curWidth)
    console.log(curHeight)
    if(typeof(node) == "undefined" || node == null) {
      return node; 
    }
  
    // if data to be delete is less than  
    // roots data then move to left subtree 
    if(key < node.value) 
    { 
      // if(typeof(node.children[0]) == "undefined") {
      //   return node;
      // }
      
      node.children[0] = await this.removeNode(node.children[0], key, node.x - curWidth/2, curHeight + treeHeightDist) 
      return node; 
    } 
  
    // if data to be delete is greater than  
    // roots data then move to right subtree 
    else if(key > node.value) 
    { 
      // if(typeof(node.children[1]) == "undefined") {
      //   return node;
      // }
      
      node.children[1] = await this.removeNode(node.children[1], key, node.x + curWidth/2, curHeight + treeHeightDist); 
      return node; 
    } 
  
    else
    { 
      console.log(node);

      if(node.children[0] == null && node.children[1] == null) 
      { 

        console.log("BOTH NULL");
        
        for(let [index, findNode] of treeNodes.entries()){
          if(findNode == node){
            treeNodes.splice(index, 1)
          }
        }

        for(let [index, edge] of edges.entries()){
          // if(node == edge.startnode){
          //   console.log(edge)
          //   edges.splice(index, 1)
          // }
          if(node == edge.endnode){
            console.log(edge)
            edges.splice(index, 1)
          }
        }
        node = null
        return node; 
      } 

      //deleting node with one children 
      else if(node.children[0] == null) 
      { 
        console.log("LEFT CHILD YUNG NULL");
        
        // FOR VISUALIZER
        for(let [index, findNode] of treeNodes.entries()){
          if(findNode == node){
            treeNodes.splice(index, 1)
          }
        }

        for(let [index, edge] of edges.entries()){
          if(node == edge.startnode){
            console.log(edge)
            edges.splice(index, 1)
          }
          if(node == edge.endnode){
            console.log(edge)
            edge.endnode = node.children[1];
          }
        }
        
        //var temp = node
        node = node.children[1]; 
        console.log(this.root)
        //temp = null;

        return node; 
      } 
        
      else if(node.children[1] == null) 
      { 
        console.log("RIGHT CHILD YUNG NULL");

        // FOR VISUALIZER
        for(let [index, findNode] of treeNodes.entries()){
          if(findNode == node){
            treeNodes.splice(index, 1)
          }
        }

        for(let [index, edge] of edges.entries()){
          if(node == edge.startnode){
            console.log(edge)
            edges.splice(index, 1)
          }
          if(node == edge.endnode){
            console.log(edge)
            edge.endnode = node.children[0];
          }
        }

        node = node.children[0]; 

        return node; 
      } 
      console.log("MAY 2 CHILDREN")
      // Deleting node with two children 
      // minumum node of the rigt subtree 
      // is stored in aux 
      var aux = this.findMinNode(node.children[1]); 
      var delX = node.x
      var delY = node.y

      

      await aux.movePos(delX, delY);

      for(let [index, edge] of edges.entries()){
        if(aux == edge.startnode){
          console.log(edge)
          edges.splice(index, 1)
        }
        if(aux == edge.endnode){
          console.log(edge)
          edge.endnode = node.children[1];
        }
      }

      for(let [index, findNode] of treeNodes.entries()){
        if(findNode == aux){
          console.log("FOUNDED")
          treeNodes.splice(index, 1)
        }
      }
      
      // console.log(aux);
      // delPrevNode.children[delPrevDir] = aux;
      // console.log(delPrevNode.children[delPrevDir]);
      // console.log(delPrevNode);
      
      //node = aux;

      console.log(aux.value)
      node.value = aux.value; 
      node.children[1] = await this.removeNode(node.children[1], aux.value, 0, 0); 

      
      console.log(node)
      
      return node; 
    } 
  }

  async adjustTree(root, curWidth, curHeight, prevX){
    console.log(root)
    if (root != null) {
      await root.movePos(prevX, curHeight)
      console.log(root.value);
      console.log(curWidth + curWidth/2)
  
      await this.adjustTree(root.children[0], curWidth/2, curHeight + treeHeightDist, prevX - curWidth);
  
      await this.adjustTree(root.children[1], curWidth/2, curHeight + treeHeightDist, prevX + curWidth);
    }
  }
  
  inOrder() {
    curTraversal = []
    this.inOrderHelper(this.root);
    //console.log(curTraversal);

  }

  inOrderHelper(root) {
    
    if (root != null) {
      this.inOrderHelper(root.children[0]);

      console.log(root.value);
      curTraversal.push(root);

      if(prevNode == null){
        prevNode = root;
      }
      else {
        prevNode = root;
      }

      this.inOrderHelper(root.children[1]);
    }
  }
}



function handleInsert() { 
  //stringValue = this.value()
  //document.getElementById("myText").value = "Johnny Bravo";
  let element = document.getElementById("functionElement").value
  tree.insert(parseInt(element))
}

function handleSearch() { 
  //stringValue = this.value()
  //document.getElementById("myText").value = "Johnny Bravo";
  let element = document.getElementById("functionElement").value
  tree.search(parseInt(element))
}

function handleRemove() { 
  //stringValue = this.value()
  //document.getElementById("myText").value = "Johnny Bravo";
  let element = document.getElementById("functionElement").value
  tree.remove(parseInt(element))
}

function handleInorder() { 
  tree.inOrder();
  console.log(tree)
}

var prevNode = null
var curTraversal = []
var treeNodes = []
var edges = []
var sNode;

var search_icon_base, search_icon_notFound, search_icon_found;
function preload() {
  search_icon_base = loadImage('assets/search_1.png');
  search_icon_notFound = loadImage('assets/search_2.png');
  search_icon_found = loadImage('assets/search_3.png');
}

async function setup() {
  //createCanvas(400, 400);
  let cnv = createCanvas(windowWidth, windowHeight - controlsHeight);
  cnv.parent("sketchHolder");
  console.log(cnv)

  console.log(windowWidth)

  sNode = new searchNode()
  tree = new BinarySearchTree(25)
  tree.root.x = windowWidth/2
  tree.root.y = treeHeightOffset

  rectMode(CENTER)
  textAlign(CENTER, CENTER)
  imageMode(CENTER);

  await tree.insert(12);
  await tree.insert(7);
  await tree.insert(20);
  await tree.insert(50);
  await tree.insert(75);
  await tree.insert(62);
  await tree.insert(100);
  await tree.insert(125);
  await tree.insert(82);
  
  tree.inOrder()
  console.log(edges)
}

function draw() {
  background(28, 42, 53);
  for(edge of edges){
    edge.draw()
  }
  for(node of treeNodes){
    node.draw()
  }
  sNode.draw()
}

function mousePressed() {
  console.log(mouseX, mouseY);
  //tree.inOrder();
}



