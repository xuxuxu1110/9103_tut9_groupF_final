/**
 * This sketch creates a dynamic, abstract artwork inspired by Pacita Abad's "Wheels of Fortune."
 * It generates a collection of interconnected, vibrantly colored "wheels" that are randomly placed
 * across the canvas while attempting to minimize excessive overlap. Connectors are drawn between
 * nearby wheels, adding to the intricate, machine-like aesthetic of the original artwork.
 *
 * The artwork is designed to be responsive, re-initializing its layout when the browser window is resized.
 */

let wheels = []; // Array to hold all Wheel objects
let connectors = []; // Array to hold all Connector objects

/**
 * Enhanced color palettes inspired by Pacita Abad's "Wheels of Fortune."
 * Each sub-array represents a distinct color palette designed for a single wheel,
 * mimicking the vibrant, layered, and often contrasting colors found in Abad's work.
 * These are hand-picked approximations and may require fine-tuning for precise replication.
 * The colors within each palette are ordered as follows:
 * [0]: Base color for the main circle of the wheel.
 * [1]: Color for the outer decorative dots and the 'stem' element.
 * [2]: Color for the first inner circle.
 * [3]: Color for the spokes and the inner dots.
 * [4]: Color for the second inner circle.
 */
const colorPalettes = [
  // Palette 1: Deep Blue/Purple with Yellow/Orange Accents (reminiscent of a top-left wheel in the original)
  ['#45206A', '#FFD700', '#FF8C00', '#B0E0E6', '#8A2BE2'], // Base, Outer Dots/Stem, Inner Circle 1, Spokes/Inner Dots, Inner Circle 2
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
  // Additional palettes can be added here based on further visual analysis of the original artwork.
];

const backgroundColor = '#2A363B'; // A dark, muted background color, chosen to be similar to the original painting's backdrop.

/**
 * The `setup()` function is called once when the program starts.
 * It's used to define initial environment properties like canvas size
 * and to perform initial setup of the artwork components.
 */
function setup() {
  createCanvas(windowWidth, windowHeight); // Create a canvas that fills the browser window.
  angleMode(RADIANS); // Set the angle mode to RADIANS for trigonometric functions, which is common in p5.js and aligns with typical mathematical conventions.

  initializeArtwork(); // Call a custom function to set up the wheels and connectors.
}

/**
 * The `draw()` function is called repeatedly, approximately 60 times per second.
 * It is responsible for continuously rendering the artwork on the canvas.
 */
function draw() {
  background(backgroundColor); // Draw the defined background color to clear the canvas in each frame, creating a fresh drawing surface.

  /**
   * Display all connector objects.
   * Connectors are displayed before wheels to ensure they appear
   * visually behind the wheels, creating a layered effect.
   */
  for (const conn of connectors) {
    conn.display();
  }

  /**
   * Display all wheel objects.
   * Wheels are drawn on top of the connectors.
   */
  for (const wheel of wheels) {
    wheel.display();
  }
}

---

### Initialization Function

/**
 * `initializeArtwork()` is a custom function responsible for generating and
 * arranging all the `Wheel` and `Connector` objects that form the artwork.
 * It clears any existing wheels and connectors, then proceeds to place
 * new wheels on the canvas, attempting to optimize their placement to
 * allow for some overlap while ensuring they are close enough to form connections.
 * Finally, it generates connections between nearby wheels.
 */
