
function generateShapeSVG(inputString) {
  const length = inputString.length;
  const angles = Array.from(inputString, (letter) =>
    letter.toUpperCase().charCodeAt() - 64
  );

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");

  svg.setAttribute("viewBox", "0 0 400 400"); // Set the initial viewBox size

  const centerX = 200;
  const centerY = 200;

  let pathString = `M${centerX} ${centerY}`;

  for (let i = 0; i < length; i++) {
    const angle = (angles[i] * (10000 / angles.reduce((a, b) => a + b, 0))) % 720;
    const x = centerX + Math.round(length * Math.cos(angle * Math.PI) * 20) / 10;
    const y = centerY + Math.round(length * Math.sin(angle * Math.PI) * 20) / 10;
    pathString += ` L${x} ${y}`;
  }

  pathString += " Z";

  const path = document.createElementNS(svgNS, "path");
  path.setAttribute("class", "bob");
  path.setAttribute("d", pathString);

  svg.appendChild(path);

    // Add animation
    const totalLength = path.getTotalLength();
    path.style.strokeDasharray = totalLength;
    path.style.strokeDashoffset = totalLength;
    path.style.animation = "lineAnimation 20s linear infinite";
  
    const style = document.createElement("style");
    style.textContent = `
      @keyframes lineAnimation {
        0% {
          stroke-dashoffset: ${totalLength};
          stroke-dasharray: ${totalLength};
        }
        50% {
          stroke-dashoffset: 0;
          stroke-dasharray: ${totalLength * 0.5} ${totalLength * 0.5};
        }
        100% {
          stroke-dashoffset: ${-totalLength};
          stroke-dasharray: ${totalLength};
        }
      }
    `;
    svg.appendChild(style);

  return svg;
}

function removeProtocol(url) {
  return url.replace(/(^\w+:|^)\/\//, '');
}

function lazyLoadListItemRaw(item, ul) {
  // SVG
  let interlinkedSVG = generateShapeSVG(item);

  var columns = item.split(',');
  var url = removeProtocol(columns[0]);
  var info = columns[1];

  var li = document.createElement('div');
  li.className = 'box';
  var a = document.createElement('a');
  
  a.href = columns[0];
  a.textContent = url;
  li.appendChild(a);

  if (info) {
    var span = document.createElement('span');
    span.textContent = info;
    li.appendChild(span);
  }

  // link
  const interlinkedAnchor = document.createElement("a");
  interlinkedAnchor.className = 'box link';
  interlinkedAnchor.setAttribute('href', a);
  interlinkedAnchor.setAttribute('title', `Go to the website ${a}`);

  // label
  const interlinkedLabel = document.createElement('div');
  interlinkedLabel.textContent = a;
  interlinkedLabel.className = 'url-target';


  interlinkedAnchor.appendChild(interlinkedSVG);

  const blob = document.createElement('div');
  blob.className = 'interlinkedParent'
  // blob.appendChild(interlinkedLabel);
  blob.appendChild(interlinkedAnchor)

  ul.appendChild(blob);
}

// Pause all SVG animations
function pauseAllSvgAnimations() {
  const svgs = document.querySelectorAll("");
  svgs.forEach((svg) => {
    const animations = svg.getAnimations();
    animations.forEach((animation) => {
      animation.pause();
    });
  });
}

// Resume all SVG animations
function resumeAllSvgAnimations() {
  const svgs = document.querySelectorAll("svg");
  svgs.forEach((svg) => {
    const animations = svg.getAnimations();
    animations.forEach((animation) => {
      animation.play();
    });
  });
}

// Update SVG dimensions on window resize
window.addEventListener("resize", updateSvgDimensions);

function updateSvgDimensions() {
  const svg = document.getElementById("mySvg"); // Replace "mySvg" with the ID of your SVG element
  const svgContainer = svg.parentElement;
  const containerWidth = svgContainer.clientWidth;
  const containerHeight = svgContainer.clientHeight;
  svg.setAttribute("viewBox", `0 0 ${containerWidth} ${containerHeight}`);
}

// Example usage: Pause and Resume buttons
const pauseButton = document.getElementById("pauseButton");
const resumeButton = document.getElementById("resumeButton");

pauseButton.addEventListener("click", pauseAllSvgAnimations);
resumeButton.addEventListener("click", resumeAllSvgAnimations);


// const nameSvg = generateShapeSVG('Brandon Douglas Herford');
// document.querySelector('#heading-svg').appendChild(nameSvg);

fetch('./data/dev-resources.csv')
  .then(function(response) {
    if (response.ok) {
      return response.text();
    } else {
      throw new Error('Error: ' + response.status);
    }
  })
  .then(function(data) {
    var rows = data.split('\n');
    var ul = document.getElementById('collected-links');

    // for (var i = 0; i < rows.length; i++) {
    //   lazyLoadListItemRaw(rows[i], ul);
    // }
    for (var i = 0; i < 20; i++) {
      lazyLoadListItemRaw(rows[i], ul);
    }
  })
  .catch(function(error) {
    console.log(error);
  });
