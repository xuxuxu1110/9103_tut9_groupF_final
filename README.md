# 9103_tut9_groupF
tut9_group F
this readme file is for iterations code

//1 xzha0076 
function setup() {
  createCanvas(800, 800);
  angleMode(DEGREES);
  colorMode(HSL, 360, 100, 100);
  noLoop();
  noStroke();
}

function draw() {
  background(0, 0, 98);

  let ringCount = 6; // 每个图案的圆环数量
  let positions = [
    [140, 150],
    [400, 100],
    [650, 50],
    
    [80, 400],
    [330, 350],
    [600, 300],
    [850, 230],
    
    [-10, 650],
    [250, 600],
    [520, 550], 
    [790, 500],
    
    [170, 850],
    [430, 800],
    [700, 750],
  ];

  for (let i = 0; i < positions.length; i++) {
    let [x, y] = positions[i];
    let hueStart = (i * 50) % 360; // 每个图案一个不同色相范围
    drawWheel(x, y, ringCount, hueStart);
  }
}

function drawWheel(x, y, totalRings, baseHue) {
  push();
  translate(x, y);

  let ringSpacing = 20;

  for (let i = totalRings; i > 0; i--) {
    let radius = i * ringSpacing;

    if (i < 4) {
      // 前三圈为随机颜色纯色圆环
      let hue = random(0, 360);
      let sat = random(60, 80); // 饱和度较低
      let light = random(50, 70);
      fill(hue, sat, light);
      ellipse(0, 0, radius * 2);
    } else {
      // 外圈为彩色扇形
      let segments = int(random(8, 14));
      let baseRingHue = random(0, 360); // 每圈一个主色调

      for (let j = 0; j < segments; j++) {
        let angleStart = (360 / segments) * j;
        let angleEnd = angleStart + (360 / segments);

        let hue = (baseRingHue + random(-10, 10)) % 360;
        let sat = random(60, 80); // 饱和度仍然偏低
        let light = random(40, 70);
        fill(hue, sat, light); 

        arc(0, 0, radius * 2, radius * 2, angleStart, angleEnd, PIE);
      }
    }
  }

  pop();
}


//2 fixed wheels
let wheels = [];
let connectors = []; // Array to hold all connector objects

// Enhanced color palettes inspired by Pacita Abad's "Wheels of Fortune"
// Each sub-array represents a palette for one wheel, mimicking the vibrant, layered colors.
// These are hand-picked approximations and should be fine-tuned.
const colorPalettes = [
  // Palette 1: Deep Blue/Purple with Yellow/Orange Accents (like top-left wheel)
  ['#45206A', '#FFD700', '#FF8C00', '#B0E0E6', '#8A2BE2'], // Base, Outer Dots, Inner Dots, Spokes, Center
  // Palette 2: Fiery Reds and Oranges with Green/Blue contrast
  ['#D90429', '#F4D35E', '#F7B267', '#0A796F', '#2E4057'],
  // Palette 3: Warm Earthy Tones with Bright Pinks/Greens
  ['#A34A2A', '#F2AF29', '#E0A890', '#3E8914', '#D4327C'],
  // Palette 4: Cool Blues and Greens with Yellow/Pink Pop
  ['#004C6D', '#7FC2BF', '#FFC94F', '#D83A56', '#5C88BF'],
  // Palette 5: Vibrant Pinks and Purples with Yellow/Green
  ['#C11F68', '#F9E795', '#F5EEF8', '#2ECC71', '#8E44AD'],
  // Palette 6: Deep Teal with Orange/Red
  ['#006D77', '#FF8C00', '#E29578', '#83C5BE', '#D64045'],
  // Add more palettes based on your visual analysis of the original artwork
];

const backgroundColor = '#2A363B'; // A dark, muted background similar to the original painting

// --- FIXED WHEEL POSITIONS AND SIZES ---
// These positions are relative to canvas width/height for better scaling
// You can adjust these values to create your desired fixed layout.
// Each array represents [x_ratio, y_ratio, radius_ratio]
const fixedWheelData = [
  // Top row
  [0.2, 0.2, 0.1], // Wheel 1 (x, y, radius relative to canvas width/height)
  [0.5, 0.15, 0.08], // Wheel 2
  [0.8, 0.25, 0.12], // Wheel 3

  // Middle row
  [0.15, 0.5, 0.11], // Wheel 4
  [0.4, 0.45, 0.09], // Wheel 5
  [0.65, 0.55, 0.07], // Wheel 6
  [0.9, 0.4, 0.1], // Wheel 7

  // Bottom row
  [0.25, 0.8, 0.09], // Wheel 8
  [0.55, 0.75, 0.11], // Wheel 9
  [0.75, 0.9, 0.08], // Wheel 10
];


