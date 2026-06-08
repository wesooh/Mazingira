const BADGE_THRESHOLDS = {
  'Eco-Warrior': (user) => user.points >= 100,
  'Tree Planter': (user) => user.treesPlanted >= 5,
  'Issue Reporter': (user) => user.reportsMade >= 3,
  'Green Guardian': (user) =>
    user.points >= 100 && user.treesPlanted >= 5 && user.reportsMade >= 3,
};

const POINTS = {
  post: 5,
  report: 10,
  tree: 25,
};

async function awardPoints(user, action) {
  const amount = POINTS[action];
  if (!amount) return user;

  user.points += amount;
  updateBadges(user);
  await user.save();
  return user;
}

function updateBadges(user) {
  const earned = [];
  for (const [badge, check] of Object.entries(BADGE_THRESHOLDS)) {
    if (check(user)) earned.push(badge);
  }
  user.badges = earned;
}

module.exports = { awardPoints, updateBadges, POINTS };
