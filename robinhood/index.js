/**
 * @typedef Point
 * @type {object}
 * @property {number} x
 * @property {number} y
 */

const Config = {
  bg: "#0c0a06",
  fg: "#d8d7d8",
  fps: 60,
};

let timer;

/**
 * Animation loop
 * @param {function} callback
 */
function loop(callback) {
  timer = setInterval(() => {
    requestAnimationFrame(() => {
      callback();
    });
  }, 1000 / Config.fps);
}

/**
 * Clear the canvas and render background
 * @param {CanvasRenderingContext2D} context
 * @param {number} width
 * @param {number} height
 */
function clear(context, width, height) {
  context.fillStyle = Config.bg;
  context.clearRect(0, 0, width, height);
  context.fillRect(0, 0, width, height);
  context.fill();
}

/**
 *
 * @param {number} quantity
 * @param {number} radius
 * @param {Point} center
 * @returns Point[]
 */
function createItems(quantity, radius, center) {
  /**
   * @type Point[] items
   */
  const items = [];

  for (let i = 0; i < quantity; i++) {
    const x = radius * 2 * Math.cos((2 * Math.PI * i) / quantity) + center.x;
    const y = radius * Math.sin((2 * Math.PI * i) / quantity) + center.y;

    items.push({ x, y });
  }

  return items;
}

/**
 *
 * @param {Point} center
 * @param {Point} point
 * @param {number} angle
 * @param {number} a
 * @param {number} b
 * @returns Point
 */
function rotate(center, point, angle, a, b) {
  const normalizedX = (point.x - center.x) / a;
  const normalizedY = (point.y - center.y) / b;
  const angleRad = angle * (Math.PI / 180);
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);
  const rotatedX = cos * normalizedX - sin * normalizedY;
  const rotatedY = sin * normalizedX + cos * normalizedY;
  const x = rotatedX * a + center.x;
  const y = rotatedY * b + center.y;

  return { x, y };
}

function main() {
  /**
   *  @type HTMLCanvasElement | null
   */
  const canvas = document.querySelector("#robinhood");
  if (!canvas) return;

  /**
   * @type CanvasRenderingContext2D | null
   */
  const context = canvas.getContext("2d");
  if (!context) return;

  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  /**
   * @type Point center
   */
  const center = { x: width / 2, y: height / 2 };

  const items = [
    {
      row: createItems(20, 100, center),
      speed: 0.5,
    },
    {
      row: createItems(25, 200, center),
      speed: 0.4,
    },
    {
      row: createItems(30, 300, center),
      speed: 0.3,
    },
    {
      row: createItems(35, 400, center),
      speed: 0.2,
    },
    {
      row: createItems(40, 500, center),
      speed: 0.1,
    },
  ];

  context.strokeStyle = Config.fg;
  context.lineWidth = 2;

  loop(() => {
    clear(context, width, height);

    items.forEach(({ row, speed }) => {
      row.forEach((item, index) => {
        context.beginPath();
        context.moveTo(item.x, item.y - 25);
        context.lineTo(item.x, item.y + 25);
        context.stroke();
        context.closePath();

        row[index] = rotate(center, item, speed, 200, 100);
      });
    });
  });
}

window.addEventListener("resize", () => {
  clearInterval(timer);
  main();
});

main();