function initializeArtwork() {
  wheels = []; // Clear the array of existing wheels.
  connectors = []; // Clear the array of existing connectors.

  const numWheels = 25; // Define the target number of wheels to generate for a denser feel, similar to the original artwork's composition.
  const minRadius = width * 0.04; // Set the minimum possible radius for a wheel, relative to the canvas width.
  const maxRadius = width * 0.12; // Set the maximum possible radius for a wheel, relative to the canvas width.
  const maxAttempts = 5000; // Define a maximum number of attempts to place a wheel, to prevent infinite loops in difficult packing scenarios.
  let currentAttempts = 0; // Initialize a counter for current placement attempts.

  /**
   * Generate wheels with optimized packing.
   * This loop attempts to place `numWheels` on the canvas.
   * It continues as long as the target number of wheels hasn't been met
   * and the maximum number of placement attempts hasn't been exceeded.
   */
  while (wheels.length < numWheels && currentAttempts < maxAttempts) {
    let candidateRadius = random(minRadius, maxRadius); // Propose a random radius for the new wheel.
    let candidateX = random(candidateRadius, width - candidateRadius); // Propose a random X coordinate, ensuring the wheel is within canvas bounds.
    let candidateY = random(candidateRadius, height - candidateRadius); // Propose a random Y coordinate, ensuring the wheel is within canvas bounds.

    let isOverlappingTooMuch = false; // Flag to check if the candidate wheel overlaps excessively with existing wheels.
    let hasNearbyWheel = false; // Flag to check if the candidate wheel is close enough to existing wheels to potentially connect.

    /**
     * Iterate through existing wheels to check for overlaps and proximity.
     */
    for (let other of wheels) {
      let d = dist(candidateX, candidateY, other.x, other.y); // Calculate the distance between the center of the candidate wheel and the existing wheel.
      let combinedRadius = candidateRadius + other.radius; // Sum of the radii of both wheels.

      /**
       * Allow for some overlap, crucial for mimicking the original artwork's density.
       * The `overlapThreshold` allows up to 40% overlap of the smaller wheel's radius.
       * If the distance `d` is less than the combined radii minus this threshold,
       * it means there is too much overlap, and the candidate is rejected.
       */
      const overlapThreshold = min(candidateRadius, other.radius) * 0.4; // Allow 40% overlap of the smaller radius.
      if (d < combinedRadius - overlapThreshold) {
        isOverlappingTooMuch = true; // Mark as excessively overlapping.
        break; // No need to check other wheels, this candidate is invalid.
      }
      /**
       * Check if the candidate wheel is within a reasonable distance to form a connection.
       * If the distance is less than 1.5 times their combined radii, they are considered close enough.
       */
      if (d < combinedRadius * 1.5) {
        hasNearbyWheel = true; // Mark as having a potential neighbor for connection.
      }
    }

    /**
     * Special condition for the first wheel: it doesn't need neighbors.
     * This ensures the very first wheel can always be placed.
     */
    if (wheels.length === 0) {
      hasNearbyWheel = true;
    }

    /**
     * If the candidate wheel is not excessively overlapping AND it has a potential neighbor
     * (or is the first wheel), then add it to the `wheels` array.
     */
    if (!isOverlappingTooMuch && hasNearbyWheel) {
      let selectedPalette = random(colorPalettes); // Choose a random color palette for the new wheel.
      /**
       * To ensure visual diversity and prevent consecutive wheels from having the same palette,
       * if the newly selected palette is identical to the last wheel's palette,
       * re-select from the remaining palettes.
       */
      if (wheels.length > 0 && selectedPalette === wheels[wheels.length - 1].colors) {
          selectedPalette = random(colorPalettes.filter(p => p !== selectedPalette));
      }
      wheels.push(new Wheel(candidateX, candidateY, candidateRadius, selectedPalette)); // Create and add a new Wheel object.
    }
    currentAttempts++; // Increment the attempt counter.
  }

  /**
   * Log a message if the maximum number of attempts was reached, indicating
   * that not all target wheels could be placed successfully within the constraints.
   */
  if (currentAttempts >= maxAttempts) {
    console.log("Could not place all wheels within limits.");
  }

  /**
   * Generate connectors between nearby wheels.
   * This nested loop iterates through all pairs of wheels to determine if a connection should be drawn.
   * The connection logic is inspired by similar artistic implementations.
   */
  for (let i = 0; i < wheels.length; i++) {
    for (let j = i + 1; j < wheels.length; j++) { // Start `j` from `i + 1` to avoid duplicate connections and connecting a wheel to itself.
      let w1 = wheels[i]; // Get the first wheel.
      let w2 = wheels[j]; // Get the second wheel.
      let d = dist(w1.x, w1.y, w2.x, w2.y); // Calculate the distance between the centers of the two wheels.
      /**
       * Connect wheels if they are within a certain range.
       * A connection is made if the distance between wheel centers is less than
       * 1.3 times their combined radii. This allows for connections even with
       * slight gaps or overlaps, mimicking the original artwork's organic connections.
       */
      if (d < (w1.radius + w2.radius) * 1.3) {
        // Create a new Connector object, passing the two wheels and a random base color for the connector.
        // A random color from any palette's base color is chosen to give variety to the connectors.
        connectors.push(new Connector(w1, w2, random(colorPalettes)[0]));
      }
    }
  }
}