function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS); // Use RADIANS as per common p5.js practice and rui's code

  initializeArtwork();
}

function draw() {
  background(backgroundColor);

  // Display connectors first, so they are behind the wheels
  for (const conn of connectors) {
    conn.display();
  }

  // Display all the wheels
  for (const wheel of wheels) {
    wheel.display();
  }
}

// --- Initialization Function ---
function initializeArtwork() {
  wheels = [];
  connectors = [];

  // Generate wheels based on fixed positions
  for (let i = 0; i < fixedWheelData.length; i++) {
    const data = fixedWheelData[i];
    const x = data[0] * width;
    const y = data[1] * height;
    const radius = data[2] * width; // Base radius on width for consistency

    // Randomly select a color palette for each wheel
    let selectedPalette = random(colorPalettes);
    
    // Optional: Avoid using the same palette consecutively (still relevant for random selection)
    if (wheels.length > 0) {
        const lastPalette = wheels[wheels.length - 1].colors;
        let availablePalettes = colorPalettes.filter(p => p !== lastPalette);
        if (availablePalettes.length > 0) {
            selectedPalette = random(availablePalettes);
        }
    }

    wheels.push(new Wheel(x, y, radius, selectedPalette));
  }

  // Generate connectors between nearby wheels (based on their fixed positions)
  for (let i = 0; i < wheels.length; i++) {
    for (let j = i + 1; j < wheels.length; j++) {
      let w1 = wheels[i];
      let w2 = wheels[j];
      let d = dist(w1.x, w1.y, w2.x, w2.y);
      // Connect wheels if they are within a certain range
      // The multiplier (e.g., 1.5) determines how far apart wheels can be to connect.
      // Adjust this based on your fixed layout to connect desired wheels.
      if (d < (w1.radius + w2.radius) * 1.6) { // Increased multiplier slightly for more connections
        connectors.push(new Connector(w1, w2, random(colorPalettes)[0])); // Random base color for connector
      }
    }
  }
}

// --- Wheel Class (based on rui's, with minor adjustments for clarity/integration) ---
class Wheel {
  constructor(x, y, radius, palette) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.colors = palette; // Now using a palette array
    this.stemAngle = random(TWO_PI); // For the single 'stem'
  }

  display() {
    push();
    translate(this.x, this.y);

    // Order of drawing layers (back to front)
    this.drawBaseCircle();
    this.drawOuterDots();
    this.drawSpokes();
    this.drawInnerCircles();
    this.drawStem(); // This could represent a decorative element or a start of a connection

    pop();
  }

  drawBaseCircle() {
    noStroke();
    fill(this.colors[0]); // Use the first color in the palette for the base
    circle(0, 0, this.radius * 2);
  }

  drawOuterDots() {
    const dotCount = 40;
    const dotRadius = this.radius * 0.9;
    const dotSize = this.radius * 0.08;
    fill(this.colors[1]); // Second color for outer dots
    noStroke();
    for (let i = 0; i < dotCount; i++) {
      const angle = map(i, 0, dotCount, 0, TWO_PI);
      const dx = cos(angle) * dotRadius;
      const dy = sin(angle) * dotRadius;
      circle(dx, dy, dotSize);
    }
  }

  drawSpokes() {
    const spokeCount = 24;
    const innerRadius = this.radius * 0.55;
    const outerRadius = this.radius * 0.8;
    stroke(this.colors[3]); // Fourth color for spokes
    strokeWeight(this.radius * 0.03);
    for (let i = 0; i < spokeCount; i++) {
      const angle = map(i, 0, spokeCount, 0, TWO_PI);
      const x1 = cos(angle) * innerRadius;
      const y1 = sin(angle) * innerRadius;
      const x2 = cos(angle) * outerRadius;
      const y2 = sin(angle) * outerRadius;
      line(x1, y1, x2, y2);
    }
  }

  drawInnerCircles() {
    noStroke();
    fill(this.colors[2]); // Third color for the first inner circle
    circle(0, 0, this.radius * 0.6);

    fill(this.colors[3]); // Fourth color for inner dots
    const innerDotCount = 20;
    const innerDotRadius = this.radius * 0.4;
    const innerDotSize = this.radius * 0.06;
    for (let i = 0; i < innerDotCount; i++) {
      const angle = map(i, 0, innerDotCount, 0, TWO_PI);
      const dx = cos(angle) * innerDotRadius;
      const dy = sin(angle) * innerDotRadius;
      circle(dx, dy, innerDotSize);
    }

    fill(this.colors[4]); // Fifth color for the second inner circle
    circle(0, 0, this.radius * 0.3);

    fill(this.colors[0]); // Reusing first color for the smallest center circle
    circle(0, 0, this.radius * 0.15);
  }

  drawStem() {
    stroke(this.colors[1]); // Use second color for the stem
    strokeWeight(this.radius * 0.04);
    noFill();
    const startX = cos(this.stemAngle) * (this.radius * 0.075);
    const startY = sin(this.stemAngle) * (this.radius * 0.075);
    const endX = cos(this.stemAngle) * (this.radius * 0.5);
    const endY = sin(this.stemAngle) * (this.radius * 0.5);
    const controlX = cos(this.stemAngle + 0.5) * (this.radius * 0.4);
    const controlY = sin(this.stemAngle + 0.5) * (this.radius * 0.4);
    beginShape();
    vertex(startX, startY);
    quadraticVertex(controlX, controlY, endX, endY);
    endShape();
    noStroke();
    fill(this.colors[1]);
    circle(endX, endY, this.radius * 0.08);
  }
}

