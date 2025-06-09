const authorizeUser = (req, res, next) => {
  const userId = req.params.userId || req.body?.userId || req.query?.userId;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required for authorization.' });
  }

  if (req.user.id.toString() !== userId.toString()) {
    return res.status(403).json({ message: 'Access denied. You cannot view this profile.' });
  }

  next();
};

module.exports = authorizeUser;