---

### Wheel Class

/**
 * The `Wheel` class represents an individual circular design element
 * inspired by Pacita Abad's "Wheels of Fortune." Each wheel has a position,
 * radius, and a unique color palette to draw its various concentric and radial components.
 */
class Wheel {
  /**
   * Constructs a new `Wheel` object.
   * @param {number} x - The x-coordinate of the wheel's center.
   * @param {number} y - The y-coordinate of the wheel's center.
   * @param {number} radius - The radius of the wheel.
   * @param {string[]} palette - An array of color strings to be used for different parts of the wheel.
   */
  constructor(x, y, radius, palette) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.colors = palette; // Assign the provided color palette to this wheel.
    this.stemAngle = random(TWO_PI); // Initialize a random angle for the single 'stem' or decorative element on the wheel.
  }

  /**
   * `display()` renders the wheel on the canvas.
   * It uses `push()` and `pop()` to isolate transformations (like `translate`)
   * applied to this specific wheel, ensuring they don't affect other drawing elements.
   */
  display() {
    push(); // Save the current drawing style settings and transformations.
    translate(this.x, this.y); // Move the origin to the center of the wheel for easier drawing.

    // The order of drawing functions ensures correct layering from back to front.
    this.drawBaseCircle();
    this.drawOuterDots();
    this.drawSpokes();
    this.drawInnerCircles();
    this.drawStem(); // This could represent a decorative element or a symbolic connection point.

    pop(); // Restore the previous drawing style settings and transformations.
  }

  /**
   * Draws the largest, base circle of the wheel.
   * This forms the primary background shape of the wheel.
   */
  drawBaseCircle() {
    noStroke(); // Disable drawing outlines for this shape.
    fill(this.colors[0]); // Use the first color from the assigned palette for the base circle.
    circle(0, 0, this.radius * 2); // Draw a circle centered at the current origin (0,0) with the specified diameter.
  }

  /**
   * Draws a ring of small dots around the outer edge of the wheel.
   * These dots add a decorative, textural detail.
   */
  drawOuterDots() {
    const dotCount = 40; // Number of dots in the outer ring.
    const dotRadius = this.radius * 0.9; // The radius at which the dots are placed, relative to the wheel's radius.
    const dotSize = this.radius * 0.08; // The size of individual dots.
    fill(this.colors[1]); // Use the second color from the palette for these dots.
    noStroke(); // Disable outlines.
    for (let i = 0; i < dotCount; i++) {
      const angle = map(i, 0, dotCount, 0, TWO_PI); // Calculate the angle for each dot, distributing them evenly around a circle.
      const dx = cos(angle) * dotRadius; // Calculate the x-offset for the dot.
      const dy = sin(angle) * dotRadius; // Calculate the y-offset for the dot.
      circle(dx, dy, dotSize); // Draw the dot at its calculated position.
    }
  }

  /**
   * Draws the spokes radiating from the center of the wheel.
   * These provide structural and decorative elements within the wheel.
   */
  drawSpokes() {
    const spokeCount = 24; // Number of spokes.
    const innerRadius = this.radius * 0.55; // The inner radius where spokes begin.
    const outerRadius = this.radius * 0.8; // The outer radius where spokes end.
    stroke(this.colors[3]); // Use the fourth color from the palette for the spokes.
    strokeWeight(this.radius * 0.03); // Set the thickness of the spokes, relative to the wheel's radius.
    for (let i = 0; i < spokeCount; i++) {
      const angle = map(i, 0, spokeCount, 0, TWO_PI); // Calculate the angle for each spoke.
      const x1 = cos(angle) * innerRadius; // Start x-coordinate of the spoke.
      const y1 = sin(angle) * innerRadius; // Start y-coordinate of the spoke.
      const x2 = cos(angle) * outerRadius; // End x-coordinate of the spoke.
      const y2 = sin(angle) * outerRadius; // End y-coordinate of the spoke.
      line(x1, y1, x2, y2); // Draw a line representing the spoke.
    }
  }

  /**
   * Draws multiple concentric inner circles and a ring of inner dots.
   * These layers add depth and intricate detail to the center of the wheel.
   */
  drawInnerCircles() {
    noStroke(); // Disable outlines for the inner circles.

    fill(this.colors[2]); // Use the third color for the first inner circle.
    circle(0, 0, this.radius * 0.6); // Draw a circle at the center with a specific size.

    fill(this.colors[3]); // Use the fourth color for the ring of inner dots.
    const innerDotCount = 20; // Number of inner dots.
    const innerDotRadius = this.radius * 0.4; // The radius at which these dots are placed.
    const innerDotSize = this.radius * 0.06; // The size of individual inner dots.
    for (let i = 0; i < innerDotCount; i++) {
      const angle = map(i, 0, innerDotCount, 0, TWO_PI); // Calculate the angle for each inner dot.
      const dx = cos(angle) * innerDotRadius; // Calculate x-offset.
      const dy = sin(angle) * innerDotRadius; // Calculate y-offset.
      circle(dx, dy, innerDotSize); // Draw the inner dot.
    }

    fill(this.colors[4]); // Use the fifth color for the second inner circle.
    circle(0, 0, this.radius * 0.3); // Draw a smaller circle at the center.

    fill(this.colors[0]); // Reuse the first color for the smallest, innermost center circle.
    circle(0, 0, this.radius * 0.15); // Draw the smallest circle at the very center.
  }

  /**
   * Draws a single, curved "stem" or decorative element radiating from the wheel's center.
   * This element adds asymmetry and a dynamic visual flair.
   */
  drawStem() {
    stroke(this.colors[1]); // Use the second color from the palette for the stem's outline.
    strokeWeight(this.radius * 0.04); // Set the thickness of the stem.
    noFill(); // Do not fill the shape, only draw its outline.
    const startX = cos(this.stemAngle) * (this.radius * 0.075); // Calculate the stem's start x-coordinate (slightly off-center).
    const startY = sin(this.stemAngle) * (this.radius * 0.075); // Calculate the stem's start y-coordinate.
    const endX = cos(this.stemAngle) * (this.radius * 0.5); // Calculate the stem's end x-coordinate.
    const endY = sin(this.stemAngle) * (this.radius * 0.5); // Calculate the stem's end y-coordinate.
    // Calculate control points for a quadratic Bezier curve to create a subtle curve for the stem.
    const controlX = cos(this.stemAngle + 0.5) * (this.radius * 0.4);
    const controlY = sin(this.stemAngle + 0.5) * (this.radius * 0.4);

    beginShape(); // Begin defining a custom shape.
    vertex(startX, startY); // Define the starting point of the curve.
    quadraticVertex(controlX, controlY, endX, endY); // Define the quadratic Bezier curve using a control point and an end point.
    endShape(); // End the shape definition.

    noStroke(); // Disable outline for the small circle at the end of the stem.
    fill(this.colors[1]); // Fill with the same color as the stem.
    circle(endX, endY, this.radius * 0.08); // Draw a small circle at the end of the stem.
  }
}