// --- Connector Class (inspired by yzh's connection logic, but now as a class) ---
class Connector {
  constructor(wheel1, wheel2, connectColor) {
    this.w1 = wheel1;
    this.w2 = wheel2;
    this.color = connectColor;
    // Pre-calculate angle and positions for drawing
    this.angle = atan2(this.w2.y - this.w1.y, this.w2.x - this.w1.x);
    this.startPoint = createVector(
      this.w1.x + cos(this.angle) * this.w1.radius,
      this.w1.y + sin(this.angle) * this.w1.radius
    );
    this.endPoint = createVector(
      this.w2.x + cos(this.angle + PI) * this.w2.radius, // Angle + PI to get to the other side of w2
      this.w2.y + sin(this.angle + PI) * this.w2.radius
    );
  }

  display() {
    stroke(this.color);
    strokeWeight(5); // Thicker line for visibility
    noFill();

    // Draw the main connection line
    line(this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y);

    // Add decorative elements for the chain-like effect (inspired by original)
    let midX = (this.startPoint.x + this.endPoint.x) / 2;
    let midY = (this.startPoint.y + this.endPoint.y) / 2;
    let distBetweenWheels = dist(this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y);

    // Draw chain links along the line
    const linkSize = 10;
    const numLinks = floor(distBetweenWheels / (linkSize * 2)); // Use a factor of 2 for more spacing between links
    if (numLinks > 0) {
      for (let i = 0; i <= numLinks; i++) {
        let lerpAmount = map(i, 0, numLinks, 0, 1);
        let linkX = lerp(this.startPoint.x, this.endPoint.x, lerpAmount);
        let linkY = lerp(this.startPoint.y, this.endPoint.y, lerpAmount);

        // Draw small circles to represent chain links
        fill(255, 200, 100); // Yellow-orange for links
        stroke(this.color);
        strokeWeight(1);
        circle(linkX, linkY, linkSize);

        // Optional: Add a tiny inner dot for more detail
        fill(0);
        noStroke();
        circle(linkX, linkY, linkSize * 0.4);
      }
    }

    // Draw decorative central blob (inspired by yzh's connecting point)
    // Only draw if there's enough space for a central blob without looking squished
    if (distBetweenWheels > 50) { // Arbitrary threshold
        fill(255, 255, 255); // White base
        stroke(this.color); // Border matching the connection line
        strokeWeight(3);
        circle(midX, midY, 20); // Larger central circle

        fill(this.color); // Inner color matching connection
        noStroke();
        circle(midX, midY, 10); // Smaller inner circle

        // Draw radiating dots around the central blob
        fill(255, 200, 100); // Yellow-orange for small dots
        noStroke();
        const numSmallDots = 8;
        const smallDotRadius = 15;
        const smallDotSize = 4;
        for (let i = 0; i < numSmallDots; i++) {
            let angle = map(i, 0, numSmallDots, 0, TWO_PI);
            let dx = midX + cos(angle) * smallDotRadius;
            let dy = midY + sin(angle) * smallDotRadius;
            circle(dx, dy, smallDotSize);
        }
    }
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initializeArtwork(); // Re-initialize wheels and connectors on resize
}

// ruxu0462
// An array to hold all the wheel objects
let wheels = [];
// Pre-defined color palettes inspired by the artwork
const colorPalettes = [
  ['#FF6B6B', '#FFD166', '#06D6A0', '#118AB2', '#073B4C'],
  ['#E63946', '#F1FAEE', '#A8DADC', '#457B9D', '#1D3557'],
  ['#F4A261', '#E76F51', '#2A9D8F', '#264653', '#E9C46A'],
  ['#D81159', '#8F2D56', '#218380', '#FBB13C', '#73D2DE']
];
const backgroundColor = '#003049'; // Dark blue background

// The Wheel class is UNCHANGED.
class Wheel {
  // The constructor sets up the initial properties for each wheel.
  constructor(x, y, radius, palette) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.colors = palette;
    this.stemAngle = random(TWO_PI);
  }

