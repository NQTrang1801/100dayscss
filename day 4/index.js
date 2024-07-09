const red = [2, 1, 1, 2, 1, 1.5, 0];
const blue = [0, 1, 0.5, 0.2, 0.8, 0.4, 1];
const mea = 60;

const transformArray = (arr, factor) => arr.map(value => value * factor);

const calculateWidthEdges = (arr, mea) =>
  arr.slice(0, -1).map((value, i) =>
    Math.hypot(value - arr[i + 1], mea)
  );

const calculateDegrees = (arr, widthEdges) =>
  arr.slice(0, -1).map((value, i) =>
    Math.asin((value - arr[i + 1]) / widthEdges[i]) * (180 / Math.PI)
  );

const updateEdgCSS = (element, bottom, rotate, width) => {
  element.style.bottom = `${bottom}px`;
  element.style.transform = `rotate(${rotate < 0 ? rotate + 2 : rotate - 2}deg)`;
  element.style.width = `${width + 3}px`;
  element.style.transformOrigin = 'left center';
  element.style.borderRadius = '30%';
};

const updatePointCSS = (element, point) => {
  element.style.top = `${point + 14}px`;
}

const updateElementCSS = (className, transformed, degrees, widths) => {
  const elements = document.querySelectorAll(`.${className} div`);
  elements.forEach((e, i) => i < transformed.length - 1 && updateEdgCSS(e, transformed[i], degrees[i], widths[i]));

  const points = document.querySelectorAll(`#${className}-val p`);
  points.forEach((p, i) => i < transformed.length && updatePointCSS(p, transformed[i]));
};

const applyStyles = (array, nthChild, className) => {
  const styleSheet = document.createElement("style");
  document.head.appendChild(styleSheet);

  array.forEach((value, index) => {
    styleSheet.sheet.insertRule(`
          .axis > div:nth-child(${nthChild}) p:nth-child(${index + 1})::before {
            content: "${value}";
          }
        `, styleSheet.sheet.cssRules.length);
  });
};

const addHoverEvent = (color) => {
  document.querySelectorAll(`.${color} span`).forEach(span => {
    span.addEventListener('mouseover', () => {
      const sId = span.getAttribute('s-id');
      const paragraph = sId && document.getElementById(`${color}-${sId}`);
      paragraph && paragraph.classList.add('show');
    });

    span.addEventListener('mouseout', () => {
      const sId = span.getAttribute('s-id');
      const paragraph = sId && document.getElementById(`${color}-${sId}`);
      paragraph && paragraph.classList.remove('show');
    });
  });
};

const createInputFields = (array, containerId, color) => {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  array.forEach((value, index) => {
    const input = document.createElement('input');
    input.type = 'number';
    input.value = value;
    input.addEventListener('input', () => updateArrayValue(array, index, parseFloat(input.value), color));
    container.appendChild(input);
  });
};

const updateArrayValue = (array, index, newValue, color) => {
  array[index] = newValue;
  const transformed = transformArray(array, mea);
  const widthEdges = calculateWidthEdges(transformed, mea);
  const degrees = calculateDegrees(transformed, widthEdges);

  updateElementCSS(color, transformed, degrees, widthEdges);
  applyStyles(array, color === 'red' ? 1 : 3, color);
};

const redTransformed = transformArray(red, mea);
const blueTransformed = transformArray(blue, mea);
const widthEdgRed = calculateWidthEdges(redTransformed, mea);
const widthEdgBlue = calculateWidthEdges(blueTransformed, mea);
const degRed = calculateDegrees(redTransformed, widthEdgRed);
const degBlue = calculateDegrees(blueTransformed, widthEdgBlue);

updateElementCSS('red', redTransformed, degRed, widthEdgRed);
updateElementCSS('blue', blueTransformed, degBlue, widthEdgBlue);

applyStyles(red, 1, 'red');
applyStyles(blue, 3, 'blue');

addHoverEvent('blue');
addHoverEvent('red');

createInputFields(red, 'red-array', 'red');
createInputFields(blue, 'blue-array', 'blue');