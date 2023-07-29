import User from "../model/User.js";
import Match from "../model/Matchs.js";
import UserActivity from "../model/UserActivity.js";
import Notification from "../model/Notification.js";
import Chat from "../model/Chat.js";

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
  if (useractivity && useractivity.dislikedUsers.length > 0) {
    pipeline.unshift({
      $match: {
        _id: { $nin: useractivity.dislikedUsers },
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
    pipeline2.unshift({
      $match: {
        _id: { $in: useractivity.dislikedUsers },
      },
    });
  }

  if (pipeline2.length > 0) {
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
      user1activity = await UserActivity.create({
        userId: user._id,
        onDate: new Date(),
      });
    }
    if (!user2activity) {
      user2activity = await UserActivity.create({
        userId: otheruser._id,
        onDate: new Date(),
      });
    }

    const profileDate1 = new Date(user1activity.onDate);
    let year1 = profileDate1.getFullYear();
    let month = profileDate1.getMonth() + 1;
    let day = profileDate1.getDate();
    const profileDate = `${year1}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;

    const currentDat1 = new Date();
    year1 = currentDat1.getFullYear();
    month = currentDat1.getMonth() + 1;
    day = currentDat1.getDate();
    const currentDate = `${year1}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;

    if (currentDate !== profileDate) {
      user1activity.MessageCount = 1;
      user1activity.SwapCount = 1;
    } else {
      if (user.subscription.plan === "0") {
        if (user1activity.SwapCount === 5) {
          return res.status(400).json({
            message: "Your daily swap is over. Upgrade your plan for more swap",
          });
        } else {
          user1activity.SwapCount = user1activity.SwapCount + 1;
        }
      } else if (user.subscription.plan === "1") {
        if (user1activity.SwapCount === 50) {
          return res.status(400).json({
            message: "Your daily swap is over. Upgrade your plan for more swap",
          });
        } else {
          user1activity.SwapCount += 1;
        }
      } else if (user.subscription.plan === "2") {
        if (user1activity.SwapCount === 100) {
          return res.status(400).json({
            message: "Your daily swap is over. Upgrade your plan for more swap",
          });
        } else {
          user1activity.SwapCount += 1;
        }
      } else if (user.subscription.plan === "3") {
        user1activity.SwapCount += 1;
      }
    }

    let notification = await Notification.findOne({ userId: otheruser._id });
    if (!notification) {
      notification = await Notification.create({ userId: otheruser._id });
    }

    await notification.message.push({
      text: `${user.name} has liked you`,
      time: new Date(),
      type: "like",
    });
    await notification.save();
    if (!user1activity.likedUsers.includes(otheruser._id)) {
      user1activity.likedUsers.push(otheruser._id);
    }

    const lastswap = {
      userId: otheruser._id,
      action: "like",
    };
    user1activity.lastswap = lastswap;

    if (
      user1activity?.dislikedUsers.length > 0 &&
      user1activity?.dislikedUsers.includes(otheruser._id)
    ) {
      const newDislikeArray = user1activity.dislikedUsers.filter(
        (userid) => JSON.stringify(userid) !== JSON.stringify(otheruser._id)
      );
      user1activity.dislikedUsers = newDislikeArray;
    }

    if (user2activity?.likedUsers.includes(user._id)) {
      user1activity.matchedUsers.push(otheruser._id);
      user2activity.matchedUsers.push(user._id);
      await user1activity.save();
      await user2activity.save();
      const user1messagecnt =
        user.subscription.plan === "0"
          ? 5
          : user.subscription.plan === "1"
          ? 50
          : user.subscription.plan === "2"
          ? "100"
          : "10000";
      const user2messagecnt =
        otheruser.subscription.plan === "0"
          ? 5
          : otheruser.subscription.plan === "1"
          ? 50
          : otheruser.subscription.plan === "2"
          ? "100"
          : "10000";

      const newchat = await Chat.create({
        members: [user._id, otheruser._id],
        TotalMessage: Math.max(user1messagecnt, user2messagecnt),
      });
      return res
        .status(200)
        .json({ ismatch: true, user: user1activity, message: "It's a match" });
    } else {
      await user1activity.save();
      await user2activity.save();
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
      user1activity = await UserActivity.create({
        userId: user._id,
        onDate: new Date(),
      });
    }
    if (!user2activity) {
      user2activity = await UserActivity.create({
        userId: otheruser._id,
        onDate: new Date(),
      });
    }
    const profileDate1 = new Date(user1activity.onDate);
    let year1 = profileDate1.getFullYear();
    let month = profileDate1.getMonth() + 1;
    let day = profileDate1.getDate();
    const profileDate = `${year1}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;

    const currentDat1 = new Date();
    year1 = currentDat1.getFullYear();
    month = currentDat1.getMonth() + 1;
    day = currentDat1.getDate();
    const currentDate = `${year1}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;

    const lastswap = {
      userId: otheruser._id,
      action: "dislike",
    };
    user1activity.lastswap = lastswap;
    if (currentDate !== profileDate) {
      user1activity.MessageCount = 1;
      user1activity.SwapCount = 1;
    } else {
      if (user.subscription.plan === "0") {
        if (user1activity.SwapCount === 5) {
          return res.status(400).json({
            message: "Your daily swap is over. Upgrade your plan for more swap",
          });
        } else {
          user1activity.SwapCount += 1;
        }
      } else if (user.subscription.plan === "1") {
        if (user1activity.SwapCount === 50) {
          return res.status(400).json({
            message: "Your daily swap is over. Upgrade your plan for more swap",
          });
        } else {
          user1activity.SwapCount += 1;
        }
      } else if (user.subscription.plan === "2") {
        if (user1activity.SwapCount === 100) {
          return res.status(400).json({
            message: "Your daily swap is over. Upgrade your plan for more swap",
          });
        } else {
          user1activity.SwapCount += 1;
        }
      } else if (user.subscription.plan === "3") {
        user1activity.SwapCount += 1;
      }
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

export const undolastswap = async (req, res) => {
  try {
    const useractivity = await UserActivity.findOne({ userId: req.user.id });
    const lastswapaction = req.body.lastswapaction;
    const lastswap = req.body.lastswap;
    if (lastswapaction === "like") {
      const newlikearray = useractivity.likedUsers.filter(
        (userid) => JSON.stringify(userid) !== JSON.stringify(lastswap)
      );
      useractivity.likedUsers = newlikearray;
      if (useractivity.matchedUsers.includes(lastswap)) {
        const newmatcharray = useractivity.matchedUsers.filter(
          (userid) => JSON.stringify(userid) !== JSON.stringify(lastswap)
        );
        useractivity.matchedUsers = newmatcharray;
      }
    } else if (lastswapaction === "dislike") {
      const newdislikearray = useractivity.dislikedUsers.filter(
        (userid) => JSON.stringify(userid) !== JSON.stringify(lastswap)
      );
      useractivity.dislikedUsers = newdislikearray;
    }
    await useractivity.save();
    return res.status(200).json({ message: "Undo your match" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err });
  }
};
