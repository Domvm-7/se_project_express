module.exports.createClothingItem = (req, res) => {
  const userId = req.user._id;

  console.log(userId);
  res.send("Clothing item created successfully!");
};