---

### Connector Class

/**
 * The `Connector` class represents a connection line between two `Wheel` objects.
 * It's designed to visually link wheels, creating a network or "chain-like" effect,
 * similar to the intricate connections found in Pacita Abad's "Wheels of Fortune."
 * Connectors include a main line, small "chain links," and a central decorative blob.
 */
class Connector {
  /**
   * Constructs a new `Connector` object.
   * @param {Wheel} wheel1 - The first `Wheel` object to connect.
   * @param {Wheel} wheel2 - The second `Wheel` object to connect.
   * @param {string} connectColor - The color to be used for the main connector line and some decorative elements.
   */
  constructor(wheel1, wheel2, connectColor) {
    this.w1 = wheel1; // Store a reference to the first wheel.
    this.w2 = wheel2; // Store a reference to the second wheel.
    this.color = connectColor; // Assign the specified color for the connector.

    /**
     * Pre-calculate the angle and exact start/end points for drawing the connection line.
     * This avoids recalculating these values in every `display()` call, improving performance.
     */
    this.angle = atan2(this.w2.y - this.w1.y, this.w2.x - this.w1.x); // Calculate the angle from wheel1 to wheel2.
    this.startPoint = createVector(
      this.w1.x + cos(this.angle) * this.w1.radius, // Calculate the point on the edge of wheel1 closest to wheel2.
      this.w1.y + sin(this.angle) * this.w1.radius
    );
    this.endPoint = createVector(
      this.w2.x + cos(this.angle + PI) * this.w2.radius, // Calculate the point on the edge of wheel2 closest to wheel1 (angle + PI reverses direction).
      this.w2.y + sin(this.angle + PI) * this.w2.radius
    );
  }

