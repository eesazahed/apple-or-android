const option1Btn = document.getElementById("option1Btn");
const option2Btn = document.getElementById("option2Btn");
const option1Voters = document.getElementById("option1Voters");
const option2Voters = document.getElementById("option2Voters");
const isWinning = document.getElementById("isWinning");
const vote = document.getElementById("vote");
const loading = document.getElementById("loading");

if (option1Btn && option2Btn) {
  option1Btn.onclick = async () => {
    loading.innerText = "Loading...";
    const response = await fetch("/vote/0", { method: "POST" });
    const data = await response.json();

    if (response.status === 200) {
      isWinning.innerText = data.winning;
      option1Voters.innerText = data.option1Voters;
      option2Voters.innerText = data.option2Voters;
      vote.innerHTML = "<h3>You've already voted!</h3>";
      loading.innerText = "";
    } else {
      loading.innerText = data.message;
    }
  };

  option2Btn.onclick = async () => {
    loading.innerText = "Loading...";
    const response = await fetch("/vote/1", { method: "POST" });
    const data = await response.json();

    if (response.status === 200) {
      isWinning.innerText = data.winning;
      option1Voters.innerText = data.option1Voters;
      option2Voters.innerText = data.option2Voters;
      vote.innerHTML = "<h3>You've already voted!</h3>";
      loading.innerText = "";
    } else {
      loading.innerText = data.message;
    }
  };
}

// data

const intlFormat = (num) =>
  new Intl.NumberFormat().format(Math.round(num * 10) / 10);

const makeFriendly = (num) => {
  if (num >= 1000000) {
    return intlFormat(num / 1000000) + "M";
  }
  if (num >= 1000) {
    return intlFormat(num / 1000) + "K";
  }
  return intlFormat(num);
};

const endx = document.getElementById("endx");
const endy = document.getElementById("endy");
const option1Color = "#1982FC";
const option2Color = "#43CC47";

const canvas = document.getElementById("canvas");
const size = canvas.height;
const ctx = canvas.getContext("2d");

const draw = (color, array, prop) => {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  array.forEach((vote, index) => ctx.lineTo(index, vote[prop]));
  ctx.stroke();
};

const drawText = (x, y, color, text) => {
  ctx.fillStyle = color;
  ctx.font = "16px sans-serif";
  ctx.fillText(text, x, y);
};

const fetchVotes = async () => {
  const response = await fetch(
    "https://apple-or-android-vote.eesazahed.repl.co/api/data"
  );

  const data = await response.json();
  return data;
};

const visualize = async () => {
  const data = await fetchVotes();

  const sortedArray = data.sort((a, b) => a.id - a.id);

  const dataVisualized = [];

  for (let vote in sortedArray) {
    vote++;
    const arrayAtTime = sortedArray.slice(0, vote);

    const option1Voters = arrayAtTime.filter(
      (thisVote) => thisVote.option === 0
    ).length;
    const option2Voters = arrayAtTime.filter(
      (thisVote) => thisVote.option === 1
    ).length;

    dataVisualized.push({ option1Voters, option2Voters });
  }

  const lastItem = dataVisualized[dataVisualized.length - 1];

  const isMore =
    lastItem.option1Voters >= lastItem.option2Voters
      ? lastItem.option1Voters
      : lastItem.option2Voters;

  endx.innerText =
    dataVisualized.length > canvas.height
      ? makeFriendly(dataVisualized.length)
      : canvas.height;
  endy.innerText =
    dataVisualized.length > canvas.height
      ? makeFriendly(dataVisualized.length)
      : canvas.height;

  const scale = 1 - ((isMore - size) / Math.abs(size)) * 1;

  drawText(16, 32, option1Color, `Apple voters: ${lastItem.option1Voters}`);
  drawText(16, 64, option2Color, `Android voters: ${lastItem.option2Voters}`);

  ctx.translate(0, size);
  ctx.scale(1, -1);
  ctx.scale(scale, scale);

  draw(option1Color, dataVisualized, "option1Voters");
  draw(option2Color, dataVisualized, "option2Voters");
};

visualize();
