var animSpeed = 3
p5.disableFriendlyErrors = true; // disables FES

const easing = 0.05 * animSpeed
const boxSize = 30;

const treeHeightOffset = 30;
const controlsHeight = document.getElementById("controlPanel").offsetHeight 

var treeWidthDist = -40;
var treeWidthOffset = 0;
var treeHeightDist = 80;

//COLORS

const YELLOW = [255, 242, 0]
const BASE_BLUE = [41, 89, 126]
const LIGHT_YELLOW = [171, 176, 62]

function sleep(ms){
  return new Promise(resolve => setTimeout(resolve,ms));
}

class Arrow {

  constructor(start, end){
    this.start = start
    this.end = end
    this.endx = start.x
    this.endy = start.y
    this.endxFin = end.x
    this.endyFin = end.y
    this.offsetY = boxSize/2
    this.drawArrow()
  }

  draw(){
    //this.endx = this.endx + (this.endxFin - this.endx) * easing
    //this.endy = this.endy + (this.endyFin - this.endy) * easing
    stroke(YELLOW)
    fill(YELLOW)
    strokeWeight(3);
    line(this.start.x, this.start.y + this.offsetY, this.endx, this.endy + this.offsetY)
    push() //start new drawing state
    var offset = 8
    var angle = atan2(this.start.y - this.endy, this.start.x - this.endx);
    translate((this.start.x + this.endx)/2, (this.start.y + this.endy)/2 + this.offsetY);
    rotate(angle-HALF_PI); //rotates the arrow point
    triangle(-offset*0.5, offset, offset*0.5, offset, 0, -offset/2); //draws the arrow point as a triangle
    pop();
  }
  async drawArrow() {

    for(let i = 0; i <= (150 / animSpeed); i++){
      this.endx = this.endx + (this.endxFin - this.endx) * easing
      this.endy = this.endy + (this.endyFin - this.endy) * easing
      await sleep(2)
    }
    
    this.endx = this.endxFin
    this.endy = this.endyFin
  }
}

class Edge {
  constructor(startnode, endnode){
    this.startnode = startnode
    this.endnode = endnode
  }
  draw() {
    stroke(255)
    strokeWeight(1);
    line(this.startnode.x, this.startnode.y + boxSize/2, 
      this.endnode.x, this.endnode.y + boxSize/2)
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
    strokeWeight(1)
    stroke(28, 42, 53)
    fill(this.color[0], this.color[1], this.color[2])
    rect(this.x, this.y + boxSize/2, boxSize, boxSize)
    noStroke()
    fill(255)
    text(this.value, this.x, this.y + boxSize/2)
  }
  async movePos(newX, newY) {
    // console.log("OLD X: " + this.x + ",Y: " + this.y)
    // console.log("X: " + newX + ",Y: " + newY)
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
    this.y = -70
    this.image = search_icon_base
  }
  draw() {
    image(this.image, this.x, this.y, 40, 40);
  }

  async movePos(newX, newY) {
    // console.log("OLD X: " + this.x + ",Y: " + this.y)
    // console.log("X: " + newX + ",Y: " + newY)
    for(let i = 0; i <= (150 / animSpeed); i++){
      this.x = this.x + (newX - this.x) * easing
      this.y = this.y + (newY - this.y) * easing
      await sleep(2)
    }
    
    this.x = newX
    this.y = newY
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
    
  }

