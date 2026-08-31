const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  httpOnly: true,
  sameSite: isProduction ? "none" : "lax",
  secure: isProduction,
};

const sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken();

  return res.status(statusCode).cookie("token", token, cookieOptions).json({
    success: true,
    user,
    token,
  });
};

function sendShopToken(seller, statusCode, res) {
  const token = seller.getJwtToken();

  return res
    .status(statusCode)
    .cookie("seller_token", token, cookieOptions)
    .json({
      success: true,
      seller,
      token,
    });
}

export { sendToken, sendShopToken };
