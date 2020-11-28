const connectColor = "rgb(70, 100, 255)"; // #0004BA rgba(238,84,57, 1) "rgba(0, 0, 240, 0.9)";
const backgroundColor = "rgb(255, 255, 255)";
const color = connectColor;

const canvasSize = 640;
const rows = 8;

const grid = canvasSize / rows;
const gridCenter = grid / 2;

// Grid offset has to be smaller than round
const gridOffset = 10; // grid offset > 10 starts to make problems :D
const shapeSize = grid - gridOffset;
console.log(shapeSize);
const shapeRound = 35;

const mistake = 1.08; // 1
const conectedObjectShape = 1.08; // 1

// Circle TODO: shapeRound
const lineHeight = pythagorean(shapeRound, shapeRound); //straight ? shapeSize : pythagorean(shapeRound, shapeRound);

const a = shapeRound + gridOffset;
const odvesna = pythagorean(a, a);
const objectWidth = odvesna / (lineHeight / 100) / 100;

// line weight
const connectingLineWidth = pythagorean(grid, grid) / (lineHeight / 100) / 100;
const centerPercentage = objectWidth / 2 - connectingLineWidth / 2;

let startCoordinates = null;

const container = document.getElementById("container");
const canvas = document.getElementById("svg");
canvas.style.fill = connectColor;
document.body.style.background = backgroundColor;

document
  .getElementsByTagName("body")[0]
  .style.setProperty("background", backgroundColor);
// canvas.setAttribute("fill", color);
// container.setAttribute("style", `background-color:${bgColor}`);

function pythagorean(sideA, sideB) {
  return Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2));
}

function snap(op) {
  // subtract offset (to center lines)
  // divide by grid to get row/column
  // round to snap to the closest one
  var cell = Math.round((op - gridCenter) / grid);
  // multiply back to grid scale
  // add offset to center

  const snaped = cell * grid + gridCenter;
  console.log(snaped);
  return snaped;
}

// END LINE SHAPES DEFS
const StartDefs = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "defs"
);

// StartDefs.innerHTML = `<marker id="startDefs" orient="auto" markerWidth="${objectWidth}" markerHeight="3" refX="-1.5" refY="0.5" fill='rgba(255, 0, 0, 0.5)'>
// <!-- triangle pointing right (+x) -->
// <path d="M0,0 V1 A 0.75 0.75, 0, 0, 1 ${objectWidth} ${objectWidth} V0 A 0.75 0.75, 0, 0, 1 0 0 Z"></path>
// </marker>`;

StartDefs.innerHTML = `<marker id="startDefs" orient="auto" markerWidth="${objectWidth}" markerHeight="3" refX="${centerPercentage}" refY="0.5" fill='${connectColor}'>
<!-- triangle pointing right (+x) -->
<path d="M0,0 V1 A 0.85 0.85, 0, 0, 1 ${objectWidth} 1 V0 A 0.85 0.85, 0, 0, 1 0 0  Z"></path>
</marker>`;

canvas.append(StartDefs);
//canvas.append(EndDefs);

const drowLine = (newCoordinates) => {
  if (startCoordinates === null) {
    startCoordinates = newCoordinates;
  } else {
    var newLine = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    const straight =
      startCoordinates[0] === newCoordinates[0] ||
      startCoordinates[1] === newCoordinates[1];

    console.log(startCoordinates[0] - newCoordinates[0]);

    const lineColor = straight ? connectColor : "";
    const lineMarker = straight ? "" : "url(#startDefs)";

    const strokeWidth = straight ? shapeSize : lineHeight;

    newLine.setAttribute("id", "line2");
    newLine.setAttribute("x1", startCoordinates[0]);
    newLine.setAttribute("y1", startCoordinates[1]);
    newLine.setAttribute("x2", newCoordinates[0]);
    newLine.setAttribute("y2", newCoordinates[1]);
    newLine.setAttribute("marker-start", lineMarker);
    newLine.setAttribute("stroke-width", strokeWidth);
    newLine.setAttribute("stroke", lineColor);

    canvas.append(newLine);

    startCoordinates = null;
  }
};

const drowPath = (cx, cy) => {
  const wall = shapeSize - shapeRound * 2;
  const startX = cx - (shapeSize / 2 - shapeRound);
  const startY = cy - shapeSize / 2;

  //const moveTo = `${[startX, startY}`;

  const corner1 = `a${shapeRound},${shapeRound} 0 0 1 ${shapeRound},${shapeRound}`;
  const corner2 = `a${shapeRound},${shapeRound} 0 0 1 -${shapeRound},${shapeRound}`;
  const corner3 = `a${shapeRound},${shapeRound} 0 0 1 -${shapeRound},-${shapeRound}`;
  const corner4 = `a${shapeRound},${shapeRound} 0 0 1 ${shapeRound},-${shapeRound}`;

  const d = `M${startX},${startY} h${wall} ${corner1} v${wall} ${corner2} h-${wall}  ${corner3} v-${wall} ${corner4} z`;

  var newPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  newPath.setAttribute("d", d);
  canvas.append(newPath);
};

container.addEventListener("click", (event) => {
  //console.log(event.layerX, event.layerY);
  //console.log(event.clientX - 255, event.clientY - 255);
  //console.log(event);
  const snapedX = snap(event.clientX - 320);
  const snapedY = snap(event.clientY - 55);

  drowPath(snapedX, snapedY);

  if (event.altKey) {
    drowLine([snapedX, snapedY]);
  }
});

//UI LAYER
function makeRows(rows, cols) {
  container.style.setProperty("--grid-rows", rows);
  container.style.setProperty("--grid-cols", cols);
  container.style.setProperty("width", canvasSize + "px");
  container.style.setProperty("height", canvasSize + "px");

  for (c = 0; c < rows * cols; c++) {
    let cell = document.createElement("div");
    cell.getClase;

    let ball = document.createElement("div");
    cell.appendChild(ball).className = "ball";

    // cell.addEventListener("click", (event) => {
    //   console.log(event.layerX, event.layerY);
    //   const snapedX = snap(event.layerX);
    //   const snapedY = snap(event.layerY);

    //   drowPath(snapedX, snapedY);

    //   if (event.altKey) {
    //     drowLine([snapedX, snapedY]);
    //   }
    // });

    container.appendChild(cell).className = "grid-cell";
  }
}

makeRows(rows, rows);
