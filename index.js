// Set up the canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let frameCount = 0;

let paused = true;

const AutonomousPixel = class {
    constructor(x, y) {
        this.x = x,
        this.y = y
    }
    behaviour = function (nextGen) {

        // run a survival check by counting neighbours
        // if pixel survives, no need to do anything
        // if pixel dies, set nextGen[x][y] to zero
        console.log(this)
        const numNeighbors = this.countNeighbours(this.x,this.y);
        console.log("framecount: "+frameCount)
        console.log("cell: "+this.x+","+this.y)
        console.log("neighbours: "+numNeighbors)
        // Rules of Life
        // if (numNeighbors < 2) {
        //     //  console.log(nextGen)
        //     nextGen[this.x][this.y] = 0;
        // } else if (numNeighbors > 3) {
        //     nextGen[this.x][this.y] = 0;
        // }

         if (numNeighbors !== 2 && numNeighbors !== 3){
             nextGen[this.x][this.y] = 0;
             console.log("cell: "+this.x+","+this.y+" died")
         }

        // now we need to count neighbours for cells 1-8 around the pixel
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if (i === 0 && j === 0) {
                    continue;
                }
              //  console.log(this.x[0]+","+this.y[0])
               // console.log(this.y[0])

                const x_cell = this.x + i;
                const y_cell = this.y + j;
                const numNeighbors = this.countNeighbours(x_cell,y_cell)
          
                //if cell is empty and numNeighbors === 3, put a new autonomousPixel at those coords

               // console.log(y_cell)

                if (x_cell >= 0 && y_cell >= 0 && x_cell < grid.length && y_cell < grid[this.y].length){
             //       console.log("frame: "+frameCount)
             //       console.log("cell "+x_cell+","+y_cell+" has "+numNeighbors +" neighbors")
                if (grid[x_cell][y_cell] === 0 && numNeighbors===3){
                //    console.log("new pixel at "+x_cell+","+y_cell)
                    nextGen[x_cell][y_cell] = new AutonomousPixel(x_cell,y_cell)
                }
            }
            }
        }
    }
    countNeighbours = function (x,y) {
        let numNeighbors = 0;
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if (i === 0 && j === 0) {
                    continue;
                }
                const x_cell = x + i;
                const y_cell = y + j;
                if (x_cell >= 0 && y_cell >= 0 && x_cell < grid.length && y_cell < grid[this.y].length) {
                    // console.log(grid[this.x[0] + i])
                    const currentNeighbor = grid[x_cell][y_cell];
                    //  console.log(currentNeighbor)
                    if (currentNeighbor !== 0) {
                        numNeighbors += 1;
                    }
                }
            }
        }
        return numNeighbors;
    }
}



function togglePause() {
    if (!paused) {
        paused = true;
        button.textContent = 'Play';
    } else if (paused) {
        paused = false;
        button.textContent = 'Pause';
    }
}

function addFrameCount() {
    //  console.log(grid)
    const frameCountElement = document.createElement('p');
    frameCountElement.id = 'frame-count';
    frameCountElement.textContent = `Frame count: ${frameCount}`;

    const oldFrameCountElement = document.getElementById('frame-count');
    if (oldFrameCountElement) {
        oldFrameCountElement.remove();
    }

    document.body.appendChild(frameCountElement);
}

const button = document.createElement('button');
button.textContent = 'Play';
button.addEventListener('click', togglePause);
document.body.appendChild(button);

const button2 = document.createElement('button');
button2.textContent = 'Next Frame';
button2.addEventListener('click', () => {
    grid = nextGen(grid);
    render(grid);
});
document.body.appendChild(button2);


// Set the size of the cells
const resolution = 20;
canvas.width = 600;
canvas.height = 600;

// Create a 2D array to store the state of each cell
function buildGrid() {

    return new Array(canvas.width / resolution).fill(null)
        .map(() => new Array(canvas.height / resolution).fill(null)
            .map(() => Math.floor(Math.random() * 2)));
}

let grid = blankGrid();

requestAnimationFrame(update);

function update() {

    if (!paused) {
        grid = nextGen(grid);
        render(grid);

    }
    requestAnimationFrame(update);
}



function nextGen(grid) {
    frameCount++;

    const nextGen = grid.map(arr => [...arr]);

    //need to give each autonomous pixel in the grid their inputs
    // i.e. the what is in each neighbouring cell


    for (let col = 0; col < grid.length; col++) {
        for (let row = 0; row < grid[col].length; row++) {
            const cell = grid[col][row];
            //  console.log("col: "+col+" , row: "+row)
            //  console.log(cell)
            if (cell !== 0) {
                //  console.log(cell)
                cell.behaviour(nextGen);
            }
        }

    }


    return nextGen;
}

function blankGrid() {
    return new Array(canvas.width / resolution).fill(null)
        .map(() => new Array(canvas.height / resolution).fill(0));
}

function render(grid) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let col = 0; col < grid.length; col++) {
        for (let row = 0; row < grid[col].length; row++) {
            const cell = grid[col][row];

            ctx.beginPath();
            ctx.rect(col * resolution, row * resolution, resolution, resolution);
            ctx.fillStyle = cell ? 'black' : 'white';
            ctx.fill();
            ctx.stroke();
        }
    }
    addFrameCount();
}

const cells = document.querySelectorAll('canvas');
cells.forEach(cell => {
    cell.addEventListener('click', (event) => {
        const col = Math.floor(event.offsetX / resolution);
        const row = Math.floor(event.offsetY / resolution);
        //console.log(grid[col][row])

        // if (grid[col][row]===1){
        //   grid[col][row]=0
        // } else if (grid[col][row]===0){
        //   grid[col][row]=1
        // }

        //grid[col][row] = !grid[col][row]; // toggle the value of the cell


        if (grid[col][row] === 0) {
            grid[col][row] = new AutonomousPixel(col, row)
        } else { grid[col][row] = 0 }
        render(grid); // redraw the grid
        // console.log(`Cell clicked: (${col}, ${row})`);
    });
});


const clearButton = document.createElement('button');
clearButton.textContent = 'Clear grid';
clearButton.addEventListener('click', function () {
    frameCount = 0;
    grid = blankGrid();
    render(grid)
});
document.body.appendChild(clearButton);
