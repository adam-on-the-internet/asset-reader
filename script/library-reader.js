const baseUrl = "https://adam-on-the-internet.github.io/asset-reader";
const assetUrl = "https://blissful-newton-edf9e2.netlify.app";
let assetsOnDisplay = [];
let fullAssetList = [];

const loadLibrary = async () => {
    const catalogURL = `${baseUrl}/catalog.json`;
    const response = await fetch(catalogURL);
    fullAssetList = await response.json();
    afterLoad();
}

function afterLoad() {
    setControls();
    showAll();
}

function showAll() {
    assetsOnDisplay = fullAssetList;
    fillGallery();
}

function applyFilter(filterTag) {
    assetsOnDisplay = fullAssetList.filter((asset) => {
        return asset.tags.includes(filterTag);
    });
    fillGallery();
}

function fillGallery() {
    document.getElementById("gallery").innerHTML = "";
    addLoading();
    setNotes();
    assetsOnDisplay.forEach((asset) => {
        addAsset(asset);
    });
    clearLoading();
}

function setNotes() {
    document.getElementById("notes").innerHTML = `<small>Showing ${assetsOnDisplay.length} asset(s)</small>`;
}

function setControls() {
    const allTags = [];
    fullAssetList.forEach((asset) => {
        asset.tags.forEach((tag) => {
            if (!allTags.includes(tag)) {
                allTags.push(tag);
            }
        });
    })

    allTags.sort(function (a, b) {
        if (a < b) {
            return -1;
        }
        if (a > b) {
            return 1;
        }
        return 0;
    })

    let controlsContent = "";
    allTags.forEach((tag) => {
        controlsContent = controlsContent +
            `<button onclick="applyFilter('${tag}')">${tag}</button>`;
    })
    const newHtml = controlsContent + "<hr>";
    document.getElementById("controls").innerHTML += newHtml;
}

function buildAssetContent(asset, fullPath, commentContent, tagContent) {
    const assetContent = `
    <h2>
      ${asset.name}
      <small>
        <a href="${fullPath}" target="_blank">  
            ${asset.src}
        </a>
      </small>
    </h2>
    ${commentContent}
    <img 
      src="${fullPath}" 
      alt="${asset.name}"
      style="width:200px;height:100px;"
    >
    ${tagContent}
    <hr>
  `;
    return assetContent;
}

function addAsset(asset) {
    const tagContent = getAssetTagContent(asset);
    const commentContent = getCommentContent(asset);
    const fullPath = `${assetUrl}/assets${asset.src}`;
    const assetContent = buildAssetContent(asset, fullPath, commentContent, tagContent);
    document.getElementById("gallery").innerHTML += assetContent;
}

function getCommentContent(asset) {
    if (asset.comment) {
        return `    
  <p>
    ${asset.comment}
  </p>`;
    } else {
        return "";
    }
}

function getAssetTagContent(asset) {
    const tags = asset.tags;
    let tagContent = "<ul>";
    tags.forEach((tag) => {
        tagContent = tagContent + `<li>${tag}</li>`
    });
    return tagContent + "</ul>";
}

function clearLoading() {
    document.getElementById("loading").innerHTML = "";
}

function addLoading() {
    document.getElementById("loading").innerHTML += "<p>Loading...</p>";
}
