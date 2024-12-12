const jwt=require('jsonwebtoken')

const auth = (req, res, next) => {
  try {
    const token = req.headers.token;
    // console.log(token)
    if (!token) {
      return res
        .status(402)
        .json({ msg: "no token found,authorization failed" });
    }
    else{
    const verified =jwt.verify(token, process.env.JWT);
    // console.log(verified);
    if (!verified) {
      return res
        .status(410)
        .json({ msg: "verification failed,authorization failed" });
    }
    req.id = verified.id;
    // console.log(req.id);
    next();}
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
module.exports = auth;
