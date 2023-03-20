import Vote from "../models/Vote.js";

const getAllVotes = async () => {
  try {
    const votes = await Vote.findAll({ raw: true });
    const option1Voters = votes.filter((vote) => vote.option === 0).length;
    const option2Voters = votes.filter((vote) => vote.option === 1).length;

    let winning = "";

    if (option1Voters > option2Voters) {
      winning = "Apple is winning!";
    } else if (option2Voters > option1Voters) {
      winning = "Android is winning!";
    } else {
      winning = "It's a tie!";
    }

    return { option1Voters, option2Voters, winning };
  } catch {
    return null;
  }
};

export default getAllVotes;