  /**
   * `display()` renders the connector on the canvas, including its main line
   * and various decorative "chain-like" and central elements.
   */
  display() {
    stroke(this.color); // Set the stroke color for the main line and outlines.
    strokeWeight(5); // Set the thickness of the main line for visibility.
    noFill(); // Ensure shapes are not filled by default.

    // Draw the main connection line between the two wheels.
    line(this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y);

    /**
     * Add decorative elements for a chain-like effect, inspired by the original artwork's details.
     * Calculate midpoint and distance for placing central and distributed elements.
     */
    let midX = (this.startPoint.x + this.endPoint.x) / 2; // Midpoint x-coordinate.
    let midY = (this.startPoint.y + this.endPoint.y) / 2; // Midpoint y-coordinate.
    let distBetweenWheels = dist(this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y); // Total length of the connector.

    /**
     * Draw small circles to represent chain links along the connection line.
     */
    const linkSize = 10; // Size of each individual chain link circle.
    const numLinks = floor(distBetweenWheels / (linkSize * 1.5)); // Calculate how many links can fit, with some spacing.
    if (numLinks > 0) { // Only draw links if there's enough space.
      for (let i = 0; i <= numLinks; i++) {
        let lerpAmount = map(i, 0, numLinks, 0, 1); // Calculate interpolation amount to distribute links evenly.
        let linkX = lerp(this.startPoint.x, this.endPoint.x, lerpAmount); // Interpolate x-coordinate for the link.
        let linkY = lerp(this.startPoint.y, this.endPoint.y, lerpAmount); // Interpolate y-coordinate for the link.

        // Draw the outer part of the chain link.
        fill(255, 200, 100); // Yellow-orange color for the links.
        stroke(this.color); // Link outline matches the connector color.
        strokeWeight(1); // Thin outline for links.
        circle(linkX, linkY, linkSize); // Draw the outer link circle.

        // Optional: Add a tiny inner dot for more detail on each link.
        fill(0); // Black fill for the inner dot.
        noStroke(); // No outline for the inner dot.
        circle(linkX, linkY, linkSize * 0.4); // Draw the inner dot.
      }
    }

    /**
     * Draw a decorative central blob, similar to connecting points in original artwork.
     */
    fill(255, 255, 255); // White base for the central blob.
    stroke(this.color); // Border color matches the connection line.
    strokeWeight(3); // Moderate thickness for the border.
    circle(midX, midY, 20); // Draw the larger outer circle of the central blob.

    fill(this.color); // Inner color matching the connection line.
    noStroke(); // No outline for the inner circle.
    circle(midX, midY, 10); // Draw the smaller inner circle of the central blob.

    /**
     * Draw radiating dots around the central blob for additional detail.
     */
    fill(255, 200, 100); // Yellow-orange for these small dots.
    noStroke(); // No outline for these dots.
    const numSmallDots = 8; // Number of radiating dots.
    const smallDotRadius = 15; // Radius at which these dots are placed from the center blob.
    const smallDotSize = 4; // Size of these small dots.
    for (let i = 0; i < numSmallDots; i++) {
      let angle = map(i, 0, numSmallDots, 0, TWO_PI); // Calculate angle for each dot.
      let dx = midX + cos(angle) * smallDotRadius; // Calculate x-position relative to midpoint.
      let dy = midY + sin(angle) * smallDotRadius; // Calculate y-position relative to midpoint.
      circle(dx, dy, smallDotSize); // Draw the radiating dot.
    }
  }
}

/**
 * `windowResized()` is a p5.js built-in function that is called whenever
 * the browser window is resized. It ensures the canvas adjusts to the new
 * window dimensions and re-initializes the artwork's layout.
 */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Adjust the canvas size to the new window dimensions.
  initializeArtwork(); // Re-initialize the wheels and connectors to fit the new canvas size, creating a responsive layout.
}
