const color = "rgb(38, 56, 255)";
//const bgColor = "rgb(38, 56, 255)";

const grid = 80;
const gridOffset = grid / 2;
const shapeSize = grid - 6;
const shapeRound = shapeSize / 2;

const mistake = 1.1; // 1.08
const conectedObjectShape = 1.16; // 1.08

let startCoordinates = null;

const container = document.getElementById("container");
const containerSVG = document.getElementById("svg");
// containerSVG.setAttribute("fill", color);
// container.setAttribute("style", `background-color:${bgColor}`);

function pythagorean(sideA, sideB) {
  return Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2));
}

function snap(op) {
  // subtract offset (to center lines)
  // divide by grid to get row/column
  // round to snap to the closest one
  var cell = Math.round((op - gridOffset) / grid);
  // multiply back to grid scale
  // add offset to center
  return cell * grid + gridOffset;
}

// END LINE SHAPES DEFS
const StartDefs = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "defs"
);
StartDefs.innerHTML = `<marker id="startDefs" orient="auto" markerWidth="3" markerHeight="3" refX="-0.50" refY="0.5">
<!-- triangle pointing right (+x) -->
<path d="M0,0 V1 A 0.75 0.75, 0, 0, 1 ${conectedObjectShape}  1 V0 A 0.75 0.75, 0, 0, 1 0 0 Z" fill="${color}"></path>
</marker>`;

// const EndDefs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
// EndDefs.innerHTML = `<marker id="endDefs" orient="auto" markerWidth="2" markerHeight="2" refX="2.4" refY="1">
// <!-- triangle pointing right (+x) -->
// <path d="M0,0.5 V1.5 L2,2 V0 Z" fill="black"></path>
// </marker>`;

containerSVG.append(StartDefs);
//containerSVG.append(EndDefs);

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

    const lineColor = straight ? color : "";
    const lineShape = straight ? "" : "url(#startDefs)";
    const lineWight = straight
      ? shapeSize
      : pythagorean(shapeRound, shapeRound);

    newLine.setAttribute("id", "line2");
    newLine.setAttribute("x1", startCoordinates[0]);
    newLine.setAttribute("y1", startCoordinates[1]);
    newLine.setAttribute("x2", newCoordinates[0]);
    newLine.setAttribute("y2", newCoordinates[1]);
    newLine.setAttribute("marker-start", lineShape);
    newLine.setAttribute("stroke-width", lineWight);
    newLine.setAttribute("stroke", lineColor);

    containerSVG.append(newLine);

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
  containerSVG.append(newPath);
};

//UI LAYER
function makeRows(rows, cols) {
  container.style.setProperty("--grid-rows", rows);
  container.style.setProperty("--grid-cols", cols);
  for (c = 0; c < rows * cols; c++) {
    let cell = document.createElement("div");
    cell.getClase;

    let ball = document.createElement("div");
    cell.appendChild(ball).className = "ball";

    cell.addEventListener("click", (event) => {
      const snapedX = snap(event.clientX);
      const snapedY = snap(event.clientY);

      drowPath(snapedX, snapedY);

      if (event.altKey) {
        drowLine([snapedX, snapedY]);
      }
    });

    container.appendChild(cell).className = "grid-cell";
  }
}

makeRows(8, 8);
