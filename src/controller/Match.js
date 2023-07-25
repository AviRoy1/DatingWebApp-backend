import User from "../model/User.js";
import Match from "../model/Matchs.js";
import UserActivity from "../model/UserActivity.js";

async function matchingAlgo(userid) {
  const user = await User.findById(userid);
  const useractivity = await UserActivity.findOne({ userId: userid });
  const lookingfor = user.interestIn;
  let pipeline = [];
  let finalans = new Array();

  if (useractivity && useractivity.blockedUsers.length > 0) {
    pipeline.unshift({
      $match: {
        _id: { $nin: useractivity.blockedUsers },
      },
    });
  }

  if (useractivity && useractivity.matchedUsers.length > 0) {
    pipeline.unshift({
      $match: {
        _id: { $nin: useractivity.matchedUsers },
      },
    });
  }

  if (useractivity && useractivity.likedUsers.length > 0) {
    pipeline.unshift({
      $match: {
        _id: { $nin: useractivity.likedUsers },
      },
    });
  }

  pipeline.push({
    $match: {
      "subscription.status": "active",
    },
  });

  pipeline.push({
    $match: {
      gender: lookingfor,
    },
  });

  if (pipeline.length > 0) {
    const ans1 = await User.aggregate(pipeline);
    finalans = [...finalans, ...ans1];
  }

  let pipeline1 = [];
  if (useractivity && useractivity.blockedUsers.length > 0) {
    pipeline1.unshift({
      $match: {
        _id: { $nin: useractivity.blockedUsers },
      },
    });
  }

  if (useractivity && useractivity.matchedUsers.length > 0) {
    pipeline1.unshift({
      $match: {
        _id: { $nin: useractivity.matchedUsers },
      },
    });
  }

  if (useractivity && useractivity.dislikedUsers.length > 0) {
    pipeline1.unshift({
      $match: {
        _id: { $nin: useractivity.dislikedUsers },
      },
    });
  }
  if (useractivity && useractivity.likedUsers.length > 0) {
    pipeline1.unshift({
      $match: {
        _id: { $nin: useractivity.likedUsers },
      },
    });
  }
  pipeline1.push({
    $match: {
      "subscription.status": "inactive",
    },
  });
  pipeline1.push({
    $match: {
      gender: lookingfor,
    },
  });

  if (pipeline1.length > 0) {
    const ans2 = await User.aggregate(pipeline1);
    finalans = [...finalans, ...ans2];
  }

  let pipeline2 = [];
  if (useractivity && useractivity.dislikedUsers.length > 0) {
    console.log("okkk");
    pipeline2.unshift({
      $match: {
        _id: { $in: useractivity.dislikedUsers },
      },
    });
  }
  // pipeline2.unshift({
  //   $match: {
  //     gender: lookingfor,
  //   },
  // });

  if (pipeline2.length > 0) {
    console.log(pipeline2);
    const res3 = await User.aggregate(pipeline2);
    finalans = [...finalans, ...res3];
  }

  return finalans;
}

export const createMatch = async (req, res) => {
  try {
    // const match = await Match.create({
    //   user1Id: req.body.user1Id,
    //   user2Id: req.body.user2Id,
    // });
    // return res.status(200).json({ match: match });

    const alluser = await matchingAlgo(req.user.id);
    return res.status(200).json({ alluser });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err });
  }
};

//  like the match
export const matchlike = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const otheruser = await User.findById(req.body.userid);

    let user1activity = await UserActivity.findOne({ userId: user._id });
    let user2activity = await UserActivity.findOne({ userId: otheruser._id });

    if (!user1activity) {
      user1activity = await UserActivity.create({ userId: user._id });
    }
    if (!user2activity) {
      user2activity = await UserActivity.create({ userId: otheruser._id });
    }

    if (!user1activity.likedUsers.includes(otheruser._id)) {
      user1activity.likedUsers.push(otheruser._id);
      await user1activity.save();
    }
    if (
      user1activity?.dislikedUsers.length > 0 &&
      user1activity?.dislikedUsers.includes(otheruser._id)
    ) {
      const newDislikeArray = user1activity.dislikedUsers.filter(
        (userid) => JSON.stringify(userid) !== JSON.stringify(otheruser._id)
      );
      user1activity.dislikedUsers = newDislikeArray;
      await user1activity.save();
    }

    if (user2activity?.likedUsers.includes(user._id)) {
      user1activity.matchedUsers.push(otheruser._id);
      user2activity.matchedUsers.push(user._id);
      await user1activity.save();
      await user2activity.save();
      return res
        .status(200)
        .json({ ismatch: true, user: user1activity, message: "It's a match" });
    } else {
      return res.status(200).json({
        ismatch: false,
        user: user1activity,
        message: `You like ${otheruser.name} successfully!!`,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err });
  }
};

//  dislike the match
export const matchdislike = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const otheruser = await User.findById(req.body.userid);

    let user1activity = await UserActivity.findOne({ userId: user._id });
    let user2activity = await UserActivity.findOne({ userId: otheruser._id });

    if (!user1activity) {
      user1activity = await UserActivity.create({ userId: user._id });
    }
    if (!user2activity) {
      user2activity = await UserActivity.create({ userId: otheruser._id });
    }

    if (!user1activity.dislikedUsers.includes(otheruser._id)) {
      user1activity.dislikedUsers.push(otheruser._id);
      await user1activity.save();
    } else {
      const newDislikeArray = user1activity.dislikedUsers.filter(
        (userid) => JSON.stringify(userid) !== JSON.stringify(otheruser._id)
      );
      user1activity.dislikedUsers = newDislikeArray;
      user1activity.dislikedUsers.push(otheruser._id);
      await user1activity.save();
    }

    return res
      .status(201)
      .json({ message: "Succeessfully dislike", useractivity: user1activity });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err });
  }
};