    /* insert */
  async insert(value) {
    this.visReset()
    // console.log(this);
    // create node from value
    var node = new Node(value);
    treeNodes.push(node)
    

    var curHeight = 0 + treeHeightOffset;
    var curWidth = treeWidthDist;
    var current = this.root;
    node.x = curWidth/2
    node.y = -30

    // if the tree's root is null, set the root to the new node
    if (this.root == null) {
      // console.log("Root is null");
      this.root = node;
      await node.movePos(curWidth/2, curHeight);
      return
    }

    // console.log("+++++++++++++++++++")
    // console.log("value:" + value)
    while (current) {
      curHeight += treeHeightDist
      curWidth /= 2
      // console.log(treeHeightDist)
      // console.log(curHeight)

      // If tree contains value return
      if (current.value == value) {
        await node.movePos(treeWidthDist/2, -60);
        treeNodes.pop()
        return;
      }
      // value is less than current.value
      else if (value < current.value) {
        // console.log("LEFT")
        
        if (current.children[0] == null || current.children[0].value == "e") {
          // console.log("NASA LEFT")
          
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
        // console.log("RIGHT")
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
    this.visReset()
    // console.log("NANDITO")
    sNode.image = search_icon_base
    await this.searchNode(this.root, data);
  } 
  
  // Method to remove node with a  
  // given data 
  // it recur over the tree to find the 
  // data and removes it 


  async searchNode(node, key) 
  { 
    // if the root is null then tree is  
    // empty 
    if(node == null) {
      sNode.image = search_icon_notFound
      await sleep(2000)
      sNode.movePos(windowWidth/2, -60);
      return null; 
    }

    await sNode.movePos(node.x, node.y + boxSize/2 + 40)
    // console.log(node.value);    
  
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
      await sleep(2000)
      sNode.movePos(windowWidth/2, -60);
    }
  }

  findMinNode(node) 
  { 
    // if left of a node is null 
    // then it must be minimum node 
    if(node.children[0] == null){
      // console.log("ITO YUNG MIN NODE");
      // console.log(node);

      return node; 
    }
    else {
      // console.log("DITO")

      return this.findMinNode(node.children[0]); 
    }
  } 

  async remove(data) 
  { 
    this.visReset()
    this.root = await this.removeNode(this.root, data, treeWidthDist/2, 0 + treeHeightOffset); 
    
    var temp = await this.adjustTree(this.root, treeWidthDist/4, 0 + treeHeightOffset, treeWidthDist/2);
    // console.log("DONE");
    return 
  } 

  // Method to remove node with a  
  // given data 
  // it recur over the tree to find the 
  // data and removes it 
  async removeNode(node, key, curWidth, curHeight) 
  { 
    // if the root is null then tree is  
    // empty 
    // console.log(curWidth)
    // console.log(curHeight)
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
      // console.log(node);

      if(node.children[0] == null && node.children[1] == null) 
      { 

        // console.log("BOTH NULL");
        
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
            // console.log(edge)
            edges.splice(index, 1)
          }
        }
        node = null
        return node; 
      } 

      //deleting node with one children 
      else if(node.children[0] == null) 
      { 
        // console.log("LEFT CHILD YUNG NULL");
        
        // FOR VISUALIZER
        for(let [index, findNode] of treeNodes.entries()){
          if(findNode == node){
            treeNodes.splice(index, 1)
          }
        }

        for(let [index, edge] of edges.entries()){
          if(node == edge.startnode){
            // console.log(edge)
            edges.splice(index, 1)
          }
          if(node == edge.endnode){
            // console.log(edge)
            edge.endnode = node.children[1];
          }
        }
        
        //var temp = node
        node = node.children[1]; 
        // console.log(this.root)
        //temp = null;

        return node; 
      } 
        
      else if(node.children[1] == null) 
      { 
        // console.log("RIGHT CHILD YUNG NULL");

        // FOR VISUALIZER
        for(let [index, findNode] of treeNodes.entries()){
          if(findNode == node){
            treeNodes.splice(index, 1)
          }
        }

        for(let [index, edge] of edges.entries()){
          if(node == edge.startnode){
            // console.log(edge)
            edges.splice(index, 1)
          }
          if(node == edge.endnode){
            // console.log(edge)
            edge.endnode = node.children[0];
          }
        }

        node = node.children[0]; 

        return node; 
      } 
      // console.log("MAY 2 CHILDREN")
      // Deleting node with two children 
      // minumum node of the rigt subtree 
      // is stored in aux 
      var aux = this.findMinNode(node.children[1]); 
      var delX = node.x
      var delY = node.y

      

      await aux.movePos(delX, delY);

      for(let [index, edge] of edges.entries()){
        if(aux == edge.startnode){
          // console.log(edge)
          edges.splice(index, 1)
        }
        if(aux == edge.endnode){
          // console.log(edge)
          edge.endnode = node.children[1];
        }
      }

      for(let [index, findNode] of treeNodes.entries()){
        if(findNode == aux){
          // console.log("FOUNDED")
          treeNodes.splice(index, 1)
        }
      }
      
      // console.log(aux);
      // delPrevNode.children[delPrevDir] = aux;
      // console.log(delPrevNode.children[delPrevDir]);
      // console.log(delPrevNode);
      
      //node = aux;

      // console.log(aux.value)
      node.value = aux.value; 
      node.children[1] = await this.removeNode(node.children[1], aux.value, 0, 0); 

      
      // console.log(node)
      
      return node; 
    } 
  }

  async adjustTree(root, curWidth, curHeight, prevX){
    this.visReset()
    // console.log(curHeight)
    if (root != null) {
      root.movePos(prevX + treeWidthOffset, curHeight)
      // console.log(root.value);
      // console.log(curWidth + curWidth/2)
  
      this.adjustTree(root.children[0], curWidth/2, curHeight + treeHeightDist, prevX - curWidth);
  
      this.adjustTree(root.children[1], curWidth/2, curHeight + treeHeightDist, prevX + curWidth);
    }
  }
  
  async inOrder() {
    this.visReset()
    sNode.image = traversal_icon
    prevArrow = sNode
    tempArrow = null
    await this.inOrderHelper(this.root);
    await this.traversalFinal()
  }

  async preOrder() {
    this.visReset()
    sNode.image = traversal_icon
    prevArrow = sNode
    tempArrow = null
    await this.preOrderHelper(this.root);
    await this.traversalFinal()
  }

  async postOrder() {
    this.visReset()
    sNode.image = traversal_icon
    prevArrow = sNode
    tempArrow = null
    await this.postOrderHelper(this.root);
    await this.traversalFinal()
  }

  async traversalFinal() {
    prevNode.color = BASE_BLUE;
    sNode.movePos(windowWidth/2, -60);
  }


  async inOrderHelper(root) {
    
    if (root != null) {
      await sNode.movePos(root.x, root.y + boxSize/2 + 40)

      await this.inOrderHelper(root.children[0]);
      await sNode.movePos(root.x, root.y + boxSize/2 + 40)

      if(tempArrow == null){
        tempArrow = root
        root.color = LIGHT_YELLOW;
      }
      else {
        arrows.push(new Arrow(tempArrow, root));
        tempArrow.color = BASE_BLUE;
        
        tempArrow = root;
        root.color = LIGHT_YELLOW;
      }
      
      // console.log(root.value);


      if(prevNode == null){
        prevNode = root;
      }
      else {
        prevNode = root;
      }

      await this.inOrderHelper(root.children[1]);
      await sNode.movePos(root.x, root.y + boxSize/2 + 40)
    }
  }

  async preOrderHelper(root) {
    
    if (root != null) {
      await sNode.movePos(root.x, root.y + boxSize/2 + 40)

      if(tempArrow == null){
        tempArrow = root
        root.color = LIGHT_YELLOW;
      }
      else {
        arrows.push(new Arrow(tempArrow, root));
        tempArrow.color = BASE_BLUE;
        
        tempArrow = root;
        root.color = LIGHT_YELLOW;
      }
      
      // console.log(root.value);


      if(prevNode == null){
        prevNode = root;
      }
      else {
        prevNode = root;
      }

      await this.preOrderHelper(root.children[0]);
      await sNode.movePos(root.x, root.y + boxSize/2 + 40)

      await this.preOrderHelper(root.children[1]);
      await sNode.movePos(root.x, root.y + boxSize/2 + 40)
    }
  }

  async postOrderHelper(root) {
    if (root != null) {
      await sNode.movePos(root.x, root.y + boxSize/2 + 40)
      await this.postOrderHelper(root.children[0]);
      await sNode.movePos(root.x, root.y + boxSize/2 + 40)

      await this.postOrderHelper(root.children[1]);

      await sNode.movePos(root.x, root.y + boxSize/2 + 40)

      if(tempArrow == null){
        tempArrow = root
        root.color = LIGHT_YELLOW;
      }
      else {
        arrows.push(new Arrow(tempArrow, root));
        tempArrow.color = BASE_BLUE;
        
        tempArrow = root;
        root.color = LIGHT_YELLOW;
      }
      
      // console.log(root.value);


      if(prevNode == null){
        prevNode = root;
      }
      else {
        prevNode = root;
      }
    }
  }

  visReset() {
    arrows = []
  }
}