  // The main draw function for the wheel.
  display() {
    push();
    translate(this.x, this.y);

    this.drawOuterDots();
    this.drawSpokes();
    this.drawInnerCircles();
    this.drawStem();

    pop();
  }

  // ... (All other methods inside the Wheel class like drawOuterDots, drawSpokes, etc., remain exactly the same)
  drawOuterDots() {
    const dotCount = 40;
    const dotRadius = this.radius * 0.9;
    const dotSize = this.radius * 0.08;
    fill(this.colors[1]);
    noStroke();
    for (let i = 0; i < dotCount; i++) {
      const angle = map(i, 0, dotCount, 0, TWO_PI);
      const dx = cos(angle) * dotRadius;
      const dy = sin(angle) * dotRadius;
      circle(dx, dy, dotSize);
    }
  }

  drawSpokes() {
    const spokeCount = 24;
    const innerRadius = this.radius * 0.55;
    const outerRadius = this.radius * 0.8;
    stroke(this.colors[0]);
    strokeWeight(this.radius * 0.03);
    for (let i = 0; i < spokeCount; i++) {
      const angle = map(i, 0, spokeCount, 0, TWO_PI);
      const x1 = cos(angle) * innerRadius;
      const y1 = sin(angle) * innerRadius;
      const x2 = cos(angle) * outerRadius;
      const y2 = sin(angle) * outerRadius;
      line(x1, y1, x2, y2);
    }
  }

  drawInnerCircles() {
    noStroke();
    fill(this.colors[2]);
    circle(0, 0, this.radius * 0.6);
    fill(this.colors[3]);
    const innerDotCount = 20;
    const innerDotRadius = this.radius * 0.4;
    const innerDotSize = this.radius * 0.06;
    for (let i = 0; i < innerDotCount; i++) {
       const angle = map(i, 0, innerDotCount, 0, TWO_PI);
       const dx = cos(angle) * innerDotRadius;
       const dy = sin(angle) * innerDotRadius;
       circle(dx, dy, innerDotSize);
    }
    fill(this.colors[4]);
    circle(0, 0, this.radius * 0.3);
    fill(this.colors[0]);
    circle(0, 0, this.radius * 0.15);
  }

  drawStem() {
    stroke(this.colors[1]);
    strokeWeight(this.radius * 0.04);
    noFill();
    const startX = cos(this.stemAngle) * (this.radius * 0.075);
    const startY = sin(this.stemAngle) * (this.radius * 0.075);
    const endX = cos(this.stemAngle) * (this.radius * 0.5);
    const endY = sin(this.stemAngle) * (this.radius * 0.5);
    const controlX = cos(this.stemAngle + 0.5) * (this.radius * 0.4);
    const controlY = sin(this.stemAngle + 0.5) * (this.radius * 0.4);
    beginShape();
    vertex(startX, startY);
    quadraticVertex(controlX, controlY, endX, endY);
    endShape();
    noStroke();
    fill(this.colors[1]);
    circle(endX, endY, this.radius * 0.08);
  }
}

// The setup function is UNCHANGED from the previous version.
function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);
  
  wheels = [];
  const numWheels = 20;
  const maxAttempts = 5000;
  let currentAttempts = 0;

  while (wheels.length < numWheels && currentAttempts < maxAttempts) {
    let candidate = {
      x: random(width),
      y: random(height),
      radius: random(width * 0.05, width * 0.15),
      palette: random(colorPalettes)
    };
    
    let isOverlapping = false;
    
    for (let other of wheels) {
      let d = dist(candidate.x, candidate.y, other.x, other.y);
      let padding = 10; 
      if (d < candidate.radius + other.radius + padding) {
        isOverlapping = true;
        break;
      }
    }
    
    if (!isOverlapping) {
      wheels.push(new Wheel(candidate.x, candidate.y, candidate.radius, candidate.palette));
    }
    
    currentAttempts++;
  }

  if (currentAttempts >= maxAttempts) {
      console.log("Could not place all wheels. The canvas might be too crowded.");
  }
}

// ===============================================
// The draw function has been updated.
// ===============================================
function draw() {
  background(backgroundColor); // Set the background color
  

  // Loop through all the wheels and display them
  for (const wheel of wheels) {
    wheel.display();
  }
}


// The window resizing function is UNCHANGED.
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setup();
}
