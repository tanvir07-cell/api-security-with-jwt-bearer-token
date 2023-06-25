export function authorize(roles) {
  return (req, res, next) => {
    console.log(req.user);
    if (roles.includes(req.user.role)) {
      return next();
    }
    return res.status(403).json({ message: "Unauthorized" });
  };
}