//DOM VARIABLES
var buttonControls = document.getElementsByClassName("buttonControls");

//GENERAL FUNCTIONS

function disableButtonControls() {
  for(button of buttonControls){
    button.disabled = true
  }
}

function enableButtonControls() {
  for(button of buttonControls){
    button.disabled = false
  }
  statusText = "Standby"
}



//BUTTON FUNCTIONS
function handleAdj() { 
  // console.log(tree.root)
  // console.log("PUNTA KA DITO POTEK")
  treeHeightDist = parseInt(document.getElementById("heightDistAdj").value)
  treeWidthDist = windowWidth + (-1 * parseInt(document.getElementById("widthDistAdj").value))
  // console.log(document.getElementById("heightDistAdj").value)
  // console.log(treeWidthDist/4)
  tree.adjustTree(tree.root, treeWidthDist/4, 0 + treeHeightOffset, treeWidthDist/2);
}

async function handleInsert() { 

  disableButtonControls()

  let element = document.getElementById("functionElement").value
  if(isNaN(element) || element == "" || element == null) {
    enableButtonControls()
    return
  }
  statusText = "Running: Insert(" + parseInt(element) + ")"
  await tree.insert(parseInt(element))

  enableButtonControls()
}

async function handleSearch() { 

  disableButtonControls()
  let element = document.getElementById("functionElement").value
  if(isNaN(element) || element == "" || element == null) {
    enableButtonControls()
    return
  }
  statusText = "Running: Search(" + parseInt(element) + ")"
  tree.search(parseInt(element))

  enableButtonControls()
}

