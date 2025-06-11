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


