import Vote from "../models/Vote.js";
import encrypted from "./encrypted.js";

const vote = async (userid, option) => {
  const userAlreadyVoted = await encrypted(userid);

  if (userAlreadyVoted === null) {
    return false;
  }

  if (option !== 0 && option !== 1) {
    return false;
  }

  await Vote.create({ userid: userAlreadyVoted, option });

  return true;
};

export default vote;