async function handleRemove() { 

  disableButtonControls()
  
  let element = document.getElementById("functionElement").value
  // console.log(element == "")
  if(isNaN(element)){
    enableButtonControls()
    return
  }
  
  if(element == "" || element == null) {
    await tree.remove(tree.root)
    statusText = "Running: Remove tree.root"
    enableButtonControls()
    return
  }
  statusText = "Running: Remove(" + parseInt(element) + ")"
  tree.remove(parseInt(element))
  enableButtonControls()
}

async function handleInorder() { 
  if(tree.root != null) {
    disableButtonControls()
    statusText = "Running: Inorder Traversal"
    await tree.inOrder()
    enableButtonControls()
  }
}

async function handlePreorder() { 
  if(tree.root != null) {
    disableButtonControls()
    statusText = "Running: Preorder Traversal"
    await tree.preOrder()
    enableButtonControls()
  }
}

async function handlePostorder() { 
  if(tree.root != null) {
    disableButtonControls()
    statusText = "Running: Postorder Traversal"
    await tree.postOrder()
    enableButtonControls()
  }
}

document.getElementById("animSlider").innerHTML = document.getElementById("myRange").value
animSpeed = document.getElementById("myRange").value

function handleSliderAnimChange() {
  output = document.getElementById("myRange").value
  //document.getElementById("animSlider").innerHTML = output * 50
  document.getElementById("animSlider").innerHTML = output
  animSpeed = output
  //var output = 
  //output.innerHTML = slider.value; // Display the default slider value
}

async function handleLoadExample() {
  disableButtonControls()
  statusText = "Load Example: Insert -> (25,20,36,10,22,30,40,28,5,12,38,48)"
  await tree.insert(25);
  await tree.insert(20);
  await tree.insert(36);
  await tree.insert(10);
  await tree.insert(22);
  await tree.insert(30);
  await tree.insert(40);
  await tree.insert(28);
  await tree.insert(5);
  await tree.insert(12);
  await tree.insert(38);
  await tree.insert(48);
  enableButtonControls()
}

//GENERAL VARIABLES
var prevNode = null
var curTraversal = []
var treeNodes = []
var edges = []
var arrows = []
var sNode;
var prevArrow, tempArrow;
var statusText = "Standby"

//IMAGE VARIABLES
var search_icon_base, search_icon_notFound, search_icon_found, traversal_icon;

function preload() {
  search_icon_base = loadImage('assets/search_1.png');
  search_icon_notFound = loadImage('assets/search_2.png');
  search_icon_found = loadImage('assets/search_3.png');
  traversal_icon = loadImage('assets/traverse_1.png');

}

async function setup() {
  //createCanvas(400, 400);
  let cnv = createCanvas(windowWidth, windowHeight - controlsHeight);
  cnv.parent("sketchHolder");
  // console.log(cnv)
  
  treeWidthDist += windowWidth
  // console.log(treeWidthDist)

  sNode = new searchNode()
  tree = new BinarySearchTree()
  // tree.root.x = windowWidth/2
  // tree.root.y = treeHeightOffset

  rectMode(CENTER)
  textAlign(CENTER, CENTER)
  imageMode(CENTER);
  pixelDensity(1);

  // textFont(fontRegular)
  
  // await tree.insert(12);
  // await tree.insert(7);
  // await tree.insert(20);
  // await tree.insert(50);
  // await tree.insert(15);
  // await tree.insert(1);
  // await tree.insert(10);
  
  // console.log(edges)
}

function draw() {
  background(28, 42, 53);
  textAlign(CENTER, CENTER)
  for(edge of edges){
    edge.draw()
  }
  
  for(arrow of arrows){
    arrow.draw()
  }

  for(node of treeNodes){
    node.draw()
  }
  sNode.draw()
  
  fill(255)
  textAlign(LEFT, TOP)
  text(statusText, 10, 10)
}

function mousePressed() {
  // console.log(mouseX, mouseY);
  
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  pixelDensity(1);
}